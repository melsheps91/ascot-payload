import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    description: 'People who can log in to this admin.',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
