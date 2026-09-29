import type { ReactNode } from 'react'

import { Autop } from './autop'
import { Button, type LinkValue } from './button'
import { Heading } from './heading'

type SectionSettings = {
  theme?: 'light' | 'grey' | 'dark' | null
  anchor?: string | null
}

const backgrounds = { light: '', grey: 'grey-back', dark: 'primary-back' }

// The outer <section> for a block: the theme's `{name}-wrap large-pad` plus its background.
export function Section({
  block,
  name,
  className,
  children,
}: {
  block: SectionSettings
  name: string
  className?: string
  children: ReactNode
}) {
  const classes = [`${name}-wrap`, 'large-pad', backgrounds[block.theme ?? 'light'], className]

  return (
    <section className={classes.filter(Boolean).join(' ')} id={block.anchor || undefined}>
      {children}
    </section>
  )
}

type Intro = {
  introEyebrow?: string | null
  introHeading?: string | null
  introText?: string | null
  introButton?: LinkValue
}

// The theme's `.intro-content` above a grid: eyebrow and heading on the left, text and
// button on the right.
export function SectionIntro({ block, size }: { block: Intro; size?: 'large' }) {
  const { introEyebrow, introHeading, introText, introButton } = block
  if (!introEyebrow && !introHeading && !introText && !introButton?.url) return null

  const hasAside = introText || introButton?.url

  return (
    <div className={`section-intro${hasAside ? '' : ' no-aside'}`}>
      <div className="section-intro-main">
        {introEyebrow && <span className="eyebrow">{introEyebrow}</span>}
        <Heading className={size === 'large' ? 'h2-large' : undefined} text={introHeading} />
      </div>
      {hasAside && (
        <div className="section-intro-aside">
          {introText && (
            <div className="content">
              <Autop text={introText} />
            </div>
          )}
          <Button link={introButton} variant="secondary" />
        </div>
      )}
    </div>
  )
}
