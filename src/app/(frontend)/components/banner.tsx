import type { BannerBlock, Media } from '@/payload-types'
import { Autop } from './shared/autop'
import { Buttons, type LinkValue } from './shared/button'
import { Emphasis } from './shared/heading'
import { asMedia, Img } from './shared/media'
import { BannerSlideshow, type BannerVideo, VideoButton } from './banner-media'

// Accepts watch, share, embed and shorts URLs, or a bare video ID.
const youtubeId = (url?: string | null): string | null => {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) ?? url.match(/^([\w-]{11})$/)
  return match?.[1] ?? null
}

export function Banner({
  block,
  pageTitle,
  path,
}: {
  block: BannerBlock
  pageTitle?: string
  path?: string
}) {
  const { variant = 'large', preHeading, heading, buttons, text, stats, scrollLink } = block
  const isVideo = block.type === 'video'
  const isYoutube = isVideo && block.videoType !== 'local'

  // Background media, following inc/footer/backstretch-script.php.
  const images = (block.images ?? []).map(asMedia).filter((image): image is Media => !!image)
  const ytId = isYoutube ? youtubeId(block.youtube) : null
  const localVideo = isVideo && !isYoutube ? asMedia(block.video) : null
  const poster = asMedia(block.videoFallback)

  let background: BannerVideo | null = null
  if (ytId) background = { kind: 'youtube', id: ytId }
  else if (localVideo) background = { kind: 'local', src: localVideo.url!, poster: poster?.url }

  // "Play Video" button, following banner-variables.php.
  let playVideo: BannerVideo | null = null
  const fullVideo = asMedia(block.fullVideo)
  if (ytId) playVideo = { kind: 'youtube', id: ytId }
  else if (isVideo && !isYoutube && fullVideo) playVideo = { kind: 'local', src: fullVideo.url! }

  const media =
    background || images.length > 1 ? (
      <BannerSlideshow images={images} position={block.imagePosition} video={background} />
    ) : (
      <div className="image">
        <Img image={images[0] ?? poster} position={block.imagePosition} priority />
      </div>
    )

  const title = (
    <h1>
      <Emphasis text={heading || pageTitle} />
    </h1>
  )
  const kicker = preHeading && <span className="kicker">{preHeading}</span>
  const actions = (buttons?.length || playVideo) && (
    <div className="buttons">
      <Buttons className={null} items={buttons} />
      {playVideo && <VideoButton video={playVideo} />}
    </div>
  )

  if (variant === 'split') {
    return (
      <section className="banner split">
        <div className="container banner-inner">
          <div className="banner-text">
            {kicker}
            {title}
            {text && (
              <div className="banner-intro">
                <Autop text={text} />
              </div>
            )}
            {actions}
          </div>
          <div className="banner-portrait">
            <Img image={images[0]} position={block.imagePosition} priority sizes="(max-width: 980px) 100vw, 50vw" />
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'default') {
    return (
      <section className="banner default">
        <div className="container banner-inner">
          <div className="banner-text">
            {kicker}
            {title}
            {text && (
              <div className="banner-intro">
                <Autop text={text} />
              </div>
            )}
          </div>
          {!!buttons?.length && (
            <nav aria-label="Section" className="banner-tabs">
              {buttons.map((item, i) => {
                const link = item.button as LinkValue
                if (!link?.url) return null
                return (
                  <a
                    aria-current={link.url === path ? 'page' : undefined}
                    className={`pill${link.url === path ? ' is-active' : ''}`}
                    href={link.url}
                    key={item.id ?? i}
                  >
                    {link.label}
                  </a>
                )
              })}
            </nav>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'home') {
    return (
      <section className="banner home">
        {media}
        <div aria-hidden className="banner-overlay" />
        <div className="container banner-inner">
          <div className="banner-text">
            {kicker}
            {title}
            {text && (
              <div className="banner-intro">
                <Autop text={text} />
              </div>
            )}
            {actions}
          </div>
          {(!!stats?.length || scrollLink?.url) && (
            <div className="banner-stats">
              {stats?.map((stat) => (
                <div className="stat" key={stat.id}>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
              {scrollLink?.url && (
                <a className="scroll-link" href={scrollLink.url}>
                  {scrollLink.label}
                  <span className="scroll-circle">
                    <i aria-hidden className={scrollLink.icon || 'fa-solid fa-arrow-down'} />
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  // Large: image, title and intro.
  return (
    <section className="banner large">
      {media}
      <div aria-hidden className="banner-overlay" />
      <div className="container banner-inner">
        <div className="banner-text">
          {kicker}
          {title}
        </div>
        {(text || actions) && (
          <div className="banner-intro">
            <Autop text={text} />
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}

