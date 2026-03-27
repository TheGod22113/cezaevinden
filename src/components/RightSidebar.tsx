import Link from 'next/link'
import { HiCheckBadge, HiArrowTrendingUp, HiUserPlus } from 'react-icons/hi2'
import NewsletterBox from './NewsletterBox'

const onlineAvukatlar = [
  { name: 'Av. Mehmet Yılmaz', expertise: 'İnfaz Hukuku',   answered: 234, online: true  },
  { name: 'Av. Ayşe Demir',   expertise: 'Ceza Hukuku',     answered: 189, online: true  },
  { name: 'Av. Kemal Arslan',  expertise: 'İdare Hukuku',    answered: 156, online: false },
  { name: 'Av. Fatma Çelik',  expertise: 'Aile Hukuku',     answered: 98,  online: true  },
]

const trendingTopics = [
  { tag: 'infazdüzenlemesi',   posts: 234 },
  { tag: 'koşulluSalıverilme', posts: 189 },
  { tag: 'cezaevikoşulları',   posts: 156 },
  { tag: 'denetimliSerbestlik',posts: 134 },
  { tag: 'tahliyesonrası',     posts: 98  },
]

const suggestedUsers = [
  { name: 'Hukuk Destek Derneği', role: 'Kurum', followers: '12.4K' },
  { name: 'İnfaz İzleme Komitesi', role: 'STK', followers: '8.9K' },
  { name: 'Tahliye Sonrası Destek', role: 'Gönüllü Grup', followers: '5.2K' },
]

export default function RightSidebar() {
  return (
    <aside className="w-80 flex-shrink-0 space-y-4">

      {/* İstatistikler */}
      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Platform İstatistikleri</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Üye',          value: '24.5K', color: 'text-blue-600' },
            { label: 'Avukat',       value: '380',   color: 'text-green-600' },
            { label: 'Soru Cevaplandı', value: '8.2K', color: 'text-purple-600' },
            { label: 'Aktif Konu',   value: '1.4K',  color: 'text-orange-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Çevrimiçi Avukatlar */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Aktif Avukatlar</h3>
          <Link href="/hukuki-yardim/avukatlar" className="text-xs text-navy-700 hover:underline">Tümü</Link>
        </div>
        <div className="space-y-3">
          {onlineAvukatlar.map(({ name, expertise, answered, online }) => (
            <div key={name} className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {name.split(' ')[1]?.charAt(0)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-green-400' : 'bg-gray-300'}`}></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-navy-700 transition-colors truncate">{name}</p>
                  <HiCheckBadge className="w-4 h-4 text-blue-500 flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-500">{expertise} · {answered} yanıt</p>
              </div>
              <Link
                href="/hukuki-yardim"
                className="text-xs bg-navy-700 hover:bg-navy-800 text-white px-2.5 py-1 rounded-lg transition-colors"
              >
                Sor
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Konular */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <HiArrowTrendingUp className="w-4 h-4 text-crimson-600" />
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Gündemdekiler</h3>
        </div>
        <div className="space-y-2">
          {trendingTopics.map(({ tag, posts }, i) => (
            <Link
              key={tag}
              href={`/forum?tag=${tag}`}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                <span className="text-sm text-gray-700 group-hover:text-navy-700 transition-colors font-medium">
                  #{tag}
                </span>
              </div>
              <span className="text-xs text-gray-400">{posts} gönderi</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Önerilen Takipler */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Önerilen</h3>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map(({ name, role, followers }) => (
            <div key={name} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-navy-700 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                <p className="text-xs text-gray-500">{role} · {followers} takipçi</p>
              </div>
              <button className="text-xs border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white px-2.5 py-1 rounded-lg transition-all font-medium">
                <HiUserPlus className="w-3.5 h-3.5 inline mr-0.5" /> Takip
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBox />

      {/* Quick Links */}
      <div className="card p-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Hızlı Bağlantılar</h3>
        <div className="space-y-1.5">
          {[
            { label: 'Trend İçerikler', href: '/trend' },
            { label: 'Avukat Liderliği', href: '/liderlik' },
            { label: 'Etkinlikler', href: '/etkinlikler' },
            { label: 'Anonim Mod Nedir?', href: '/gizli-mod' },
            { label: 'Bağış Yap', href: '/bagis' },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="block text-sm text-gray-600 hover:text-navy-700 hover:underline transition-colors py-0.5">
              {label}
            </Link>
          ))}
        </div>
      </div>

    </aside>
  )
}
