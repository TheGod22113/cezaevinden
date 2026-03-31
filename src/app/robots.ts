import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/mesajlar/', '/profil/', '/giris', '/kayit', '/bildirimler'],
    },
    sitemap: 'https://cezaevinden.com/sitemap.xml',
  }
}
