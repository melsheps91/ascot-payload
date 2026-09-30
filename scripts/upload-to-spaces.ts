/**
 * Uploads local uploads to DigitalOcean Spaces, where the production site reads them:
 *   media/*  →  <S3_PREFIX>/<file>       public-read (images, served straight from Spaces)
 *   cvs/*    →  <S3_PREFIX>/cvs/<file>   private (only reachable through the admin)
 *
 * Keys are read from .env.spaces (git-ignored) or the environment:
 *   S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PREFIX (default ascot-payload)
 *
 * Files already in Spaces are skipped unless --force is passed.
 *   pnpm spaces:upload            # upload what's missing
 *   pnpm spaces:upload --dry      # list what would be uploaded
 */
import { HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.spaces' })

const { S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env
const PREFIX = process.env.S3_PREFIX || 'ascot-payload'
const dryRun = process.argv.includes('--dry')
const force = process.argv.includes('--force')

const missing = Object.entries({ S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY })
  .filter(([, value]) => !value)
  .map(([name]) => name)
if (missing.length) {
  console.error(`Missing ${missing.join(', ')}. Add them to .env.spaces (see the header of this file).`)
  process.exit(1)
}

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  // DigitalOcean requires this literal value; the real region is in the endpoint.
  region: 'us-east-1',
  credentials: { accessKeyId: S3_ACCESS_KEY_ID!, secretAccessKey: S3_SECRET_ACCESS_KEY! },
})

const exists = async (Key: string) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key }))
    return true
  } catch {
    return false
  }
}

const sets = [
  { dir: 'media', prefix: PREFIX, acl: 'public-read' as const },
  { dir: 'cvs', prefix: `${PREFIX}/cvs`, acl: 'private' as const },
]

let uploaded = 0
let skipped = 0
for (const { dir, prefix, acl } of sets) {
  if (!fs.existsSync(dir)) continue
  for (const file of fs.readdirSync(dir).filter((name) => !name.startsWith('.'))) {
    const Key = `${prefix}/${file}`
    if (!force && (await exists(Key))) {
      skipped++
      continue
    }
    const ContentType = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream'
    console.log(`${dryRun ? 'would upload' : 'uploading'} ${Key} (${acl}, ${ContentType})`)
    if (!dryRun) {
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key,
          Body: fs.readFileSync(path.join(dir, file)),
          ACL: acl,
          ContentType,
        }),
      )
    }
    uploaded++
  }
}
console.log(`\n${dryRun ? 'Would upload' : 'Uploaded'} ${uploaded} file(s); ${skipped} already in Spaces.`)
