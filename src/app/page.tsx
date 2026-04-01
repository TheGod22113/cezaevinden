'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import RightSidebar from '@/components/RightSidebar'
import PostCard, { type PostData } from '@/components/PostCard'
import PostComposer from '@/components/PostComposer'
import InfiniteScroll from '@/components/InfiniteScroll'
import { PostSkeleton } from '@/components/Skeleton'
import { HiScale, HiNewspaper, HiHandRaised, HiStar, HiChatBubbleLeftRight, HiArrowRight, HiCheckBadge } from 'react-icons/hi2'

const filterTabs = [
  { label: 'Tümü',       category: undefined },
  { label: 'Hukuki',     category: 'Hukuki' },
  { label: 'Deneyim',    category: 'Deneyim' },
  { label: 'Soru',       category: 'Soru' },
  { label: 'Destek',     category: 'Destek' },
  { label: 'Haber',      category: 'Haber' },
]

type FeaturedData = {
  news:       { id: string; title: string; summary: string; category: string } | null
  lawyerPost: PostData | null
  forumTopic: { id: string; title: string; category: string; _count: { replies: number }; isSolved: boolean } | null
}

export default function HomePage() {
  const { data: session } = useSession()
  const [activeFilter, setActiveFilter] = useState(0)
  const [posts, setPosts]     = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [featured, setFeatured] = useState<FeaturedData>({ news: null, lawyerPost: null, forumTopic: null })

  const loadPosts = useCallback(async (pageNum: number, catIdx: number, replace = false) => {
    setLoading(true)
    const cat = filterTabs[catIdx].category
    const catParam = cat ? '&category=' + encodeURIComponent(cat) : ''
    const url = '/api/posts?page=' + pageNum + catParam
    const res = await fetch(url)
    const data = await res.json()
    const arr: PostData[] = Array.isArray(data) ? data : []
    setPosts(prev => replace ? arr : [...prev, ...arr])
    setHasMore(arr.length === 20)
    setLoading(false)
  }, [])

  useEffect(() => {
    setPage(1)
    loadPosts(1, activeFilter, true)
  }, [activeFilter, loadPosts])

  useEffect(() => {
    Promise.all([
      fetch('/api/news?limit=1').then(r => r.json()),
      fetch('/api/posts?category=Hukuki&limit=1').then(r => r.json()),
      fetch('/api/forum?sort=popular&limit=1').then(r => r.json()),
    ]).then(([newsData, postData, forumData]) => {
      setFeatured({
        news:       Array.isArray(newsData)  && newsData[0]  ? newsData[0]  : null,
        lawyerPost: Array.isArray(postData)  && postData[0]  ? postData[0]  : null,
        forumTopic: Array.isArray(forumData) && forumData[0] ? forumData[0] : null,
      })
    }).catch(() => {})
  }, [])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    loadPosts(next, activeFilter, false)
  }

  const onPost = (post: PostData) => {
    setPosts(prev => [post, ...prev])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="hero-gradient rounded-2xl p-6 mb-6 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gold-500 text-navy-800 text-xs font-bold px-2.5 py-1 rounded-full">BETA</span>
            <span className="text-blue-200 text-sm">Türkiye'nin ceza adaleti dayanışma platformu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Yalnız değilsiniz.</h1>
          <p className="text-blue-100 text-sm sm:text-base mb-4">
            Tutuklu ve hükümlüler, aileler ve gönüllü avukatlar bir arada —
            paylaşmak, destek olmak ve birlikte güçlenmek için.
          </p>
          <div className="flex flex-wrap gap-3">
            {session ? (
              <>
                <div className="bg-white/10 rounded-xl px-5 py-2.5">
                  <p className="text-blue-200 text-xs">Hoş geldiniz</p>
                  <p className="font-semibold text-white">{session.user?.name}</p>
                </div>
                <a href="/profil" className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm flex items-center">
                  Profilim
                </a>
              </>
            ) : (
              <>
                <a href="/kayit" className="bg-crimson-600 hover:bg-crimson-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  Hemen Üye Ol — Ücretsiz
                </a>
                <a href="/hakkimizda" className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm">
                  Nasıl Çalışır?
                </a>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-white/20">
          {[
            { icon: '👥', value: '24.5K', label: 'Üye' },
            { icon: '⚖️', value: '380',   label: 'Gönüllü Avukat' },
            { icon: '✅', value: '8.2K',  label: 'Yanıtlanan Soru' },
            { icon: '🤝', value: '1.4K',  label: 'Aktif Tartışma' },
          ].map(({ icon, value, label }) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold">{icon} {value}</p>
              <p className="text-xs text-blue-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:block">
          <Sidebar active="/" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Quick access */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { href: '/hukuki-yardim', icon: HiScale,     label: 'Hukuki Yardım', color: 'bg-blue-500',    desc: 'Avukata sor' },
              { href: '/haberler',      icon: HiNewspaper,  label: 'Son Haberler',  color: 'bg-crimson-600', desc: 'Güncel gelişmeler' },
              { href: '/destek',        icon: HiHandRaised, label: 'Destek Ağı',    color: 'bg-green-500',   desc: 'Yardım bul' },
              { href: '/forum',         icon: HiStar,       label: 'Forum',         color: 'bg-gold-500',    desc: 'Tartışmalar' },
            ].map(({ href, icon: Icon, label, color, desc }) => (
              <a key={href} href={href}
                className="card p-4 flex flex-col items-center text-center hover:shadow-md transition-all group">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </a>
            ))}
          </div>

          {/* Öne Çıkanlar */}
          {(featured.news || featured.lawyerPost || featured.forumTopic) && (
            <div className="mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Öne Çıkanlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Güncel Haber */}
                {featured.news && (
                  <Link href="/haberler" className="card p-4 hover:shadow-md transition-all group border-l-4 border-crimson-500">
                    <div className="flex items-center gap-1.5 mb-2">
                      <HiNewspaper className="w-4 h-4 text-crimson-500" />
                      <span className="text-xs font-semibold text-crimson-600 uppercase tracking-wide">Güncel Haber</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-navy-700 transition-colors leading-snug">
                      {featured.news.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{featured.news.summary}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-crimson-600 font-medium mt-2">
                      Habere git <HiArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                )}

                {/* Avukat Gönderisi */}
                {featured.lawyerPost && (
                  <div className="card p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-1.5 mb-2">
                      <HiCheckBadge className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Avukat Paylaşımı</span>
                    </div>
                    {featured.lawyerPost.author && (
                      <p className="text-xs text-gray-500 mb-1.5 font-medium">{featured.lawyerPost.author.name}</p>
                    )}
                    <p className="text-sm text-gray-700 line-clamp-3 leading-snug">{featured.lawyerPost.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>👍 {featured.lawyerPost._count?.likes ?? 0}</span>
                      <span>💬 {featured.lawyerPost._count?.comments ?? 0}</span>
                    </div>
                  </div>
                )}

                {/* Forum Tartışması */}
                {featured.forumTopic && (
                  <Link href={`/forum/${featured.forumTopic.id}`} className="card p-4 hover:shadow-md transition-all group border-l-4 border-gold-500">
                    <div className="flex items-center gap-1.5 mb-2">
                      <HiChatBubbleLeftRight className="w-4 h-4 text-gold-600" />
                      <span className="text-xs font-semibold text-gold-700 uppercase tracking-wide">Aktif Tartışma</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-navy-700 transition-colors leading-snug">
                      {featured.forumTopic.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>💬 {featured.forumTopic._count?.replies ?? 0} yanıt</span>
                      {featured.forumTopic.isSolved && <span className="text-green-600 font-medium">✅ Çözüldü</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-gold-700 font-medium mt-1">
                      Tartışmaya katıl <HiArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Composer */}
          <PostComposer onPost={onPost} />

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {filterTabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveFilter(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === i
                    ? 'bg-navy-700 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-3">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
            {loading && <><PostSkeleton /><PostSkeleton /></>}
          </div>

          <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} isLoading={loading} />

          {!loading && posts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Henüz gönderi yok. İlk paylaşımı siz yapın!</p>
            </div>
          )}
        </div>

        <div className="hidden xl:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
