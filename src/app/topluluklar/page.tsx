'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiUserGroup, HiUserPlus, HiLockClosed, HiGlobeAlt, HiMagnifyingGlass, HiPlus, HiXMark } from 'react-icons/hi2'

const communities = [
  { id: '1', slug: 'aile-destegi',      name: 'Aile Desteği',           members: 5670, posts: 1203, type: 'public',  category: 'Aile',      desc: 'Tutuklu ve hükümlü yakınlarının deneyim ve desteklerini paylaştığı grup.', color: 'from-green-500 to-green-700'   },
  { id: '2', slug: 'hukuki-haklarim',   name: 'Hukuki Haklarım',        members: 3420, posts: 891,  type: 'public',  category: 'Hukuk',     desc: 'İnfaz mevzuatı, yasal değişiklikler ve hak ihlalleri üzerine tartışma platformu.', color: 'from-navy-600 to-navy-800' },
  { id: '3', slug: 'tahliye-sonrasi',   name: 'Tahliye Sonrası Hayat',  members: 1240, posts: 342,  type: 'public',  category: 'Tahliye',   desc: 'İş, barınma, sosyal entegrasyon ve yeni başlangıçlar hakkında deneyim paylaşımı.', color: 'from-teal-500 to-teal-700' },
  { id: '4', slug: 'is-bulmak',         name: 'İş Bulmak',              members: 892,  posts: 234,  type: 'public',  category: 'Kariyer',   desc: 'Tahliye sonrası iş fırsatları, CV hazırlama ve kariyer tavsiyeleri.', color: 'from-blue-500 to-blue-700'      },
  { id: '5', slug: 'psikolojik-destek', name: 'Psikolojik Destek',      members: 670,  posts: 198,  type: 'public',  category: 'Psikoloji', desc: 'Uzman psikologlar ve gönüllülerin rehberlik ettiği duygusal destek topluluğu.', color: 'from-pink-500 to-pink-700'   },
  { id: '6', slug: 'cocuklarim',        name: 'Çocuklarım İçin',        members: 430,  posts: 98,   type: 'public',  category: 'Aile',      desc: 'Tutuklu ebeveynler için çocuklarıyla ilişkilerini güçlendirme ve destek alanı.', color: 'from-purple-500 to-purple-700'},
]

const categoryColors: Record<string, string> = {
  Aile:      'bg-green-100 text-green-700',
  Hukuk:     'bg-navy-100 text-navy-700',
  Tahliye:   'bg-teal-100 text-teal-700',
  Kariyer:   'bg-blue-100 text-blue-700',
  Psikoloji: 'bg-pink-100 text-pink-700',
}

export default function TopluluklarPage() {
  const [joined,       setJoined]       = useState<Set<string>>(new Set())
  const [search,       setSearch]       = useState('')
  const [showModal,    setShowModal]    = useState(false)
  const [newCommunity, setNewCommunity] = useState({ name: '', desc: '', category: 'Destek' })
  const [creating,     setCreating]     = useState(false)
  const [created,      setCreated]      = useState(false)

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommunity.name.trim()) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 800))
    setCreating(false)
    setCreated(true)
    setTimeout(() => {
      setShowModal(false)
      setCreated(false)
      setNewCommunity({ name: '', desc: '', category: 'Destek' })
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiUserGroup className="w-6 h-6 text-gold-500" />
              <h1 className="text-2xl font-bold">Topluluklar</h1>
            </div>
            <p className="text-blue-100 text-sm">Ortak paydaşlarla bir araya gelin, güçlü topluluklar oluşturun.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <HiPlus className="w-4 h-4" /> Oluştur
          </button>
        </div>
      </div>

      {/* Arama */}
      <div className="relative mb-6">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
          placeholder="Topluluk ara..."
        />
      </div>

      {/* Topluluk Kartları */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card overflow-hidden hover:shadow-md transition-all group">
            <Link href={`/topluluklar/${c.slug}`}>
              <div className={`h-24 bg-gradient-to-br ${c.color} flex items-end p-4 cursor-pointer`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white/20 text-white">
                    {c.category}
                  </span>
                  {c.type === 'private' && (
                    <span className="flex items-center gap-1 text-xs text-white/80">
                      <HiLockClosed className="w-3 h-3" /> Özel
                    </span>
                  )}
                </div>
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/topluluklar/${c.slug}`}>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-navy-700 transition-colors cursor-pointer">{c.name}</h3>
              </Link>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{c.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>👥 {c.members.toLocaleString('tr')}</span>
                  <span>📝 {c.posts}</span>
                </div>
                <button
                  onClick={() => setJoined(p => { const s = new Set(p); s.has(c.id) ? s.delete(c.id) : s.add(c.id); return s })}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    joined.has(c.id)
                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      : 'bg-navy-700 text-white hover:bg-navy-800'
                  }`}
                >
                  {joined.has(c.id) ? '✓ Katıldın' : <><HiUserPlus className="w-3.5 h-3.5" /> Katıl</>}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Topluluk Oluştur Banner */}
      <div className="mt-6 card p-5 border-2 border-dashed border-gray-200 text-center">
        <HiUserGroup className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="font-semibold text-gray-700 mb-1">Yeni Topluluk Oluştur</p>
        <p className="text-sm text-gray-400 mb-3">Kendi topluluğunuzu kurun ve insanları bir araya getirin.</p>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
          <HiPlus className="w-4 h-4 inline mr-1" /> Topluluk Oluştur
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-lg">Yeni Topluluk Oluştur</h2>
              <button onClick={() => setShowModal(false)} aria-label="Kapat" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {created ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HiUserGroup className="w-8 h-8 text-green-500" />
                </div>
                <p className="font-bold text-gray-800">Topluluk oluşturuldu!</p>
                <p className="text-sm text-gray-400 mt-1">İnceleme sonrası yayınlanacak.</p>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Topluluk Adı</label>
                  <input
                    type="text"
                    value={newCommunity.name}
                    onChange={e => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    className="input-field"
                    placeholder="Topluluğunuzun adını girin"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Kategori</label>
                  <select
                    value={newCommunity.category}
                    onChange={e => setNewCommunity({ ...newCommunity, category: e.target.value })}
                    className="input-field"
                  >
                    {['Aile', 'Hukuk', 'Tahliye', 'Kariyer', 'Psikoloji', 'Destek', 'Diğer'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Açıklama</label>
                  <textarea
                    rows={3}
                    value={newCommunity.desc}
                    onChange={e => setNewCommunity({ ...newCommunity, desc: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Topluluğunuzun amacını kısaca açıklayın..."
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">İptal</button>
                  <button type="submit" disabled={creating} className="btn-primary flex-1">
                    {creating ? 'Oluşturuluyor...' : 'Oluştur'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
