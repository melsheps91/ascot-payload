import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import { getPageBySlug } from '@/lib/payload'
import { HOME_SLUG } from '@/lib/routes'

import { EditButton } from '../components/edit-button'
import { RenderBlocks } from '../components/render-blocks'

// Rendered on every request: the DigitalOcean build has no database or PAYLOAD_SECRET,
// so nothing here may query Payload at build time. Segment config is per file, so each
// page sets this itself (see .claude/skills/pre-deploy-check).
export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description ?? undefined,
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params
  if (slug === HOME_SLUG) permanentRedirect('/')

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  const query = await searchParams
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

  return (
    <>
      <RenderBlocks
        page={page}
        params={{ category: first(query.category), page: first(query.page) }}
        path={`/${slug}`}
      />
      <EditButton target={{ collection: 'pages', id: page.id }} />
    </>
  )
}
