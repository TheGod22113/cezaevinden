'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { HiMagnifyingGlass, HiCheckBadge } from 'react-icons/hi2'
import { roleLabels, roleColors } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

interface User {
  name: string
  username: string
  bio: string | null
  role: string
  verified: boolean
  _count: { followers: number }
}

export default function UserSearchDropdown() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<User[]>([])
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const debouncedQ            = useDebounce(query, 300)
  const ref                   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!debouncedQ || debouncedQ.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    fetch(`/api/users/search?q=${encodeURIComponent(debouncedQ)}`)
      .then(r => r.json())
      .then(d => { setResults(d); setOpen(true) })
      .finally(() => setLoading(false))
  }, [debouncedQ])

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="relative">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Kullanıcı ara…"
          className="input-field pl-9 text-sm"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-navy-700 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {results.map(u => (
            <Link
              key={u.username}
              href={`/profil/${u.username}`}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 bg-navy-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-gray-900 truncate">{u.name}</span>
                  {u.verified && <HiCheckBadge className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">@{u.username}</span>
                  <span className={`text-xs badge-${roleColors[u.role] ?? 'gray'}`}>
                    {roleLabels[u.role] ?? u.role}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{u._count.followers} takipçi</span>
            </Link>
          ))}
        </div>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 px-4 py-3 text-sm text-gray-400">
          Sonuç bulunamadı.
        </div>
      )}
    </div>
  )
}
