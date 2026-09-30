import type { GlobalConfig } from 'payload'

import { link } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

// Shared by every job page and the speculative application page (/careers/apply).
export const JobSettings: GlobalConfig = {
  slug: 'jobSettings',
  label: 'Job Settings',
  admin: { group: 'Careers' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'applicationForm',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Used on every job page and /careers/apply. Submissions are linked to the job.',
      },
    },
    {
      name: 'why',
      label: '"Why join us" panel',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'text', type: 'textarea' },
        link({ name: 'link', label: 'Link' }),
      ],
    },
    {
      name: 'general',
      label: 'Speculative application page',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Apply for *other roles.*' },
        { name: 'text', type: 'textarea' },
      ],
    },
  ],
}
