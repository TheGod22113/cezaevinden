'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  HiBell, HiHeart, HiChatBubbleOvalLeft, HiUserPlus,
  HiScale, HiMegaphone, HiCheckCircle, HiArrowLeft,
} from 'react-icons/hi2'

type NotifType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'LEGAL_ANSWER' | 'MENTION' | 'SYSTEM'

interface Notif {
  id: string
  type: NotifType
  message: string
  link?: string | null
  read: boolean
  createdAt: string
}

const iconMap: Record<NotifType, { icon: any; bg: string; color: string }> = {
  LIKE:         { icon: HiHeart,              bg: 'bg-red-100',    color: 'text-red-500'    },
  COMMENT:      { icon: HiChatBubbleOvalLeft, bg: 'bg-blue-100',   color: 'text-blue-500'   },
  FOLLOW:       { icon: HiUserPlus,           bg: 'bg-green-100',  color: 'text-green-500'  },
  LEGAL_ANSWER: { icon: HiScale,              bg: 'bg-navy-100',   color: 'text-navy-700'   },
  MENTION:      { icon: HiMegaphone,          bg: 'bg-yellow-100', color: 'text-yellow-600' },
  SYSTEM:       { icon: HiBell,               bg: 'bg-gray-100',   color: 'text-gray-500'   },
}

const filters = ['Tümü', 'Okunmamış', 'Beğeniler', 'Yorumlar', 'Hukuki', 'Takip']

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Az önce'
  if (m < 60) return `${m} dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} saat önce`
  return `${Math.floor(h / 24)} gün önce`
}

export default function BildirimlerPage() {
  const { data: session } = useSession()
  const [notifs, setNotifs]         = useState<Notif[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState('Tümü')

  useEffect(() => {
    if (!session) { setLoading(false); return }
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => { setNotifs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [session])

  const unread = notifs.filter(n => !n.read).length

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' }).catch(() => {})
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' }).catch(() => {})
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const filtered = notifs.filter(n => {
    if (activeFilter === 'Okunmamış') return !n.read
    if (activeFilter === 'Beğeniler') return n.type === 'LIKE'
    if (activeFilter === 'Yorumlar')  return n.type === 'COMMENT'
    if (activeFilter === 'Hukuki')    return n.type === 'LEGAL_ANSWER'
    if (activeFilter === 'Takip')     return n.type === 'FOLLOW'
    return true
  })

  if (!session) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">
      <HiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
      <p className="font-medium mb-2">Bildirimleri görmek için giriş yapın</p>
      <Link href="/giris" className="text-navy-700 font-semibold hover:underline">Giriş Yap</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">Bildirimler</h1>
              {unread > 0 && (
                <span className="bg-crimson-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{unread} okunmamış bildirim</p>
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-navy-700 font-medium hover:underline"
          >
            <HiCheckCircle className="w-4 h-4" /> Tümünü okundu say
          </button>
        )}
      </div>

      {/* Filtreler */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              activeFilter === f ? 'bg-navy-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Bildirim Listesi */}
      <div className="card divide-y divide-gray-50 overflow-hidden">
        {loading && (
          <div className="py-16 text-center text-gray-400">
            <HiBell className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
            <p>Yükleniyor...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <HiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Bildirim yok</p>
          </div>
        )}

        {filtered.map(notif => {
          const { icon: Icon, bg, color } = iconMap[notif.type] || iconMap.SYSTEM
          const content = (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-all cursor-pointer ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
              onClick={() => markRead(notif.id)}
            >
              <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {notif.message}
                </p>
                <span className="text-xs text-gray-400">{timeAgo(notif.createdAt)}</span>
              </div>
              {!notif.read && (
                <span className="w-2.5 h-2.5 bg-navy-700 rounded-full flex-shrink-0 mt-1" />
              )}
            </div>
          )

          return notif.link ? (
            <Link key={notif.id} href={notif.link}>{content}</Link>
          ) : (
            <div key={notif.id}>{content}</div>
          )
        })}
      </div>
    </div>
  )
}
