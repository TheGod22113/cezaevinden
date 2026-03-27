'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiScale, HiCheckCircle, HiShieldCheck, HiUsers, HiStar, HiAcademicCap } from 'react-icons/hi2'

const benefits = [
  { icon: HiUsers,       title: '24.500+ Üyeye Ulaşın',       desc: 'Platformdaki binlerce kişiye hukuki bilginizle destek olun.' },
  { icon: HiStar,        title: 'Uzmanlığınızı Sergileyin',   desc: 'Yanıtladığınız sorular profilinizde görünür, itibarınız artar.' },
  { icon: HiShieldCheck, title: 'Doğrulanmış Rozet',          desc: 'Baro numaranız doğrulandıktan sonra mavi tik rozeti alırsınız.' },
  { icon: HiAcademicCap, title: 'Hizmet İçi Eğitim',         desc: 'Diğer gönüllü avukatlarla bilgi paylaşım ağına dahil olun.' },
]

const steps = [
  { n: '1', title: 'Kayıt Olun',          desc: '"Avukat" rolünü seçerek üye olun.' },
  { n: '2', title: 'Belgelerinizi Ekleyin', desc: 'Baro adı ve sicil numaranızı girin.' },
  { n: '3', title: 'Onay Bekleyin',       desc: 'Ekibimiz 1-2 iş günü içinde doğrular.' },
  { n: '4', title: 'Soruları Yanıtlayın', desc: 'Kategorinize gelen soruları görün ve yanıtlayın.' },
]

export default function AvukatOlPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', baroCity: '', baroNo: '', expertise: '' })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="hero-gradient rounded-2xl p-8 mb-8 text-white text-center">
        <HiScale className="w-14 h-14 text-gold-500 mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-3">Gönüllü Avukat Olun</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Hukuki bilginizle bir mahkumun hayatını, bir ailenin umudunu değiştirebilirsiniz.
          Ücretsiz, zaman ayırabildiğiniz kadar.
        </p>
        <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-white/20 flex-wrap">
          {[['380', 'Aktif Avukat'], ['8.2K', 'Yanıtlanan Soru'], ['~3sa', 'Ort. Yanıt Süresi']].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-2xl font-black">{v}</p>
              <p className="text-xs text-blue-200">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Avantajlar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Neden Katılmalısınız?</h2>
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-navy-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}

          {/* Adımlar */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Nasıl Çalışır?</h2>
            <div className="space-y-3">
              {steps.map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-navy-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {n}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Başvuru Formu */}
        <div className="card p-6">
          {submitted ? (
            <div className="text-center py-8">
              <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Başvurunuz Alındı!</h2>
              <p className="text-sm text-gray-500 mb-4">
                1-2 iş günü içinde e-posta ile dönüş yapacağız.
              </p>
              <Link href="/" className="btn-primary text-sm">Ana Sayfaya Dön</Link>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-gray-800 mb-4">Hızlı Başvuru</h2>
              <form className="space-y-3" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
                {[
                  { label: 'Ad Soyad',    key: 'name',      placeholder: 'Av. Ad Soyad',       type: 'text'  },
                  { label: 'E-posta',     key: 'email',     placeholder: 'av@example.com',      type: 'email' },
                  { label: 'Baro',        key: 'baroCity',  placeholder: 'Ankara, İstanbul...', type: 'text'  },
                  { label: 'Sicil No',    key: 'baroNo',    placeholder: '12345',               type: 'text'  },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                    <input type={type} required className="input-field text-sm" placeholder={placeholder}
                      value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Uzmanlık Alanı</label>
                  <select className="input-field text-sm" value={form.expertise}
                    onChange={e => setForm({ ...form, expertise: e.target.value })}>
                    <option value="">Seçiniz...</option>
                    {['İnfaz Hukuku', 'Ceza Hukuku', 'Aile Hukuku', 'İdare Hukuku', 'İnsan Hakları', 'Diğer'].map(o => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-colors mt-2">
                  Başvur
                </button>
              </form>
              <p className="text-xs text-center text-gray-400 mt-3">
                Veya <Link href="/kayit" className="text-navy-700 hover:underline">üye olarak</Link> da başvurabilirsiniz.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
