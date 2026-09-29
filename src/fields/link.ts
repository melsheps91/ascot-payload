import type { Field, NamedGroupField } from 'payload'

type LinkOptions = {
  name: string
  label?: string
  required?: boolean
  admin?: NamedGroupField['admin']
}

// Equivalent of an ACF `link` field (url, title, target), plus the optional icon and
// style the redesign's pill buttons need.
export const link = ({ name, label, required, admin }: LinkOptions): Field => ({
  name,
  label,
  type: 'group',
  admin,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', type: 'text', required },
        { name: 'url', label: 'URL', type: 'text', required },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Automatic (first primary, then secondary)', value: 'auto' },
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Secondary (outline)', value: 'secondary' },
            { label: 'Text link with arrow', value: 'text' },
            { label: 'Round icon only', value: 'icon' },
          ],
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Optional Font Awesome classes, e.g. "fa-brands fa-linkedin-in".',
          },
        },
      ],
    },
    { name: 'newTab', label: 'Open in new tab', type: 'checkbox' },
  ],
})
