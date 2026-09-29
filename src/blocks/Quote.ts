import type { Block } from 'payload'

// A pull quote with its author, inserted inside rich text (news articles).
export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'author', type: 'text' },
  ],
}
