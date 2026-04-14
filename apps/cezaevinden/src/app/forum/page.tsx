'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import {
  HiChatBubbleLeftRight,
  HiEye,
  HiHeart,
  HiCheckCircle,
  HiClock,
  HiMagnifyingGlass,
  HiPlus,
  HiFire,
  HiArrowTrendingUp,
  HiStar,
  HiChevronRight,
} from 'react-icons/hi2'

const categories = [
  { id: 'infaz',      label: 'İnfaz Hukuku',       icon: '⚖️', count: 128, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'aile',       label: 'Aile & Ziyaret',      icon: '👨‍👩‍👧', count: 89,  color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'tahliye',    label: 'Tahliye Süreci',       icon: '🚪', count: 64,  color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'psikoloji',  label: 'Psikolojik Destek',   icon: '🧠', count: 53,  color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'barinma',    label: 'Barınma & İş',         icon: '🏠', count: 41,  color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'mevzuat',    label: 'Mevzuat & Haberler',   icon: '📰', count: 37,  color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'egitim',     label: 'Eğitim & Gelişim',    icon: '📚', count: 29,  color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'saglik',     label: 'Sağlık Sorunları',    icon: '🏥', count: 24,  color: 'bg-pink-100 text-pink-700 border-pink-200' },
]

const topics = [
  {
    id: '1',
    title: 'Açık cezaevinde izin hakkı — hangi belgeler gerekiyor?',
    category: 'Aile & Ziyaret',
    author: 'Fatma Y.',
    authorRole: 'aile',
    replies: 18,
    views: 342,
    likes: 27,
    time: '2 saat önce',
    answered: false,
    hot: true,
    pinned: false,
    excerpt: 'Eşim açık cezaevinde. İzin hakkını kullanmak istiyoruz ama belgeler konusunda net bir bilgi bulamıyoruz...',
  },
  {
    id: '2',
    title: 'İyi hal indirimi hesaplama — 2025 güncel bilgi',
    category: 'İnfaz Hukuku',
    author: 'Av. Mehmet Y.',
    authorRole: 'avukat',
    replies: 34,
    views: 1204,
    likes: 89,
    time: '5 saat önce',
    answered: true,
    hot: true,
    pinned: true,
    excerpt: 'Son değişikliklerle birlikte iyi hal indirimi hesaplaması nasıl yapılıyor? Dikkat etmeniz gereken kriterler...',
  },
  {
    id: '3',
    title: 'Tahliye sonrası adli sicil — iş başvurularında ne yapmalı?',
    category: 'Tahliye Süreci',
    author: 'Ahmet K.',
    authorRole: 'tahliye',
    replies: 23,
    views: 567,
    likes: 45,
    time: '1 gün önce',
    answered: true,
    hot: false,
    pinned: false,
    excerpt: '6 yıl sonra tahliye oldum. İş bulmak gerçekten çok zor. Adli sicil affından sonra bile işverenler çekiniyor...',
  },
  {
    id: '4',
    title: 'Avukatla görüşme talebim 3 haftadır reddediliyor — hukuki yol?',
    category: 'İnfaz Hukuku',
    author: 'Anonim',
    authorRole: 'mahkum',
    replies: 34,
    views: 892,
    likes: 89,
    time: '1 gün önce',
    answered: false,
    hot: true,
    pinned: false,
    excerpt: 'Avukatla görüşme taleplerimi 3 haftadır reddediyorlar. "Avukat kapasitesi dolu" diyorlar. Bu yasal mı?...',
  },
  {
    id: '5',
    title: 'Denetimli serbestlik şartları — kaç ay kaldığımda başvurabilirim?',
    category: 'İnfaz Hukuku',
    author: 'Yusuf M.',
    authorRole: 'aile',
    replies: 12,
    views: 456,
    likes: 31,
    time: '2 gün önce',
    answered: true,
    hot: false,
    pinned: false,
    excerpt: 'Eşim toplam 4 yıl ceza aldı. Denetimli serbestlikten ne zaman ve nasıl yararlanabilir?...',
  },
]

const sortOptions = ['En Yeni', 'En Popüler', 'En Çok Yanıtlanan', 'Yanıtsız']
const roleColors: Record<string, string> = {
  mahkum:  'bg-orange-100 text-orange-700',
  aile:    'bg-green-100 text-green-700',
  avukat:  'bg-blue-100 text-blue-700',
  tahliye: 'bg-teal-100 text-teal-700',
  gonullu: 'bg-purple-100 text-purple-700',
}
const roleLabels: Record<string, string> = {
  mahkum: 'Tutuklu', aile: 'Aile', avukat: 'Avukat', tahliye: 'Tahliye', gonullu: 'Gönüllü',
}

type ApiTopic = {
  id: string
  title: string
  content: string
  category: string
  isAnonymous: boolean
  isPinned: boolean
  isSolved: boolean
  views: number
  createdAt: string
  author: { id: string | null; name: string; username: string | null; role: string; verified: boolean } | null
  _count: { replies: number }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Az önce'
  if (m < 60) return `${m} dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat önce`
  const d = Math.floor(h / 24)
  return `${d} gün önce`
}

