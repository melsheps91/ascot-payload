import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { type CollectionConfig, slugField } from 'payload'

import { Quote } from '../blocks/Quote'
import { meta } from '../fields/meta'
import { revalidateHooks } from '../hooks/revalidate'
import { postPath } from '../lib/routes'

// News articles (WordPress posts). Rendered at /news/[slug].
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  admin: {
    useAsTitle: 'title',
    group: 'News',
    defaultColumns: ['title', 'category', 'publishedDate'],
    description: 'News articles, newest first on /news.',
    listSearchableFields: ['title', 'excerpt'],
    preview: (doc) => (typeof doc?.slug === 'string' ? postPath(doc.slug) : null),
  },
  access: {
    read: () => true,
  },
  defaultSort: '-publishedDate',
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    meta,
    { name: 'heroImage', label: 'Image', type: 'upload', relationTo: 'media' },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown on news cards and as the article intro.' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [Quote] })],
      }),
    },
  ],
}
