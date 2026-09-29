import type { LogoGridBlock } from '@/payload-types'

import { asMedia, Img } from './shared/media'
import { Section, SectionIntro } from './shared/section'

// Port of inc/content/logo-grid.php.
export function LogoGrid({ block }: { block: LogoGridBlock }) {
  const logos = block.logos ?? []
  if (!logos.length) return null

  return (
    <Section block={block} name="logo-grid">
      <div className="container">
        <SectionIntro block={block} />
        <ul className="logo-grid">
          {logos.map((logo) => {
            const inner = asMedia(logo.logo) ? (
              <Img fit="contain" image={logo.logo} sizes="240px" />
            ) : (
              <span className="logo-name">{logo.name}</span>
            )
            return (
              <li className="logo" key={logo.id} title={logo.name}>
                {logo.url ? (
                  <a href={logo.url} rel="noopener noreferrer" target="_blank">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
