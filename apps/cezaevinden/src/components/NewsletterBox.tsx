'use client'

import { useState } from 'react'
import { HiEnvelope, HiCheckCircle } from 'react-icons/hi2'

export default function NewsletterBox() {
  const [email, setEmail]   = useState('')
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setDone(true)
    } catch { /* ignore */ }
    setLoading(false)
  }

  return (
    <div className="bg-navy-700 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-2">
        <HiEnvelope className="w-5 h-5 text-gold-500" />
        <h3 className="font-bold text-lg">Haberdar Ol</h3>
      </div>
      <p className="text-sm text-navy-200 mb-4">
        Hukuki değişiklikler, haberler ve topluluk güncellemeleri için bültenimize abone olun.
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-green-300 font-semibold text-sm">
          <HiCheckCircle className="w-5 h-5" />
          Abone oldunuz! Teşekkürler.
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            className="flex-1 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? '…' : 'Abone Ol'}
          </button>
        </form>
      )}
    </div>
  )
}
