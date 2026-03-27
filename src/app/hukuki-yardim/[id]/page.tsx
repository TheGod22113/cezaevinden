'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiArrowLeft, HiCheckCircle, HiCheckBadge, HiClock,
  HiHeart, HiOutlineHeart, HiFlag, HiPaperAirplane,
  HiLockClosed, HiShieldCheck,
} from 'react-icons/hi2'

const question = {
  id: '1',
  title: 'Denetimli serbestlik şartları ve başvuru süreci',
  category: 'İnfaz Hukuku',
  asker: 'Hatice K.',
  askerRole: 'Aile',
  time: '3 saat önce',
  isAnonymous: false,
  answered:    true,
  content: `Eşim 2021 yılında 5 yıl ceza aldı. Şu an cezasının 3. yılında ve iyi halli. Denetimli serbestlikten ne zaman yararlanabilir? Başvuruyu kim yapıyor, hangi belgeler gerekiyor? Avukatımız var ama bir de burada sormak istedim.`,
}

const answers = [
  {
    id: '1',
    lawyer: 'Av. Mehmet Yılmaz',
    baroNo: 'Ankara Barosu #12458',
    verified: true,
    time: '2 saat önce',
    helpful: 47,
    isOfficial: true,
    content: `Sorunuzu detaylı yanıtlamak isterim:

**Denetimli Serbestlik Şartları (5275 sayılı Kanun md. 105/A):**

✅ Koşullu salıverilmesine **1 yıl veya daha az** kalan iyi halli hükümlüler yararlanabilir.
✅ 5 yıllık cezada koşullu salıverilme = cezanın **2/3'ü** = ~3 yıl 4 ay
✅ DS başvurusu = koşullu salıverilmeden 1 yıl önce = yaklaşık **2 yıl 4 ay** sonra

**Başvuru Süreci:**
1. Ceza infaz kurumu sosyal çalışmacısına dilekçe
2. İnfaz hakimliği kararı (avukatınız bu aşamada kritik)
3. Denetimli serbestlik müdürlüğüne kayıt

**Gerekli Belgeler:**
- Hükümlünün dilekçesi
- İyi hal belgesi (kurumdan)
- İkametgah adresi belgesi
- Sosyal çalışmacı raporu

Avukatınız iyi hal değerlendirmesini yakından takip etsin. 📋`,
  },
  {
    id: '2',
    lawyer: 'Av. Ayşe Demir',
    baroNo: 'İstanbul Barosu #34721',
    verified: true,
    time: '1 saat önce',
    helpful: 18,
    isOfficial: false,
    content: `Av. Mehmet Bey'in yanıtına ek olarak: Denetimli serbestlik kararı verildikten sonra müdürlük hükümlüyle yükümlülükler konusunda görüşme yapıyor. Genellikle haftada bir imza, çalışma yükümlülüğü veya eğitim programı gibi şartlar konuluyor. Bu şartlara uyulmazsa geri alınabilir, dikkat edin.`,
  },
]

export default function LegalQuestionPage() {
  const [reply,    setReply]   = useState('')
  const [helpful,  setHelpful] = useState<Set<string>>(new Set())

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/hukuki-yardim" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Hukuki Yardım
      </Link>

      {/* Soru */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900">{question.title}</h1>
          {question.answered && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0 font-medium">
              <HiCheckCircle className="w-3.5 h-3.5" /> Yanıtlandı
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{question.category}</span>
          <span>{question.asker} ({question.askerRole})</span>
          <span className="flex items-center gap-0.5"><HiClock className="w-3 h-3" /> {question.time}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>

        {/* Yasal Uyarı */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
          <HiShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Yanıtlar bilgilendirme amaçlıdır, hukuki tavsiye yerine geçmez.
          </p>
        </div>
      </div>

      {/* Yanıtlar */}
      <div className="space-y-4 mb-4">
        <p className="text-sm font-semibold text-gray-600">{answers.length} Avukat Yanıtladı</p>

        {answers.map(a => (
          <div key={a.id} className={`card p-5 ${a.isOfficial ? 'border-l-4 border-green-400' : ''}`}>
            {a.isOfficial && (
              <p className="text-xs text-green-600 font-semibold mb-3 flex items-center gap-1">
                <HiCheckCircle className="w-3.5 h-3.5" /> En Faydalı Yanıt
              </p>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {a.lawyer.split(' ')[1]?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{a.lawyer}</span>
                  <HiCheckBadge className="w-4 h-4 text-blue-500" />
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Avukat</span>
                </div>
                <p className="text-xs text-gray-400">{a.baroNo} · {a.time}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{a.content}</div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
              <button
                onClick={() => setHelpful(p => { const s = new Set(p); s.has(a.id) ? s.delete(a.id) : s.add(a.id); return s })}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  helpful.has(a.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                {helpful.has(a.id) ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
                Faydalı ({a.helpful + (helpful.has(a.id) ? 1 : 0)})
              </button>
              <button className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1">
                <HiFlag className="w-3.5 h-3.5" /> Şikayet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Yorum Ekle (avukat değilse devre dışı) */}
      <div className="card p-5 bg-gray-50">
        <p className="text-sm text-gray-500 text-center flex items-center justify-center gap-2">
          <HiLockClosed className="w-4 h-4" />
          Hukuki sorulara yalnızca doğrulanmış avukatlar yanıt verebilir.
          <Link href="/kayit" className="text-navy-700 font-semibold hover:underline">Avukat olarak kayıt ol →</Link>
        </p>
      </div>
    </div>
  )
}
