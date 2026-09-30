import Image from 'next/image'

import type { Media } from '@/payload-types'

// Upload fields come back as an ID when not populated; only use them once they're objects.
export const asMedia = (value?: number | Media | null): Media | null =>
  value && typeof value === 'object' && value.url ? value : null

export type ImagePosition = 'focal' | 'top' | 'center' | 'bottom' | 'left' | 'right'

const POSITIONS: Record<Exclude<ImagePosition, 'focal'>, string> = {
  top: 'center top',
  center: 'center center',
  bottom: 'center bottom',
  left: 'left center',
  right: 'right center',
}

// Where a cropped image is anchored: a fixed position, or the focal point set on the
// image in the Media library (Payload stores it as percentages).
export const objectPosition = (media: Media, position: ImagePosition = 'focal') =>
  position !== 'focal' ? POSITIONS[position] : `${media.focalX ?? 50}% ${media.focalY ?? 50}%`

// A cover image that fills its (positioned) parent. With no image it renders an empty
// placeholder panel, matching the design's image slots.
export function Img({
  image,
  sizes = '100vw',
  priority,
  fit = 'cover',
  placeholder,
  position,
}: {
  image?: number | Media | null
  sizes?: string
  priority?: boolean
  fit?: 'cover' | 'contain'
  placeholder?: string
  position?: ImagePosition | null
}) {
  const media = asMedia(image)

  if (!media) {
    return (
      <div aria-hidden className="img-placeholder">
        {placeholder && <span>{placeholder.replace(/\*/g, '')}</span>}
      </div>
    )
  }

  return (
    <Image
      alt={media.alt ?? ''}
      className={fit === 'cover' ? 'o-fit' : 'o-contain'}
      fill
      priority={priority}
      sizes={sizes}
      src={media.url!}
      style={fit === 'cover' ? { objectPosition: objectPosition(media, position ?? 'focal') } : undefined}
      unoptimized={media.mimeType === 'image/svg+xml'}
    />
  )
}
