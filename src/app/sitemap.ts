import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cezaevinden.com'
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: 'daily',   priority: 1   },
    { url: `${base}/forum`,        lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${base}/hukuki-yardim`,lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/haberler`,     lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${base}/destek`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/kayit`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/hakkimizda`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]
}
