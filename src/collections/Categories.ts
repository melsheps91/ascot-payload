import { type CollectionConfig, slugField } from 'payload'

import { revalidateHooks } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'News',
    description: 'The filter buttons on /news.',
    defaultColumns: ['title', 'order'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      name: 'order',
      type: 'number',
      admin: { position: 'sidebar', description: 'Order of the news filter buttons.' },
    },
  ],
}
