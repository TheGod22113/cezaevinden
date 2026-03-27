'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  HiHeart, HiOutlineHeart, HiBookmark, HiOutlineBookmark,
  HiChatBubbleLeftRight, HiArrowLeft, HiFlag, HiPaperAirplane,
} from 'react-icons/hi2'
import { timeAgo, roleLabels, roleColors } from '@/lib/utils'
import ShareButton from '@/components/ShareButton'
import { PostSkeleton } from '@/components/Skeleton'

interface Comment {
  id: string
  content: string
  isAnonymous: boolean
  createdAt: string
  author: { name: string; username: string; role: string; verified: boolean } | null
  _count: { likes: number }
}

interface Post {
  id: string
  content: string
  category: string
  isAnonymous: boolean
  createdAt: string
  author: { name: string; username: string; role: string; verified: boolean } | null
  _count: { likes: number; comments: number; bookmarks: number }
}

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost]         = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading]   = useState(true)
  const [liked, setLiked]       = useState(false)
  const [saved, setSaved]       = useState(false)
  const [reply, setReply]       = useState('')
  const [anon, setAnon]         = useState(false)
  const [sending, setSending]   = useState(false)

  useEffect(() => {
    const load = async () => {
      const [postRes, commRes] = await Promise.all([
        fetch(`/api/posts/${postId}`),
        fetch(`/api/posts/${postId}/comments`),
      ])
      if (postRes.ok) setPost(await postRes.json())
      if (commRes.ok) setComments(await commRes.json())
      setLoading(false)
    }
    load()
  }, [postId])

  const sendReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: reply, isAnonymous: anon }),
    })
    if (res.ok) {
      const c = await res.json()
      setComments(prev => [c, ...prev])
      setReply('')
    }
    setSending(false)
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PostSkeleton /><PostSkeleton /><PostSkeleton />
    </div>
  )

  if (!post) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Bu gönderi bulunamadı veya silinmiş.</p>
      <Link href="/" className="btn-primary mt-4 inline-block">Ana Sayfaya Dön</Link>
    </div>
  )

  const authorName = post.isAnonymous ? 'Anonim Kullanıcı' : (post.author?.name ?? 'Bilinmiyor')
  const authorUsername = post.isAnonymous ? null : post.author?.username

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy-700 mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Geri dön
      </Link>

      {/* Post */}
      <div className="card p-5 mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-navy-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {post.isAnonymous ? '?' : (post.author?.name?.charAt(0) ?? '?')}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {authorUsername
                ? <Link href={`/profil/${authorUsername}`} className="font-bold text-gray-900 hover:underline">{authorName}</Link>
                : <span className="font-bold text-gray-500 italic">{authorName}</span>
              }
              {!post.isAnonymous && post.author?.role && (
                <span className={`badge-${roleColors[post.author.role] ?? 'gray'} text-xs`}>
                  {roleLabels[post.author.role] ?? post.author.role}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
          <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{post.category}</span>
        </div>

        <p className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">{post.content}</p>

        <div className="flex items-center gap-5 pt-3 border-t border-gray-100">
          <button onClick={() => setLiked(l => !l)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-crimson-600' : 'text-gray-500 hover:text-crimson-600'}`}>
            {liked ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
            <span>{post._count.likes + (liked ? 1 : 0)}</span>
          </button>

          <span className="flex items-center gap-1.5 text-sm text-gray-500">
            <HiChatBubbleLeftRight className="w-5 h-5" />
            <span>{comments.length}</span>
          </span>

          <button onClick={() => setSaved(s => !s)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${saved ? 'text-gold-500' : 'text-gray-500 hover:text-gold-500'}`}>
            {saved ? <HiBookmark className="w-5 h-5" /> : <HiOutlineBookmark className="w-5 h-5" />}
          </button>

          <div className="ml-auto">
            <ShareButton title={authorName + ' paylaştı'} url={`/${postId}`} />
          </div>

          <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <HiFlag className="w-4 h-4" /> Şikayet
          </button>
        </div>
      </div>

      {/* Reply box */}
      <div className="card p-4 mb-4">
        <textarea
          rows={3}
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Yanıtınızı yazın…"
          className="input-field resize-none mb-2"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)}
              className="rounded border-gray-300 text-navy-700 focus:ring-navy-700" />
            Anonim yanıtla
          </label>
          <button onClick={sendReply} disabled={sending || !reply.trim()}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-50">
            <HiPaperAirplane className="w-4 h-4" />
            {sending ? 'Gönderiliyor…' : 'Yanıtla'}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Henüz yanıt yok. İlk yanıtı siz yazın!</p>
        )}
        {comments.map(c => {
          const cName = c.isAnonymous ? 'Anonim' : (c.author?.name ?? 'Bilinmiyor')
          const cUser = c.isAnonymous ? null : c.author?.username
          return (
            <div key={c.id} className="card p-4 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm flex-shrink-0">
                {c.isAnonymous ? '?' : (c.author?.name?.charAt(0) ?? '?')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {cUser
                    ? <Link href={`/profil/${cUser}`} className="text-sm font-semibold text-gray-900 hover:underline">{cName}</Link>
                    : <span className="text-sm font-semibold text-gray-500 italic">{cName}</span>
                  }
                  {!c.isAnonymous && c.author?.role && (
                    <span className={`badge-${roleColors[c.author.role] ?? 'gray'} text-xs`}>
                      {roleLabels[c.author.role] ?? c.author.role}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
