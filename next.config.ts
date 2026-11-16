import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Every page is static; nothing here needs a server at request time.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
