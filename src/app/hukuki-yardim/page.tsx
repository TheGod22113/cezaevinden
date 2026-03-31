'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import {
  HiScale,
  HiCheckBadge,
  HiChatBubbleLeftRight,
  HiClock,
  HiCheckCircle,
  HiMagnifyingGlass,
  HiPlus,
  HiStar,
  HiPhone,
  HiEnvelope,
  HiShieldCheck,
  HiAcademicCap,
  HiArrowRight,
} from 'react-icons/hi2'

const avukatlar = [
  {
    id: '1',
    name: 'Av. Mehmet Yılmaz',
    expertise: ['İnfaz Hukuku', 'Ceza Hukuku'],
    city: 'Ankara',
    baroNo: 'Ankara Barosu #12458',
    answered: 234,
    rating: 4.9,
    reviews: 89,
    online: true,
    about: '15 yıllık deneyimle infaz hukuku ve ceza davalarında uzmanlaşmış avukat. Cezaevi koşulları ve mahkum hakları konusunda gönüllü danışmanlık yapıyorum.',
    responseTime: '~2 saat',
  },
  {
    id: '2',
    name: 'Av. Ayşe Demir',
    expertise: ['Ceza Hukuku', 'Aile Hukuku'],
    city: 'İstanbul',
    baroNo: 'İstanbul Barosu #34721',
    answered: 189,
    rating: 4.8,
    reviews: 67,
    online: true,
    about: 'Özellikle kadın mahkumların ve aile üyelerinin haklarını korumak için gönüllü çalışmaktayım.',
    responseTime: '~3 saat',
  },
  {
    id: '3',
    name: 'Av. Kemal Arslan',
    expertise: ['İdare Hukuku', 'İnsan Hakları'],
    city: 'İzmir',
    baroNo: 'İzmir Barosu #9145',
    answered: 156,
    rating: 4.7,
    reviews: 54,
    online: false,
    about: 'AİHM başvuruları ve cezaevi koşullarına ilişkin idare davalarında uzmanlaştım.',
    responseTime: '~6 saat',
  },
  {
    id: '4',
    name: 'Av. Fatma Çelik',
    expertise: ['Aile Hukuku', 'Velayet Davaları'],
    city: 'Bursa',
    baroNo: 'Bursa Barosu #5234',
    answered: 98,
    rating: 4.9,
    reviews: 41,
    online: true,
    about: 'Cezaevindeyken aile ve velayet davalarıyla mücadele eden kişilere ücretsiz danışmanlık veriyorum.',
    responseTime: '~4 saat',
  },
]

const sorular = [
  {
    id: '1',
    title: 'Denetimli serbestlikten yararlanma şartları neler?',
    category: 'İnfaz Hukuku',
    asker: 'Hatice K.',
    askerRole: 'Aile',
    time: '1 saat önce',
    answered: true,
    avukat: 'Av. Mehmet Yılmaz',
    likes: 23,
    views: 234,
  },
  {
    id: '2',
    title: 'Koşullu salıverilme hesabı nasıl yapılır?',
    category: 'İnfaz Hukuku',
    asker: 'Anonim',
    askerRole: 'Tutuklu',
    time: '3 saat önce',
    answered: false,
    avukat: null,
    likes: 17,
    views: 189,
  },
  {
    id: '3',
    title: 'Cezaevinde darp iddiası için ne yapmalıyım?',
    category: 'İnsan Hakları',
    asker: 'Ali R.',
    askerRole: 'Aile',
    time: '5 saat önce',
    answered: true,
    avukat: 'Av. Kemal Arslan',
    likes: 45,
    views: 567,
  },
  {
    id: '4',
    title: 'Tahliye sonrası sosyal yardımlara nasıl başvurabilirim?',
    category: 'Sosyal Haklar',
    asker: 'Mehmet S.',
    askerRole: 'Tahliye',
    time: '1 gün önce',
    answered: true,
    avukat: 'Av. Ayşe Demir',
    likes: 38,
    views: 412,
  },
]

const categories = [
  '⚖️ İnfaz Hukuku',
  '🏛️ Ceza Davası',
  '👨‍👩‍👧 Aile Hukuku',
  '🌍 İnsan Hakları',
  '🏠 Sosyal Haklar',
  '📋 İdari İşlemler',
]

