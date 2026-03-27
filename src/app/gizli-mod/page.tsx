'use client'

import Link from 'next/link'
import { HiEyeSlash, HiShieldCheck, HiArrowRight, HiCheckCircle } from 'react-icons/hi2'

const features = [
  { icon: '🔒', title: 'Kimliğiniz Gizli', desc: 'Anonim paylaşımlarınızda adınız ve profil fotoğrafınız görünmez.' },
  { icon: '📝', title: 'Gerçek Deneyimler', desc: 'Sosyal baskı olmadan gerçek deneyimlerinizi paylaşabilirsiniz.' },
  { icon: '⚖️', title: 'Hukuki Güvenlik', desc: 'Hukuki süreçleriniz hakkında anonim soru sorabilirsiniz.' },
  { icon: '🤝', title: 'Topluluk Desteği', desc: 'Kimliğinizi ifşa etmeden topluluktan destek alabilirsiniz.' },
  { icon: '🛡️', title: 'Moderasyon Koruması', desc: 'Anonim içerikler de moderasyon kurallarına tabidir.' },
  { icon: '🗑️', title: 'Silebilirsiniz', desc: 'Kendi anonim içeriklerinizi hesabınızdan her zaman silebilirsiniz.' },
]

export default function GizliModPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <HiEyeSlash className="w-9 h-9 text-gold-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Anonim Mod</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Cezaevinden.com'da anonim paylaşım yapabilir, sorularınızı güvenle sorabilirsiniz.
          Kimliğiniz tamamen gizli tutulur.
        </p>
      </div>

      {/* How it works */}
      <div className="card p-6 mb-6">
        <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          <HiShieldCheck className="w-5 h-5 text-green-500" /> Nasıl Çalışır?
        </h2>
        <ol className="space-y-3">
          {[
            'Gönderi veya yorum oluştururken "Anonim" seçeneğini işaretleyin.',
            'İçeriğiniz "Anonim Kullanıcı" adıyla yayınlanır.',
            'Profil sayfanızda anonim içerikleriniz görünmez.',
            'Sadece siz kendi anonim içeriklerinizin farkındasınız.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-6 h-6 bg-navy-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {features.map((f, i) => (
          <div key={i} className="card p-4">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Privacy notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">Önemli Bilgi</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Anonim mod, yasal zorunluluk veya platform güvenliği durumunda yetkili makamlara hesap
              bilgisi sunulmasını engellemez. Yasadışı içerik paylaşımı anonim modda da yasaktır.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
          Paylaşım Yap <HiArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/gizlilik" className="flex-1 text-center border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <HiCheckCircle className="w-4 h-4" /> Gizlilik Politikası
        </Link>
      </div>
    </div>
  )
}
