import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
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
    components: {
      // Dev-only tool for turning CleanBuildPro ACF groups into blocks (see src/endpoints/acfImport.ts).
      afterNavLinks: isDev ? ['/components/admin/AcfImportNavLink#AcfImportNavLink'] : [],
      views: {
        acfImport: {
          Component: '/components/admin/AcfImportView#AcfImportView',
          path: '/acf-import',
        },
      },
    },
  },
  collections: [Users, Media, Pages],
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
  plugins: [],
})
