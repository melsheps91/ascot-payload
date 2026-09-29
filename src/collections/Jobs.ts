import { type CollectionConfig, slugField } from 'payload'

import { meta } from '../fields/meta'
import { revalidateHooks } from '../hooks/revalidate'
import { jobPath } from '../lib/routes'

// Vacancies (WordPress "careers" post type). Rendered at /careers/[slug].
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: {
    singular: 'Job',
    plural: 'Jobs',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Careers',
    defaultColumns: ['title', 'company', 'location', 'status'],
    description: 'Vacancies on /careers. Set a job to Closed to take it down without deleting it.',
    listSearchableFields: ['title', 'company', 'location'],
    preview: (doc) => (typeof doc?.slug === 'string' && doc.status === 'open' ? jobPath(doc.slug) : null),
  },
  access: {
    read: () => true,
  },
  hooks: revalidateHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ position: 'sidebar' }),
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      required: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar', description: 'Closed jobs are hidden from the site.' },
    },
    meta,
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', required: true },
        { name: 'location', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'type', label: 'Contract type', type: 'text', defaultValue: 'Full-time' },
        { name: 'hours', type: 'text' },
      ],
    },
    { name: 'summary', type: 'textarea', required: true },
    {
      name: 'duties',
      label: 'The role',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      label: 'About you',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
  ],
}
