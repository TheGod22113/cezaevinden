'use client'

import { useState, useEffect } from 'react'
import { HiBookmark } from 'react-icons/hi2'
import PostCard from '@/components/PostCard'
import { PostSkeleton } from '@/components/Skeleton'

export default function KaydedilenlerPage() {
  const [posts, setPosts]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(r => r.json())
      .then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <HiBookmark className="w-6 h-6 text-gold-500" />
        <h1 className="text-xl font-black text-gray-900">Kaydedilenler</h1>
      </div>

      {loading && <><PostSkeleton /><PostSkeleton /></>}

      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <HiBookmark className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Henüz kaydettiğiniz gönderi yok.</p>
        </div>
      )}

      <div className="space-y-3">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}
