import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Jobs } from './collections/Jobs'
import { Testimonials } from './collections/Testimonials'
import { Cvs } from './collections/Cvs'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { CompanyDetails } from './globals/CompanyDetails'
import { JobSettings } from './globals/JobSettings'
import { revalidateHooks } from './hooks/revalidate'
import { acfImportEndpoints } from './endpoints/acfImport'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isDev = process.env.NODE_ENV !== 'production'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Purplex branding (logos in public/admin/, styles in src/app/(payload)/custom.scss).
    meta: {
      titleSuffix: ' — Ascot Group website | Purplex',
      icons: [{ rel: 'icon', type: 'image/png', url: '/admin/favicon.png' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/branding/Logo#Logo',
        Icon: '/components/admin/branding/Icon#Icon',
      },
      beforeLogin: ['/components/admin/branding/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
      afterNavLinks: [
        '/components/admin/branding/ViewSiteLink#ViewSiteLink',
        // Dev-only tool for turning CleanBuildPro ACF groups into blocks (see src/endpoints/acfImport.ts).
        ...(isDev ? ['/components/admin/AcfImportNavLink#AcfImportNavLink'] : []),
      ],
      views: {
        acfImport: {
          Component: '/components/admin/AcfImportView#AcfImportView',
          path: '/acf-import',
        },
      },
    },
  },
  collections: [Pages, Media, Testimonials, Posts, Categories, Jobs, Cvs, Users],
  globals: [Header, Footer, CompanyDetails, JobSettings],
  endpoints: acfImportEndpoints,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 20_000_000, // bytes
    },
  },
  plugins: [
    formBuilderPlugin({
      fields: {
        payment: false,
        state: false,
        country: false,
        radio: true,
        upload: true,
      },
      uploadCollections: ['cvs'],
      redirectRelationships: ['pages'],
      formOverrides: {
        admin: {
          group: 'Forms',
          description: 'The contact and job application forms. Add, remove or reorder fields here.',
        },
        access: { read: () => true },
        hooks: revalidateHooks,
      },
      formSubmissionOverrides: {
        labels: { singular: 'Submission', plural: 'Submissions' },
        admin: {
          group: 'Forms',
          defaultColumns: ['form', 'job', 'createdAt'],
          description: 'Everything sent through the website forms. Job applications are linked to their job and CV.',
        },
        fields: ({ defaultFields }) => [
          ...defaultFields,
          // Set by the job application form so applications can be filtered by job.
          {
            name: 'job',
            type: 'relationship',
            relationTo: 'jobs',
            admin: { position: 'sidebar', readOnly: true },
          },
        ],
      },
    }),
  ],
})
