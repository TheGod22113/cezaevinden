import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/mesajlar/',
          '/profil/',
          '/giris',
          '/kayit',
          '/bildirimler',
          '/arama',
          '/kaydedilenler',
          '/onboarding',
          '/profil/ayarlar',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
    ],
    sitemap: 'https://cezaevinden.com/sitemap.xml',
  }
}
