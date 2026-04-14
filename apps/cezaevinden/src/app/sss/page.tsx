'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  HiChevronDown,
  HiChevronUp,
  HiMagnifyingGlass,
  HiQuestionMarkCircle,
  HiShieldCheck,
  HiScale,
  HiBellAlert,
  HiLockClosed,
  HiArrowRight,
} from 'react-icons/hi2'

type FAQItem = {
  q: string
  a: string
}

type FAQCategory = {
  title: string
  icon: React.ReactNode
  color: string
  items: FAQItem[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: 'Platform Hakkında',
    icon: <HiQuestionMarkCircle className="w-5 h-5" />,
    color: 'text-navy-700 bg-navy-50',
    items: [
      {
        q: 'Cezaevinden.com nedir?',
        a: 'Cezaevinden.com, tutuklu ve hükümlüler, aileleri ve gönüllü avukatların bir araya geldiği ücretsiz bir dayanışma platformudur. Hukuki bilgi paylaşımı, topluluk desteği ve denetimli serbestlik hatırlatmaları gibi araçlar sunar.',
      },
      {
        q: 'Kayıt olmak ücretli mi?',
        a: 'Hayır. Platform tamamen ücretsizdir. Kayıt, hukuki soru sorma, topluluk forumu ve DS hatırlatma hizmetleri dahil tüm temel özellikler ücretsiz sunulmaktadır.',
      },
      {
        q: 'Kimler kayıt olabilir?',
        a: 'Tutuklu veya hükümlüler, aile üyeleri, tahliye olmuş bireyler, avukatlar ve toplumsal dayanışmaya katkı sağlamak isteyen gönüllüler platforma kayıt olabilir.',
      },
    ],
  },
  {
    title: 'Hukuki Yardım',
    icon: <HiScale className="w-5 h-5" />,
    color: 'text-blue-700 bg-blue-50',
    items: [
      {
        q: 'Avukatlar gerçekten ücretsiz mi yardım ediyor?',
        a: 'Evet. Platforma kayıtlı avukatlar tamamen gönüllülük esasıyla destek vermektedir. Herhangi bir ücret talep etmeleri yasaktır ve bu kural platform sözleşmesiyle güvence altına alınmıştır.',
      },
      {
        q: 'Soruma ne kadar sürede yanıt alırım?',
        a: 'Genellikle 24-48 saat içinde yanıt gelir; ancak sorunun niteliği ve avukatların yoğunluğuna göre bu süre uzayabilir. Acil durumlarda sorunuzun başlığına "[ACİL]" ekleyerek dikkat çekebilirsiniz.',
      },
      {
        q: 'Hukuki yanıtlar bağlayıcı mı?',
        a: 'Hayır. Platform üzerinden verilen yanıtlar yalnızca bilgilendirme amaçlıdır, hukuki danışmanlık niteliği taşımaz ve bağlayıcı değildir. Kesin hukuki tavsiye ve temsil için bir avukatla birebir görüşmeniz önerilir.',
      },
    ],
  },
  {
    title: 'DS Hatırlatma',
    icon: <HiBellAlert className="w-5 h-5" />,
    color: 'text-amber-700 bg-amber-50',
    items: [
      {
        q: 'DS hatırlatma nedir?',
        a: 'Denetimli Serbestlik (DS) kapsamındaki imza ve seminer yükümlülüklerinizin tarih ve saatlerini unutmamanız için e-posta ile otomatik hatırlatma gönderen bir hizmettir. İhlaller ciddi hukuki sonuçlara yol açabileceğinden bu araç büyük önem taşır.',
      },
      {
        q: 'Hatırlatmayı nasıl kurarım?',
        a: 'Profilinize giriş yapın; Ayarlar → DS Hatırlatma sekmesine gidin. İmza günlerinizi, seminer tarihlerinizi ve tercih ettiğiniz hatırlatma saatini girin. Değişiklikleri kaydettikten sonra sistem otomatik olarak devreye girer.',
      },
    ],
  },
  {
    title: 'Güvenlik & Gizlilik',
    icon: <HiLockClosed className="w-5 h-5" />,
    color: 'text-green-700 bg-green-50',
    items: [
      {
        q: 'Bilgilerim güvende mi?',
        a: 'Evet. Tüm veriler endüstri standardı şifreleme yöntemleriyle saklanır ve herhangi bir üçüncü taraf ile paylaşılmaz. Gizlilik politikamız ve KVKK uyumluluğumuz hakkında daha fazla bilgi için Gizlilik Politikası sayfamızı inceleyebilirsiniz.',
      },
      {
        q: 'Anonim gönderi yapabilir miyim?',
        a: 'Evet. Gönderi veya yorum oluştururken "Anonim olarak paylaş" seçeneğini işaretleyebilirsiniz. Bu durumda kullanıcı adınız diğer üyelere gösterilmez; yalnızca platform yöneticileri kötüye kullanım denetimi amacıyla kimliğinizi görebilir.',
      },
    ],
  },
]

export default function SSSPage() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return FAQ_DATA
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [search])

  const totalMatches = filtered.reduce((sum, cat) => sum + cat.items.length, 0)

  function toggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-8 text-white text-center mb-8">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <HiQuestionMarkCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-2">Sıkça Sorulan Sorular</h1>
        <p className="text-blue-200 max-w-lg mx-auto text-sm leading-relaxed">
          Cezaevinden.com hakkında merak ettiğiniz her şeyi burada bulabilirsiniz.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          className="input-field pl-11"
          placeholder="Soru veya anahtar kelime ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {totalMatches} sonuç
          </span>
        )}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="card p-8 text-center text-gray-500">
          <HiShieldCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Bu aramayla eşleşen soru bulunamadı.</p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin ya da aşağıdan bize ulaşın.</p>
        </div>
      )}

      {/* FAQ Categories */}
      <div className="space-y-6">
        {filtered.map((cat) => (
          <div key={cat.title}>
            {/* Category header */}
            <div className={`flex items-center gap-2 mb-3 px-1 font-semibold text-sm ${cat.color.split(' ')[0]}`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                {cat.icon}
              </span>
              {cat.title}
            </div>

            {/* Items */}
            <div className="card overflow-hidden divide-y divide-gray-100">
              {cat.items.map((item, idx) => {
                const key = `${cat.title}-${idx}`
                const isOpen = openKey === key
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus-visible:bg-gray-50"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-gray-800 text-sm leading-snug">
                        {item.q}
                      </span>
                      {isOpen ? (
                        <HiChevronUp className="w-5 h-5 text-navy-700 flex-shrink-0" />
                      ) : (
                        <HiChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 animate-fade-in">
                        <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-navy-200 pl-3">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="card p-6 mt-10 text-center">
        <HiQuestionMarkCircle className="w-10 h-10 text-navy-700 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-800 mb-1">Sorunuzu Bulamadınız mı?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Hukuki sorularınızı gönüllü avukatlarımıza doğrudan iletebilirsiniz.
        </p>
        <Link
          href="/hukuki-yardim"
          className="btn-primary inline-flex items-center gap-2"
        >
          Hukuki Yardım Al
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
