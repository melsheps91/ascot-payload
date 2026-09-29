import type { GlobalConfig } from 'payload'

import { link } from '../fields/link'
import { revalidateGlobal } from '../hooks/revalidate'

// Based on ACF group "Footer Sections" (group_6a2b08900foot). The address, phone and
// social links come from Company Details.
export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'logo', label: 'Footer Logo', type: 'upload', relationTo: 'media' },
        {
          name: 'badge',
          label: 'Award Badge',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'menuHeading', label: 'Menu 1 Heading', type: 'text', defaultValue: 'Information' },
        { name: 'addressHeading', label: 'Menu 2 Heading', type: 'text', defaultValue: 'Address' },
        { name: 'contactHeading', label: 'Menu 3 Heading', type: 'text', defaultValue: 'Get in touch' },
      ],
    },
    {
      name: 'menu',
      type: 'array',
      fields: [link({ name: 'link', label: 'Link', required: true })],
    },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [link({ name: 'link', label: 'Link', required: true })],
    },
    {
      name: 'copyright',
      type: 'text',
      admin: {
        description: '{year} and {company} are replaced with the current year and company name.',
      },
      defaultValue: '© Copyright {year} {company}',
    },
  ],
}
