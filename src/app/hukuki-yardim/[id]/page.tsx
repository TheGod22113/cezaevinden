'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  HiArrowLeft, HiCheckCircle, HiCheckBadge, HiClock,
  HiFlag, HiPaperAirplane, HiLockClosed, HiShieldCheck,
  HiChatBubbleLeft,
} from 'react-icons/hi2'

interface Answer {
  id: string
  content: string
  isOfficial: boolean
  helpful: number
  createdAt: string
  author: { name: string; username: string; role: string; verified: boolean }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  author: { name: string; username: string; role: string }
}

interface Question {
  id: string
  title: string
  content: string
  category: string
  isAnonymous: boolean
  isAnswered: boolean
  createdAt: string
  author: { name: string; username: string; role: string } | null
  answers: Answer[]
  comments: Comment[]
  _count: { answers: number }
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
  MAHKUM: 'Mahkum', AILE: 'Aile Üyesi', AVUKAT: 'Avukat',
  TAHLIYE: 'Tahliye Olan', GONULLU: 'Gönüllü', ADMIN: 'Yönetici',
}

export default function LegalQuestionPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [answerText, setAnswerText] = useState('')
  const [commentText, setCommentText] = useState('')
  const [sendingAnswer, setSendingAnswer] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [error, setError] = useState('')

  const user = session?.user as any
  const isLawyer = user?.role === 'AVUKAT' || user?.role === 'ADMIN'

  useEffect(() => {
    fetch(`/api/legal/${id}`)
      .then(r => r.json())
      .then(data => { setQuestion(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerText.trim()) return
    setSendingAnswer(true)
    setError('')
    try {
      const res = await fetch(`/api/legal/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerText.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Bir hata oluştu')
      } else {
        const newAnswer = await res.json()
        setQuestion(prev => prev ? { ...prev, answers: [...prev.answers, newAnswer], isAnswered: true } : prev)
        setAnswerText('')
      }
    } catch { setError('Bir hata oluştu') }
    setSendingAnswer(false)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSendingComment(true)
    setError('')
    try {
      const res = await fetch(`/api/legal/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Bir hata oluştu')
      } else {
        const newComment = await res.json()
        setQuestion(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev)
        setCommentText('')
      }
    } catch { setError('Bir hata oluştu') }
    setSendingComment(false)
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-400">Yükleniyor...</div>
  if (!question || (question as any).error) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-500 mb-4">Soru bulunamadı.</p>
      <Link href="/hukuki-yardim" className="text-navy-700 font-medium hover:underline">← Geri Dön</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/hukuki-yardim" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700 mb-4">
        <HiArrowLeft className="w-4 h-4" /> Hukuki Yardım
      </Link>

      {/* Soru */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900">{question.title}</h1>
          {question.isAnswered && (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex-shrink-0 font-medium">
              <HiCheckCircle className="w-3.5 h-3.5" /> Yanıtlandı
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-4">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{question.category}</span>
          {!question.isAnonymous && question.author && (
            <span>{question.author.name} · {roleLabel[question.author.role] || question.author.role}</span>
          )}
          <span className="flex items-center gap-0.5"><HiClock className="w-3 h-3" /> {timeAgo(question.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{question.content}</p>
        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
          <HiShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">Yanıtlar bilgilendirme amaçlıdır, hukuki tavsiye yerine geçmez.</p>
        </div>
      </div>

      {/* Avukat Yanıtları */}
      {question.answers.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">{question.answers.length} Avukat Yanıtı</p>
          <div className="space-y-4">
            {question.answers.map((a, i) => (
              <div key={a.id} className={`card p-5 ${i === 0 ? 'border-l-4 border-green-400' : ''}`}>
                {i === 0 && (
                  <p className="text-xs text-green-600 font-semibold mb-3 flex items-center gap-1">
                    <HiCheckCircle className="w-3.5 h-3.5" /> En Faydalı Yanıt
                  </p>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {a.author.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-gray-900">{a.author.name}</span>
                      {a.author.verified && <HiCheckBadge className="w-4 h-4 text-blue-500" />}
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Avukat</span>
                    </div>
                    <p className="text-xs text-gray-400">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{a.content}</div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                  <button className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1">
                    <HiFlag className="w-3.5 h-3.5" /> Şikayet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yorumlar / Ek Sorular */}
      {question.comments.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-1.5">
            <HiChatBubbleLeft className="w-4 h-4" /> {question.comments.length} Yorum / Ek Soru
          </p>
          <div className="space-y-2">
            {question.comments.map(c => (
              <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-sm text-gray-700 mb-2">{c.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{c.author.name}</span>
                  <span>·</span>
                  <span>{roleLabel[c.author.role] || c.author.role}</span>
                  <span>·</span>
                  <span>{timeAgo(c.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Alanları */}
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {session ? (
        <div className="space-y-3">
          {/* Avukat Yanıt Formu */}
          {isLawyer && (
            <div className="card p-5 border-l-4 border-blue-400">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                <HiCheckBadge className="w-5 h-5 text-blue-500" /> Avukat Yanıtı Yaz
              </h3>
              <p className="text-xs text-gray-500 mb-3">Yanıtınız resmi avukat yanıtı olarak işaretlenecek.</p>
              <form onSubmit={handleAnswer}>
                <textarea
                  value={answerText}
                  onChange={e => setAnswerText(e.target.value)}
                  placeholder="Hukuki yanıtınızı yazın..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingAnswer || !answerText.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    <HiPaperAirplane className="w-4 h-4" />
                    {sendingAnswer ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Yorum / Ek Soru Formu (herkes) */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <HiChatBubbleLeft className="w-5 h-5 text-gray-500" />
              {isLawyer ? 'Ek Yorum Ekle' : 'Yorum Yap / Ek Soru Sor'}
            </h3>
            {!isLawyer && (
              <p className="text-xs text-gray-500 mb-3">
                Hukuki yanıt yalnızca avukatlar tarafından verilebilir. Siz ek soru sorabilir veya yorum yapabilirsiniz.
              </p>
            )}
            <form onSubmit={handleComment}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={isLawyer ? 'Yorumunuzu yazın...' : 'Sorunuzu veya yorumunuzu yazın...'}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-navy-700 mb-3"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sendingComment || !commentText.trim()}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-50"
                >
                  <HiPaperAirplane className="w-4 h-4" />
                  {sendingComment ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="card p-5 text-center">
          <p className="text-sm text-gray-500 mb-3 flex items-center justify-center gap-2">
            <HiLockClosed className="w-4 h-4" />
            Yorum yapmak veya soru sormak için giriş yapmanız gerekiyor.
          </p>
          <Link href="/giris" className="btn-primary px-6 py-2.5 text-sm">Giriş Yap</Link>
        </div>
      )}
    </div>
  )
}
