// File-system side of the ACF importer, shared by the CLI (index.ts) and the
// admin view's API endpoints (src/endpoints/acfImport.ts).
import { execFile } from 'child_process'
import fs from 'fs'
import path from 'path'
import { format, resolveConfig } from 'prettier'
import { promisify } from 'util'

import { type AcfGroup, type Converted, convertGroup, type Kind } from './convert'

export type ImportOptions = {
  as?: Kind
  force?: boolean
  strip?: boolean
  frontend?: boolean
}

export type Status = 'new' | 'imported' | 'name-taken'

export type Plan = {
  result: Converted
  target: string
  source: string
  status: Status
}

export type ImportReport = {
  title: string
  kind: Kind
  slug: string
  target: string
  outcome: 'created' | 'overwritten' | 'skipped'
  notes: string[]
  warnings: string[]
  problems: string[]
}

export const projectPaths = (root: string) => ({
  root,
  blocks: path.join(root, 'src/blocks'),
  globals: path.join(root, 'src/globals'),
  collections: path.join(root, 'src/collections'),
  pages: path.join(root, 'src/collections/Pages.ts'),
  config: path.join(root, 'src/payload.config.ts'),
  components: path.join(root, 'src/app/(frontend)/components'),
  renderer: path.join(root, 'src/app/(frontend)/page.tsx'),
  inbox: path.join(root, 'acf-import'),
  theme: path.resolve(root, '../CleanBuildPro/functions/acf/acf-fields-sync'),
})

type Paths = ReturnType<typeof projectPaths>

export const isAcfGroup = (value: unknown): value is AcfGroup =>
  Boolean(value) &&
  typeof (value as AcfGroup).title === 'string' &&
  Array.isArray((value as AcfGroup).fields)

// ACF sync files hold one group; exports from Tools > Export hold an array of them.
export function groupsFromJson(parsed: unknown): AcfGroup[] {
  return (Array.isArray(parsed) ? parsed : [parsed]).filter(isAcfGroup)
}

export function readGroups(file: string): AcfGroup[] {
  return groupsFromJson(JSON.parse(fs.readFileSync(file, 'utf8')))
}

export function jsonFilesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(dir, f))
}

