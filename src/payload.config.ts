import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Header } from './Header/config'
import { Footer } from './Footer/config'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'

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
  collections: [Users, Media, Pages, Posts, Categories],

  // Globals
  globals: [Header, Footer, SiteSettings],

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

  // Plugins
  plugins,
})
