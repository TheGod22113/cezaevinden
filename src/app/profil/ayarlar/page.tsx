'use client'

import { useState } from 'react'
import {
  HiUser, HiLockClosed, HiBell, HiShieldCheck,
  HiTrash, HiCamera, HiCheckCircle, HiEye, HiEyeSlash,
} from 'react-icons/hi2'

const tabs = [
  { id: 'profil',    label: 'Profil',   icon: HiUser        },
  { id: 'guvenlik',  label: 'Güvenlik', icon: HiLockClosed  },
  { id: 'bildirim',  label: 'Bildirim', icon: HiBell        },
  { id: 'gizlilik',  label: 'Gizlilik', icon: HiShieldCheck },
]

export default function ProfilAyarlarPage() {
  const [activeTab, setActiveTab] = useState('profil')
  const [saved,     setSaved]     = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  const [profil, setProfil] = useState({
    name: 'Ahmet Kaya', username: 'ahmetkaya', bio: '6 yıl sonra tahliye oldum.',
    city: 'Ankara', email: 'ahmet@example.com',
  })

  const [notifs, setNotifs] = useState({
    like: true, comment: true, follow: true, legalAnswer: true,
    email: false, digest: true,
  })

  const [privacy, setPrivacy] = useState({
    showRole: true, showCity: true, allowMessages: true,
    anonymousDefault: false, showOnline: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Hesap Ayarları</h1>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-navy-700 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* PROFİL */}
      {activeTab === 'profil' && (
        <div className="card p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                AK
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-navy-700 text-white rounded-full flex items-center justify-center hover:bg-navy-800 transition-colors">
                <HiCamera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Profil Fotoğrafı</p>
              <p className="text-xs text-gray-400">JPG veya PNG, maks. 2MB</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Ad Soyad',    key: 'name',     type: 'text',  placeholder: 'Adınız' },
              { label: 'Kullanıcı Adı', key: 'username', type: 'text', placeholder: 'kullanici_adi' },
              { label: 'E-posta',     key: 'email',    type: 'email', placeholder: 'ornek@email.com' },
              { label: 'Şehir',       key: 'city',     type: 'text',  placeholder: 'İstanbul' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
                <input type={type} className="input-field" placeholder={placeholder}
                  value={(profil as any)[key]}
                  onChange={e => setProfil({ ...profil, [key]: e.target.value })} />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Biyografi</label>
            <textarea rows={3} className="input-field resize-none"
              value={profil.bio} onChange={e => setProfil({ ...profil, bio: e.target.value })}
              placeholder="Kendinizi kısaca tanıtın..." />
            <p className="text-xs text-gray-400 mt-1">{profil.bio.length}/200 karakter</p>
          </div>

          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            {saved ? <><HiCheckCircle className="w-4 h-4" /> Kaydedildi!</> : 'Kaydet'}
          </button>
        </div>
      )}

      {/* GÜVENLİK */}
      {activeTab === 'guvenlik' && (
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-gray-800">Şifre Değiştir</h2>
            {['Mevcut Şifre', 'Yeni Şifre', 'Yeni Şifre (Tekrar)'].map((label, i) => (
              <div key={label}>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-field pr-10"
                    placeholder="••••••••" />
                  {i === 0 && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className="btn-primary">Şifreyi Güncelle</button>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-gray-800 mb-1">İki Faktörlü Doğrulama</h2>
            <p className="text-sm text-gray-500 mb-4">Hesabınızı ekstra güvenlik katmanıyla koruyun.</p>
            <button className="btn-secondary text-sm">2FA Etkinleştir</button>
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
          <button onClick={handleSave} className="btn-primary mt-2">
            {saved ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
        </div>
      )}

      {/* GİZLİLİK */}
      {activeTab === 'gizlilik' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-800 mb-2">Gizlilik Ayarları</h2>
          {[
            { key: 'showRole',         label: 'Rolümü Göster',              desc: 'Profilimde üyelik türü görünsün' },
            { key: 'showCity',         label: 'Şehri Göster',               desc: 'Profilimde şehir bilgisi görünsün' },
            { key: 'allowMessages',    label: 'Mesajlara İzin Ver',         desc: 'Herkes bana mesaj gönderebilsin' },
            { key: 'anonymousDefault', label: 'Varsayılan Anonim',          desc: 'Gönderilerim varsayılan anonim olsun' },
            { key: 'showOnline',       label: 'Çevrimiçi Durumu Göster',   desc: 'Aktifken yeşil nokta görünsün' },
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
          <button onClick={handleSave} className="btn-primary mt-2">
            {saved ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
        </div>
      )}
    </div>
  )
}
