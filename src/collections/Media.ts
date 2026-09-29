import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Image or file',
    plural: 'Images & files',
  },
  admin: {
    group: 'Website',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    description: 'Photos, logos and videos used around the site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Description (alt text)',
      type: 'text',
      required: true,
      admin: {
        description: 'Say what the image shows, e.g. "The team at the Spring BBQ". Read out by screen readers and used by search engines.',
      },
    },
  ],
  upload: true,
}
