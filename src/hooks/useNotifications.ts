'use client'

import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export function useNotifications(enabled = true) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [loading, setLoading]             = useState(false)

  const fetch_ = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data: Notification[] = await res.json()
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.read).length)
      }
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 30_000) // poll every 30s
    return () => clearInterval(interval)
  }, [fetch_])

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, loading, markAllRead, refetch: fetch_ }
}
