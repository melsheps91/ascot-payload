import type { Block } from 'payload'

import { link } from '../fields/link'
import { sectionIntro, sectionSettings } from '../fields/section'

// Generated from ACF group "Product Cards - Manual" (group_618a5e63ca3e7) by scripts/acf-to-payload.
// Hand-added for the redesign: the tag shown on each card.
export const ProductCardsManual: Block = {
  slug: 'productCardsManual',
  imageURL: '/admin/blocks/productCardsManual.jpg',
  admin: { group: 'Grids & cards' },
  interfaceName: 'ProductCardsManualBlock',
  labels: {
    singular: 'Image Cards',
    plural: 'Image Cards',
  },
  fields: [
    sectionIntro,
    {
      name: 'cards',
      label: 'Cards',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'tag', type: 'text' },
            {
              name: 'heading',
              label: 'Heading',
              required: true,
              type: 'text',
            },
          ],
        },
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
        },
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
        },
        link({
          name: 'link',
          label: 'Link',
          required: true,
        }),
      ],
    },
    sectionSettings,
  ],
}
