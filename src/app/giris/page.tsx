'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiScale, HiEye, HiEyeSlash, HiLockClosed, HiEnvelope } from 'react-icons/hi2'

export default function GirisPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (res?.error) {
        setError('E-posta veya şifre hatalı.')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg">
              <HiScale className="w-9 h-9 text-gold-500" />
            </div>
            <div>
              <span className="text-2xl font-bold text-navy-700">Cezaevinden</span>
              <span className="text-2xl font-bold text-crimson-600">.com</span>
            </div>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Hesabınıza giriş yapın</p>
        </div>

        {/* Form Kartı */}
        <div className="card p-6 shadow-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {/* E-posta */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="input-field pl-10"
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            {/* Şifre */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Şifre</label>
                <Link href="/sifremi-unuttum" className="text-xs text-navy-700 hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Beni Hatırla */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={form.remember}
                onChange={e => setForm({...form, remember: e.target.checked})}
                className="w-4 h-4 text-navy-700 rounded"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">Beni hatırla</label>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            {/* Ayırıcı */}
            <div className="flex items-center gap-3">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400">veya</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* Google Giriş */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              <span>🔵</span> Google ile Giriş Yap
            </button>
          </form>

          {/* Kayıt Linki */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="text-navy-700 font-semibold hover:underline">
              Ücretsiz üye olun
            </Link>
          </p>
        </div>

        {/* Güvenlik Notu */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <HiLockClosed className="w-3.5 h-3.5" />
          <span>Verileriniz güvende. Gizlilik Politikamızı okuyun.</span>
        </div>
      </div>
    </div>
  )
}
