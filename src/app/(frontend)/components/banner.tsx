import Image from 'next/image'

import type { BannerBlock, Media } from '@/payload-types'
import { Autop } from './shared/autop'
import { Buttons } from './shared/button'
import { BannerSlideshow, type BannerVideo, VideoButton } from './banner-media'

const media = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' && value.url ? value : null

// Accepts watch, share, embed and shorts URLs, or a bare video ID.
const youtubeId = (url?: string | null): string | null => {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) ?? url.match(/^([\w-]{11})$/)
  return match?.[1] ?? null
}

export function Banner({ block, pageTitle }: { block: BannerBlock; pageTitle?: string }) {
  const { variant = 'large', preHeading, heading, buttons, text } = block
  const isVideo = block.type === 'video'
  const isYoutube = isVideo && block.videoType !== 'local'

  // Background media, following inc/footer/backstretch-script.php.
  const images = (block.images ?? []).map(media).filter((image): image is Media => !!image)
  const ytId = isYoutube ? youtubeId(block.youtube) : null
  const localVideo = isVideo && !isYoutube ? media(block.video) : null
  const poster = media(block.videoFallback)

  let background: BannerVideo | null = null
  if (ytId) background = { kind: 'youtube', id: ytId }
  else if (localVideo) background = { kind: 'local', src: localVideo.url!, poster: poster?.url }

  // "Play Video" button, following banner-variables.php.
  let playVideo: BannerVideo | null = null
  if (ytId) playVideo = { kind: 'youtube', id: ytId }
  else if (isVideo && !isYoutube && media(block.fullVideo))
    playVideo = { kind: 'local', src: media(block.fullVideo)!.url! }

  let backdrop = null
  if (background || images.length > 1) {
    backdrop = <BannerSlideshow images={images} video={background} />
  } else if (!isVideo && images[0]) {
    backdrop = (
      <div className="image">
        <Image alt={images[0].alt} className="o-fit" fill priority sizes="100vw" src={images[0].url!} />
      </div>
    )
  } else if (isVideo && poster) {
    // Video chosen but none uploaded yet: show the poster rather than an empty banner.
    backdrop = (
      <div className="image">
        <Image alt={poster.alt} className="o-fit" fill priority sizes="100vw" src={poster.url!} />
      </div>
    )
  }

  const hasButtons = !!buttons?.some((item) => item.button?.url) || !!playVideo

  const content = (
    <>
      {preHeading && <span className="eyebrow">{preHeading}</span>}
      <h1>{heading || pageTitle}</h1>
      <Autop text={text} />
      {hasButtons && (
        <div className={`buttons${variant === 'home' ? ' j-center' : ''}`}>
          <Buttons items={buttons} />
          {playVideo && <VideoButton video={playVideo} />}
        </div>
      )}
    </>
  )

  if (variant === 'split') {
    return (
      <section className="banner split flex">
        <div className="banner-text half large-pad">
          <div className="inner-container">{content}</div>
        </div>
        <div className="banner-slider half relative">{backdrop}</div>
      </section>
    )
  }

  const textClass = {
    large: 'banner-text half',
    home: 'banner-text half t-center',
    default: 'banner-text half t-center',
  }[variant]

  return (
    <section className={`banner ${variant}${variant === 'default' ? ' small-pad' : ''}`}>
      <div className="container">
        <div className={textClass}>{content}</div>
      </div>
      {backdrop}
    </section>
  )
}
