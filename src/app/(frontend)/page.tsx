import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPageBySlug } from '@/lib/payload'
import { HOME_SLUG } from '@/lib/routes'

import { EditButton } from './components/edit-button'
import { RenderBlocks } from './components/render-blocks'

// Rendered on every request: the DigitalOcean build has no database or PAYLOAD_SECRET,
// so nothing here may query Payload at build time. Segment config is per file, so each
// page sets this itself (see .claude/skills/pre-deploy-check).
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(HOME_SLUG)
  return {
    title: page?.meta?.title ? { absolute: page.meta.title } : undefined,
    description: page?.meta?.description ?? undefined,
  }
}

export default async function HomePage() {
  const page = await getPageBySlug(HOME_SLUG)
  if (!page) notFound()

  return (
    <>
      <RenderBlocks page={page} path="/" />
      <EditButton target={{ collection: 'pages', id: page.id }} />
    </>
  )
}
