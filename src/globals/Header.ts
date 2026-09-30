import type { GlobalConfig } from 'payload'

import { link } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

// The WordPress main menu and header logo.
export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'White version, shown over the navy banners.' },
    },
    {
      name: 'navItems',
      label: 'Menu',
      type: 'array',
      fields: [link({ name: 'link', label: 'Link', required: true })],
    },
    link({ name: 'cta', label: 'Button' }),
  ],
}
