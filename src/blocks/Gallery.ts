import type { Block } from 'payload'

import { sectionIntro, sectionSettings } from '../fields/section'

// Generated from ACF group "Gallery" (group_618b87354f82e) by scripts/acf-to-payload.
export const Gallery: Block = {
  slug: 'gallery',
  imageURL: '/admin/blocks/gallery.jpg',
  admin: { group: 'Text & media' },
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Image gallery',
    plural: 'Image galleries',
  },
  fields: [
    sectionIntro,
    {
      name: 'gallery',
      label: 'Gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      minRows: 1,
      admin: {
        description: 'One image shows full width. Two or more show as a grid.',
      },
    },
    sectionSettings,
  ],
}
