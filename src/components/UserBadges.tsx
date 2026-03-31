'use client'

import { useEffect, useState } from 'react'

interface Badge {
  id: string
  type: string
  awardedAt: string
  meta: { label: string; emoji: string; desc: string; color: string }
}

export default function UserBadges({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    if (!userId) return
    fetch(`/api/badges?userId=${userId}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBadges(d) })
      .catch(() => {})
  }, [userId])

  if (badges.length === 0) return null

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Rozetler</p>
      <div className="flex flex-wrap gap-2">
        {badges.map(b => (
          <div
            key={b.id}
            title={b.meta.desc}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${b.meta.color} cursor-default`}
          >
            <span>{b.meta.emoji}</span>
            <span>{b.meta.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
