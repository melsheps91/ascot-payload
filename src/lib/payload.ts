import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = () => getPayload({ config })

// cache() dedupes these per request, so the layout and pages can both ask for them.

export const getGlobals = cache(async () => {
  const payload = await getPayloadClient()
  const [header, footer, company, jobSettings] = await Promise.all([
    payload.findGlobal({ slug: 'header', depth: 1 }),
    payload.findGlobal({ slug: 'footer', depth: 1 }),
    payload.findGlobal({ slug: 'companyDetails' }),
    payload.findGlobal({ slug: 'jobSettings', depth: 2 }),
  ])
  return { header, footer, company, jobSettings }
})

export const getPageBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
})

export const getJobBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'jobs',
    where: { slug: { equals: slug }, status: { equals: 'open' } },
    limit: 1,
  })
  return docs[0] ?? null
})