function collectionSlugs(paths: Paths) {
  return fs
    .readdirSync(paths.collections)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => fs.readFileSync(path.join(paths.collections, f), 'utf8').match(/slug:\s*['"]([^'"]+)/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .map((m) => m[1])
}

async function formatted(file: string, source: string) {
  const config = await resolveConfig(file)
  return format(source, { ...config, filepath: file })
}

export async function planImport(
  group: AcfGroup,
  root: string,
  options: ImportOptions = {},
): Promise<Plan> {
  const paths = projectPaths(root)
  const result = convertGroup(group, {
    as: options.as,
    stripPrefix: options.strip,
    collections: collectionSlugs(paths),
  })
  const target = path.join(
    result.kind === 'block' ? paths.blocks : paths.globals,
    `${result.exportName}.ts`,
  )
  let status: Status = 'new'
  if (fs.existsSync(target)) {
    status = fs.readFileSync(target, 'utf8').includes(`(${group.key})`) ? 'imported' : 'name-taken'
  }
  return { result, target, source: await formatted(target, result.source), status }
}

function addImport(source: string, name: string, statement: string, after: RegExp) {
  if (new RegExp(`import\\s*(type\\s*)?\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`).test(source)) {
    return source
  }
  const lines = source.split('\n')
  let index = -1
  lines.forEach((line, i) => {
    if (after.test(line)) index = i
  })
  if (index === -1) {
    lines.forEach((line, i) => {
      if (/^import /.test(line)) index = i
    })
  }
  lines.splice(index + 1, 0, statement)
  return lines.join('\n')
}

function addToArray(source: string, key: string, name: string) {
  const pattern = new RegExp(`(${key}:\\s*\\[)([^\\]]*)(\\])`)
  const match = source.match(pattern)
  if (!match) return null
  const items = match[2]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (items.includes(name)) return source
  return source.replace(pattern, `$1${[...items, name].join(', ')}$3`)
}

function registerBlock(paths: Paths, result: Converted): string | null {
  let source = fs.readFileSync(paths.pages, 'utf8')
  source = addImport(
    source,
    result.exportName,
    `import { ${result.exportName} } from '../blocks/${result.exportName}'`,
    /from ['"]\.\.\/blocks\//,
  )
  const updated = addToArray(source, 'blocks', result.exportName)
  if (!updated) return `Couldn't find the layout "blocks: [...]" array in ${rel(paths, paths.pages)}`
  fs.writeFileSync(paths.pages, updated)
  return null
}

function registerGlobal(paths: Paths, result: Converted): string | null {
  let source = fs.readFileSync(paths.config, 'utf8')
  source = addImport(
    source,
    result.exportName,
    `import { ${result.exportName} } from './globals/${result.exportName}'`,
    /from ['"]\.\/(collections|globals)\//,
  )
  let updated = addToArray(source, 'globals', result.exportName)
  if (!updated) {
    const collectionsLine = source.match(/\n([ \t]*)collections:\s*\[[^\]]*\],?[ \t]*\n/)
    if (!collectionsLine) return `Couldn't find "collections: [...]" in ${rel(paths, paths.config)}`
    updated = source.replace(
      collectionsLine[0],
      `${collectionsLine[0]}${collectionsLine[1]}globals: [${result.exportName}],\n`,
    )
  }
  fs.writeFileSync(paths.config, updated)
  return null
}

function componentStub(result: Converted) {
  return `import type { ${result.interfaceName} } from '@/payload-types'

// TODO: port the markup from the matching CleanBuildPro include (see the acf-to-payload skill).
export function ${result.exportName}({ block }: { block: ${result.interfaceName} }) {
  return (
    <section className="${result.kebab}-wrap med-pad" id="${result.kebab}">
      <pre>{JSON.stringify(block, null, 2)}</pre>
    </section>
  )
}
`
}

async function addFrontend(paths: Paths, result: Converted): Promise<string[]> {
  const notes: string[] = []
  const file = path.join(paths.components, `${result.kebab}.tsx`)
  if (!fs.existsSync(file)) {
    fs.mkdirSync(paths.components, { recursive: true })
    fs.writeFileSync(file, await formatted(file, componentStub(result)))
    notes.push(`created ${rel(paths, file)}`)
  }

  if (!fs.existsSync(paths.renderer)) return [...notes, `no ${rel(paths, paths.renderer)} to register in`]
  let source = fs.readFileSync(paths.renderer, 'utf8')
  if (source.includes(`case '${result.slug}':`)) return notes

  const defaultCase = source.match(/\n([ \t]*)default:/)
  if (!defaultCase) {
    return [...notes, `add case '${result.slug}' to the block switch in ${rel(paths, paths.renderer)} yourself`]
  }
  const indent = defaultCase[1]
  source = source.replace(
    defaultCase[0],
    `\n${indent}case '${result.slug}':\n${indent}  return <${result.exportName} block={block} key={block.id} />${defaultCase[0]}`,
  )
  source = addImport(
    source,
    result.exportName,
    `import { ${result.exportName} } from './components/${result.kebab}'`,
    /from ['"]\.\/components\//,
  )
  fs.writeFileSync(paths.renderer, source)
  notes.push(`added case '${result.slug}' to ${rel(paths, paths.renderer)}`)
  return notes
}

const rel = (paths: Paths, file: string) => path.relative(paths.root, file)

// Writes the config for one group and registers it. Existing files are only replaced with `force`.
export async function importGroup(
  group: AcfGroup,
  root: string,
  options: ImportOptions = {},
): Promise<ImportReport> {
  const paths = projectPaths(root)
  const plan = await planImport(group, root, options)
  const { result, target } = plan
  const report: ImportReport = {
    title: group.title,
    kind: result.kind,
    slug: result.slug,
    target: rel(paths, target),
    outcome: 'skipped',
    notes: [],
    warnings: result.warnings,
    problems: [],
  }

  if (plan.status !== 'new' && !options.force) {
    report.notes.push(`${report.target} already exists`)
    return report
  }

  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, plan.source)
  report.outcome = plan.status === 'new' ? 'created' : 'overwritten'
  report.notes.push(`${report.outcome} ${report.target}`)

  const error = result.kind === 'block' ? registerBlock(paths, result) : registerGlobal(paths, result)
  if (error) report.problems.push(error)
  if (result.kind === 'block' && options.frontend !== false) {
    report.notes.push(...(await addFrontend(paths, result)))
  }
  return report
}

export async function generateTypes(root: string): Promise<{ ok: boolean; output: string }> {
  try {
    const { stdout, stderr } = await promisify(execFile)('npx', ['payload', 'generate:types'], {
      cwd: root,
      env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
    })
    return { ok: true, output: `${stdout}${stderr}` }
  } catch (error) {
    return { ok: false, output: error instanceof Error ? error.message : String(error) }
  }
}
