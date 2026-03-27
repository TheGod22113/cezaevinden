'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiXMark, HiSpeakerphone } from 'react-icons/hi2'

const announcements = [
  { id: '1', text: '🎉 Platform beta sürümünde! Geri bildirimleriniz için ', link: '/iletisim', linkText: 'tıklayın', color: 'bg-gold-500 text-navy-800' },
  { id: '2', text: '⚖️ Yeni gönüllü avukatlar platforma katıldı. Hukuki sorularınız için ', link: '/hukuki-yardim', linkText: 'Hukuki Yardım', color: 'bg-green-600 text-white' },
]

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const active = announcements.filter(a => !dismissed.has(a.id))[0]

  if (!active) return null

  return (
    <div className={`${active.color} text-sm py-2 px-4 flex items-center justify-center gap-2 relative`}>
      <HiSpeakerphone className="w-4 h-4 flex-shrink-0" />
      <span>
        {active.text}
        <Link href={active.link} className="font-bold underline underline-offset-2">{active.linkText}</Link>
      </span>
      <button
        onClick={() => setDismissed(p => new Set([...p, active.id]))}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  )
}
