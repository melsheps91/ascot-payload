import type { CollectionConfig } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'

// Based on ACF group "Testimonial" (group_5ad7689a7b303). The quote is the WordPress
// post content. Rating, origin and review type aren't used by the redesign.
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Website',
    description: 'Quotes shown by the Testimonials block.',
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'companyName', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: revalidateHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'customerName', label: 'Name', type: 'text', required: true },
        { name: 'companyName', label: 'Company or role', type: 'text' },
      ],
    },
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional square photo.' },
    },
  ],
}
