'use client'

import { useState } from 'react'
import { HiEnvelope, HiPhone, HiMapPin, HiCheckCircle, HiPaperAirplane } from 'react-icons/hi2'

export default function IletisimPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const subjects = ['Genel Soru', 'Teknik Sorun', 'Hukuki İş Birliği', 'Medya / Basın', 'STK İş Birliği', 'Şikayet', 'Diğer']

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-navy-700 mb-2">İletişim</h1>
        <p className="text-gray-500">Sorularınız, önerileriniz veya iş birliği talepleriniz için bize ulaşın.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* İletişim Bilgileri */}
        <div className="space-y-4">
          {[
            { icon: HiEnvelope, label: 'E-posta', value: 'info@cezaevinden.com',     color: 'bg-blue-100 text-blue-600'   },
            { icon: HiPhone,    label: 'Telefon', value: '0850 XXX XX XX',           color: 'bg-green-100 text-green-600'  },
            { icon: HiMapPin,   label: 'Adres',   value: 'İstanbul, Türkiye',        color: 'bg-orange-100 text-orange-600'},
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}

          <div className="card p-4 bg-navy-700 text-white">
            <p className="font-bold mb-1 text-sm">Acil Hukuki Durum?</p>
            <p className="text-xs text-blue-200 mb-3">Gönüllü avukatlarımız 7/24 sorularınızı yanıtlıyor.</p>
            <a href="/hukuki-yardim" className="block text-center bg-gold-500 text-navy-800 font-bold text-sm py-2 rounded-lg hover:bg-gold-600 transition-colors">
              Hukuki Yardım Al
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 card p-6">
          {sent ? (
            <div className="text-center py-10">
              <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Mesajınız Alındı!</h2>
              <p className="text-gray-500 text-sm">En kısa sürede size dönüş yapacağız.</p>
              <button onClick={() => setSent(false)} className="mt-4 btn-secondary text-sm">Yeni Mesaj</button>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Ad Soyad</label>
                  <input type="text" required className="input-field" placeholder="Adınız"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">E-posta</label>
                  <input type="email" required className="input-field" placeholder="ornek@email.com"
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Konu</label>
                <select className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                  <option value="">Seçiniz...</option>
                  {subjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Mesaj</label>
                <textarea required rows={5} className="input-field resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                  value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <HiPaperAirplane className="w-4 h-4" /> Gönder
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
