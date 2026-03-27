'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  HiBell, HiHeart, HiChatBubbleOvalLeft, HiUserPlus,
  HiScale, HiSpeakerphone, HiCheckCircle, HiArrowLeft,
  HiEllipsisHorizontal,
} from 'react-icons/hi2'

type NotifType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'LEGAL_ANSWER' | 'MENTION' | 'SYSTEM'

interface Notif {
  id: string
  type: NotifType
  message: string
  link?: string
  isRead: boolean
  time: string
  actor?: string
  actorRole?: string
}

const mockNotifs: Notif[] = [
  { id: '1', type: 'LEGAL_ANSWER', message: 'Av. Mehmet Yılmaz hukuki sorunuzu yanıtladı', link: '/hukuki-yardim', isRead: false, time: '5 dk önce', actor: 'Av. Mehmet Yılmaz', actorRole: 'Avukat' },
  { id: '2', type: 'LIKE',         message: 'Ahmet Kaya gönderinizi beğendi', link: '/',              isRead: false, time: '12 dk önce', actor: 'Ahmet Kaya', actorRole: 'Tahliye' },
  { id: '3', type: 'COMMENT',      message: 'Fatma Yıldız gönderinize yorum yaptı: "Çok faydalı bilgi, teşekkürler!"', link: '/', isRead: false, time: '1 saat önce', actor: 'Fatma Yıldız', actorRole: 'Aile' },
  { id: '4', type: 'FOLLOW',       message: 'Mustafa Çelik sizi takip etmeye başladı', link: '/profil/mustafacelik', isRead: false, time: '2 saat önce', actor: 'Mustafa Çelik', actorRole: 'Gönüllü' },
  { id: '5', type: 'MENTION',      message: 'Bir forum konusunda sizden bahsedildi', link: '/forum',   isRead: true,  time: '5 saat önce' },
  { id: '6', type: 'SYSTEM',       message: 'Denetimli serbestlik hakkında yeni bir haber yayınlandı', link: '/haberler', isRead: true, time: '1 gün önce' },
  { id: '7', type: 'LIKE',         message: 'Hukuki Destek Derneği gönderinizi beğendi', link: '/',   isRead: true,  time: '1 gün önce', actor: 'Hukuk Destek Derneği', actorRole: 'Kurum' },
  { id: '8', type: 'SYSTEM',       message: 'Hoş geldiniz! Profilinizi tamamlayarak daha fazla kişiye ulaşın.', link: '/profil/ayarlar', isRead: true, time: '3 gün önce' },
  { id: '9', type: 'LEGAL_ANSWER', message: 'Av. Ayşe Demir hukuki sorunuzu yanıtladı', link: '/hukuki-yardim', isRead: true, time: '4 gün önce', actor: 'Av. Ayşe Demir', actorRole: 'Avukat' },
]

const iconMap: Record<NotifType, { icon: any; bg: string; color: string }> = {
  LIKE:         { icon: HiHeart,              bg: 'bg-red-100',    color: 'text-red-500'    },
  COMMENT:      { icon: HiChatBubbleOvalLeft, bg: 'bg-blue-100',   color: 'text-blue-500'   },
  FOLLOW:       { icon: HiUserPlus,           bg: 'bg-green-100',  color: 'text-green-500'  },
  LEGAL_ANSWER: { icon: HiScale,              bg: 'bg-navy-100',   color: 'text-navy-700'   },
  MENTION:      { icon: HiSpeakerphone,       bg: 'bg-yellow-100', color: 'text-yellow-600' },
  SYSTEM:       { icon: HiBell,               bg: 'bg-gray-100',   color: 'text-gray-500'   },
}

const filters = ['Tümü', 'Okunmamış', 'Beğeniler', 'Yorumlar', 'Hukuki', 'Takip']

export default function BildirimlerPage() {
  const [notifs, setNotifs]   = useState<Notif[]>(mockNotifs)
  const [activeFilter, setActiveFilter] = useState('Tümü')

  const unread = notifs.filter(n => !n.isRead).length

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })))

  const markRead = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))

  const filtered = notifs.filter(n => {
    if (activeFilter === 'Okunmamış') return !n.isRead
    if (activeFilter === 'Beğeniler') return n.type === 'LIKE'
    if (activeFilter === 'Yorumlar')  return n.type === 'COMMENT'
    if (activeFilter === 'Hukuki')    return n.type === 'LEGAL_ANSWER'
    if (activeFilter === 'Takip')     return n.type === 'FOLLOW'
    return true
  })

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
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <HiBell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Bildirim yok</p>
          </div>
        )}

        {filtered.map(notif => {
          const { icon: Icon, bg, color } = iconMap[notif.type]
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-4 hover:bg-gray-50 transition-all cursor-pointer group ${
                !notif.isRead ? 'bg-blue-50/40' : ''
              }`}
              onClick={() => markRead(notif.id)}
            >
              {/* İkon */}
              <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>

              {/* İçerik */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {notif.actor && (
                    <span className="font-bold">{notif.actor} </span>
                  )}
                  {notif.actor
                    ? notif.message.replace(notif.actor + ' ', '')
                    : notif.message
                  }
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {notif.actorRole && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {notif.actorRole}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
              </div>

              {/* Okunmamış nokta */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 bg-navy-700 rounded-full" />
                )}
                <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                  <HiEllipsisHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
