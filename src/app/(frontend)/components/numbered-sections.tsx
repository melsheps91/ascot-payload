import type { NumberedSectionsBlock } from '@/payload-types'
import { getGlobals } from '@/lib/payload'

import { RichText } from './shared/rich-text'

const number = (i: number) => String(i + 1).padStart(2, '0')

// Legal pages: numbered sections beside a sticky contents list.
export async function NumberedSections({ block }: { block: NumberedSectionsBlock }) {
  const sections = block.sections ?? []
  if (!sections.length) return null

  const { company } = await getGlobals()

  return (
    <section className="numbered-sections-wrap med-pad">
      <div className="container numbered-sections">
        <nav aria-label={block.contentsHeading ?? 'Contents'} className="contents">
          <span className="eyebrow">{block.contentsHeading}</span>
          <ol>
            {sections.map((section, i) => (
              <li key={section.id}>
                <a href={`#section-${i + 1}`}>
                  <span>{number(i)}</span>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
          {company.regNumber && <span className="reg">Company no. {company.regNumber}</span>}
        </nav>
        <div className="sections">
          {sections.map((section, i) => (
            <article className="numbered-section" id={`section-${i + 1}`} key={section.id}>
              <span className="section-number">{number(i)}</span>
              <h2>{section.heading}</h2>
              {section.content?.root?.children?.length ? (
                <RichText data={section.content} />
              ) : (
                <p className="to-follow">Policy wording to be supplied.</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
