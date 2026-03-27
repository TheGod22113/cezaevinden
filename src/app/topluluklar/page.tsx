'use client'

import { useState } from 'react'
import { HiUserGroup, HiUserPlus, HiLockClosed, HiGlobeAlt, HiMagnifyingGlass } from 'react-icons/hi2'

const communities = [
  { id: '1', name: 'Ankara Tahliye Destek Grubu', members: 1240, posts: 342, type: 'public',  category: 'Destek',       desc: 'Ankara\'da tahliye olan veya olacak kişiler ve aileleri için dayanışma grubu.', color: 'from-blue-500 to-blue-700'    },
  { id: '2', name: 'İnfaz Hukuku Tartışmaları',   members: 3420, posts: 891, type: 'public',  category: 'Hukuk',        desc: 'İnfaz mevzuatı, yasal değişiklikler ve hak ihlalleri üzerine tartışma platformu.', color: 'from-navy-600 to-navy-800' },
  { id: '3', name: 'Aile Dayanışma Ağı',          members: 5670, posts: 1203,type: 'public',  category: 'Aile',         desc: 'Tutuklu ve hükümlü yakınlarının deneyim ve desteklerini paylaştığı özel grup.', color: 'from-green-500 to-green-700'  },
  { id: '4', name: 'Tahliye Sonrası Hayat',        members: 892,  posts: 234, type: 'public',  category: 'Tahliye',      desc: 'İş, barınma, sosyal entegrasyon ve yeni başlangıçlar hakkında deneyim paylaşımı.', color: 'from-teal-500 to-teal-700'  },
  { id: '5', name: 'Gönüllü Avukatlar Ağı',       members: 380,  posts: 156, type: 'private', category: 'Hukuk',        desc: 'Platformdaki gönüllü avukatların koordinasyon ve bilgi paylaşım grubu.', color: 'from-purple-500 to-purple-700' },
  { id: '6', name: 'Psikolojik Destek Çevresi',   members: 670,  posts: 198, type: 'public',  category: 'Psikoloji',    desc: 'Uzman psikologlar ve gönüllülerin rehberlik ettiği duygusal destek topluluğu.', color: 'from-pink-500 to-pink-700'   },
]

const categoryColors: Record<string, string> = {
  Destek: 'bg-blue-100 text-blue-700', Hukuk: 'bg-navy-100 text-navy-700',
  Aile: 'bg-green-100 text-green-700', Tahliye: 'bg-teal-100 text-teal-700',
  Psikoloji: 'bg-pink-100 text-pink-700',
}

export default function TopluluklarPage() {
  const [joined,  setJoined]  = useState<Set<string>>(new Set())
  const [search,  setSearch]  = useState('')

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <HiUserGroup className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-bold">Topluluklar</h1>
        </div>
        <p className="text-blue-100 text-sm">Ortak paydaşlarla bir araya gelin, güçlü topluluklar oluşturun.</p>
      </div>

      <div className="relative mb-6">
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
          placeholder="Topluluk ara..." />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="card overflow-hidden hover:shadow-md transition-all">
            <div className={`h-24 bg-gradient-to-br ${c.color} flex items-end p-4`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-white/20 text-white`}>
                  {c.category}
                </span>
                {c.type === 'private' && (
                  <span className="flex items-center gap-1 text-xs text-white/80">
                    <HiLockClosed className="w-3 h-3" /> Özel
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{c.name}</h3>
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
                      ? 'bg-gray-100 text-gray-500'
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

      <div className="mt-6 card p-5 border-2 border-dashed border-gray-200 text-center">
        <HiUserGroup className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="font-semibold text-gray-700 mb-1">Yeni Topluluk Oluştur</p>
        <p className="text-sm text-gray-400 mb-3">Kendi topluluğunuzu kurun ve insanları bir araya getirin.</p>
        <button className="btn-primary text-sm">Topluluk Oluştur</button>
      </div>
    </div>
  )
}
