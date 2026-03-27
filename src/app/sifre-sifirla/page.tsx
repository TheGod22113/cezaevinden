'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiLockClosed, HiCheckCircle, HiEye, HiEyeSlash } from 'react-icons/hi2'

function ResetForm() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Şifreler eşleşmiyor.'); return }
    if (password.length < 8)  { setError('En az 8 karakter gerekli.'); return }
    setLoading(true); setError('')

    const res = await fetch('/api/auth/reset-password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Bir hata oluştu.'); return }
    setDone(true)
    setTimeout(() => router.push('/giris'), 2500)
  }

  if (!token) return (
    <div className="text-center text-red-600 font-semibold py-10">
      Geçersiz veya eksik bağlantı. Lütfen e-posta'daki linki kullanın.
    </div>
  )

  if (done) return (
    <div className="text-center py-10">
      <HiCheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
      <h2 className="text-xl font-bold text-gray-900 mb-1">Şifre Güncellendi!</h2>
      <p className="text-gray-500 text-sm">Giriş sayfasına yönlendiriliyorsunuz…</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Yeni Şifre</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="input-field pr-10"
            required
          />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre Tekrar</label>
        <input
          type={show ? 'text' : 'password'}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Şifreyi tekrar girin"
          className="input-field"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Kaydediliyor…' : 'Şifremi Güncelle'}
      </button>
    </form>
  )
}

export default function SifreSifirlaPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <HiLockClosed className="w-7 h-7 text-gold-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Yeni Şifre Belirle</h1>
        <p className="text-gray-500 text-sm">Güçlü bir şifre seçin.</p>
      </div>

      <div className="card p-6">
        <Suspense fallback={<div className="text-center py-6 text-gray-400">Yükleniyor…</div>}>
          <ResetForm />
        </Suspense>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/giris" className="text-navy-700 font-semibold hover:underline">Giriş sayfasına dön</Link>
      </p>
    </div>
  )
}
