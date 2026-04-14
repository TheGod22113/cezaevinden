'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiXMark } from 'react-icons/hi2'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')
    if (!accepted) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-navy-800 text-white rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-blue-100 flex-1">
          🍪 Platforma daha iyi hizmet vermek için zorunlu çerezler kullanıyoruz.
          <Link href="/cerez" className="text-gold-400 hover:underline ml-1">Çerez Politikası</Link>
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={accept}
            className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-800 font-bold text-sm rounded-xl transition-colors">
            Kabul Et
          </button>
          <button onClick={() => setShow(false)}
            className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
