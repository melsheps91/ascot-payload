import { Fragment } from 'react'

// Equivalent of an ACF textarea with new_lines "wpautop": blank lines start a new
// paragraph and single line breaks become <br />.
export function Autop({ text }: { text?: string | null }) {
  if (!text?.trim()) return null

  return (
    <>
      {text
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph, i) => (
          <p key={i}>
            {paragraph.split('\n').map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        ))}
    </>
  )
}
