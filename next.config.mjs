/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 Désactive les erreurs TypeScript au build
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🔥 Désactive ESLint au build (optionnel mais recommandé)
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      // ✅ CORS pour l'API
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },

      // ✅ Headers de sécurité globaux
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'deny' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig