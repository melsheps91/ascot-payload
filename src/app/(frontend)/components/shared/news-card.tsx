import type { Category, Post } from '@/payload-types'
import { formatDate, postPath } from '@/lib/routes'

import { Img } from './media'

export const categoryTitle = (post: Post) =>
  typeof post.category === 'object' ? (post.category as Category | null)?.title : undefined

export function NewsMeta({ post }: { post: Post }) {
  return (
    <div className="news-meta">
      {categoryTitle(post) && <span className="news-cat">{categoryTitle(post)}</span>}
      <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
    </div>
  )
}

// Port of the post card in inc/content/latest-news.php.
export function NewsCard({ post, excerpt = true }: { post: Post; excerpt?: boolean }) {
  return (
    <a className="card post" href={postPath(post.slug)}>
      <div className="image">
        <Img image={post.heroImage} sizes="(max-width: 980px) 100vw, 33vw" />
      </div>
      <NewsMeta post={post} />
      <h3>{post.title}</h3>
      {excerpt && <p>{post.excerpt}</p>}
    </a>
  )
}
