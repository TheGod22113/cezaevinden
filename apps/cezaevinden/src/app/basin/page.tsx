import { HiNewspaper, HiArrowDownTray } from 'react-icons/hi2'

export const metadata = { title: 'Basın — Cezaevinden.com' }

const haberler = [
  { title: 'Türkiye\'nin İlk Ceza Adaleti Sosyal Platformu Yayına Girdi', source: 'Haber Türk', date: 'Mart 2025' },
  { title: 'Cezaevinden.com: Mahkumlar ve Aileler Artık Bir Platformda', source: 'Milliyet', date: 'Mart 2025' },
  { title: 'Gönüllü Avukatlar ve Mahkum Aileleri Buluşuyor',              source: 'BiaNet',   date: 'Şubat 2025' },
]

export default function BasinPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-navy-700 mb-2 flex items-center gap-2">
        <HiNewspaper className="w-7 h-7 text-gold-500" /> Basın Odası
      </h1>
      <p className="text-gray-500 text-sm mb-8">Medya mensupları için basın materyalleri ve iletişim bilgileri.</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Logo Paketi',     desc: 'SVG, PNG (beyaz/renkli)', icon: '🎨' },
          { label: 'Basın Bülteni',   desc: 'Lansman duyurusu PDF',    icon: '📄' },
          { label: 'Platform Görselleri', desc: 'Ekran görüntüleri',    icon: '🖼️' },
          { label: 'İstatistik Kiti', desc: 'Platform verileri',       icon: '📊' },
        ].map(({ label, desc, icon }) => (
          <div key={label} className="card p-4 flex items-center gap-3 hover:shadow-md transition-all cursor-pointer group">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <HiArrowDownTray className="w-5 h-5 text-gray-300 group-hover:text-navy-700 transition-colors" />
          </div>
        ))}
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-3">Bizi Yazan Medya</h2>
        <div className="space-y-3">
          {haberler.map(h => (
            <div key={h.title} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{h.title}</p>
                <p className="text-xs text-gray-400">{h.source} · {h.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5 bg-navy-700 text-white">
        <h2 className="font-bold mb-1">Basın İletişimi</h2>
        <p className="text-sm text-blue-200 mb-3">Röportaj, bilgi ve içerik talepleri için:</p>
        <a href="mailto:basin@cezaevinden.com" className="text-gold-400 font-semibold hover:underline">
          basin@cezaevinden.com
        </a>
      </div>
    </div>
  )
}
