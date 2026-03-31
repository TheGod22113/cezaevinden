'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HiBell } from 'react-icons/hi2'
import { useNotifications } from '@/hooks/useNotifications'
import { timeAgo } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export default function NotificationBell() {
  const { data: session } = useSession()
  const { notifications, unreadCount, markAllRead } = useNotifications(!!session)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!session) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Bildirimler"
      >
        <HiBell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crimson-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-bold text-gray-900">Bildirimler</span>
            <Link href="/bildirimler" onClick={() => setOpen(false)}
              aria-label="Tüm bildirimleri görüntüle"
              className="text-xs text-navy-700 hover:underline font-semibold">
              Tüm Bildirimler
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.slice(0, 8).map(n => (
              <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-blue-50' : ''}`}>
                {n.link
                  ? <Link href={n.link} onClick={() => setOpen(false)} className="block">
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </Link>
                  : <>
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </>
                }
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">Bildirim yok.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
