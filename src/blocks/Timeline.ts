import type { Block } from 'payload'

import { headingDescription, sectionSettings } from '../fields/section'

// New for the redesign (no CleanBuildPro equivalent): an intro that stays in view beside
// a list of dated milestones.
export const Timeline: Block = {
  slug: 'timeline',
  imageURL: '/admin/blocks/timeline.jpg',
  admin: { group: 'Text & media' },
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'heading', type: 'text', admin: { description: headingDescription } },
      ],
    },
    { name: 'content', type: 'richText' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'year', type: 'text', required: true, admin: { width: '25%' } },
            { name: 'title', type: 'text', required: true },
          ],
        },
        { name: 'text', type: 'textarea' },
      ],
    },
    sectionSettings,
  ],
}
