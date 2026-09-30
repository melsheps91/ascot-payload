import { Fragment, type JSX } from 'react'

// Renders "Build your career *with us.*" with the starred words in bold, which is how
// the redesign mixes light and heavy weights in one heading.
export function Emphasis({ text }: { text?: string | null }) {
  if (!text) return null

  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <strong key={i}>{part.slice(1, -1)}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function Heading({
  text,
  as: Tag = 'h2',
  className,
}: {
  text?: string | null
  as?: keyof JSX.IntrinsicElements
  className?: string
}) {
  if (!text) return null

  return (
    <Tag className={className}>
      <Emphasis text={text} />
    </Tag>
  )
}
