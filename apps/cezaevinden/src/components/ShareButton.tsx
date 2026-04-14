'use client'

import { useState } from 'react'
import { HiShare, HiLink, HiCheckCircle } from 'react-icons/hi2'

export default function ShareButton({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const fullUrl = `${window.location.origin}${url}`

    if (navigator.share) {
      await navigator.share({ title, url: fullUrl })
    } else {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button onClick={share}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-700 transition-colors">
      {copied
        ? <><HiCheckCircle className="w-4 h-4 text-green-500" /> Kopyalandı!</>
        : <><HiShare className="w-4 h-4" /> Paylaş</>
      }
    </button>
  )
}
