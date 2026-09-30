import type { LatestNewsBlock } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

import { NewsCard } from './shared/news-card'
import { Section, SectionIntro } from './shared/section'

// Port of inc/content/latest-news.php. `exclude` hides the article being read.
export async function LatestNews({
  block,
  exclude,
}: {
  block: Pick<LatestNewsBlock, 'introEyebrow' | 'introHeading' | 'introText' | 'introButton' | 'limit' | 'theme' | 'anchor'>
  exclude?: number
}) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: exclude ? { id: { not_equals: exclude } } : {},
    sort: '-publishedDate',
    limit: block.limit ?? 3,
    depth: 1,
  })

  if (!docs.length) return null

  return (
    <Section block={block} name="latest-news">
      <div className="container">
        <SectionIntro block={block} />
        <div className="latest-news">
          {docs.map((post) => (
            <NewsCard excerpt={false} key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Section>
  )
}
