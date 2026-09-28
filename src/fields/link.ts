import type { Field, NamedGroupField } from 'payload'

type LinkOptions = {
  name: string
  label?: string
  required?: boolean
  admin?: NamedGroupField['admin']
}

// Equivalent of an ACF `link` field (url, title, target).
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
    { name: 'newTab', label: 'Open in new tab', type: 'checkbox' },
  ],
})
