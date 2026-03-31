'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiCalculator, HiCalendar, HiCheckCircle, HiXCircle,
  HiInformationCircle, HiArrowRight, HiClock,
} from 'react-icons/hi2'

const sucTipleri = [
  {
    id: 'GENEL',
    label: 'Kasıtlı Suç (Genel)',
    desc: 'Hırsızlık, dolandırıcılık, yaralama vb.',
    ks: 2 / 3,
    dsYil: 1,
    acik: 1 / 5,
  },
  {
    id: 'TAKSIR',
    label: 'Taksirli Suç',
    desc: 'Trafik kazası, ihmali öldürme vb.',
    ks: 1 / 2,
    dsYil: 1,
    acik: 1 / 5,
  },
  {
    id: 'UYUSTURUCU_BIREYSEL',
    label: 'Uyuşturucu (Bireysel Kullanım)',
    desc: 'Kişisel kullanım amaçlı uyuşturucu',
    ks: 2 / 3,
    dsYil: 1,
    acik: 1 / 5,
  },
  {
    id: 'TEROR',
    label: 'Terör Suçları',
    desc: 'TMK kapsamındaki suçlar',
    ks: 3 / 4,
    dsYil: null,
    acik: null,
  },
  {
    id: 'CINSEL_COCUK',
    label: 'Çocuğa Karşı Cinsel Suç',
    desc: 'Çocuğun cinsel istismarı',
    ks: 3 / 4,
    dsYil: null,
    acik: null,
  },
  {
    id: 'UYUSTURUCU_ORGUT',
    label: 'Uyuşturucu (Örgütlü/Ticareti)',
    desc: 'Örgütlü veya ticaret amaçlı uyuşturucu',
    ks: 3 / 4,
    dsYil: null,
    acik: null,
  },
  {
    id: 'KASTEN_OLDURME',
    label: 'Kasten Öldürme',
    desc: 'TCK 81-82',
    ks: 3 / 4,
    dsYil: null,
    acik: 1 / 5,
  },
  {
    id: 'MUEBBET',
    label: 'Müebbet Hapis',
    desc: 'Ağırlaştırılmamış müebbet',
    ks: null,
    ksYil: 24,
    dsYil: null,
    acik: null,
  },
  {
    id: 'AGIR_MUEBBET',
    label: 'Ağırlaştırılmış Müebbet',
    desc: 'En ağır hapis cezası',
    ks: null,
    ksYil: 30,
    dsYil: null,
    acik: null,
  },
]

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + Math.round(days))
  return d
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function diffLabel(d: Date): string {
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  if (diff < 0) return 'Geçti'
  const days = Math.floor(diff / 86400000)
  if (days < 30) return `${days} gün kaldı`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ay kaldı`
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  return remMonths > 0 ? `${years} yıl ${remMonths} ay kaldı` : `${years} yıl kaldı`
}

interface Result {
  ksDate: Date | null
  dsDate: Date | null
  acikDate: Date | null
  totalDays: number
  sucTip: typeof sucTipleri[0]
}

export default function HesaplaPage() {
  const [girişTarihi, setGirişTarihi] = useState('')
  const [yil, setYil]     = useState('')
  const [ay, setAy]       = useState('')
  const [gun, setGun]     = useState('')
  const [sucTip, setSucTip] = useState(sucTipleri[0].id)
  const [iyiHal, setIyiHal] = useState(true)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError]   = useState('')

  const hesapla = () => {
    setError('')
    if (!girişTarihi) { setError('Cezaevine giriş tarihini girin.'); return }
    const y = parseInt(yil || '0')
    const m = parseInt(ay  || '0')
    const d = parseInt(gun || '0')
    if (y === 0 && m === 0 && d === 0) { setError('Ceza süresini girin.'); return }

    const tip = sucTipleri.find(s => s.id === sucTip)!
    // Toplam gün: 1 yıl=365, 1 ay=30
    const totalDays = y * 365 + m * 30 + d
    const başlangıç = new Date(girişTarihi)

    let ksDate: Date | null = null
    let dsDate: Date | null = null
    let acikDate: Date | null = null

    if ((tip as any).ksYil) {
      // Müebbet
      ksDate = new Date(başlangıç)
      ksDate.setFullYear(ksDate.getFullYear() + (tip as any).ksYil)
    } else if (tip.ks) {
      // İyi hal indirimi: Bazı özel suçlarda iyi hal indirimi uygulanmaz
      // Genel kural: iyi hal aranır
      const ksDays = totalDays * tip.ks
      ksDate = addDays(başlangıç, ksDays)
    }

    if (tip.dsYil !== null && tip.dsYil !== undefined && ksDate) {
      dsDate = new Date(ksDate)
      dsDate.setFullYear(dsDate.getFullYear() - tip.dsYil)
    }

    if (tip.acik !== null && tip.acik !== undefined) {
      const acikDays = totalDays * tip.acik
      acikDate = addDays(başlangıç, acikDays)
    }

    setResult({ ksDate, dsDate, acikDate, totalDays, sucTip: tip })
  }

  const seçiliTip = sucTipleri.find(s => s.id === sucTip)!

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <HiCalculator className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-bold">İnfaz Hesap Makinası</h1>
        </div>
        <p className="text-blue-100 text-sm">
          Koşullu salıverilme, denetimli serbestlik ve açık cezaevine geçiş tarihlerini hesaplayın.
          CGTİHK md. 107 ve ilgili mevzuat esas alınmaktadır.
        </p>
      </div>

      {/* Uyarı */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <HiInformationCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Bu hesaplama <strong>bilgilendirme amaçlıdır</strong>. Gerçek tarihi mahkeme kararı, suçun
          nitelendirilmesi, iyi hal değerlendirmesi ve infaz kurumu kararları belirler.
          Kesin bilgi için avukatınıza veya infaz kurumuna danışın.
        </p>
      </div>

      <div className="card p-6 space-y-5">
        {/* Suç Tipi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Suç Tipi</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {sucTipleri.map(t => (
              <button key={t.id} onClick={() => setSucTip(t.id)}
                className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  sucTip === t.id
                    ? 'border-navy-700 bg-navy-50 text-navy-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Ceza Süresi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Hükmedilen Ceza Süresi</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Yıl', val: yil, set: setYil, max: 30 },
              { label: 'Ay',  val: ay,  set: setAy,  max: 11 },
              { label: 'Gün', val: gun, set: setGun, max: 29 },
            ].map(({ label, val, set, max }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input
                  type="number" min="0" max={max}
                  className="input-field text-center text-lg font-bold"
                  placeholder="0"
                  value={val}
                  onChange={e => set(e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Giriş Tarihi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Cezaevine Giriş Tarihi
          </label>
          <input
            type="date"
            className="input-field"
            value={girişTarihi}
            onChange={e => setGirişTarihi(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* İyi Hal */}
        <div className="flex items-center justify-between py-2 border border-gray-100 rounded-xl px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">İyi Hal Koşulu</p>
            <p className="text-xs text-gray-400">Disiplin cezası almadan devam ediyor</p>
          </div>
          <button
            onClick={() => setIyiHal(!iyiHal)}
            className={`relative w-11 h-6 rounded-full transition-colors ${iyiHal ? 'bg-navy-700' : 'bg-gray-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${iyiHal ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
        )}

        <button onClick={hesapla} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3">
          <HiCalculator className="w-5 h-5" /> Hesapla
        </button>
      </div>

      {/* SONUÇLAR */}
      {result && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5 text-green-500" /> Hesaplama Sonuçları
          </h2>

          {/* Özet bilgi */}
          <div className="card p-4 bg-navy-50 border border-navy-200">
            <p className="text-sm text-navy-800">
              <strong>{result.sucTip.label}</strong> — Toplam{' '}
              <strong>{Math.floor(result.totalDays / 365)} yıl {Math.floor((result.totalDays % 365) / 30)} ay</strong>{' '}
              ({result.totalDays} gün) ceza
            </p>
          </div>

          <div className="space-y-3">

            {/* Açık Cezaevi */}
            {result.acikDate ? (
              <ResultCard
                icon="🏠"
                title="Açık Cezaevine Geçiş"
                subtitle={`Cezanın 1/5'i tamamlandığında`}
                date={result.acikDate}
                color="green"
              />
            ) : (
              <DisabledCard icon="🏠" title="Açık Cezaevine Geçiş" reason="Bu suç tipi için açık cezaevine geçiş uygulanmıyor" />
            )}

            {/* Denetimli Serbestlik */}
            {result.dsDate ? (
              <ResultCard
                icon="📋"
                title="Denetimli Serbestlik Başlangıcı"
                subtitle={`Koşullu salıverilmeden ${result.sucTip.dsYil} yıl önce`}
                date={result.dsDate}
                color="blue"
              />
            ) : (
              <DisabledCard icon="📋" title="Denetimli Serbestlik" reason="Bu suç tipi için denetimli serbestlik uygulanmıyor" />
            )}

            {/* Koşullu Salıverilme */}
            {result.ksDate ? (
              <ResultCard
                icon="🔓"
                title="Koşullu Salıverilme"
                subtitle={
                  (result.sucTip as any).ksYil
                    ? `${(result.sucTip as any).ksYil} yıl sonra`
                    : `Cezanın ${result.sucTip.ks === 2/3 ? '2/3'
                        : result.sucTip.ks === 1/2 ? '1/2'
                        : '3/4'}'si tamamlandığında`
                }
                date={result.ksDate}
                color="teal"
                highlight
              />
            ) : null}
          </div>

          {/* Takvim İndeksi */}
          <div className="card p-4">
            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Hukuki Dayanak</p>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• 5275 sayılı CGTİHK Madde 107 — Koşullu salıverilme</li>
              <li>• 5275 sayılı CGTİHK Madde 90-91 — Denetimli serbestlik</li>
              <li>• 5275 sayılı CGTİHK Madde 14 — Açık ceza infaz kurumu</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/hukuki-yardim" className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2">
              Avukata Sor <HiArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => setResult(null)} className="flex-1 btn-secondary text-sm">
              Yeniden Hesapla
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ResultCard({ icon, title, subtitle, date, color, highlight }: {
  icon: string; title: string; subtitle: string; date: Date
  color: 'green' | 'blue' | 'teal'; highlight?: boolean
}) {
  const isPast = date < new Date()
  const colors = {
    green: 'border-green-200 bg-green-50',
    blue:  'border-blue-200 bg-blue-50',
    teal:  'border-teal-200 bg-teal-50',
  }
  return (
    <div className={`card p-4 border-2 ${highlight ? colors[color] : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-gray-900 flex items-center gap-1">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            {formatDate(date)}
          </p>
          <p className={`text-xs font-medium mt-0.5 flex items-center justify-end gap-1 ${isPast ? 'text-green-600' : 'text-orange-600'}`}>
            <HiClock className="w-3 h-3" />
            {diffLabel(date)}
          </p>
        </div>
      </div>
    </div>
  )
}

function DisabledCard({ icon, title, reason }: { icon: string; title: string; reason: string }) {
  return (
    <div className="card p-4 border border-gray-100 opacity-60">
      <div className="flex items-center gap-3">
        <span className="text-2xl grayscale">{icon}</span>
        <div>
          <p className="font-semibold text-gray-500">{title}</p>
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            <HiXCircle className="w-3.5 h-3.5" /> {reason}
          </p>
        </div>
      </div>
    </div>
  )
}
