import type { Block } from 'payload'

import { sectionIntro, sectionSettings } from '../fields/section'

// Based on the "logo_grid" gallery in ACF group "Global Sections" (group_617005bcaf28a).
// A block rather than a global so each page can have its own logos, and an array rather
// than a gallery so a logo can have a name (shown until its image is uploaded) and a link.
export const LogoGrid: Block = {
  slug: 'logoGrid',
  imageURL: '/admin/blocks/logoGrid.jpg',
  admin: { group: 'Grids & cards' },
  interfaceName: 'LogoGridBlock',
  labels: {
    singular: 'Logo grid',
    plural: 'Logo grids',
  },
  fields: [
    sectionIntro,
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'url', label: 'URL', type: 'text' },
          ],
        },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
    sectionSettings,
  ],
}
