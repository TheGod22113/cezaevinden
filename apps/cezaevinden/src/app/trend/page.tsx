'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiArrowTrendingUp, HiChatBubbleLeftRight, HiScale, HiHeart } from 'react-icons/hi2'
import { timeAgo } from '@/lib/utils'

export default function TrendPage() {
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-4">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <HiArrowTrendingUp className="w-7 h-7 text-crimson-600" />
        <div>
          <h1 className="text-2xl font-black text-gray-900">Trendler</h1>
          <p className="text-gray-500 text-sm">Bu haftanın en çok ilgi gören içerikleri</p>
        </div>
      </div>

      {/* Trending Posts */}
      {data?.posts?.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiHeart className="w-4 h-4 text-crimson-600" /> Popüler Gönderiler
          </h2>
          <div className="space-y-2">
            {data.posts.map((p: any, i: number) => (
              <Link key={p.id} href={`/${p.id}`}
                className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
                <span className="text-2xl font-black text-gray-200 w-8 flex-shrink-0">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-2">{p.content}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>❤️ {p._count.likes}</span>
                    <span>💬 {p._count.comments}</span>
                    <span>{timeAgo(p.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Topics */}
      {data?.topics?.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiChatBubbleLeftRight className="w-4 h-4 text-purple-600" /> Forum Trendleri
          </h2>
          <div className="space-y-2">
            {data.topics.map((t: any, i: number) => (
              <Link key={t.id} href={`/forum/${t.id}`}
                className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <span className="text-2xl font-black text-gray-200 w-8 flex-shrink-0">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{t.title}</p>
                  <p className="text-xs text-gray-500">{t._count.replies} yanıt · {timeAgo(t.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trending Legal */}
      {data?.legal?.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            <HiScale className="w-4 h-4 text-navy-700" /> Gündem Hukuki Sorular
          </h2>
          <div className="space-y-2">
            {data.legal.map((q: any, i: number) => (
              <Link key={q.id} href={`/hukuki-yardim/${q.id}`}
                className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <span className="text-2xl font-black text-gray-200 w-8 flex-shrink-0">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{q.title}</p>
                  <p className="text-xs text-gray-500">{q._count.answers} yanıt · {timeAgo(q.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
