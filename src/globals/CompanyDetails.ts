import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '../hooks/revalidate'

// Based on ACF group "Company Details" (group_58ec97ac10edb). Opening hours and their
// structured data aren't used by the redesign, so they aren't ported.
export const CompanyDetails: GlobalConfig = {
  slug: 'companyDetails',
  label: 'Company Details',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'companyName', label: 'Company Name', type: 'text', required: true },
                { name: 'regNumber', label: 'Company Reg Number', type: 'text' },
              ],
            },
            {
              name: 'address',
              label: 'Company Address',
              type: 'array',
              fields: [{ name: 'line', label: 'Address Line', type: 'text', required: true }],
            },
            {
              name: 'addressNote',
              label: 'Directions',
              type: 'text',
              admin: { description: 'Shown under the address on the contact page.' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'phoneNumbers',
              label: 'Company Phone Number',
              type: 'array',
              fields: [{ name: 'number', label: 'Phone Number', type: 'text', required: true }],
            },
            {
              name: 'emailAddresses',
              label: 'Company Email Address',
              type: 'array',
              fields: [{ name: 'email', label: 'Email Address', type: 'email', required: true }],
            },
            {
              name: 'socialLinks',
              label: 'Social Links',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', label: 'Social Title', type: 'text', required: true },
                    {
                      name: 'icon',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. "fa-brands fa-linkedin-in"' },
                    },
                  ],
                },
                { name: 'url', label: 'Social Link', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
