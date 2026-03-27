'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  HiMagnifyingGlass, HiUser, HiChatBubbleLeftRight,
  HiScale, HiDocumentText, HiCheckBadge, HiClock,
  HiArrowRight, HiXMark,
} from 'react-icons/hi2'

const roleColors: Record<string, string> = {
  MAHKUM:  'bg-orange-100 text-orange-700',
  AILE:    'bg-green-100 text-green-700',
  AVUKAT:  'bg-blue-100 text-blue-700',
  TAHLIYE: 'bg-teal-100 text-teal-700',
  GONULLU: 'bg-purple-100 text-purple-700',
}
const roleLabels: Record<string, string> = {
  MAHKUM: 'Tutuklu', AILE: 'Aile', AVUKAT: 'Avukat', TAHLIYE: 'Tahliye', GONULLU: 'Gönüllü',
}

// Demo arama sonuçları
const demoResults = {
  users: [
    { id: '1', name: 'Av. Mehmet Yılmaz', username: 'av.mehmet', role: 'AVUKAT', verified: true,  city: 'Ankara' },
    { id: '2', name: 'Ahmet Kaya',         username: 'ahmetkaya', role: 'TAHLIYE',verified: false, city: 'İstanbul' },
  ],
  posts: [
    { id: '1', content: 'Denetimli serbestlik başvurusu hakkında önemli bilgiler...', author: { name: 'Av. Mehmet', role: 'AVUKAT' }, time: '2 saat önce', likes: 89 },
    { id: '2', content: 'Tahliye sonrası iş bulma deneyimlerim ve önerilerim...', author: { name: 'Ahmet K.', role: 'TAHLIYE' }, time: '1 gün önce', likes: 47 },
  ],
  topics: [
    { id: '1', title: 'Denetimli serbestlik şartları neler?', category: 'İnfaz Hukuku', replies: 18, time: '3 saat önce' },
    { id: '2', title: 'Açık cezaevinde izin hakkı ve belgeler', category: 'Aile & Ziyaret', replies: 12, time: '1 gün önce' },
  ],
  questions: [
    { id: '1', title: 'İyi hal indirimi nasıl hesaplanır?', category: 'İnfaz Hukuku', answered: true,  answers: 3 },
    { id: '2', title: 'Koşullu salıverilme tarihi hesaplama', category: 'İnfaz Hukuku', answered: false, answers: 0 },
  ],
}

const tabs = [
  { id: 'all',    label: 'Tümü',        icon: HiMagnifyingGlass  },
  { id: 'users',  label: 'Kişiler',     icon: HiUser             },
  { id: 'posts',  label: 'Gönderiler',  icon: HiDocumentText     },
  { id: 'forum',  label: 'Forum',       icon: HiChatBubbleLeftRight },
  { id: 'legal',  label: 'Hukuki',      icon: HiScale            },
]

const popularSearches = [
  'denetimli serbestlik', 'iyi hal indirimi', 'avukat görüşme hakkı',
  'tahliye belgeler', 'adli sicil affı', 'koşullu salıverilme',
]

export default function AraPage() {
  const [query,     setQuery]     = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searched,  setSearched]  = useState(false)

  const handleSearch = (q?: string) => {
    const val = q ?? query
    if (!val.trim()) return
    setQuery(val)
    setSearched(true)
  }

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
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Gönderi, kullanıcı, forum konusu veya hukuki soru ara..."
            className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-700 shadow-sm"
            autoFocus
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearched(false) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <HiXMark className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Popüler Aramalar */}
      {!searched && (
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Popüler Aramalar</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map(s => (
              <button key={s} onClick={() => handleSearch(s)}
                className="text-sm bg-gray-50 border border-gray-200 text-gray-600 hover:bg-navy-50 hover:border-navy-200 hover:text-navy-700 px-3 py-1.5 rounded-xl transition-all">
                🔍 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sonuçlar */}
      {searched && (
        <>
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-4 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Kullanıcılar */}
            {(activeTab === 'all' || activeTab === 'users') && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiUser className="w-4 h-4" /> Kişiler
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {demoResults.users.map(u => (
                    <Link key={u.id} href={`/profil/${u.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-gray-900 group-hover:text-navy-700">{u.name}</span>
                          {u.verified && <HiCheckBadge className="w-4 h-4 text-blue-500" />}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[u.role]}`}>
                            {roleLabels[u.role]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">@{u.username} · {u.city}</p>
                      </div>
                      <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Gönderiler */}
            {(activeTab === 'all' || activeTab === 'posts') && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiDocumentText className="w-4 h-4" /> Gönderiler
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {demoResults.posts.map(p => (
                    <div key={p.id} className="px-4 py-3 hover:bg-gray-50 transition-all cursor-pointer group">
                      <p className="text-sm text-gray-800 group-hover:text-navy-700 mb-1">{p.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className={`px-1.5 py-0.5 rounded-full font-medium ${roleColors[p.author.role]}`}>
                          {roleLabels[p.author.role]}
                        </span>
                        <span>{p.author.name}</span>
                        <span>·</span>
                        <HiClock className="w-3 h-3" />
                        <span>{p.time}</span>
                        <span>· ❤️ {p.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Forum */}
            {(activeTab === 'all' || activeTab === 'forum') && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiChatBubbleLeftRight className="w-4 h-4" /> Forum Konuları
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {demoResults.topics.map(t => (
                    <Link key={t.id} href="/forum"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-navy-700">{t.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{t.category}</span>
                          <span>{t.replies} yanıt</span>
                          <span>{t.time}</span>
                        </div>
                      </div>
                      <HiArrowRight className="w-4 h-4 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Hukuki */}
            {(activeTab === 'all' || activeTab === 'legal') && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <HiScale className="w-4 h-4" /> Hukuki Sorular
                </h2>
                <div className="card divide-y divide-gray-50 overflow-hidden">
                  {demoResults.questions.map(q => (
                    <Link key={q.id} href="/hukuki-yardim"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-navy-700">{q.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{q.category}</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${q.answered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {q.answered ? '✓ Yanıtlandı' : 'Yanıt bekleniyor'}
                          </span>
                          <span>{q.answers} yanıt</span>
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
