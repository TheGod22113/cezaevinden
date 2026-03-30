'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import {
  HiNewspaper,
  HiClock,
  HiEye,
  HiShare,
  HiBookmark,
  HiOutlineBookmark,
  HiArrowTopRightOnSquare,
  HiFire,
  HiTag,
  HiChevronRight,
} from 'react-icons/hi2'

const haberler = [
  {
    id: '1',
    title: 'Denetimli Serbestlik Süreleri Uzatıldı — Yeni Düzenleme Yürürlükte',
    excerpt: 'Adalet Bakanlığı\'nın açıklamasına göre denetimli serbestlik uygulamasında yeni düzenlemeyle birlikte süreler 1 yıldan 2 yıla çıkarıldı. Düzenleme 180.000 kişiyi etkileyecek.',
    category: 'Mevzuat',
    source: 'Adalet Bakanlığı',
    time: '3 saat önce',
    views: 12400,
    image: true,
    hot: true,
    tags: ['denetimliSerbestlik', 'infaz', 'kanun'],
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: '2',
    title: 'Türkiye\'deki Cezaevi Nüfusu Açıklandı — 350 Bin Tutuklu ve Hükümlü',
    excerpt: 'TÜİK ve Adalet Bakanlığı verilerine göre Türkiye\'deki cezaevlerinde 350 bin 847 kişi bulunuyor. Bu rakam 2020\'ye kıyasla yüzde 18 artış gösteriyor.',
    category: 'İstatistik',
    source: 'TÜİK',
    time: '1 gün önce',
    views: 8900,
    image: true,
    hot: false,
    tags: ['istatistik', 'cezaevleri', 'rapor'],
    color: 'from-gray-600 to-gray-800',
  },
  {
    id: '3',
    title: 'AİHM: Türkiye\'de Cezaevi Koşulları İnsan Hakları İhlali Oluşturuyor',
    excerpt: 'Avrupa İnsan Hakları Mahkemesi, Türkiye\'deki bazı cezaevlerindeki koşulların AİHS\'nin 3. maddesini ihlal ettiğine hükmetti. Türkiye ihlali gidermekle yükümlü.',
    category: 'İnsan Hakları',
    source: 'AİHM',
    time: '2 gün önce',
    views: 24500,
    image: true,
    hot: true,
    tags: ['AİHM', 'insanHakları', 'cezaevi'],
    color: 'from-red-600 to-red-800',
  },
  {
    id: '4',
    title: 'Cezaevinde Eğitim Programları Genişletildi — Online Kurs İmkânı',
    excerpt: 'MEB ile Adalet Bakanlığı arasındaki protokol kapsamında cezaevlerinde online eğitim platformuna erişim sağlanacak. Pilot uygulama 15 cezaevinde başladı.',
    category: 'Eğitim',
    source: 'MEB',
    time: '3 gün önce',
    views: 5600,
    image: false,
    hot: false,
    tags: ['eğitim', 'online', 'protokol'],
    color: 'from-green-600 to-green-800',
  },
  {
    id: '5',
    title: 'İnfaz İzleme Kurulları Raporu: Kapasite Sorunu Devam Ediyor',
    excerpt: 'Cezaevi İzleme Kurulları\'nın yıllık raporuna göre Türkiye\'deki cezaevlerinin yüzde 67\'si kapasitesinin üzerinde çalışıyor. Rapor, koşulların iyileştirilmesi için acil önlem alınmasını talep ediyor.',
    category: 'Rapor',
    source: 'İnfaz İzleme Kurulu',
    time: '4 gün önce',
    views: 7800,
    image: false,
    hot: true,
    tags: ['kapasite', 'izleme', 'rapor'],
    color: 'from-orange-600 to-orange-800',
  },
  {
    id: '6',
    title: 'Tahliye Sonrası Yeniden Entegrasyon Programı Başlatıldı',
    excerpt: 'ÇSGB ve STK\'lar iş birliğiyle hayata geçirilen program, tahliye olan kişilere iş bulma, barınma ve psikolojik destek sağlıyor. İlk yılda 5.000 kişiye ulaşılması hedefleniyor.',
    category: 'Sosyal',
    source: 'ÇSGB',
    time: '5 gün önce',
    views: 4200,
    image: false,
    hot: false,
    tags: ['tahliye', 'entegrasyon', 'iş'],
    color: 'from-teal-600 to-teal-800',
  },
]

