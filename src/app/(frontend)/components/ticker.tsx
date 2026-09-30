import type { CSSProperties } from 'react'

import type { TickerBlock } from '@/payload-types'

export function Ticker({ block }: { block: TickerBlock }) {
  const items = block.items ?? []
  if (!items.length) return null

  // Two copies side by side so the strip loops seamlessly.
  const row = (copy: number) =>
    items.map((item) => (
      <span aria-hidden={copy > 0 || undefined} className="ticker-item" key={`${copy}-${item.id}`}>
        {item.label}
        <span className="ticker-dot" />
      </span>
    ))

  return (
    <section
      className={`ticker-wrap${block.theme === 'dark' ? ' primary-back' : block.theme === 'grey' ? ' grey-back' : ''}`}
      id={block.anchor || undefined}
    >
      <div className="ticker" style={{ '--ticker-duration': `${block.duration ?? 40}s` } as CSSProperties}>
        {row(0)}
        {row(1)}
      </div>
    </section>
  )
}
