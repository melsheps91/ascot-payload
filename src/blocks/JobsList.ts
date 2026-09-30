import type { Block } from 'payload'

import { link } from '../fields/link'
import { sectionIntro, sectionSettings } from '../fields/section'

// New for the redesign: open vacancies from the Jobs collection, with keyword and location
// filters and a call to action for speculative applications.
export const JobsList: Block = {
  slug: 'jobsList',
  imageURL: '/admin/blocks/jobsList.jpg',
  admin: { group: 'News & jobs' },
  interfaceName: 'JobsListBlock',
  labels: {
    singular: 'Vacancies list',
    plural: 'Vacancies lists',
  },
  fields: [
    sectionIntro,
    {
      name: 'emptyText',
      label: 'No matches text',
      type: 'text',
      defaultValue: 'No roles match your search — send us your CV instead.',
    },
    {
      name: 'cta',
      label: 'Call to action',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'text', type: 'textarea' },
        link({ name: 'button', label: 'Button' }),
      ],
    },
    sectionSettings,
  ],
}