export default function ForumPage() {
  const [activeSort, setActiveSort] = useState('En Yeni')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newTopic, setNewTopic] = useState({ title: '', category: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [topicList, setTopicList] = useState<typeof topics>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sort = activeSort === 'En Popüler' ? 'popular' : 'new'
    const cat  = selectedCategory
      ? categories.find(c => c.id === selectedCategory)?.label
      : undefined
    const url  = `/api/forum?sort=${sort}${cat ? `&category=${encodeURIComponent(cat)}` : ''}`
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then((data: ApiTopic[]) => {
        if (!Array.isArray(data)) return
        setTopicList(data.map(t => ({
          id:         t.id,
          title:      t.title,
          category:   t.category,
          author:     t.isAnonymous ? 'Anonim' : (t.author?.name ?? 'Üye'),
          authorRole: (t.author?.role ?? 'aile').toLowerCase(),
          replies:    t._count.replies,
          views:      t.views,
          likes:      0,
          time:       timeAgo(t.createdAt),
          answered:   t.isSolved,
          hot:        t._count.replies > 10,
          pinned:     t.isPinned,
          excerpt:    t.content.slice(0, 140),
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeSort, selectedCategory])

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopic.title.trim() || !newTopic.content.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopic),
      })
      if (res.ok) {
        const created = await res.json()
        setTopicList(prev => [{
          id: created.id,
          title: newTopic.title,
          category: newTopic.category || 'Genel',
          author: 'Siz',
          authorRole: 'mahkum',
          replies: 0,
          views: 1,
          likes: 0,
          time: 'Az önce',
          answered: false,
          hot: false,
          pinned: false,
          excerpt: newTopic.content.slice(0, 120) + '...',
        }, ...prev])
        setNewTopic({ title: '', category: '', content: '' })
        setShowModal(false)
      }
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Yeni Konu Modalı */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b dark:border-[#2a2d3e]">
              <h2 className="text-lg font-bold text-navy-700">Yeni Konu Aç</h2>
              <button onClick={() => setShowModal(false)} aria-label="Kapat" className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreateTopic} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Başlık</label>
                <input
                  className="input-field"
                  placeholder="Konunuzun başlığını yazın..."
                  value={newTopic.title}
                  onChange={e => setNewTopic(p => ({...p, title: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Kategori</label>
                <select
                  className="input-field"
                  value={newTopic.category}
                  onChange={e => setNewTopic(p => ({...p, category: e.target.value}))}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(c => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">İçerik</label>
                <textarea
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Konunuzu detaylı açıklayın..."
                  value={newTopic.content}
                  onChange={e => setNewTopic(p => ({...p, content: e.target.value}))}
                  required
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-[#2a2d3e] rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium text-sm">İptal</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-crimson-600 hover:bg-crimson-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm">
                  {submitting ? 'Gönderiliyor...' : 'Konuyu Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sayfa Başlığı */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiChatBubbleLeftRight className="w-6 h-6 text-gold-500" />
              <h1 className="text-2xl font-bold">Forum</h1>
            </div>
            <p className="text-blue-100 text-sm">Sorularınızı sorun, deneyimlerinizi paylaşın, birbirinize destek olun.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-crimson-600 hover:bg-crimson-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <HiPlus className="w-5 h-5" /> Yeni Konu Aç
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sol Sidebar */}
        <div className="hidden lg:block">
          <Sidebar active="/forum" />
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Arama + Filtre */}
          <div className="card p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Forum'da ara..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {sortOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setActiveSort(opt)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeSort === opt ? 'bg-navy-700 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Kategoriler */}
          <div className="card p-4">
            <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Kategoriler</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map(({ id, label, icon, count, color }) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(selectedCategory === id ? null : id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedCategory === id ? 'ring-2 ring-navy-700 ' + color : color + ' hover:opacity-80'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="truncate">{label}</span>
                  <span className="ml-auto text-xs opacity-70">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Konu Listesi */}
          <div className="space-y-3">
            {!loading && topicList.length === 0 && (
              <div className="card p-12 text-center text-gray-400">
                <HiChatBubbleLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Henüz konu yok</p>
                <p className="text-sm mt-1">İlk konuyu siz açın!</p>
              </div>
            )}
            {loading && [1,2,3].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-3" />
                <div className="flex gap-2">
                  <div className="h-3 bg-gray-100 rounded w-16" />
                  <div className="h-3 bg-gray-100 rounded w-20" />
                </div>
              </div>
            ))}
            {!loading && topicList.map(topic => (
              <article
                key={topic.id}
                onClick={() => window.location.href = `/forum/${topic.id}`}
                className="card p-4 hover:shadow-md transition-all cursor-pointer group animate-fade-in"
              >
                {/* Üst Satır */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {topic.pinned && <span className="text-gold-500 mt-0.5 flex-shrink-0">📌</span>}
                    {topic.hot && !topic.pinned && (
                      <HiFire className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-navy-700 transition-colors text-sm sm:text-base leading-snug">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{topic.excerpt}</p>
                    </div>
                  </div>
                  {topic.answered && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex-shrink-0">
                      <HiCheckCircle className="w-3.5 h-3.5" /> Yanıtlandı
                    </span>
                  )}
                </div>

                {/* Alt Meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[topic.authorRole]}`}>
                    {roleLabels[topic.authorRole]}
                  </span>
                  <span className="text-xs text-gray-500">{topic.author}</span>
                  <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{topic.category}</span>
                  <span className="text-xs text-gray-400">{topic.time}</span>

                  <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <HiChatBubbleLeftRight className="w-3.5 h-3.5" /> {topic.replies}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiEye className="w-3.5 h-3.5" /> {topic.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiHeart className="w-3.5 h-3.5" /> {topic.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sayfalama */}
          <div className="flex items-center justify-center gap-2">
            {[1,2,3,'...',12].map((page, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === 1 ? 'bg-navy-700 text-white' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/15 border border-gray-200 dark:border-[#2a2d3e]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Sağ Sidebar */}
        <div className="hidden xl:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
