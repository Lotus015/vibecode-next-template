import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin panel configuration
  admin: {
    meta: {
      title: 'Payload CMS Admin',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // Collections
  collections: [Users],

  // Globals - will be added in future stories
  globals: [],

  // Rich text editor configuration
  editor: lexicalEditor(),

  // Secret for authentication
  secret: process.env.PAYLOAD_SECRET || 'default-secret-change-in-production',

  // TypeScript types output
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // Database adapter - PostgreSQL
  // Uses DATABASE_URL environment variable
  // During build without DB, Payload handles this gracefully
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
})
