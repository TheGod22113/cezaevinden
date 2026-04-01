'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiCalculator, HiCalendar, HiCheckCircle, HiXCircle,
  HiInformationCircle, HiArrowRight, HiClock, HiExclamationTriangle,
  HiShieldExclamation,
} from 'react-icons/hi2'

// Önemli kanun tarihleri
const KANUN_7242 = new Date('2020-04-25') // 7242 sayılı Kanun — DS süresi değişti
const EK_DENETIM_KESIM = new Date('2023-07-31') // Bu tarihten önce işlenen belirli suçlara +3 yıl ek denetim

const sucTipleri = [
  {
    id: 'GENEL',
    label: 'Kasıtlı Suç (Genel)',
    desc: 'Hırsızlık, dolandırıcılık, yaralama vb.',
    ks: 2 / 3,
    dsYilEski: 1,   // 7242 öncesi
    dsYilYeni: 2,   // 7242 sonrası (CGTİHK 105/A)
    acik: 1 / 5,
    ekDenetim3Yil: false,
  },
  {
    id: 'TAKSIR',
    label: 'Taksirli Suç',
    desc: 'Trafik kazası, ihmali öldürme vb.',
    ks: 1 / 2,
    dsYilEski: 1,
    dsYilYeni: 2,
    acik: 1 / 5,
    ekDenetim3Yil: false,
  },
  {
    id: 'UYUSTURUCU_BIREYSEL',
    label: 'Uyuşturucu (Bireysel Kullanım)',
    desc: 'Kişisel kullanım amaçlı uyuşturucu',
    ks: 2 / 3,
    dsYilEski: 1,
    dsYilYeni: 2,
    acik: 1 / 5,
    ekDenetim3Yil: false,
  },
  {
    id: 'TEROR',
    label: 'Terör Suçları',
    desc: 'TMK kapsamındaki suçlar',
    ks: 3 / 4,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: true,
  },
  {
    id: 'CINSEL_COCUK',
    label: 'Çocuğa Karşı Cinsel Suç',
    desc: 'TCK 103 — Çocuğun cinsel istismarı',
    ks: 3 / 4,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: true,
  },
  {
    id: 'CINSEL_YETISKIN',
    label: 'Cinsel Saldırı (Yetişkin)',
    desc: 'TCK 102 — Cinsel saldırı',
    ks: 3 / 4,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: true,
  },
  {
    id: 'UYUSTURUCU_ORGUT',
    label: 'Uyuşturucu (Örgütlü/Ticareti)',
    desc: 'Örgütlü veya ticaret amaçlı uyuşturucu',
    ks: 3 / 4,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: true,
  },
  {
    id: 'KASTEN_OLDURME',
    label: 'Kasten Öldürme',
    desc: 'TCK 81-82',
    ks: 3 / 4,
    dsYilEski: null,
    dsYilYeni: null,
    acik: 1 / 5,
    ekDenetim3Yil: true,
  },
  {
    id: 'MUEBBET',
    label: 'Müebbet Hapis',
    desc: 'Ağırlaştırılmamış müebbet — 24 yıl',
    ks: null,
    ksYil: 24,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: false,
  },
  {
    id: 'AGIR_MUEBBET',
    label: 'Ağırlaştırılmış Müebbet',
    desc: 'En ağır hapis cezası — 30 yıl',
    ks: null,
    ksYil: 30,
    dsYilEski: null,
    dsYilYeni: null,
    acik: null,
    ekDenetim3Yil: false,
  },
]

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + Math.round(days))
  return d
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
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
  ekDenetimDate: Date | null
  totalDays: number
  sucTip: typeof sucTipleri[0]
  dsYilUygulanan: number | null
  kanunVersiyonu: '7242_oncesi' | '7242_sonrasi'
  ekDenetimVar: boolean
  iyiHalEtkisi: boolean
}

