import type { Block } from 'payload'

// New for the redesign (legal pages): numbered sections with a sticky contents list.
export const NumberedSections: Block = {
  slug: 'numberedSections',
  imageURL: '/admin/blocks/numberedSections.jpg',
  admin: { group: 'Forms & legal' },
  interfaceName: 'NumberedSectionsBlock',
  labels: {
    singular: 'Legal sections',
    plural: 'Legal sections',
  },
  fields: [
    {
      name: 'contentsHeading',
      label: 'Contents Heading',
      type: 'text',
      defaultValue: 'Contents',
    },
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'content',
          type: 'richText',
          admin: { description: 'Leave empty to show a "wording to be supplied" placeholder.' },
        },
      ],
    },
  ],
}
