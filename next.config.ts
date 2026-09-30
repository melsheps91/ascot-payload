import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Required by the Dockerfile, which copies from .next/standalone.
  output: 'standalone',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      // Media served straight from DigitalOcean Spaces (see src/payload.config.ts). The
      // storage plugin's URLs are lon1.digitaloceanspaces.com/<bucket>/…; `**` also allows
      // bucket-style and CDN hosts (<bucket>.lon1.cdn.…). S3_* variables are Run Time-only,
      // so this can't be env-driven.
      {
        hostname: '**.digitaloceanspaces.com',
        protocol: 'https',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
