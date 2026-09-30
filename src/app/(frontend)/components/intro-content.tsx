import type { IntroContentBlock } from '@/payload-types'

import { Buttons } from './shared/button'
import { Heading } from './shared/heading'
import { Img } from './shared/media'
import { RichText } from './shared/rich-text'
import { Section } from './shared/section'

// Port of inc/content/intro-content.php, with the redesign's split layout.
export function IntroContent({ block }: { block: IntroContentBlock }) {
  const { layout, eyebrow, heading, stat, content, buttons, headingLinks, image } = block

  if (layout === 'centred') {
    return (
      <Section block={block} className="centred" name="intro-content">
        <div className="container-small t-center">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <Heading text={heading} />
          <RichText data={content} />
          <Buttons className="buttons j-center" items={buttons} />
        </div>
      </Section>
    )
  }

  return (
    <Section block={block} className="split" name="intro-content">
      <div className="container">
        <div className="intro-grid">
          <div className="intro-main">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {stat?.value ? (
              <div className="intro-stat">
                <span className="stat-value">{stat.value}</span>
                {stat.caption && <span className="stat-caption">{stat.caption}</span>}
              </div>
            ) : (
              <Heading text={heading} />
            )}
            <Buttons className="buttons heading-links" items={headingLinks} />
          </div>
          <div className="intro-aside">
            <RichText data={content} />
            <Buttons items={buttons} />
          </div>
        </div>
        {image && (
          <div className="intro-image">
            <Img image={image} sizes="(max-width: 1480px) 100vw, 1480px" />
          </div>
        )}
      </div>
    </Section>
  )
}
