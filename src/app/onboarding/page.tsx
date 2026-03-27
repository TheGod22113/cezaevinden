'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiCheckCircle, HiArrowRight, HiArrowLeft, HiScale } from 'react-icons/hi2'

const steps = [
  {
    title: 'Profilinizi Tamamlayın',
    desc: 'Bir bio ve şehir ekleyerek diğer üyelerle daha iyi bağlantı kurun.',
    action: 'Profili Düzenle',
    href: '/profil/ayarlar',
    icon: '👤',
    done: false,
  },
  {
    title: 'İlk Gönderinizi Paylaşın',
    desc: 'Deneyimlerinizi veya sorularınızı toplulukla paylaşın.',
    action: 'Gönderi Oluştur',
    href: '/',
    icon: '📝',
    done: false,
  },
  {
    title: 'Forum\'u Keşfedin',
    desc: 'Kategorilere göre tartışmaları takip edin, yanıt verin.',
    action: 'Forum\'a Git',
    href: '/forum',
    icon: '💬',
    done: false,
  },
  {
    title: 'Hukuki Soru Sorun',
    desc: 'Gönüllü avukatlarımız sorularınızı ücretsiz yanıtlıyor.',
    action: 'Soru Sor',
    href: '/hukuki-yardim',
    icon: '⚖️',
    done: false,
  },
  {
    title: 'Bir Topluluğa Katılın',
    desc: 'Ortak paydaş gruplara üye olun, bildirimleri takip edin.',
    action: 'Topluluklar',
    href: '/topluluklar',
    icon: '🤝',
    done: false,
  },
]

export default function OnboardingPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  const toggle = (i: number) =>
    setCompleted(p => { const s = new Set(p); s.has(i) ? s.delete(i) : s.add(i); return s })

  const progress = Math.round((completed.size / steps.length) * 100)

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <HiScale className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">Platforma Hoş Geldiniz!</h1>
        <p className="text-gray-500 text-sm">Başlamak için aşağıdaki adımları tamamlayın.</p>
      </div>

      {/* İlerleme */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">İlerlemeniz</span>
          <span className="text-sm font-bold text-navy-700">{completed.size}/{steps.length}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy-700 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
            <HiCheckCircle className="w-4 h-4" /> Tebrikler! Tüm adımları tamamladınız 🎉
          </p>
        )}
      </div>

      {/* Adımlar */}
      <div className="space-y-3 mb-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`card p-4 flex items-center gap-4 transition-all ${completed.has(i) ? 'opacity-60' : ''}`}
          >
            <button
              onClick={() => toggle(i)}
              className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                completed.has(i) ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-navy-700'
              }`}
            >
              {completed.has(i) && <HiCheckCircle className="w-5 h-5 text-white" />}
            </button>

            <span className="text-2xl flex-shrink-0">{step.icon}</span>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${completed.has(i) ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.desc}</p>
            </div>

            <Link href={step.href}
              className="flex-shrink-0 text-xs text-navy-700 font-semibold hover:underline flex items-center gap-0.5">
              {step.action} <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
          <HiArrowLeft className="w-4 h-4" /> Ana sayfaya dön
        </Link>
      </div>
    </div>
  )
}
