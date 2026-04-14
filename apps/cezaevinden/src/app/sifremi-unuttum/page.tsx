'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiScale, HiEnvelope, HiArrowLeft, HiCheckCircle } from 'react-icons/hi2'

export default function SifremiUnuttumPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Bir hata oluştu, tekrar deneyin.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Sunucuya bağlanılamadı, tekrar deneyin.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-navy-700 rounded-2xl flex items-center justify-center shadow-lg">
              <HiScale className="w-8 h-8 text-gold-500" />
            </div>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-3">Şifremi Unuttum</h1>
          <p className="text-sm text-gray-500 mt-1">E-posta adresinize sıfırlama linki göndereceğiz.</p>
        </div>

        <div className="card p-6 shadow-lg">
          {sent ? (
            <div className="text-center py-4">
              <HiCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <h2 className="font-bold text-gray-800 mb-1">E-posta Gönderildi!</h2>
              <p className="text-sm text-gray-500 mb-4">
                <strong>{email}</strong> adresine şifre sıfırlama linki gönderdik. Gelen kutunuzu kontrol edin.
              </p>
              <p className="text-xs text-gray-400 mb-4">E-posta gelmedi mi? Spam klasörünü kontrol edin.</p>
              <button onClick={() => { setSent(false); setEmail('') }} className="text-sm text-navy-700 hover:underline">
                Tekrar gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="text-sm font-semibold text-gray-700 block mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Gönderiliyor…' : 'Sıfırlama Linki Gönder'}
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
            <Link href="/giris" className="flex items-center gap-1 text-gray-500 hover:text-navy-700 transition-colors">
              <HiArrowLeft className="w-4 h-4" /> Giriş Yap
            </Link>
            <span className="text-gray-200">|</span>
            <Link href="/kayit" className="text-navy-700 font-semibold hover:underline">Üye Ol</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
