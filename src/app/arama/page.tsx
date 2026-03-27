'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiMagnifyingGlass, HiUsers, HiDocumentText, HiChatBubbleLeftRight, HiScale } from 'react-icons/hi2'
import { roleLabels, roleColors, timeAgo } from '@/lib/utils'

type Tab = 'all' | 'users' | 'posts' | 'forum' | 'legal'

function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [tab, setTab]     = useState<Tab>('all')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q.trim()) return
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(q)}&tab=${tab}`)
      .then(r => r.json())
      .then(d => { setResults(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [q, tab])

  const tabs: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
    { key: 'all',   label: 'Tümü',   icon: HiMagnifyingGlass },
    { key: 'users', label: 'Kişiler',icon: HiUsers },
    { key: 'posts', label: 'Gönderiler', icon: HiDocumentText },
    { key: 'forum', label: 'Forum',  icon: HiChatBubbleLeftRight },
    { key: 'legal', label: 'Hukuki', icon: HiScale },
  ]

  return (
    <div>
      {/* Search header */}
      <div className="mb-6">
        <form method="GET" className="flex gap-2">
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Ara…"
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-5">Ara</button>
        </form>
        {q && <p className="text-sm text-gray-500 mt-2">"{q}" için sonuçlar</p>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'bg-navy-700 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results && (
        <div className="space-y-6">
          {/* Users */}
          {(tab === 'all' || tab === 'users') && results.users?.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HiUsers className="w-4 h-4" /> Kişiler
              </h2>
              <div className="space-y-2">
                {results.users.map((u: any) => (
                  <Link key={u.username} href={`/profil/${u.username}`}
                    className="card p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                    <span className={`badge-${roleColors[u.role] ?? 'gray'} text-xs`}>
                      {roleLabels[u.role] ?? u.role}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Posts */}
          {(tab === 'all' || tab === 'posts') && results.posts?.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HiDocumentText className="w-4 h-4" /> Gönderiler
              </h2>
              <div className="space-y-2">
                {results.posts.map((p: any) => (
                  <Link key={p.id} href={`/${p.id}`}
                    className="card p-3 hover:shadow-md transition-shadow block">
                    <p className="text-sm text-gray-800 line-clamp-2">{p.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(p.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Forum */}
          {(tab === 'all' || tab === 'forum') && results.topics?.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HiChatBubbleLeftRight className="w-4 h-4" /> Forum
              </h2>
              <div className="space-y-2">
                {results.topics.map((t: any) => (
                  <Link key={t.id} href={`/forum/${t.id}`}
                    className="card p-3 hover:shadow-md transition-shadow block">
                    <p className="font-semibold text-gray-900 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(t.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Legal */}
          {(tab === 'all' || tab === 'legal') && results.questions?.length > 0 && (
            <section>
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HiScale className="w-4 h-4" /> Hukuki Sorular
              </h2>
              <div className="space-y-2">
                {results.questions.map((q: any) => (
                  <Link key={q.id} href={`/hukuki-yardim/${q.id}`}
                    className="card p-3 hover:shadow-md transition-shadow block">
                    <p className="font-semibold text-gray-900 text-sm">{q.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{q.content}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!results.users?.length && !results.posts?.length && !results.topics?.length && !results.questions?.length && (
            <div className="text-center py-16 text-gray-400">
              <HiMagnifyingGlass className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>"{q}" için sonuç bulunamadı.</p>
            </div>
          )}
        </div>
      )}

      {!q && (
        <div className="text-center py-16 text-gray-400">
          <HiMagnifyingGlass className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aramak için bir şeyler yazın.</p>
        </div>
      )}
    </div>
  )
}

export default function AramaPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Suspense fallback={<div className="text-center py-8 text-gray-400">Yükleniyor…</div>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
