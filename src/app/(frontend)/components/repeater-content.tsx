import type { Media, RepeaterContentBlock } from '@/payload-types'

import { Buttons } from './shared/button'
import { Heading } from './shared/heading'
import { asMedia, Img } from './shared/media'
import { RichText } from './shared/rich-text'
import { Section } from './shared/section'
import { Slider } from './shared/slider'

type Row = NonNullable<RepeaterContentBlock['rows']>[number]

const youtubeEmbed = (url?: string | null) => {
  const id = url?.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1]
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null
}

function RowMedia({ row }: { row: Row }) {
  if (row.mediaType === 'video') {
    const embed = row.videoType !== 'local' ? youtubeEmbed(row.youtubeLink) : null
    const video = asMedia(row.video)
    return (
      <div className="video">
        {embed ? (
          <iframe
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="o-fit"
            loading="lazy"
            src={embed}
            title={row.heading ?? 'Video'}
          />
        ) : video ? (
          <video className="o-fit" controls poster={asMedia(row.videoPoster)?.url ?? undefined} preload="none" src={video.url!} />
        ) : (
          <Img />
        )}
      </div>
    )
  }

  const fit = row.imageFit === 'fit' ? 'contain' : 'cover'
  const images = (row.images ?? []).map(asMedia).filter((image): image is Media => !!image)
  const sizes = '(max-width: 980px) 100vw, 50vw'

  return (
    <div className={`image${fit === 'contain' ? ' contain' : ''}`}>
      {images.length > 1 ? (
        <Slider autoplay={3000} className="image-slider" label={row.heading ?? 'Images'}>
          {images.map((image) => (
            <div className="slide" key={image.id}>
              <Img fit={fit} image={image} sizes={sizes} />
            </div>
          ))}
        </Slider>
      ) : (
        <Img fit={fit} image={images[0]} placeholder={row.heading ?? undefined} sizes={sizes} />
      )}
    </div>
  )
}

// Port of inc/content/repeater-content.php: rows of text beside media, alternating sides.
export function RepeaterContent({ block }: { block: RepeaterContentBlock }) {
  const rows = block.rows ?? []
  if (!rows.length) return null

  const startRight = block.firstImageSide === 'right'

  return (
    <Section block={block} name="repeater-content">
      <div className="container repeater-content">
        {rows.map((row, i) => {
          const mediaRight = (i % 2 === 1) !== startRight
          const logo = asMedia(row.logo)
          return (
            <div className={`row${mediaRight ? ' media-right' : ''}`} key={row.id}>
              <RowMedia row={row} />
              <div className="row-text">
                {(row.eyebrow || logo) && (
                  <div className="row-top">
                    {row.eyebrow && <span className="eyebrow">{row.eyebrow}</span>}
                    {logo && (
                      <div className="row-logo">
                        <Img fit="contain" image={logo} sizes="160px" />
                      </div>
                    )}
                  </div>
                )}
                <Heading text={row.heading} />
                <RichText data={row.content} />
                {!!row.tags?.length && (
                  <ul className="tags">
                    {row.tags.map((tag) => (
                      <li className="pill" key={tag.id}>
                        {tag.label}
                      </li>
                    ))}
                  </ul>
                )}
                <Buttons items={row.buttons} />
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
