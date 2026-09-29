import type { Block } from 'payload'

import { link } from '../fields/link'
import { sectionIntro, sectionSettings } from '../fields/section'

// Generated from ACF group "Icon Grid" (group_618b8f658cde7) by scripts/acf-to-payload.
// Hand-added for the redesign: the grid style, numbering and an optional image per item.
export const IconGrid: Block = {
  slug: 'iconGrid',
  imageURL: '/admin/blocks/iconGrid.jpg',
  admin: { group: 'Grids & cards' },
  interfaceName: 'IconGridBlock',
  labels: {
    singular: 'Icon grid',
    plural: 'Icon grids',
  },
  fields: [
    sectionIntro,
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'bordered',
          required: true,
          options: [
            { label: 'Bordered grid', value: 'bordered' },
            { label: 'Cards', value: 'cards' },
            { label: 'Row with dividers', value: 'row' },
            { label: 'Pills (headings only)', value: 'pills' },
          ],
        },
        {
          name: 'numbered',
          type: 'checkbox',
          admin: {
            description: 'Show 01, 02, 03… at the top of each item.',
            style: { alignSelf: 'center' },
          },
        },
      ],
    },
    {
      name: 'grid',
      label: 'Icon Grid',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              label: 'Icon',
              type: 'text',
              admin: { description: 'Font Awesome classes, e.g. "fa-solid fa-award".' },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Optional logo, shown in a white panel.' },
            },
          ],
        },
        {
          name: 'heading',
          label: 'Heading',
          required: true,
          type: 'text',
        },
        {
          name: 'text',
          label: 'Text',
          type: 'textarea',
        },
        link({
          name: 'link',
          label: 'Link',
          admin: {
            description:
              'Leave the label empty to make the whole item clickable, or add one to show a text link.',
          },
        }),
      ],
    },
    sectionSettings,
  ],
}
