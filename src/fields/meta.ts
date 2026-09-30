import type { Field } from 'payload'

// Search engine title and description, shown in the sidebar.
export const meta: Field = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Defaults to the title.' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
