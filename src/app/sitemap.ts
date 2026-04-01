import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const base = 'https://cezaevinden.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1   },
    { url: `${base}/forum`,             lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${base}/hukuki-yardim`,     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/haberler`,          lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.8 },
    { url: `${base}/destek`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/hesapla`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/avukat-ol`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/hakkimizda`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/sss`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/dilekce`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/gizlilik`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/kullanim-kosullari`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/avukat-ol`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/iletisim`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/kvkk`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/basin`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const [forumTopics, legalQuestions, news] = await Promise.all([
      prisma.forumTopic.findMany({
        where: { isAnonymous: false },
        select: { id: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.legalQuestion.findMany({
        where: { isAnonymous: false },
        select: { id: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.news.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ])

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...forumTopics.map(t => ({
        url: `${base}/forum/${t.id}`,
        lastModified: t.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...legalQuestions.map(q => ({
        url: `${base}/hukuki-yardim/${q.id}`,
        lastModified: q.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
      ...news.map(n => ({
        url: `${base}/haberler/${n.id}`,
        lastModified: n.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ]

    // Destek kaynakları
    try {
      const support = await prisma.supportResource.findMany({
        where: { verified: true },
        select: { id: true, updatedAt: true },
        take: 50,
      })
      dynamicRoutes.push(...support.map(s => ({
        url: `${base}/destek/${s.id}`,
        lastModified: s.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })))
    } catch { /* supportResource tablosu yoksa atla */ }

    return [...staticRoutes, ...dynamicRoutes]
  } catch {
    return staticRoutes
  }
}
