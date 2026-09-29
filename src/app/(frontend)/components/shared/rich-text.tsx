import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { type JSXConvertersFunction, RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import type { QuoteBlock } from '@/payload-types'

// Adds the Quote block (news articles) to Payload's default converters.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    quote: ({ node }: { node: { fields: QuoteBlock } }) => (
      <figure className="pull-quote">
        <blockquote>“{node.fields.quote}”</blockquote>
        {node.fields.author && <figcaption>— {node.fields.author}</figcaption>}
      </figure>
    ),
  },
})

export function RichText({
  data,
  className = 'content',
}: {
  data?: SerializedEditorState | null
  className?: string
}) {
  if (!data?.root?.children?.length) return null

  return <LexicalRichText className={className} converters={converters} data={data} />
}
