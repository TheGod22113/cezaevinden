'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HiScale,
  HiEye,
  HiEyeSlash,
  HiLockClosed,
  HiEnvelope,
  HiUser,
  HiCheckCircle,
  HiInformationCircle,
} from 'react-icons/hi2'

type Role = 'mahkum' | 'aile' | 'avukat' | 'tahliye' | 'gonullu' | ''

const roles = [
  { value: 'mahkum',  label: 'Tutuklu / Hükümlü', desc: 'Şu an cezaevindeyim',      icon: '🔒', color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { value: 'aile',    label: 'Aile Üyesi',         desc: 'Yakınım cezaevinde',       icon: '👨‍👩‍👧', color: 'border-green-300 bg-green-50 text-green-700' },
  { value: 'tahliye', label: 'Tahliye Olmuş',      desc: 'Cezaevinden çıktım',       icon: '🚪', color: 'border-teal-300 bg-teal-50 text-teal-700' },
  { value: 'avukat',  label: 'Avukat',             desc: 'Gönüllü hukuki destek',    icon: '⚖️', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'gonullu', label: 'Gönüllü',            desc: 'Destek vermek istiyorum',  icon: '🤝', color: 'border-purple-300 bg-purple-50 text-purple-700' },
]

export default function KayitPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<Role>('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', baroNo: '', kvkk: false,
  })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.kvkk) { setError('KVKK metnini onaylamanız gerekiyor.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Kayıt başarısız.'); setLoading(false); return }
      // Auto login after register
      await signIn('credentials', { identifier: form.email, password: form.password, redirect: false })
      setStep(3)
    } catch { setError('Bir hata oluştu.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

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
          <p className="text-gray-500 text-sm mt-1">Ücretsiz hesap oluşturun</p>
        </div>

        {/* Adım Göstergesi */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s ? 'bg-green-500 text-white' :
                step === s ? 'bg-navy-700 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > s ? <HiCheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 rounded-full transition-all ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-gray-400 mb-6">
          {step === 1 && 'Kimliğinizi seçin'}
          {step === 2 && 'Hesap bilgilerinizi girin'}
          {step === 3 && 'Hoş geldiniz!'}
        </div>

        <div className="card p-6 shadow-lg">

          {/* ADIM 1 — Rol Seçimi */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Sizi en iyi tanımlayan hangisi?
              </h2>
              <div className="space-y-2">
                {roles.map(({ value, label, desc, icon, color }) => (
                  <button
                    key={value}
                    onClick={() => setRole(value as Role)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      role === value
                        ? color + ' ring-2 ring-navy-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    {role === value && (
                      <HiCheckCircle className="w-5 h-5 text-navy-700 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              {/* Anonimlik Notu */}
              <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-xl">
                <HiInformationCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Rolünüz diğer üyelere gösterilebilir. İstediğinizde anonim mod kullanabilirsiniz.
                  Gizliliğinizi her zaman koruruz.
                </p>
              </div>

              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full mt-4 bg-navy-700 hover:bg-navy-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Devam Et →
              </button>
            </div>
          )}

          {/* ADIM 2 — Hesap Bilgileri */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Hesap Bilgileriniz</h2>
              <form className="space-y-4" onSubmit={handleRegister}>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Ad Soyad</label>
                  <div className="relative">
                    <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="input-field pl-10"
                      placeholder="Ad Soyad (veya takma ad)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">E-posta</label>
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

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Şifre</label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                      className="input-field pl-10 pr-10"
                      placeholder="En az 8 karakter"
                      minLength={8}
                      required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Avukat ise baro no */}
                {role === 'avukat' && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Baro Sicil Numarası</label>
                    <input
                      type="text"
                      value={form.baroNo}
                      onChange={e => setForm({...form, baroNo: e.target.value})}
                      className="input-field"
                      placeholder="Baro ve sicil numaranızı girin"
                    />
                    <p className="text-xs text-gray-400 mt-1">Doğrulama için baro numaranız gereklidir.</p>
                  </div>
                )}

                {/* KVKK */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="kvkk"
                    checked={form.kvkk}
                    onChange={e => setForm({...form, kvkk: e.target.checked})}
                    className="w-4 h-4 mt-0.5"
                    required
                  />
                  <label htmlFor="kvkk" className="text-xs text-gray-500">
                    <Link href="/kvkk" className="text-navy-700 hover:underline">KVKK Aydınlatma Metni</Link>'ni
                    ve{' '}
                    <Link href="/kullanim-kosullari" className="text-navy-700 hover:underline">Kullanım Koşulları</Link>'nı
                    okudum ve kabul ediyorum.
                  </label>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-shrink-0 px-4">
                    ← Geri
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
                    {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADIM 3 — Hoş Geldin */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Hoş Geldiniz!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Hesabınız oluşturuldu. E-posta adresinize doğrulama linki gönderdik.
              </p>
              <div className="space-y-3">
                <Link href="/" className="block w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-colors">
                  Ana Sayfaya Git
                </Link>
                <Link href="/profil/ayarlar" className="block w-full btn-secondary py-3 text-center rounded-xl">
                  Profilimi Tamamla
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="text-navy-700 font-semibold hover:underline">Giriş Yapın</Link>
        </p>
      </div>
    </div>
  )
}
