/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'ui-avatars.com'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.cezaevinden.com' }],
        destination: 'https://cezaevinden.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