const categories = ['Tümü', 'Mevzuat', 'İnsan Hakları', 'İstatistik', 'Eğitim', 'Rapor', 'Sosyal']

export default function HaberlerPage() {
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const filtered = activeCategory === 'Tümü'
    ? haberler
    : haberler.filter(h => h.category === activeCategory)

  const featured = haberler[0]
  const rest = haberler.slice(1)

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Bağlantı kopyalandı!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <HiNewspaper className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-bold">Haberler</h1>
        </div>
        <p className="text-blue-100 text-sm">
          Ceza adaleti, infaz mevzuatı ve cezaevi haberleri — güncel gelişmeler bir arada.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sol Sidebar */}
        <div className="hidden lg:block">
          <Sidebar active="/haberler" />
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Kategori Filtreleri */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Öne Çıkan Haber */}
          {activeCategory === 'Tümü' && (
            <Link href={`/haberler/${featured.id}`} className="card overflow-hidden animate-fade-in block hover:shadow-md transition-shadow">
              <div className={`h-48 bg-gradient-to-br ${featured.color} flex items-end p-5`}>
                <div>
                  <span className="bg-crimson-600 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block">
                    🔥 ÖNE ÇIKAN
                  </span>
                  <h2 className="text-white font-bold text-lg leading-tight">{featured.title}</h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{featured.category}</span>
                    <span>📰 {featured.source}</span>
                    <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {featured.time}</span>
                    <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {featured.views.toLocaleString('tr')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => handleShare(e, featured.title)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy-700 transition-colors px-2 py-1.5 hover:bg-gray-50 rounded-lg"
                    >
                      <HiShare className="w-4 h-4" /> Paylaş
                    </button>
                    <span className="flex items-center gap-1.5 text-xs bg-navy-700 text-white px-3 py-1.5 rounded-lg font-medium">
                      Devamını Oku <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Haber Listesi */}
          <div className="space-y-3">
            {(activeCategory === 'Tümü' ? rest : filtered).map(haber => (
              <Link
                key={haber.id}
                href={`/haberler/${haber.id}`}
                className="card p-4 hover:shadow-md transition-all group cursor-pointer animate-fade-in block"
              >
                <div className="flex gap-4">
                  {haber.image && (
                    <div className={`w-24 h-24 bg-gradient-to-br ${haber.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                      📰
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {haber.hot && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium mb-1">
                        <HiFire className="w-3.5 h-3.5" /> Gündemde
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 group-hover:text-navy-700 transition-colors text-sm leading-snug mb-1.5">
                      {haber.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{haber.excerpt}</p>

                    <div className="flex items-center gap-3 flex-wrap text-xs text-gray-400">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{haber.category}</span>
                      <span>{haber.source}</span>
                      <span className="flex items-center gap-0.5"><HiClock className="w-3 h-3" /> {haber.time}</span>
                      <span className="flex items-center gap-0.5"><HiEye className="w-3 h-3" /> {haber.views.toLocaleString('tr')}</span>
                      <button
                        onClick={e => toggleSave(e, haber.id)}
                        className={`ml-auto transition-colors ${saved.has(haber.id) ? 'text-navy-700' : 'hover:text-navy-700'}`}
                      >
                        {saved.has(haber.id) ? <HiBookmark className="w-4 h-4" /> : <HiOutlineBookmark className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sağ Panel */}
        <div className="hidden xl:block w-72 flex-shrink-0 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiTag className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Popüler Etiketler</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['denetimliSerbestlik', 'infaz', 'AİHM', 'tahliye', 'mevzuat', 'cezaevi', 'eğitim', 'rapor', 'insan hakları', 'istatistik'].map(tag => (
                <span key={tag} className="text-xs bg-navy-50 text-navy-700 px-2.5 py-1 rounded-full hover:bg-navy-100 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Haber Kaynakları</h3>
            <div className="space-y-2">
              {[
                { name: 'Adalet Bakanlığı', count: 234 },
                { name: 'AİHM Kararları',   count: 89  },
                { name: 'İnfaz İzleme',     count: 67  },
                { name: 'Baro Haberleri',   count: 45  },
                { name: 'TÜİK Verileri',    count: 34  },
              ].map(({ name, count }) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 hover:text-navy-700 cursor-pointer transition-colors flex items-center gap-1">
                    <HiChevronRight className="w-3.5 h-3.5 text-gray-300" /> {name}
                  </span>
                  <span className="text-xs text-gray-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