export default function HesaplaPage() {
  const [girişTarihi, setGirişTarihi] = useState('')
  const [sucTarihi, setSucTarihi]     = useState('')
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
    if (!sucTarihi)   { setError('Suçun işlendiği tarihi girin.'); return }
    const y = parseInt(yil || '0')
    const m = parseInt(ay  || '0')
    const d = parseInt(gun || '0')
    if (y === 0 && m === 0 && d === 0) { setError('Ceza süresini girin.'); return }

    const tip = sucTipleri.find(s => s.id === sucTip)!
    const totalDays  = y * 365 + m * 30 + d
    const başlangıç  = new Date(girişTarihi)
    const sucTarihiD = new Date(sucTarihi)

    // Hangi kanun versiyonu uygulanıyor?
    const kanunVersiyonu: Result['kanunVersiyonu'] =
      sucTarihiD >= KANUN_7242 ? '7242_sonrasi' : '7242_oncesi'

    // DS süresi: 7242 sonrası daha uzun (lehe kanun ilkesiyle eski suçlara da uygulanabilir)
    const dsYilUygulanan: number | null =
      kanunVersiyonu === '7242_sonrasi' ? tip.dsYilYeni : tip.dsYilEski

    // 31 Temmuz 2023 öncesi işlenen belirli suçlara ek denetim
    const ekDenetimVar = tip.ekDenetim3Yil && sucTarihiD < EK_DENETIM_KESIM

    let ksDate: Date | null = null
    let dsDate: Date | null = null
    let acikDate: Date | null = null
    let ekDenetimDate: Date | null = null

    // Koşullu Salıverilme hesabı
    if ((tip as any).ksYil) {
      ksDate = addYears(başlangıç, (tip as any).ksYil)
    } else if (tip.ks) {
      let ksDays = totalDays * tip.ks
      // İyi hal yoksa: tahmini +90 gün (iyi hal şartı sağlanmamış olabilir, KS reddedilebilir)
      if (!iyiHal) ksDays += 90
      ksDate = addDays(başlangıç, ksDays)
    }

    // Denetimli Serbestlik hesabı
    if (dsYilUygulanan !== null && dsYilUygulanan !== undefined && ksDate) {
      dsDate = addYears(new Date(ksDate), -dsYilUygulanan)
      // DS başlangıcı cezaevi girişinden önce olamaz
      if (dsDate < başlangıç) dsDate = new Date(başlangıç)
    }

    // Açık Cezaevine Geçiş
    if (tip.acik !== null && tip.acik !== undefined) {
      acikDate = addDays(başlangıç, totalDays * tip.acik)
    }

    // Ek denetim: KS tarihinden itibaren +3 yıl denetim süresi
    if (ekDenetimVar && ksDate) {
      ekDenetimDate = addYears(new Date(ksDate), 3)
    }

    setResult({
      ksDate, dsDate, acikDate, ekDenetimDate,
      totalDays, sucTip: tip,
      dsYilUygulanan, kanunVersiyonu,
      ekDenetimVar,
      iyiHalEtkisi: !iyiHal,
    })
  }

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
          CGTİHK md. 107, 7242 sayılı Kanun ve ilgili mevzuat esas alınmaktadır.
        </p>
      </div>

      {/* Uyarı */}
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 mb-6">
        <HiInformationCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Bu hesaplama <strong>bilgilendirme amaçlıdır</strong>. Gerçek tarihleri mahkeme kararı,
          suçun nitelendirilmesi, iyi hal değerlendirmesi ve infaz kurumu kararları belirler.
          Kesin bilgi için avukatınıza veya infaz kurumuna danışın.
        </p>
      </div>

      <div className="card p-6 space-y-5">

        {/* Suç Tipi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">Suç Tipi</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {sucTipleri.map(t => (
              <button key={t.id} onClick={() => setSucTip(t.id)}
                className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  sucTip === t.id
                    ? 'border-navy-700 bg-navy-50 dark:bg-navy-900/40 text-navy-800 dark:text-blue-200'
                    : 'border-gray-200 dark:border-[#2a2d3e] hover:border-gray-300 text-gray-700 dark:text-gray-300'
                }`}>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Suç Tarihi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-1">
            Suçun İşlendiği Tarih
          </label>
          <p className="text-xs text-gray-400 mb-2">Hangi kanun versiyonunun uygulanacağını belirler (7242, 31 Temmuz 2023 vb.)</p>
          <input
            type="date"
            className="input-field"
            value={sucTarihi}
            onChange={e => setSucTarihi(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Ceza Süresi */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">Hükmedilen Ceza Süresi</label>
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
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
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
        <div className="flex items-center justify-between py-2 border border-gray-100 dark:border-[#2a2d3e] rounded-xl px-4">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">İyi Hal Koşulu</p>
            <p className="text-xs text-gray-400">
              {iyiHal
                ? 'Disiplin cezası almadan devam ediyor'
                : 'İyi hal şartı sağlanmıyor — KS tarihi ötelenebilir veya reddedilebilir'}
            </p>
          </div>
          <button
            onClick={() => setIyiHal(!iyiHal)}
            className={`relative w-11 h-6 rounded-full transition-colors ${iyiHal ? 'bg-navy-700' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${iyiHal ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">{error}</p>
        )}

        <button onClick={hesapla} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3">
          <HiCalculator className="w-5 h-5" /> Hesapla
        </button>
      </div>

      {/* SONUÇLAR */}
      {result && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5 text-green-500" /> Hesaplama Sonuçları
          </h2>

          {/* Kanun versiyonu bilgisi */}
          <div className={`rounded-xl p-4 border text-sm ${
            result.kanunVersiyonu === '7242_sonrasi'
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40'
              : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-[#2a2d3e]'
          }`}>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {result.kanunVersiyonu === '7242_sonrasi'
                ? '📋 7242 sayılı Kanun uygulanıyor (25 Nisan 2020 sonrası)'
                : '📋 Eski CGTİHK kuralları uygulanıyor (7242 öncesi)'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {result.kanunVersiyonu === '7242_sonrasi'
                ? `Denetimli serbestlik süresi: ${result.dsYilUygulanan ?? '—'} yıl`
                : `Denetimli serbestlik süresi: ${result.dsYilUygulanan ?? '—'} yıl (eski kural)`}
              {' '}· Lehe kanun ilkesiyle farklı versiyon uygulanabilir, avukata danışın.
            </p>
          </div>

          {/* İyi hal uyarısı */}
          {result.iyiHalEtkisi && (
            <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/40 rounded-xl p-4">
              <HiExclamationTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 dark:text-orange-300">
                <strong>İyi hal şartı sağlanmıyor.</strong> Koşullu salıverilme reddedilebilir veya infaz kurulu
                kararıyla tarihe +90 gün eklenebilir. Gösterilen KS tarihi tahminidir.
              </p>
            </div>
          )}

          {/* Özet */}
          <div className="card p-4 bg-navy-50 dark:bg-navy-900/40 border border-navy-200 dark:border-navy-700/50">
            <p className="text-sm text-navy-800 dark:text-blue-200">
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
                subtitle="Cezanın 1/5'i tamamlandığında (CGTİHK md. 14)"
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
                subtitle={`Koşullu salıverilmeden ${result.dsYilUygulanan} yıl önce (CGTİHK md. 105/A)`}
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
                    ? `${(result.sucTip as any).ksYil} yıl sonra (CGTİHK md. 107)`
                    : `Cezanın ${
                        result.sucTip.ks === 2/3 ? '2/3' :
                        result.sucTip.ks === 1/2 ? '1/2' : '3/4'
                      }'si tamamlandığında (CGTİHK md. 107)`
                }
                date={result.ksDate}
                color="teal"
                highlight
              />
            ) : null}

            {/* Ek Denetim (31 Temmuz 2023 öncesi suçlar) */}
            {result.ekDenetimVar && result.ekDenetimDate ? (
              <div className="card p-4 border-2 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-start gap-3">
                  <HiShieldExclamation className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-800 dark:text-orange-300">
                      +3 Yıl Ek Denetim Süresi
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                      31 Temmuz 2023 öncesi işlenen bu suç tipine ek denetim uygulanmaktadır.
                      KS tarihinden itibaren 3 yıl boyunca denetimli serbestlik koşulları devam eder.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <HiCalendar className="w-4 h-4 text-orange-500" />
                      <p className="font-bold text-orange-800 dark:text-orange-300">
                        Denetim Bitiş: {formatDate(result.ekDenetimDate)}
                      </p>
                    </div>
                    <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                      <HiInformationCircle className="w-3.5 h-3.5" />
                      Bu kuralın uygulanıp uygulanmayacağını avukatınızla doğrulayın.
                    </p>
                  </div>
                </div>
              </div>
            ) : result.ekDenetim3Yil && !result.ekDenetimVar ? (
              <div className="card p-3 border border-gray-100 dark:border-[#2a2d3e]">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <HiCheckCircle className="w-4 h-4 text-green-500" />
                  Suç tarihi 31 Temmuz 2023 sonrası — ek 3 yıl denetim bu davaya uygulanmıyor.
                </p>
              </div>
            ) : null}
          </div>

          {/* Hukuki Dayanak */}
          <div className="card p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-semibold uppercase tracking-wide">Hukuki Dayanak</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
              <li>• 5275 sayılı CGTİHK Madde 107 — Koşullu salıverilme</li>
              <li>• 5275 sayılı CGTİHK Madde 105/A — Denetimli serbestlik</li>
              <li>• 5275 sayılı CGTİHK Madde 14 — Açık ceza infaz kurumu</li>
              <li>• 7242 sayılı Kanun (25.04.2020) — Denetimli serbestlik süre değişikliği</li>
              <li>• 31 Temmuz 2023 kesim tarihi — Belirli suçlara ek denetim uygulaması</li>
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
  const colorMap = {
    green: 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
    blue:  'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
    teal:  'border-teal-200 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/20',
  }
  return (
    <div className={`card p-4 border-2 ${highlight ? colorMap[color] : 'border-gray-100 dark:border-[#2a2d3e]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
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
    <div className="card p-4 border border-gray-100 dark:border-[#2a2d3e] opacity-60">
      <div className="flex items-center gap-3">
        <span className="text-2xl grayscale">{icon}</span>
        <div>
          <p className="font-semibold text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            <HiXCircle className="w-3.5 h-3.5" /> {reason}
          </p>
        </div>
      </div>
    </div>
  )
}
