import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { HiArrowLeft, HiCalendar, HiUser } from 'react-icons/hi2'
import ShareButton from '@/components/ShareButton'

interface Props { params: { id: string } }

export default async function HaberDetayPage({ params }: Props) {
  const news = await prisma.news.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, username: true } },
    },
  })

  if (!news || !news.published) notFound()

  const related = await prisma.news.findMany({
    where: {
      published: true,
      category: news.category,
      id: { not: news.id },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/haberler"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Haberlere Dön
      </Link>

      <article>
        <div className="mb-4">
          <span className="badge-navy text-xs px-3 py-1">{news.category}</span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{news.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1.5">
            <HiUser className="w-4 h-4" />
            {news.author?.name ?? 'Editör'}
          </span>
          <span className="flex items-center gap-1.5">
            <HiCalendar className="w-4 h-4" />
            {new Date(news.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <div className="ml-auto">
            <ShareButton title={news.title} url={`/haberler/${news.id}`} />
          </div>
        </div>

        {news.imageUrl && (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 font-medium mb-4 leading-relaxed">{news.summary}</p>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{news.content}</div>
        </div>
      </article>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-black text-gray-900 text-lg mb-4">İlgili Haberler</h2>
          <div className="space-y-3">
            {related.map(r => (
              <Link key={r.id} href={`/haberler/${r.id}`}
                className="card p-4 flex gap-3 hover:shadow-md transition-shadow">
                {r.imageUrl && (
                  <img src={r.imageUrl} alt={r.title}
                    className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
