import path from 'path'

import type { Endpoint, PayloadRequest } from 'payload'

import type { AcfGroup } from '../../scripts/acf-to-payload/convert'
import type { ImportOptions } from '../../scripts/acf-to-payload/importer'

// Dev-only API behind /admin/acf-import. It writes source files, so it refuses to run in
// production and requires a logged-in user.

export type SourceItem = { id: string } | { group: AcfGroup }

export type SourceSummary = {
  id: string
  origin: 'theme' | 'inbox'
  file: string
  title: string
  kind: 'block' | 'global'
  exportName: string
  slug: string
  status: 'new' | 'imported' | 'name-taken'
  warnings: string[]
}

const root = process.cwd()
const importer = () => import('../../scripts/acf-to-payload/importer')

let running = false

function guard(req: PayloadRequest) {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'The ACF importer only runs in development.' }, { status: 404 })
  }
  if (!req.user) {
    return Response.json({ error: 'Log in to use the ACF importer.' }, { status: 401 })
  }
  return null
}

async function sourceGroups() {
  const { jsonFilesIn, projectPaths, readGroups } = await importer()
  const paths = projectPaths(root)
  const origins = [
    { origin: 'theme' as const, dir: paths.theme },
    { origin: 'inbox' as const, dir: paths.inbox },
  ]
  return origins.flatMap(({ origin, dir }) =>
    jsonFilesIn(dir).flatMap((file) => {
      try {
        return readGroups(file).map((group, index) => ({
          id: `${origin}:${path.basename(file)}#${index}`,
          origin,
          file: path.basename(file),
          group,
        }))
      } catch {
        return []
      }
    }),
  )
}

async function resolveItems(items: unknown): Promise<AcfGroup[]> {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Choose at least one group.')
  const { isAcfGroup } = await importer()
  const sources = await sourceGroups()
  return items.map((item: SourceItem) => {
    if ('group' in item) {
      if (!isAcfGroup(item.group)) throw new Error('An uploaded file is not an ACF field group.')
      return item.group
    }
    const match = sources.find((s) => s.id === item.id)
    if (!match) throw new Error(`Unknown group ${item.id}. Refresh the list and try again.`)
    return match.group
  })
}

const readOptions = (body: { options?: Partial<ImportOptions> }): ImportOptions => ({
  force: body.options?.force === true,
  strip: body.options?.strip !== false,
  as: body.options?.as === 'block' || body.options?.as === 'global' ? body.options.as : undefined,
})

const errorResponse = (error: unknown) =>
  Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 })

export const acfImportEndpoints: Endpoint[] = [
  {
    path: '/acf-import',
    method: 'get',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      const { planImport, projectPaths } = await importer()
      const sources = await sourceGroups()
      const summaries: SourceSummary[] = await Promise.all(
        sources.map(async ({ id, origin, file, group }) => {
          const plan = await planImport(group, root)
          return {
            id,
            origin,
            file,
            title: group.title,
            kind: plan.result.kind,
            exportName: plan.result.exportName,
            slug: plan.result.slug,
            status: plan.status,
            warnings: plan.result.warnings,
          }
        }),
      )
      const paths = projectPaths(root)
      return Response.json({
        sources: summaries,
        themeDir: path.relative(root, paths.theme),
        inboxDir: path.relative(root, paths.inbox),
      })
    },
  },
  {
    path: '/acf-import/preview',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      try {
        const body = (await req.json?.()) ?? {}
        const { planImport } = await importer()
        const options = readOptions(body)
        const groups = await resolveItems(body.items)
        const previews = await Promise.all(
          groups.map(async (group) => {
            const plan = await planImport(group, root, options)
            return {
              title: group.title,
              kind: plan.result.kind,
              slug: plan.result.slug,
              exportName: plan.result.exportName,
              target: path.relative(root, plan.target),
              status: plan.status,
              source: plan.source,
              warnings: plan.result.warnings,
            }
          }),
        )
        return Response.json({ previews })
      } catch (error) {
        return errorResponse(error)
      }
    },
  },
  {
    path: '/acf-import/run',
    method: 'post',
    handler: async (req) => {
      const denied = guard(req)
      if (denied) return denied
      if (running) return Response.json({ error: 'An import is already running.' }, { status: 409 })
      running = true
      try {
        const body = (await req.json?.()) ?? {}
        const { generateTypes, importGroup } = await importer()
        const options = readOptions(body)
        const groups = await resolveItems(body.items)
        const reports = []
        for (const group of groups) reports.push(await importGroup(group, root, options))
        const written = reports.some((r) => r.outcome !== 'skipped')
        const types = written ? await generateTypes(root) : null
        req.payload.logger.info(
          `ACF import by ${req.user?.email}: ${reports.map((r) => `${r.title} ${r.outcome}`).join(', ')}`,
        )
        return Response.json({ reports, types })
      } catch (error) {
        return errorResponse(error)
      } finally {
        running = false
      }
    },
  },
]
