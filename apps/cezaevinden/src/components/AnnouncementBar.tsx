'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiXMark, HiMegaphone } from 'react-icons/hi2'

interface Announcement {
  id: string
  text: string
  link: string | null
  linkText: string | null
  color: string
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAnnouncements(data) })
      .catch(() => {})
  }, [])

  const active = announcements.find(a => !dismissed.has(a.id))
  if (!active) return null

  return (
    <div className={`${active.color} text-sm py-2 px-4 flex items-center justify-center gap-2 relative`}>
      <HiMegaphone className="w-4 h-4 flex-shrink-0" />
      <span>
        {active.text}
        {active.link && active.linkText && (
          <Link href={active.link} className="font-bold underline underline-offset-2 ml-1">
            {active.linkText}
          </Link>
        )}
      </span>
      <button
        onClick={() => setDismissed(p => { const s = new Set(p); s.add(active.id); return s })}
        aria-label="Duyuruyu kapat"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  )
}
