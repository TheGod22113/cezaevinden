'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiCheckCircle, HiXCircle, HiEnvelope, HiArrowRight } from 'react-icons/hi2'
import { HiScale } from 'react-icons/hi2'

function DogrulaContent() {
  const params = useSearchParams()
  const status = params.get('status')
  const error  = params.get('error')

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">E-posta Doğrulandı!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Hesabınız aktif edildi. Artık tüm özelliklere erişebilirsiniz.
        </p>
        <Link href="/" className="btn-primary flex items-center justify-center gap-2">
          Ana Sayfaya Git <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  if (status === 'already') {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheckCircle className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Zaten Doğrulanmış</h2>
        <p className="text-gray-500 text-sm mb-6">
          Bu e-posta adresi daha önce doğrulanmış. Giriş yapabilirsiniz.
        </p>
        <Link href="/giris" className="btn-primary flex items-center justify-center gap-2">
          Giriş Yap <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  if (error) {
    const messages: Record<string, string> = {
      missing:   'Doğrulama linki eksik.',
      notfound:  'Kullanıcı bulunamadı.',
      'Token süresi dolmuş': 'Doğrulama linkinizin süresi dolmuş. Yeni link isteyin.',
      'Token imzası hatalı': 'Geçersiz doğrulama linki.',
    }
    const msg = messages[error] || 'Doğrulama başarısız. Lütfen tekrar deneyin.'

    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiXCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Doğrulama Başarısız</h2>
        <p className="text-gray-500 text-sm mb-6">{msg}</p>
        <div className="flex gap-3">
          <Link href="/giris" className="flex-1 btn-secondary text-center">
            Giriş Yap
          </Link>
          <Link href="/kayit" className="flex-1 btn-primary text-center">
            Yeniden Kayıt Ol
          </Link>
        </div>
      </div>
    )
  }

  // Default: pending (e-posta gönderildi, linke tıklanmadı)
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <HiEnvelope className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">E-postanızı Doğrulayın</h2>
      <p className="text-gray-500 text-sm mb-2">
        Kayıt sırasında verdiğiniz e-posta adresine doğrulama linki gönderdik.
      </p>
      <p className="text-gray-400 text-xs mb-6">
        Spam/Gereksiz klasörünü de kontrol etmeyi unutmayın.
      </p>
      <div className="bg-blue-50 rounded-xl p-4 text-left text-sm text-blue-700 mb-4">
        <p className="font-semibold mb-1">📬 Peki sonra?</p>
        <ol className="space-y-1 list-decimal list-inside text-xs">
          <li>E-postanızdaki "E-postamı Doğrula" butonuna tıklayın</li>
          <li>Otomatik giriş yapılacak</li>
          <li>Platforma tam erişiminiz olacak</li>
        </ol>
      </div>
      <Link href="/" className="text-sm text-navy-700 hover:underline font-medium">
        Şimdilik Ana Sayfaya Dön →
      </Link>
    </div>
  )
}

export default function DogrulaPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg">
              <HiScale className="w-8 h-8 text-gold-500" />
            </div>
            <div>
              <span className="text-xl font-bold text-navy-700">Cezaevinden</span>
              <span className="text-xl font-bold text-crimson-600">.com</span>
            </div>
          </Link>
        </div>

        <div className="card p-6 shadow-lg">
          <Suspense fallback={
            <div className="text-center py-8 animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          }>
            <DogrulaContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
