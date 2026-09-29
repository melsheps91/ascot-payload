// Tiny builders for Lexical rich-text JSON, so seed content can be written as plain data.

type Inline = string | { text: string; href: string } | { text: string; bold: true }

const text = (value: string, format = 0) => ({
  type: 'text',
  version: 1,
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
})

const inline = (part: Inline) => {
  if (typeof part === 'string') return text(part)
  if ('href' in part) {
    return {
      type: 'link',
      version: 3,
      fields: { linkType: 'custom', url: part.href, newTab: /^https?:/.test(part.href) },
      children: [text(part.text)],
      direction: 'ltr',
      format: '',
      indent: 0,
    }
  }
  return text(part.text, 1)
}

export type Node = ReturnType<typeof p> | ReturnType<typeof h> | ReturnType<typeof quote>

export const p = (...parts: Inline[]) => ({
  type: 'paragraph',
  version: 1,
  children: parts.map(inline),
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
})

export const h = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading',
  tag,
  version: 1,
  children: [text(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
})

// The Quote block from src/blocks/Quote.ts.
export const quote = (value: string, author?: string) => ({
  type: 'block',
  version: 2,
  format: '' as const,
  fields: { blockType: 'quote', blockName: '', quote: value, author },
})

export const richText = (...children: Node[]) => ({
  root: {
    type: 'root',
    version: 1,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  },
})

// Shorthand for several plain paragraphs.
export const paragraphs = (...values: string[]) => richText(...values.map((value) => p(value)))
