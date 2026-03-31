import Link from 'next/link'
import {
  HiHome,
  HiChatBubbleLeftRight,
  HiScale,
  HiNewspaper,
  HiHandRaised,
  HiUserGroup,
  HiEnvelope,
  HiCog6Tooth,
  HiQuestionMarkCircle,
  HiShieldCheck,
  HiCalculator,
} from 'react-icons/hi2'

const navItems = [
  { href: '/',              label: 'Ana Sayfa',      icon: HiHome,                 badge: null },
  { href: '/forum',         label: 'Forum',          icon: HiChatBubbleLeftRight,  badge: null },
  { href: '/hukuki-yardim', label: 'Hukuki Yardım',  icon: HiScale,                badge: null },
  { href: '/haberler',      label: 'Haberler',       icon: HiNewspaper,            badge: null },
  { href: '/destek',        label: 'Destek Ağı',     icon: HiHandRaised,           badge: null },
  { href: '/hesapla',       label: 'İnfaz Hesapla',  icon: HiCalculator,           badge: null },
  { href: '/mesajlar',      label: 'Mesajlar',       icon: HiEnvelope,             badge: null },
]

const categories = [
  { label: 'İnfaz Hukuku',    count: 128, color: 'bg-blue-500' },
  { label: 'Aile Ziyareti',   count: 89,  color: 'bg-green-500' },
  { label: 'Tahliye Süreci',  count: 64,  color: 'bg-teal-500' },
  { label: 'Psikolojik Destek', count: 53, color: 'bg-purple-500' },
  { label: 'Barınma & İş',    count: 41,  color: 'bg-orange-500' },
  { label: 'Mevzuat',         count: 37,  color: 'bg-red-500' },
]

export default function Sidebar({ active }: { active?: string }) {
  return (
    <aside className="w-64 flex-shrink-0">
      {/* Navigasyon */}
      <div className="card p-3 mb-4">
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active === href
                  ? 'bg-navy-700 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active === href ? 'text-white' : 'text-gray-400 group-hover:text-navy-700'}`} />
                {label}
              </div>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  active === href ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Kategoriler */}
      <div className="card p-4 mb-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Popüler Konular</h3>
        <div className="space-y-2">
          {categories.map(({ label, count, color }) => (
            <Link
              key={label}
              href={`/forum?kategori=${encodeURIComponent(label)}`}
              className="flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`}></span>
                <span className="text-sm text-gray-600 group-hover:text-navy-700 transition-colors">{label}</span>
              </div>
              <span className="text-xs text-gray-400">{count}</span>
            </Link>
          ))}
        </div>
        <Link href="/forum" className="mt-3 text-xs text-navy-700 font-medium hover:underline block">
          Tüm kategoriler →
        </Link>
      </div>

      {/* Gönüllü Avukat Ara */}
      <div className="card p-4 mb-4 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <HiScale className="w-8 h-8 text-gold-500 mb-2" />
        <h3 className="font-bold mb-1">Ücretsiz Hukuki Danışmanlık</h3>
        <p className="text-xs text-blue-200 mb-3">
          Gönüllü avukatlarımız sorularınızı yanıtlamaya hazır.
        </p>
        <Link
          href="/hukuki-yardim"
          className="block text-center bg-gold-500 hover:bg-gold-600 text-navy-800 font-semibold text-sm py-2 rounded-lg transition-colors"
        >
          Soru Sor
        </Link>
      </div>

      {/* Alt Linkler */}
      <div className="px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {[
            { label: 'Hakkımızda',       href: '/hakkimizda'         },
            { label: 'Gizlilik',         href: '/gizlilik'           },
            { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
            { label: 'Yardım',           href: '/yardim'             },
            { label: 'İletişim',         href: '/iletisim'           },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-2">© 2025 Cezaevinden.com</p>
      </div>
    </aside>
  )
}
