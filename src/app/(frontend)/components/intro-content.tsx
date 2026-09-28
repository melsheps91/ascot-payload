import { RichText } from '@payloadcms/richtext-lexical/react'

import type { IntroContentBlock } from '@/payload-types'

import { Buttons } from './shared/button'

export function IntroContent({ block }: { block: IntroContentBlock }) {
  const { eyebrow, heading, content, buttons } = block

  if (!content) return null

  return (
    <section className="intro-content large-pad grey-back" id="intro">
      <div className="container-small t-center">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <h2>{heading}</h2>}

        <RichText data={content} disableContainer />

        {buttons && buttons.length > 0 && (
          <div className="buttons j-center">
            <Buttons items={buttons} />
          </div>
        )}
      </div>
    </section>
  )
}
