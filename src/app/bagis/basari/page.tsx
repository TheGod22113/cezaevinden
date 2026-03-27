import Link from 'next/link'
import { HiCheckCircle, HiHeart } from 'react-icons/hi2'

export default function BagisBasariPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiCheckCircle className="w-12 h-12 text-green-500" />
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3">Teşekkürler!</h1>
      <p className="text-gray-600 mb-2">Bağışınız başarıyla alındı.</p>
      <p className="text-gray-500 text-sm mb-8">
        Desteğiniz sayesinde hukuki yardım, aile desteği ve sosyal uyum programlarımızı sürdürebiliyoruz.
      </p>

      <div className="card p-5 mb-8 text-left">
        <div className="flex items-center gap-2 mb-3">
          <HiHeart className="w-5 h-5 text-red-500" />
          <span className="font-bold text-gray-900">Bağışınızın Etkisi</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Gönüllü avukatlara hukuki kırtasiye desteği</li>
          <li>✅ Tahliye sonrası destek programları</li>
          <li>✅ Platform altyapısı ve güvenliği</li>
          <li>✅ Aile destek grupları</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/" className="btn-primary w-full">Ana Sayfaya Dön</Link>
        <Link href="/bagis" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Tekrar bağış yap
        </Link>
      </div>
    </div>
  )
}
