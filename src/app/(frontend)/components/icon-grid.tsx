import type { ReactNode } from 'react'

import type { IconGridBlock } from '@/payload-types'

import { Autop } from './shared/autop'
import { Button } from './shared/button'
import { asMedia, Img } from './shared/media'
import { Section, SectionIntro } from './shared/section'

// Port of inc/content/icon-grid.php. The redesign uses it in four styles: bordered
// grids (brands, perks), grey cards (criteria, explore), a divided row (accolades) and pills.
export function IconGrid({ block }: { block: IconGridBlock }) {
  const items = block.grid ?? []
  if (!items.length) return null

  const style = block.style ?? 'bordered'

  if (style === 'pills') {
    return (
      <Section block={block} name="icon-grid">
        <div className="container">
          <SectionIntro block={block} />
          <ul className="icon-grid pills">
            {items.map((item) =>
              item.link?.url ? (
                <li key={item.id}>
                  <a className="pill" href={item.link.url}>
                    {item.icon && <i aria-hidden className={item.icon} />}
                    {item.heading}
                  </a>
                </li>
              ) : (
                <li className="pill" key={item.id}>
                  {item.icon && <i aria-hidden className={item.icon} />}
                  {item.heading}
                </li>
              ),
            )}
          </ul>
        </div>
      </Section>
    )
  }

  return (
    <Section block={block} name="icon-grid">
      <div className="container">
        <SectionIntro block={block} size="large" />
        <div className={`icon-grid ${style}`}>
          {items.map((item, i) => {
            // With no label the whole item is the link, marked by an arrow in the corner;
            // with a label it's a text button under the copy.
            const linked = Boolean(item.link?.url && !item.link.label)
            const body: ReactNode = (
              <>
                {(block.numbered || linked) && (
                  <div className="item-top">
                    {block.numbered && <span className="item-number">{String(i + 1).padStart(2, '0')}</span>}
                    {linked && <i aria-hidden className="fa-solid fa-arrow-right item-arrow" />}
                  </div>
                )}
                {item.icon && !asMedia(item.image) && <i aria-hidden className={`${item.icon} item-icon`} />}
                {item.image && (
                  <div className="item-logo">
                    <Img fit="contain" image={item.image} placeholder={item.heading} sizes="240px" />
                  </div>
                )}
                <div className="item-text">
                  <h3>{item.heading}</h3>
                  {item.text && <Autop text={item.text} />}
                </div>
                {!linked && <Button link={item.link} variant="text" />}
              </>
            )

            return linked ? (
              <a
                className="item"
                href={item.link!.url!}
                key={item.id}
                rel={item.link?.newTab ? 'noopener noreferrer' : undefined}
                target={item.link?.newTab ? '_blank' : undefined}
              >
                {body}
              </a>
            ) : (
              <div className="item" key={item.id}>
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
