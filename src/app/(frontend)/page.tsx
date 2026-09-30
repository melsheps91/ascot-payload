import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPageBySlug } from '@/lib/payload'
import { HOME_SLUG } from '@/lib/routes'

import { EditButton } from './components/edit-button'
import { RenderBlocks } from './components/render-blocks'

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
