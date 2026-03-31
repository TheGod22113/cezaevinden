'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import {
  HiHandRaised,
  HiHome,
  HiBriefcase,
  HiHeart,
  HiAcademicCap,
  HiPhone,
  HiMapPin,
  HiArrowRight,
  HiCheckCircle,
  HiGlobeAlt,
  HiUserGroup,
  HiCurrencyDollar,
  HiShieldCheck,
} from 'react-icons/hi2'

const categories = [
  { id: 'barinma',   label: 'Barınma',           icon: HiHome,          color: 'bg-blue-500',   count: 24 },
  { id: 'is',        label: 'İş & Kariyer',       icon: HiBriefcase,     color: 'bg-green-500',  count: 38 },
  { id: 'psikoloji', label: 'Psikolojik Destek',  icon: HiHeart,         color: 'bg-pink-500',   count: 19 },
  { id: 'egitim',    label: 'Eğitim',             icon: HiAcademicCap,   color: 'bg-yellow-500', count: 15 },
  { id: 'maddi',     label: 'Maddi Yardım',       icon: HiCurrencyDollar,color: 'bg-orange-500', count: 12 },
  { id: 'hukuk',     label: 'Hukuki Destek',      icon: HiShieldCheck,   color: 'bg-navy-500',   count: 31 },
]


const cityFilter = ['Tümü', 'Ankara', 'İstanbul', 'İzmir', 'Bursa', 'Türkiye Geneli']

export default function DestekPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeCity, setActiveCity] = useState('Tümü')
  const [dbResources, setDbResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeCity !== 'Tümü') params.set('city', activeCity)
    if (activeCategory) {
      const cat = categories.find(c => c.id === activeCategory)
      if (cat) params.set('category', cat.label)
    }
    fetch(`/api/support?${params}`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setDbResources([])
          return
        }
        setDbResources(data.map(r => ({
          id:          r.id,
          name:        r.name,
          category:    r.category,
          city:        r.city ?? 'Türkiye Geneli',
          type:        'STK',
          services:    [],
          phone:       r.phone ?? '',
          website:     r.website ?? '',
          verified:    r.verified,
          rating:      4.5,
          description: r.description,
        })))
      })
      .catch(() => setDbResources([]))
      .finally(() => setLoadingResources(false))
  }, [activeCategory, activeCity])

  const filtered = dbResources.filter(r => {
    const catMatch = !activeCategory || r.category.toLowerCase().includes(activeCategory)
    const cityMatch = activeCity === 'Tümü' || r.city === activeCity
    return catMatch && cityMatch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <HiHandRaised className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-bold">Destek Ağı</h1>
        </div>
        <p className="text-blue-100 text-sm max-w-xl">
          Barınma, iş, psikolojik ve hukuki destek için kurum ve gönüllülere ulaşın.
          Tahliye sonrası yeni bir başlangıç için buradayız.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20">
          {[
            { icon: '🏠', value: '180+', label: 'Barınma İmkânı' },
            { icon: '💼', value: '2.4K', label: 'İş Fırsatı' },
            { icon: '🧠', value: '90+',  label: 'Psikolog' },
            { icon: '🤝', value: '45',   label: 'Partner STK' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold">{icon} {value}</p>
              <p className="text-xs text-blue-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sol Sidebar */}
        <div className="hidden lg:block">
          <Sidebar active="/destek" />
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Kategori Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map(({ id, label, icon: Icon, color, count }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(activeCategory === id ? null : id)}
                className={`card p-3 flex flex-col items-center text-center transition-all group ${
                  activeCategory === id ? 'ring-2 ring-navy-700' : 'hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400">{count} kaynak</p>
              </button>
            ))}
          </div>

          {/* Şehir Filtresi */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {cityFilter.map(city => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  activeCity === city ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <HiMapPin className="w-3.5 h-3.5 inline mr-1" />{city}
              </button>
            ))}
          </div>

          {/* Kaynak Listesi */}
          <div className="space-y-4">
            {!loadingResources && filtered.length === 0 && (
              <div className="card p-8 text-center text-gray-400">
                <p>Bu kategoride kaynak bulunamadı.</p>
              </div>
            )}
            {loadingResources && [1,2,3].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
            {!loadingResources && filtered.map(resource => (
              <div key={resource.id} className="card p-5 hover:shadow-md transition-all animate-fade-in">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900">{resource.name}</h3>
                      {resource.verified && (
                        <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          <HiCheckCircle className="w-3.5 h-3.5" /> Doğrulandı
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{resource.type}</span>
                      <span className="flex items-center gap-0.5"><HiMapPin className="w-3 h-3" /> {resource.city}</span>
                      <span className="bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{resource.category}</span>
                      <span>⭐ {resource.rating}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    <a href={`tel:${resource.phone}`} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Ara">
                      <HiPhone className="w-5 h-5" />
                    </a>
                    <a href={resource.website.startsWith('http') ? resource.website : `https://${resource.website}`} target="_blank" rel="noopener noreferrer"
                      className="p-2 bg-navy-50 text-navy-700 hover:bg-navy-100 rounded-lg transition-colors" title="Web Sitesi">
                      <HiGlobeAlt className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

                <div className="flex flex-wrap gap-2">
                  {resource.services.map((s: string) => (
                    <span key={s} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <HiCheckCircle className="w-3 h-3 text-green-500" /> {s}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <HiPhone className="w-3.5 h-3.5" /> {resource.phone}
                  </span>
                  <a href={`/destek/${resource.id}`} className="flex items-center gap-1.5 text-sm text-navy-700 font-medium hover:underline">
                    Detay Gör <HiArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Kaynak Öner */}
          <div className="card p-5 bg-gradient-to-br from-navy-50 to-blue-50 border-2 border-dashed border-navy-200">
            <div className="flex items-center gap-3 mb-2">
              <HiUserGroup className="w-8 h-8 text-navy-700" />
              <div>
                <h3 className="font-bold text-gray-800">Bir kaynak eklemek ister misiniz?</h3>
                <p className="text-sm text-gray-500">Faydalı bir kurum veya gönüllü grubu biliyor musunuz?</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/iletisim'}
              className="mt-2 btn-primary text-sm"
            >
              Kaynak Öner
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
