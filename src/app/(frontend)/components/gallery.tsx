import type { GalleryBlock } from '@/payload-types'

import { Img } from './shared/media'
import { Section, SectionIntro } from './shared/section'

// Port of inc/content/gallery.php. A single image shows full width.
export function Gallery({ block }: { block: GalleryBlock }) {
  const images = block.gallery ?? []
  if (!images.length) return null

  return (
    <Section block={block} name="gallery">
      <div className="container">
        <SectionIntro block={block} />
        <div className={`gallery${images.length === 1 ? ' single' : ''}`}>
          {images.map((image, i) => (
            <div className="gallery-image" key={typeof image === 'object' ? image.id : i}>
              <Img image={image} sizes={images.length === 1 ? '(max-width: 1480px) 100vw, 1480px' : '(max-width: 980px) 100vw, 33vw'} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
