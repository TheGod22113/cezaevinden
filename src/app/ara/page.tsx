'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  HiMagnifyingGlass, HiUser, HiChatBubbleLeftRight,
  HiScale, HiDocumentText, HiCheckBadge, HiClock,
  HiArrowRight, HiXMark, HiFire,
} from 'react-icons/hi2'
import { roleBadgeClasses, roleLabels, timeAgo } from '@/lib/utils'

const tabs = [
  { id: 'all',   label: 'Tümü',       icon: HiMagnifyingGlass     },
  { id: 'users', label: 'Kişiler',    icon: HiUser                },
  { id: 'posts', label: 'Gönderiler', icon: HiDocumentText        },
  { id: 'forum', label: 'Forum',      icon: HiChatBubbleLeftRight },
  { id: 'legal', label: 'Hukuki',     icon: HiScale               },
]

const popularSearches = [
  'denetimli serbestlik', 'iyi hal indirimi', 'avukat görüşme hakkı',
  'tahliye belgeler', 'adli sicil affı', 'koşullu salıverilme',
]

export default function AraPage() {
  const [query,     setQuery]     = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'forum' | 'legal'>('all')
  const [results,   setResults]   = useState<any>(null)
  const [loading,   setLoading]   = useState(false)

  const search = useCallback(async (q: string, tab: string) => {
    if (q.length < 2) {
      setResults(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&tab=${tab}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(() => {
      search(query, activeTab)
    }, 400)
    return () => clearTimeout(timer)
  }, [query, activeTab, search])

  const handlePopularSearch = (s: string) => {
    setQuery(s)
  }

  const hasResults = results && (
    (results.users?.length > 0) ||
    (results.posts?.length > 0) ||
    (results.topics?.length > 0) ||
    (results.questions?.length > 0)
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Arama Kutusu */}
      <div className="mb-6">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search(query, activeTab)}
            placeholder="Gönderi, kullanıcı, forum konusu veya hukuki soru ara..."
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 shadow-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResults(null) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Popüler Aramalar — shown when no query */}
      {!query && (
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide flex items-center gap-2">
            <HiFire className="w-4 h-4 text-orange-500" /> Popüler Aramalar
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(s => (
              <button
                key={s}
                onClick={() => handlePopularSearch(s)}
                className="text-sm bg-gray-50 border border-gray-200 text-gray-600 hover:bg-navy-50 hover:border-navy-200 hover:text-navy-700 px-3 py-1.5 rounded-xl transition-all"
              >
                🔍 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Min char hint */}
      {query.length > 0 && query.length < 2 && (
        <div className="text-center text-sm text-gray-400 py-8">
          Arama için en az 2 karakter girin
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && query.length >= 2 && (
        <>
          {/* Tab bar */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-4 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {results && !hasResults && (
            <div className="text-center py-16 text-gray-400">
              <HiMagnifyingGlass className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Sonuç bulunamadı</p>
              <p className="text-xs mt-1">"{query}" için herhangi bir sonuç bulunamadı</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Kullanıcılar */}
            {(activeTab === 'all' || activeTab === 'users') && results?.users?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiUser className="w-4 h-4" /> Kişiler
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {results.users.map((u: any) => (
                    <Link
                      key={u.id}
                      href={`/profil/${u.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {u.name?.charAt(0) ?? '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-navy-700">
                            {u.name}
                          </span>
                          {u.verified && <HiCheckBadge className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                          {u.role && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClasses[u.role] ?? ''}`}>
                              {roleLabels[u.role] ?? u.role}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          @{u.username}{u.city ? ` · ${u.city}` : ''}
                        </p>
                      </div>
                      <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Gönderiler */}
            {(activeTab === 'all' || activeTab === 'posts') && results?.posts?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiDocumentText className="w-4 h-4" /> Gönderiler
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {results.posts.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/${p.id}`}
                      className="block px-4 py-3 hover:bg-gray-50 transition-all group"
                    >
                      <p className="text-sm text-gray-800 group-hover:text-navy-700 line-clamp-2 mb-1">
                        {p.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                        {p.author?.role && (
                          <span className={`px-1.5 py-0.5 rounded-full font-medium ${roleBadgeClasses[p.author.role] ?? ''}`}>
                            {roleLabels[p.author.role] ?? p.author.role}
                          </span>
                        )}
                        {p.author?.name && <span>{p.author.name}</span>}
                        <span>·</span>
                        <HiClock className="w-3 h-3" />
                        <span>{timeAgo(p.createdAt)}</span>
                        <span>· ❤️ {p._count?.likes ?? 0}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Forum Konuları */}
            {(activeTab === 'all' || activeTab === 'forum') && results?.topics?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiChatBubbleLeftRight className="w-4 h-4" /> Forum Konuları
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {results.topics.map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/forum/${t.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-navy-700">{t.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                          <HiClock className="w-3 h-3" />
                          <span>{timeAgo(t.createdAt)}</span>
                          <span>· {t._count?.replies ?? 0} yanıt</span>
                        </div>
                      </div>
                      <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Hukuki Sorular */}
            {(activeTab === 'all' || activeTab === 'legal') && results?.questions?.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiScale className="w-4 h-4" /> Hukuki Sorular
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {results.questions.map((q: any) => (
                    <Link
                      key={q.id}
                      href={`/hukuki-yardim/${q.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-navy-700">{q.title}</p>
                        {q.content && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{q.content}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${q.isAnswered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {q.isAnswered ? '✓ Yanıtlandı' : 'Yanıt bekleniyor'}
                          </span>
                        </div>
                      </div>
                      <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  )
}
