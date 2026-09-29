import type { CollectionConfig } from 'payload'

const isLoggedIn = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// CVs uploaded with job applications. Only logged-in users can see or download them.
// The Form Builder plugin creates them through the Local API, which bypasses access control.
export const Cvs: CollectionConfig = {
  slug: 'cvs',
  labels: {
    singular: 'CV',
    plural: 'CVs',
  },
  admin: {
    group: 'Careers',
    description: 'Uploaded with job applications. Open an application under Form Submissions.',
  },
  access: {
    read: isLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    staticDir: 'cvs',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  fields: [],
}
