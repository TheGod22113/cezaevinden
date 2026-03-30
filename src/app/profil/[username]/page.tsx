'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PostCard, { type PostData } from '@/components/PostCard'
import {
  HiCheckBadge, HiMapPin, HiCalendar, HiUserPlus, HiUserMinus,
  HiChatBubbleLeftRight, HiShare, HiArrowLeft, HiScale,
} from 'react-icons/hi2'
import Link from 'next/link'

const roleInfo: Record<string, { label: string; color: string; bg: string }> = {
  MAHKUM:  { label: 'Tutuklu/Hükümlü', color: 'text-orange-700', bg: 'bg-orange-100' },
  AILE:    { label: 'Aile Üyesi',       color: 'text-green-700',  bg: 'bg-green-100'  },
  AVUKAT:  { label: 'Avukat',           color: 'text-blue-700',   bg: 'bg-blue-100'   },
  TAHLIYE: { label: 'Tahliye Olmuş',    color: 'text-teal-700',   bg: 'bg-teal-100'   },
  GONULLU: { label: 'Gönüllü',          color: 'text-purple-700', bg: 'bg-purple-100' },
  ADMIN:   { label: 'Yönetici',         color: 'text-gray-700',   bg: 'bg-gray-100'   },
}

interface UserProfile {
  id: string
  name: string
  username: string
  role: string
  verified: boolean
  bio: string | null
  city: string | null
  website: string | null
  createdAt: string
  _count: { posts: number; followers: number; following: number }
}

const tabs = ['Gönderiler', 'Hakkında']

export default function ProfilPage({ params }: { params: { username: string } }) {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Gönderiler')
  const [notFound, setNotFound] = useState(false)

  const me = session?.user as any
  const isOwn = me?.username === params.username

  useEffect(() => {
    fetch(`/api/users/${params.username}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setNotFound(true); setLoading(false); return }
        setUser(data)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [params.username])

  useEffect(() => {
    if (activeTab !== 'Gönderiler') return
    setPostsLoading(true)
    fetch(`/api/users/${params.username}/posts`)
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setPostsLoading(false) })
      .catch(() => setPostsLoading(false))
  }, [params.username, activeTab])

  const handleFollow = async () => {
    if (!session) return
    setFollowLoading(true)
    try {
      const res = await fetch(`/api/users/${params.username}/follow`, { method: 'POST' })
      const data = await res.json()
      setFollowing(data.following)
      setUser(prev => prev ? {
        ...prev,
        _count: {
          ...prev._count,
          followers: prev._count.followers + (data.following ? 1 : -1),
        },
      } : prev)
    } catch { /* ignore */ }
    setFollowLoading(false)
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Yükleniyor...</div>
  )
  if (notFound || !user) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 mb-4">Kullanıcı bulunamadı.</p>
      <Link href="/" className="text-navy-700 font-medium hover:underline">← Ana Sayfa</Link>
    </div>
  )

  const role = roleInfo[user.role] || { label: user.role, color: 'text-gray-700', bg: 'bg-gray-100' }
  const joinDate = new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4">
        <HiArrowLeft className="w-4 h-4" /> Ana Sayfa
      </Link>

      {/* Profil Kartı */}
      <div className="card overflow-hidden mb-4">
        <div className="h-32 bg-gradient-to-br from-navy-700 via-navy-600 to-blue-500" />
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="w-20 h-20 bg-navy-700 rounded-2xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex items-center gap-2 mt-12">
              <button
                onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/profil/${user.username}`)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                title="Profil linkini kopyala"
              >
                <HiShare className="w-5 h-5" />
              </button>
              {!isOwn && (
                <Link href="/mesajlar" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                  <HiChatBubbleLeftRight className="w-5 h-5" />
                </Link>
              )}
              {isOwn ? (
                <Link href="/profil/ayarlar" className="px-4 py-2 rounded-xl font-semibold text-sm border border-gray-200 hover:bg-gray-50 transition-all">
                  Profili Düzenle
                </Link>
              ) : session ? (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
                    following
                      ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                      : 'bg-navy-700 text-white hover:bg-navy-800'
                  }`}
                >
                  {following
                    ? <><HiUserMinus className="w-4 h-4" /> Takipten Çık</>
                    : <><HiUserPlus className="w-4 h-4" /> Takip Et</>}
                </button>
              ) : (
                <Link href="/giris" className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm bg-navy-700 text-white hover:bg-navy-800">
                  <HiUserPlus className="w-4 h-4" /> Takip Et
                </Link>
              )}
            </div>
          </div>

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

          {user.bio && <p className="text-sm text-gray-700 mb-3 leading-relaxed">{user.bio}</p>}

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
            {user.city && <span className="flex items-center gap-1"><HiMapPin className="w-3.5 h-3.5" /> {user.city}</span>}
            <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> {joinDate}'da katıldı</span>
          </div>

          <div className="flex gap-6">
            {[
              { value: user._count.posts,     label: 'Gönderi',  href: null },
              { value: user._count.followers,  label: 'Takipçi',  href: `/profil/${user.username}/takipciler` },
              { value: user._count.following,  label: 'Takip',    href: `/profil/${user.username}/takip-edilenler` },
            ].map(({ value, label, href }) => (
              href ? (
                <Link key={label} href={href} className="text-center hover:opacity-75 transition-opacity">
                  <p className="font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </Link>
              ) : (
                <div key={label} className="text-center">
                  <p className="font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Avukat Rozeti */}
      {user.role === 'AVUKAT' && user.verified && (
        <div className="card p-4 mb-4 flex items-center gap-3 bg-blue-50 border border-blue-100">
          <HiScale className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Doğrulanmış Gönüllü Avukat</p>
            <p className="text-xs text-blue-600">Bu üye, platformda ücretsiz hukuki danışmanlık sağlamaktadır.</p>
          </div>
        </div>
      )}

      {/* Tablar */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 mb-4 shadow-sm">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-navy-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Gönderiler */}
      {activeTab === 'Gönderiler' && (
        <div className="space-y-4">
          {postsLoading && [1,2].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
          {!postsLoading && posts.map(post => <PostCard key={post.id} post={post} />)}
          {!postsLoading && posts.length === 0 && (
            <div className="card p-10 text-center text-gray-400">
              <p>Henüz gönderi yok.</p>
            </div>
          )}
        </div>
      )}

      {/* Hakkında */}
      {activeTab === 'Hakkında' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Profil Bilgileri</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Üyelik Türü',      value: role.label },
              { label: 'Şehir',            value: user.city || '—' },
              { label: 'Katılım',          value: joinDate },
              { label: 'Toplam Gönderi',   value: `${user._count.posts} gönderi` },
              { label: 'Web Sitesi',       value: user.website || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
