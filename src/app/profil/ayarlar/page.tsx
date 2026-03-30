'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  HiUser, HiLockClosed, HiBell, HiShieldCheck,
  HiTrash, HiCheckCircle, HiEye, HiEyeSlash, HiArrowLeft,
} from 'react-icons/hi2'

const tabs = [
  { id: 'profil',   label: 'Profil',   icon: HiUser        },
  { id: 'guvenlik', label: 'Güvenlik', icon: HiLockClosed  },
  { id: 'bildirim', label: 'Bildirim', icon: HiBell        },
  { id: 'gizlilik', label: 'Gizlilik', icon: HiShieldCheck },
]

export default function ProfilAyarlarPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profil')
  const [saved,     setSaved]     = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(true)

  const [profil, setProfil] = useState({
    name: '', username: '', bio: '', city: '', email: '', website: '',
  })

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  })

  const [notifs, setNotifs] = useState({
    like: true, comment: true, follow: true, legalAnswer: true,
    email: false, digest: true,
  })

  const [privacy, setPrivacy] = useState({
    showRole: true, showCity: true, allowMessages: true,
    anonymousDefault: false, showOnline: true,
  })

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setProfil({
            name: data.name || '',
            username: data.username || '',
            bio: data.bio || '',
            city: data.city || '',
            email: data.email || '',
            website: data.website || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSaveProfil = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profil.name,
          bio: profil.bio,
          city: profil.city,
          website: profil.website,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Hata oluştu'); setSaving(false); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Bağlantı hatası') }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      setError('Yeni şifreler eşleşmiyor'); return
    }
    if (passwords.newPass.length < 8) {
      setError('Şifre en az 8 karakter olmalı'); return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Hata'); setSaving(false); return }
      setPasswords({ current: '', newPass: '', confirm: '' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Bağlantı hatası') }
    setSaving(false)
  }

  if (!session) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
      <p className="mb-4">Bu sayfayı görmek için giriş yapmalısınız.</p>
      <Link href="/giris" className="text-navy-700 font-semibold hover:underline">Giriş Yap</Link>
    </div>
  )

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Yükleniyor...</div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/profil/${profil.username}`} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Hesap Ayarları</h1>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setError('') }}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* PROFİL */}
      {activeTab === 'profil' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-navy-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {profil.name.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Profil Resmi</p>
              <p className="text-xs text-gray-400">Yakında eklenecek</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Ad Soyad</label>
              <input type="text" className="input-field"
                value={profil.name}
                onChange={e => setProfil({ ...profil, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Kullanıcı Adı</label>
              <input type="text" className="input-field bg-gray-50 cursor-not-allowed"
                value={profil.username} disabled />
              <p className="text-xs text-gray-400 mt-1">Kullanıcı adı değiştirilemez</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">E-posta</label>
              <input type="email" className="input-field bg-gray-50 cursor-not-allowed"
                value={profil.email} disabled />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Şehir</label>
              <input type="text" className="input-field" placeholder="İstanbul"
                value={profil.city}
                onChange={e => setProfil({ ...profil, city: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Web Sitesi</label>
              <input type="url" className="input-field" placeholder="https://..."
                value={profil.website}
                onChange={e => setProfil({ ...profil, website: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Biyografi</label>
            <textarea rows={3} className="input-field resize-none"
              value={profil.bio}
              onChange={e => setProfil({ ...profil, bio: e.target.value })}
              placeholder="Kendinizi kısaca tanıtın..." />
            <p className="text-xs text-gray-400 mt-1">{profil.bio.length}/200 karakter</p>
          </div>

          <button onClick={handleSaveProfil} disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60">
            {saved ? <><HiCheckCircle className="w-4 h-4" /> Kaydedildi!</> : saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      )}

      {/* GÜVENLİK */}
      {activeTab === 'guvenlik' && (
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-gray-800">Şifre Değiştir</h2>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Mevcut Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-10"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Yeni Şifre</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={passwords.newPass}
                onChange={e => setPasswords({ ...passwords, newPass: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Yeni Şifre (Tekrar)</label>
              <input type="password" className="input-field" placeholder="••••••••"
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
            </div>
            <button onClick={handleChangePassword} disabled={saving || !passwords.current || !passwords.newPass}
              className="btn-primary disabled:opacity-60">
              {saved ? '✓ Şifre Güncellendi' : 'Şifreyi Güncelle'}
            </button>
          </div>

          <div className="card p-6 border border-red-100">
            <h2 className="font-bold text-red-600 mb-1 flex items-center gap-2">
              <HiTrash className="w-5 h-5" /> Hesabı Sil
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Hesabınız ve tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
            </p>
            <button className="text-sm text-red-600 border border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-medium">
              Hesabımı Sil
            </button>
          </div>
        </div>
      )}

      {/* BİLDİRİM */}
      {activeTab === 'bildirim' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-800 mb-2">Bildirim Tercihleri</h2>
          {[
            { key: 'like',        label: 'Beğeniler',            desc: 'Biri gönderinizi beğendiğinde' },
            { key: 'comment',     label: 'Yorumlar',             desc: 'Gönderinize yorum yapıldığında' },
            { key: 'follow',      label: 'Takipler',             desc: 'Biri sizi takip ettiğinde' },
            { key: 'legalAnswer', label: 'Hukuki Yanıtlar',      desc: 'Sorunuz yanıtlandığında' },
            { key: 'email',       label: 'E-posta Bildirimleri', desc: 'Önemli gelişmeler için e-posta' },
            { key: 'digest',      label: 'Haftalık Özet',        desc: 'Haftalık platform özeti' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs({ ...notifs, [key]: !(notifs as any)[key] })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  (notifs as any)[key] ? 'bg-navy-700' : 'bg-gray-200'
                }`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  (notifs as any)[key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* GİZLİLİK */}
      {activeTab === 'gizlilik' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-800 mb-2">Gizlilik Ayarları</h2>
          {[
            { key: 'showRole',         label: 'Rolümü Göster',            desc: 'Profilimde üyelik türü görünsün' },
            { key: 'showCity',         label: 'Şehri Göster',             desc: 'Profilimde şehir bilgisi görünsün' },
            { key: 'allowMessages',    label: 'Mesajlara İzin Ver',       desc: 'Herkes bana mesaj gönderebilsin' },
            { key: 'anonymousDefault', label: 'Varsayılan Anonim',        desc: 'Gönderilerim varsayılan anonim olsun' },
            { key: 'showOnline',       label: 'Çevrimiçi Durumu Göster',  desc: 'Aktifken yeşil nokta görünsün' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => setPrivacy({ ...privacy, [key]: !(privacy as any)[key] })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  (privacy as any)[key] ? 'bg-navy-700' : 'bg-gray-200'
                }`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  (privacy as any)[key] ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
