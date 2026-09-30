import type { ProductCardsManualBlock } from '@/payload-types'

import { Img } from './shared/media'
import { Section, SectionIntro } from './shared/section'

// Port of inc/content/cards/product-cards-manual.php as the redesign's image cards.
export function ProductCardsManual({ block }: { block: ProductCardsManualBlock }) {
  const cards = block.cards ?? []
  if (!cards.length) return null

  return (
    <Section block={block} name="product-card">
      <div className="container">
        <SectionIntro block={block} />
        <div className="product-cards">
          {cards.map((card) => (
            <a
              className="product card"
              href={card.link?.url ?? '#'}
              key={card.id}
              rel={card.link?.newTab ? 'noopener noreferrer' : undefined}
              target={card.link?.newTab ? '_blank' : undefined}
              title={card.link?.label ? `More about ${card.link.label}` : undefined}
            >
              <div className="image">
                <Img image={card.image} placeholder={card.heading} sizes="(max-width: 980px) 100vw, 33vw" />
              </div>
              {card.tag && <span className="card-tag">{card.tag}</span>}
              <div className="card-text">
                <div className="card-text-inner">
                  <h3>{card.heading}</h3>
                  {card.text && <p>{card.text}</p>}
                </div>
                <span aria-hidden className="arrow-circle">
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  )
}