type ApiQuestion = {
  id: string
  title: string
  category: string
  isAnonymous: boolean
  isAnswered: boolean
  createdAt: string
  author: { name: string; role: string } | null
  _count: { answers: number }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'az önce'
  if (m < 60) return `${m} dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat önce`
  return `${Math.floor(h / 24)} gün önce`
}

export default function HukukiYardimPage() {
  const [activeTab, setActiveTab] = useState<'sorular' | 'avukatlar'>('sorular')
  const [showAskForm, setShowAskForm] = useState(false)
  const [questionForm, setQF] = useState({ title: '', category: '', content: '', isAnonymous: false })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [loadingQ, setLoadingQ] = useState(true)

  useEffect(() => {
    fetch('/api/legal')
      .then(r => r.json())
      .then(data => { setQuestions(Array.isArray(data) ? data : []); setLoadingQ(false) })
      .catch(() => setLoadingQ(false))
  }, [])

  const handleAskSubmit = async () => {
    if (!questionForm.title.trim() || !questionForm.content.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionForm),
      })
      setSubmitted(true)
      setShowAskForm(false)
      setQF({ title: '', category: '', content: '', isAnonymous: false })
    } catch { /* ignore */ }
    setSubmitting(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiScale className="w-6 h-6 text-gold-500" />
              <h1 className="text-2xl font-bold">Hukuki Yardım</h1>
            </div>
            <p className="text-blue-100 text-sm max-w-xl">
              Gönüllü avukatlarımız sorularınızı ücretsiz yanıtlıyor.
              Hukuki haklarınızı öğrenin, sesini duyurun.
            </p>
          </div>
          <button
            onClick={() => setShowAskForm(true)}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <HiPlus className="w-5 h-5" /> Soru Sor
          </button>
        </div>

        {/* İstatistikler */}
        <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-white/20">
          {[
            { value: '380', label: 'Gönüllü Avukat', icon: '⚖️' },
            { value: '8.2K', label: 'Yanıtlanan Soru', icon: '✅' },
            { value: '~3sa', label: 'Ort. Yanıt Süresi', icon: '⏱️' },
            { value: '%94', label: 'Memnuniyet', icon: '⭐' },
          ].map(({ value, label, icon }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold">{icon} {value}</p>
              <p className="text-xs text-blue-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Uyarı Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <HiShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Önemli Bilgilendirme</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Bu platform hukuki danışmanlık hizmeti değil, bilgilendirme amaçlıdır. Verilen yanıtlar
            avukatlık hizmeti yerine geçmez. Resmi hukuki destek için baronuza veya adli yardım birimlerine başvurun.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sol Sidebar */}
        <div className="hidden lg:block">
          <Sidebar active="/hukuki-yardim" />
        </div>

        {/* Ana İçerik */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Soru Formu */}
          {showAskForm && (
            <div className="card p-5 animate-fade-in border-2 border-navy-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Hukuki Soru Sor</h2>
                <button onClick={() => setShowAskForm(false)} aria-label="Kapat" className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Soru Başlığı</label>
                  <input type="text" className="input-field" placeholder="Sorunuzu kısaca özetleyin..."
                    value={questionForm.title} onChange={e => setQF(p => ({...p, title: e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Kategori</label>
                  <select className="input-field" value={questionForm.category} onChange={e => setQF(p => ({...p, category: e.target.value}))}>
                    <option value="">Kategori seçin</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Detaylı Açıklama</label>
                  <textarea className="input-field min-h-[120px] resize-none" placeholder="Durumunuzu detaylı anlatın..."
                    value={questionForm.content} onChange={e => setQF(p => ({...p, content: e.target.value}))} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="anon" className="w-4 h-4"
                    checked={questionForm.isAnonymous} onChange={e => setQF(p => ({...p, isAnonymous: e.target.checked}))} />
                  <label htmlFor="anon" className="text-sm text-gray-600">Anonim olarak sor (kimliğin gizli kalır)</label>
                </div>
                {submitted && <p className="text-green-600 text-sm font-medium">✅ Sorunuz gönderildi! Avukatlar en kısa sürede yanıtlayacak.</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAskSubmit} disabled={submitting} className="btn-primary flex-1">
                    {submitting ? 'Gönderiliyor...' : 'Soruyu Gönder'}
                  </button>
                  <button onClick={() => setShowAskForm(false)} className="btn-secondary">İptal</button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Seçimi */}
          <div className="flex gap-2">
            {(['sorular', 'avukatlar'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${
                  activeTab === tab ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab === 'sorular' ? '❓ Sorular' : '⚖️ Avukatlar'}
              </button>
            ))}
          </div>

          {/* SORULAR */}
          {activeTab === 'sorular' && (
            <div className="space-y-3">
              {loadingQ && [1,2,3].map(i => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
              {!loadingQ && questions.length === 0 && (
                <div className="card p-12 text-center text-gray-400">
                  <HiScale className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Henüz soru yok</p>
                  <p className="text-sm mt-1">İlk soruyu siz sorun!</p>
                </div>
              )}
              {!loadingQ && questions.map(q => (
                <Link key={q.id} href={`/hukuki-yardim/${q.id}`} className="card p-4 hover:shadow-md transition-all cursor-pointer group block">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-navy-700 transition-colors text-sm sm:text-base">
                      {q.title}
                    </h3>
                    {q.isAnswered ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0 font-medium">
                        <HiCheckCircle className="w-3.5 h-3.5" /> Yanıtlandı
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0 font-medium">
                        <HiClock className="w-3.5 h-3.5" /> Yanıt Bekleniyor
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{q.category}</span>
                    {!q.isAnonymous && q.author && <span>{q.author.name}</span>}
                    {q.isAnonymous && <span>Anonim</span>}
                    <span>{timeAgo(q.createdAt)}</span>
                    <span className="ml-auto flex items-center gap-1">
                      <HiChatBubbleLeftRight className="w-3.5 h-3.5" /> {q._count.answers}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* AVUKATLAR */}
          {activeTab === 'avukatlar' && (
            <div className="space-y-4">
              {avukatlar.map(av => (
                <div key={av.id} className="card p-5 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {av.name.split(' ')[1]?.charAt(0)}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${av.online ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900">{av.name}</h3>
                        <HiCheckBadge className="w-5 h-5 text-blue-500" />
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${av.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {av.online ? '● Çevrimiçi' : '○ Çevrimdışı'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {av.expertise.map(e => (
                          <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{e}</span>
                        ))}
                        <span className="text-xs text-gray-400">📍 {av.city}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{av.about}</p>

                      <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <HiStar className="w-4 h-4 text-gold-500" />
                          <strong className="text-gray-700">{av.rating}</strong> ({av.reviews} değerlendirme)
                        </span>
                        <span className="flex items-center gap-1">
                          <HiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                          {av.answered} soru yanıtlandı
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock className="w-3.5 h-3.5" />
                          Yanıt: {av.responseTime}
                        </span>
                        <span className="text-gray-400">🎓 {av.baroNo}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="btn-primary text-sm py-2 px-4">
                        Soru Sor
                      </button>
                      <button className="btn-secondary text-sm py-2 px-4">
                        Profil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sağ Panel */}
        <div className="hidden xl:block w-72 flex-shrink-0 space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Sık Sorulan Konular</h3>
            <div className="space-y-2">
              {[
                'İyi hal indirimi nasıl hesaplanır?',
                'Denetimli serbestlik şartları neler?',
                'Koşullu salıverilme ne zaman olur?',
                'Avukat görüşme hakkı nasıl kullanılır?',
                'Tahliye sonrası sosyal yardım?',
                'Adli sicil affı başvurusu?',
              ].map((q, i) => (
                <button key={i} className="w-full text-left text-sm text-gray-600 hover:text-navy-700 flex items-center gap-2 py-1.5 group transition-colors">
                  <HiArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-navy-700 flex-shrink-0" />
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4 bg-navy-700 text-white">
            <HiAcademicCap className="w-8 h-8 text-gold-500 mb-2" />
            <h3 className="font-bold mb-1">Avukat mısınız?</h3>
            <p className="text-xs text-blue-200 mb-3">
              Gönüllü avukat olarak platforma katılın ve insanlara yardım edin.
            </p>
            <button className="w-full bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold text-sm py-2 rounded-lg transition-colors">
              Gönüllü Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
