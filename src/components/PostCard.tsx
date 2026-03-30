'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiHeart, HiOutlineHeart, HiChatBubbleOvalLeft,
  HiBookmark, HiOutlineBookmark, HiFlag, HiEllipsisHorizontal, HiLockClosed,
} from 'react-icons/hi2'
import { timeAgo, roleLabels, roleBadgeClasses } from '@/lib/utils'
import ShareButton from './ShareButton'

export interface PostData {
  id: string
  content: string
  category?: string
  isAnonymous: boolean
  isPinned?: boolean
  imageUrl?: string | null
  createdAt: string
  author: {
    name: string
    username?: string
    role: string
    verified?: boolean
  } | null
  _count?: {
    likes?: number
    comments?: number
    shares?: number
    bookmarks?: number
  }
}

export default function PostCard({ post }: { post: PostData }) {
  const [liked, setLiked]   = useState(false)
  const [saved, setSaved]   = useState(false)
  const [menu, setMenu]     = useState(false)

  const likes    = (post._count?.likes    ?? 0) + (liked ? 1 : 0)
  const comments = post._count?.comments  ?? 0

  const authorName = post.isAnonymous || !post.author ? 'Anonim Kullanıcı' : post.author.name
  const authorUser = post.isAnonymous || !post.author ? null : post.author.username
  const roleClass  = post.author?.role ? (roleBadgeClasses[post.author.role] ?? 'bg-gray-100 text-gray-700') : ''
  const roleLabel  = post.author?.role ? (roleLabels[post.author.role] ?? post.author.role) : ''

  const toggleLike = async () => {
    setLiked(l => !l)
    await fetch(`/api/posts/${post.id}/like`, { method: 'POST' }).catch(() => {})
  }

  const toggleSave = async () => {
    setSaved(s => !s)
    await fetch(`/api/posts/${post.id}/bookmark`, { method: 'POST' }).catch(() => {})
  }

  return (
    <article className="card p-4 hover:shadow-md transition-shadow">
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs text-gold-600 font-medium mb-3">
          📌 Sabitlenmiş Gönderi
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${post.isAnonymous ? 'bg-gray-400' : 'bg-navy-700'}`}>
            {post.isAnonymous ? <HiLockClosed className="w-5 h-5" /> : (post.author?.name?.charAt(0) ?? '?')}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {authorUser
                ? <Link href={`/profil/${authorUser}`} className="font-semibold text-gray-900 text-sm hover:underline">{authorName}</Link>
                : <span className={`font-semibold text-sm ${post.isAnonymous ? 'text-gray-500 italic' : 'text-gray-900'}`}>{authorName}</span>
              }
              {!post.isAnonymous && post.author?.verified && (
                <span className="text-blue-500 text-xs">✓</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {!post.isAnonymous && post.author?.role && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleClass}`}>
                  {roleLabel}
                </span>
              )}
              {post.category && <span className="text-xs text-gray-400">· {post.category}</span>}
              <span className="text-xs text-gray-400">· {timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setMenu(m => !m)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <HiEllipsisHorizontal className="w-5 h-5" />
          </button>
          {menu && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 w-40">
              <Link href={`/${post.id}`} onClick={() => setMenu(false)}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Gönderiyi Aç
              </Link>
              <button
                onClick={() => { setMenu(false) }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2">
                <HiFlag className="w-3.5 h-3.5" /> Şikayet Et
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/${post.id}`}>
        <p className="text-gray-800 text-sm leading-relaxed mb-3 line-clamp-4 hover:line-clamp-none transition-all">
          {post.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <button onClick={toggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              liked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'
            }`}>
            {liked ? <HiHeart className="w-4 h-4" /> : <HiOutlineHeart className="w-4 h-4" />}
            {likes > 0 && <span>{likes}</span>}
          </button>

          <Link href={`/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all">
            <HiChatBubbleOvalLeft className="w-4 h-4" />
            {comments > 0 && <span>{comments}</span>}
          </Link>

          <ShareButton title="Gönderiyi Paylaş" url={`/${post.id}`} />
        </div>

        <button onClick={toggleSave}
          className={`p-2 rounded-lg transition-all ${saved ? 'text-gold-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}>
          {saved ? <HiBookmark className="w-4 h-4" /> : <HiOutlineBookmark className="w-4 h-4" />}
        </button>
      </div>
    </article>
  )
}
