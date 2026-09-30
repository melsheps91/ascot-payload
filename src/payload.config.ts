import { postgresAdapter } from '@payloadcms/db-postgres'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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

// DigitalOcean signs managed Postgres certificates with its own CA, which Node doesn't
// trust by default. `sslmode` in the URL overrides the `ssl.ca` option, so it's stripped
// once a CA certificate is supplied. (Same approach as the Payload Starter.)
const databaseCACert = process.env.DATABASE_CA_CERT
function connectionString() {
  const raw = process.env.DATABASE_URL || ''
  if (!raw || !databaseCACert) return raw
  const url = new URL(raw)
  url.searchParams.delete('sslmode')
  return url.toString()
}

// DigitalOcean Spaces (S3-compatible), so uploads survive redeploys. Switched on by
// S3_BUCKET; off locally, where files stay on disk in media/ and cvs/. S3_PREFIX
// namespaces this site inside a bucket shared with other sites (must be unique per site).
// alwaysInsertFields keeps the plugin's `prefix` column in the schema either way, so
// local migrations match production.
// A fixed default keeps the schema and stored file keys the same in every environment.
const S3_PREFIX = process.env.S3_PREFIX || 'ascot-payload'
const spaces = {
  enabled: Boolean(process.env.S3_BUCKET),
  alwaysInsertFields: true,
  bucket: process.env.S3_BUCKET || '',
  config: {
    endpoint: process.env.S3_ENDPOINT,
    // DigitalOcean requires this literal value; the real region is in the endpoint.
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: false,
  },
}

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
  db: postgresAdapter({
    pool: {
      connectionString: connectionString(),
      ...(databaseCACert && { ssl: { ca: databaseCACert } }),
    },
    // Development pushes schema changes automatically. Production never does:
    // apply migrations by hand with `pnpm payload migrate` (prodMigrations is
    // deliberately not set; see .claude/skills/pre-deploy-check).
    push: isDev,
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 20_000_000, // bytes
    },
  },
  plugins: [
    // Images: public, served straight from Spaces.
    s3Storage({
      ...spaces,
      acl: 'public-read',
      collections: {
        media: { prefix: S3_PREFIX, disablePayloadAccessControl: true },
      },
    }),
    // CVs: private. Downloads go through Payload's own file route, so the collection's
    // access control (logged-in users only) still applies.
    s3Storage({
      ...spaces,
      acl: 'private',
      collections: {
        cvs: { prefix: `${S3_PREFIX}/cvs` },
      },
    }),
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
