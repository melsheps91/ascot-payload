import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { getPostBySlug } from '@/lib/payload'
import { formatDate, NEWS_PATH, postPath } from '@/lib/routes'

import { EditButton } from '../../components/edit-button'
import { LatestNews } from '../../components/latest-news'
import { Img } from '../../components/shared/media'
import { categoryTitle } from '../../components/shared/news-card'
import { RichText } from '../../components/shared/rich-text'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug)
  if (!post) return {}
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
  }
}

// Port of single.php / inc/content/single-post-content.php.
export default async function ArticlePage({ params }: Props) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()

  const host = (await headers()).get('host')
  const url = encodeURIComponent(`${process.env.NEXT_PUBLIC_SERVER_URL || `https://${host}`}${postPath(post.slug)}`)
  const title = encodeURIComponent(post.title)
  const share = [
    { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` },
    { label: 'X', icon: 'fa-brands fa-x-twitter', href: `https://twitter.com/intent/tweet?url=${url}&text=${title}` },
    { label: 'Facebook', icon: 'fa-brands fa-facebook-f', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: 'Email', icon: 'fa-solid fa-envelope', href: `mailto:?subject=${title}&body=${url}` },
  ]

  return (
    <article className="article">
      <header className="article-header primary-back">
        <div className="container-medium article-header-inner">
          <a className="back-link" href={NEWS_PATH}>
            <i aria-hidden className="fa-solid fa-arrow-left" />
            All news
          </a>
          <div className="article-meta">
            {categoryTitle(post) && <span className="pill">{categoryTitle(post)}</span>}
            <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
          </div>
          <h1>{post.title}</h1>
        </div>
      </header>

      <div className="container-medium">
        <div className="article-image">
          <Img image={post.heroImage} priority sizes="(max-width: 1280px) 100vw, 1280px" />
        </div>
        <div className="article-body">
          <p className="article-intro">{post.excerpt}</p>
          <RichText data={post.content} />
          <div className="share">
            <span>Share this post</span>
            <div className="share-links">
              {share.map((item) => (
                <a
                  aria-label={`Share on ${item.label}`}
                  className="btn icon"
                  href={item.href}
                  key={item.label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i aria-hidden className={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LatestNews
        block={{
          introHeading: 'More *news*',
          introButton: { label: 'View all', url: NEWS_PATH, style: 'text' },
          limit: 3,
          theme: 'grey',
        }}
        exclude={post.id}
      />
      <EditButton label="Edit article" target={{ collection: 'posts', id: post.id }} />
    </article>
  )
}
