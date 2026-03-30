'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  HiArrowLeft, HiChatBubbleLeftRight, HiEye, HiHandThumbUp,
  HiCheckBadge, HiLockClosed, HiShieldCheck, HiPaperAirplane,
} from 'react-icons/hi2'

interface Reply {
  id: string
  content: string
  isAnonymous: boolean
  isSolution: boolean
  createdAt: string
  author: { name: string; username: string; role: string; verified: boolean } | null
  _count: { likes: number }
}

interface Topic {
  id: string
  title: string
  content: string
  category: string
  isAnonymous: boolean
  isPinned: boolean
  isSolved: boolean
  views: number
  createdAt: string
  author: { name: string; username: string; role: string; verified: boolean } | null
  replies: Reply[]
  _count: { replies: number }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'az önce'
  if (m < 60) return `${m} dakika önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat önce`
  return `${Math.floor(h / 24)} gün önce`
}

const roleLabel: Record<string, string> = {
  MAHKUM: 'Mahkum', AILE: 'Aile', AVUKAT: 'Avukat',
  TAHLIYE: 'Tahliye Olan', GONULLU: 'Gönüllü', ADMIN: 'Yönetici',
}
const roleColor: Record<string, string> = {
  MAHKUM: 'bg-red-100 text-red-700', AILE: 'bg-blue-100 text-blue-700',
  AVUKAT: 'bg-purple-100 text-purple-700', TAHLIYE: 'bg-green-100 text-green-700',
  GONULLU: 'bg-orange-100 text-orange-700', ADMIN: 'bg-gray-100 text-gray-700',
}

export default function ForumTopicPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/forum/${id}`)
      .then(r => r.json())
      .then(data => { setTopic(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: reply.trim(), isAnonymous: anonymous }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Bir hata oluştu')
      } else {
        const newReply = await res.json()
        setTopic(prev => prev
          ? { ...prev, replies: [...prev.replies, newReply], _count: { replies: prev._count.replies + 1 } }
          : prev)
        setReply('')
      }
    } catch {
      setError('Bir hata oluştu')
    }
    setSending(false)
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Yükleniyor...</div>
  )
  if (!topic || (topic as any).error) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 mb-4">Konu bulunamadı.</p>
      <Link href="/forum" className="text-navy-700 font-medium hover:underline">← Foruma Dön</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/forum" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700 mb-4">
        <HiArrowLeft className="w-4 h-4" /> Foruma Dön
      </Link>

      {/* Konu */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-navy-50 text-navy-700 rounded-full text-xs font-medium">{topic.category}</span>
            {topic.isPinned && <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">📌 Sabitlenmiş</span>}
            {topic.isSolved && <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Çözüldü</span>}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(topic.createdAt)}</span>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">{topic.title}</h1>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-5">{topic.content}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {topic.isAnonymous || !topic.author ? (
            <span className="text-sm text-gray-500 flex items-center gap-1.5">
              <HiLockClosed className="w-4 h-4" /> Anonim
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-white text-sm font-bold">
                {topic.author.name[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                  {topic.author.name}
                  {topic.author.verified && <HiShieldCheck className="w-4 h-4 text-purple-500" />}
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded ${roleColor[topic.author.role] || 'bg-gray-100 text-gray-600'}`}>
                  {roleLabel[topic.author.role] || topic.author.role}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><HiEye className="w-4 h-4" /> {topic.views}</span>
            <span className="flex items-center gap-1"><HiChatBubbleLeftRight className="w-4 h-4" /> {topic._count.replies}</span>
          </div>
        </div>
      </div>

      {/* Cevaplar */}
      {topic.replies.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {topic._count.replies} Cevap
          </h2>
          <div className="space-y-3">
            {topic.replies.map(r => (
              <div key={r.id} className={`card p-5 ${r.isSolution ? 'border-l-4 border-green-500' : ''}`}>
                {r.isSolution && (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium mb-3">
                    <HiCheckBadge className="w-4 h-4" /> Çözüm olarak işaretlendi
                  </div>
                )}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{r.content}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {r.isAnonymous || !r.author ? (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <HiLockClosed className="w-3 h-3" /> Anonim
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-bold">
                        {r.author.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{r.author.name}</span>
                      {r.author.verified && <HiShieldCheck className="w-3.5 h-3.5 text-purple-500" />}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${roleColor[r.author.role] || 'bg-gray-100 text-gray-600'}`}>
                        {roleLabel[r.author.role] || r.author.role}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><HiHandThumbUp className="w-3.5 h-3.5" /> {r._count.likes}</span>
                    <span>{timeAgo(r.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cevap Formu */}
      {session ? (
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-3">Cevap Yaz</h3>
          <form onSubmit={handleReply}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Cevabınızı yazın..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-700 mb-3"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={e => setAnonymous(e.target.checked)}
                  className="rounded"
                />
                Anonim olarak gönder
              </label>
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-50"
              >
                <HiPaperAirplane className="w-4 h-4" />
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card p-5 text-center">
          <p className="text-gray-500 mb-3">Cevap yazabilmek için giriş yapmanız gerekiyor.</p>
          <Link href="/giris" className="btn-primary px-6 py-2.5 text-sm">Giriş Yap</Link>
        </div>
      )}
    </div>
  )
}
