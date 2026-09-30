import type { TimelineBlock } from '@/payload-types'

import { Heading } from './shared/heading'
import { RichText } from './shared/rich-text'
import { Section } from './shared/section'

export function Timeline({ block }: { block: TimelineBlock }) {
  const items = block.items ?? []

  return (
    <Section block={block} name="timeline">
      <div className="container timeline-grid">
        <div className="timeline-intro">
          {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
          <Heading text={block.heading} />
          <RichText data={block.content} />
        </div>
        <ol className="timeline">
          {items.map((item) => (
            <li className="timeline-item" key={item.id}>
              <span className="timeline-year">{item.year}</span>
              <div className="timeline-text">
                <h3>{item.title}</h3>
                {item.text && <p>{item.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
