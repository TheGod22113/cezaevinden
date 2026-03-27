'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { HiArrowLeft, HiUsers, HiChatBubbleLeftRight } from 'react-icons/hi2'

// Static community data — can be replaced with DB
const communities: Record<string, {
  name: string; slug: string; desc: string; icon: string;
  members: number; posts: number; category: string
}> = {
  'aile-destegi':     { name: 'Aile Desteği',       slug: 'aile-destegi',     desc: 'Tutuklu yakınları için destek grubu',                         icon: '👨‍👩‍👧',  members: 1240, posts: 3400, category: 'Destek' },
  'tahliye-sonrasi':  { name: 'Tahliye Sonrası',     slug: 'tahliye-sonrasi',  desc: 'Yeniden topluma katılım deneyimleri',                         icon: '🚪',  members: 890,  posts: 2100, category: 'Deneyim' },
  'hukuki-haklarim':  { name: 'Hukuki Haklarım',     slug: 'hukuki-haklarim',  desc: 'Hukuki süreçler hakkında bilgi paylaşımı',                    icon: '⚖️',  members: 2100, posts: 5600, category: 'Hukuk' },
  'is-bulmak':        { name: 'İş Bulmak',           slug: 'is-bulmak',        desc: 'İş fırsatları ve kariyer tavsiyesi',                          icon: '💼',  members: 670,  posts: 1800, category: 'Kariyer' },
  'psikolojik-destek':{ name: 'Psikolojik Destek',   slug: 'psikolojik-destek',desc: 'Ruh sağlığı ve iyileşme',                                     icon: '🧠',  members: 1560, posts: 4200, category: 'Sağlık' },
  'cocuklarim':       { name: 'Çocuklarım İçin',     slug: 'cocuklarim',       desc: 'Tutuklu ebeveynler için paylaşım alanı',                      icon: '👶',  members: 430,  posts: 980,  category: 'Aile' },
}

const samplePosts = [
  { id: '1', author: 'Ayşe K.', time: '2 saat önce', content: 'Bugün ilk kez avukatımla görüştüm. Çok faydalı bilgiler aldım.', likes: 12 },
  { id: '2', author: 'Mehmet A.', time: '5 saat önce', content: 'Bu topluluğu bulduğuma sevindim. Yalnız değiliz.', likes: 28 },
  { id: '3', author: 'Fatma S.', time: '1 gün önce', content: 'İş başvurularında geçmişimi nasıl açıklayacağım konusunda yardım lazım.', likes: 7 },
]

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const community = communities[slug]

  if (!community) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Topluluk bulunamadı.</p>
      <Link href="/topluluklar" className="btn-primary mt-4 inline-block">Topluluklara Dön</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/topluluklar"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Topluluklara Dön
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{community.icon}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-xl font-black text-gray-900">{community.name}</h1>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{community.category}</span>
              </div>
              <button className="btn-primary text-sm px-4 py-2">Katıl</button>
            </div>
            <p className="text-gray-600 text-sm mt-2">{community.desc}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><HiUsers className="w-4 h-4" />{community.members.toLocaleString('tr-TR')} üye</span>
              <span className="flex items-center gap-1"><HiChatBubbleLeftRight className="w-4 h-4" />{community.posts.toLocaleString('tr-TR')} paylaşım</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="font-bold text-gray-900 mb-3">Son Paylaşımlar</h2>
      <div className="space-y-3">
        {samplePosts.map(p => (
          <div key={p.id} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {p.author.charAt(0)}
              </div>
              <span className="font-semibold text-sm text-gray-900">{p.author}</span>
              <span className="text-xs text-gray-400 ml-auto">{p.time}</span>
            </div>
            <p className="text-sm text-gray-700">{p.content}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>❤️ {p.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
