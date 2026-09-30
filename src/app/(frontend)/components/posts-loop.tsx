import type { Where } from 'payload'

import type { PostsLoopBlock } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import { formatDate, postPath } from '@/lib/routes'

import { Img } from './shared/media'
import { categoryTitle, NewsCard } from './shared/news-card'

export type LoopParams = { category?: string; page?: string }

// Port of inc/content/posts-loop.php: category filters, the latest article featured,
// then a grid with "Older posts" paging. Filters and paging use the query string, so
// they work without JavaScript.
export async function PostsLoop({
  block,
  path,
  params,
}: {
  block: PostsLoopBlock
  path: string
  params: LoopParams
}) {
  const payload = await getPayloadClient()
  const page = Math.max(1, Number(params.page) || 1)

  const { docs: categories } = await payload.find({
    collection: 'categories',
    sort: 'order',
    limit: 50,
  })
  const active = categories.find((cat) => cat.slug === params.category)

  const where: Where = active ? { category: { equals: active.id } } : {}
  const posts = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedDate',
    limit: block.perPage ?? 13,
    page,
    depth: 1,
  })

  const href = (category?: string | null, pageNumber?: number) => {
    const query = new URLSearchParams()
    if (category) query.set('category', category)
    if (pageNumber && pageNumber > 1) query.set('page', String(pageNumber))
    const qs = query.toString()
    return qs ? `${path}?${qs}` : path
  }

  const [featured, ...rest] = page === 1 ? posts.docs : [null, ...posts.docs]

  return (
    <section className="posts-loop-wrap" id="posts">
      {block.showFilters && categories.length > 0 && (
        <div className="posts-filters primary-back">
          <nav aria-label="News categories" className="container">
            <a className={`pill${active ? '' : ' is-active'}`} href={href()}>
              All
            </a>
            {categories.map((cat) => (
              <a className={`pill${active?.id === cat.id ? ' is-active' : ''}`} href={href(cat.slug)} key={cat.id}>
                {cat.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="container posts-loop">
        {featured && (
          <a className="featured-post" href={postPath(featured.slug)}>
            <div className="image">
              <Img image={featured.heroImage} priority sizes="(max-width: 980px) 100vw, 50vw" />
            </div>
            <div className="featured-text">
              <div className="news-meta">
                <span className="latest">Latest</span>
                {categoryTitle(featured) && <span className="news-cat">{categoryTitle(featured)}</span>}
                <time dateTime={featured.publishedDate}>{formatDate(featured.publishedDate)}</time>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="btn text">
                Read article <i aria-hidden className="fa-solid fa-arrow-right" />
              </span>
            </div>
          </a>
        )}

        {rest.length > 0 && (
          <div className="posts-grid">
            {rest.map((post) => post && <NewsCard key={post.id} post={post} />)}
          </div>
        )}

        {!posts.docs.length && <p className="posts-empty">No articles yet.</p>}

        {(posts.hasNextPage || posts.hasPrevPage) && (
          <nav aria-label="Pages" className="posts-paging">
            {posts.hasPrevPage && (
              <a className="btn secondary" href={href(active?.slug, page - 1)}>
                <i aria-hidden className="fa-solid fa-arrow-left" /> Newer posts
              </a>
            )}
            {posts.hasNextPage && (
              <a className="btn secondary" href={href(active?.slug, page + 1)}>
                Older posts <i aria-hidden className="fa-solid fa-arrow-right" />
              </a>
            )}
          </nav>
        )}
      </div>
    </section>
  )
}
