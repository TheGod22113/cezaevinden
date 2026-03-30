'use client'

import { useState } from 'react'
import PostCard, { type PostData } from '@/components/PostCard'
import {
  HiCheckBadge, HiMapPin, HiCalendar, HiUserPlus, HiUserMinus,
  HiChatBubbleLeftRight, HiShare, HiEllipsisHorizontal,
  HiScale, HiStar, HiArrowLeft,
} from 'react-icons/hi2'
import Link from 'next/link'

const roleInfo: Record<string, { label: string; color: string; bg: string }> = {
  mahkum:  { label: 'Tutuklu/HÃ¼kÃ¼mlÃ¼', color: 'text-orange-700', bg: 'bg-orange-100' },
  aile:    { label: 'Aile Ãœyesi',       color: 'text-green-700',  bg: 'bg-green-100'  },
  avukat:  { label: 'Avukat',           color: 'text-blue-700',   bg: 'bg-blue-100'   },
  tahliye: { label: 'Tahliye OlmuÅŸ',    color: 'text-teal-700',   bg: 'bg-teal-100'   },
  gonullu: { label: 'GÃ¶nÃ¼llÃ¼',          color: 'text-purple-700', bg: 'bg-purple-100' },
}

const sampleUser = {
  username:  'ahmetkaya',
  name:      'Ahmet Kaya',
  role:      'tahliye',
  verified:  true,
  bio:       '6 yÄ±l sonra tahliye oldum. Åimdi tahliye olan insanlara yardÄ±mcÄ± olmaya Ã§alÄ±ÅŸÄ±yorum. Birlikte daha gÃ¼Ã§lÃ¼yÃ¼z.',
  city:      'Ankara',
  joinDate:  'Ocak 2024',
  followers: 342,
  following: 128,
  posts:     47,
  answered:  0,
  avatar:    'AK',
  avatarColor: 'bg-teal-500',
}

const samplePosts: PostData[] = [
  {
    id: '1',
    author: { name: 'Ahmet Kaya', role: 'tahliye', verified: true },
    content: '6 yıl sonra tahliye oldum. İş bulmak gerçekten çok zor. Benzer deneyim yaşayan var mı?',
    category: 'Tahliye Sonrası',
    isAnonymous: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    _count: { likes: 47, comments: 23 },
  },
  {
    id: '2',
    author: { name: 'Ahmet Kaya', role: 'tahliye', verified: true },
    content: 'Adli sicil affı başvurusunu tamamladım. Süreç hakkında merak edenlere anlatayım...',
    category: 'Hukuki Bilgi',
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    _count: { likes: 89, comments: 31 },
  },
]

const tabs = ['GÃ¶nderiler', 'Yorumlar', 'Kaydedilenler', 'HakkÄ±nda']

export default function ProfilPage({ params }: { params: { username: string } }) {
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('GÃ¶nderiler')
  const user = sampleUser
  const role = roleInfo[user.role]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Geri */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Ana Sayfa
      </Link>

      {/* Profil KartÄ± */}
      <div className="card overflow-hidden mb-4">
        {/* Kapak FotoÄŸrafÄ± */}
        <div className="h-32 bg-gradient-to-br from-navy-700 via-navy-600 to-blue-500" />

        {/* Avatar + Aksiyonlar */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className={`w-20 h-20 ${user.avatarColor} rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {user.avatar}
            </div>
            <div className="flex items-center gap-2 mt-12">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <HiShare className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <HiChatBubbleLeftRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFollowing(!following)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  following
                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                    : 'bg-navy-700 text-white hover:bg-navy-800'
                }`}
              >
                {following ? <><HiUserMinus className="w-4 h-4" /> Takipten Ã‡Ä±k</> : <><HiUserPlus className="w-4 h-4" /> Takip Et</>}
              </button>
            </div>
          </div>

          {/* Ä°sim + Rol */}
          <div className="mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              {user.verified && <HiCheckBadge className="w-5 h-5 text-blue-500" />}
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role.bg} ${role.color}`}>
                {role.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">{user.bio}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1"><HiMapPin className="w-3.5 h-3.5" /> {user.city}</span>
            <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> {user.joinDate}'da katÄ±ldÄ±</span>
          </div>

          {/* Ä°statistikler */}
          <div className="flex gap-6">
            {[
              { value: user.posts,     label: 'GÃ¶nderi' },
              { value: user.followers, label: 'TakipÃ§i' },
              { value: user.following, label: 'Takip' },
            ].map(({ value, label }) => (
              <button key={label} className="text-center hover:opacity-75 transition-opacity">
                <p className="font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Avukat Rozeti */}
      {user.role === 'avukat' && (
        <div className="card p-4 mb-4 flex items-center gap-3 bg-blue-50 border border-blue-100">
          <HiScale className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">DoÄŸrulanmÄ±ÅŸ GÃ¶nÃ¼llÃ¼ Avukat</p>
            <p className="text-xs text-blue-600">Bu Ã¼ye, platformda Ã¼cretsiz hukuki danÄ±ÅŸmanlÄ±k saÄŸlamaktadÄ±r.</p>
          </div>
        </div>
      )}

      {/* Tablar */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-4 shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Ä°Ã§eriÄŸi */}
      {activeTab === 'GÃ¶nderiler' && (
        <div className="space-y-4">
          {samplePosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {activeTab === 'HakkÄ±nda' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Profil Bilgileri</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Ãœyelik TÃ¼rÃ¼', value: role.label },
              { label: 'Åehir',       value: user.city },
              { label: 'KatÄ±lÄ±m',     value: user.joinDate },
              { label: 'Toplam GÃ¶nderi', value: `${user.posts} gÃ¶nderi` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'Yorumlar' || activeTab === 'Kaydedilenler') && (
        <div className="card p-10 text-center text-gray-400">
          <p className="text-4xl mb-3">ğŸ”’</p>
          <p className="font-medium">GiriÅŸ yapmanÄ±z gerekiyor</p>
          <p className="text-sm mt-1">Bu iÃ§erikleri gÃ¶rmek iÃ§in Ã¼ye olun.</p>
          <Link href="/kayit" className="inline-block mt-4 btn-primary text-sm">Ãœye Ol</Link>
        </div>
      )}
    </div>
  )
}


