'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { HiPaperAirplane, HiPhoto, HiEyeSlash } from 'react-icons/hi2'

const categories = ['Genel', 'Deneyim', 'Soru', 'Destek', 'Haber', 'Hukuki']

interface Props {
  onPost?: (post: any) => void
}

export default function PostComposer({ onPost }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [content, setContent]   = useState('')
  const [category, setCategory] = useState('Genel')
  const [anon, setAnon]         = useState(false)
  const [loading, setLoading]   = useState(false)

  const submit = async () => {
    if (!session) { router.push('/giris'); return }
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim(), category, isAnonymous: anon }),
    })
    if (res.ok) {
      const post = await res.json()
      setContent('')
      setAnon(false)
      onPost?.(post)
    }
    setLoading(false)
  }

  const user = session?.user as any

  return (
    <div className="card p-4 mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {user?.name?.charAt(0) ?? '?'}
        </div>
        <div className="flex-1">
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={session ? 'Düşüncelerinizi paylaşın…' : 'Paylaşım yapmak için giriş yapın'}
            className="input-field resize-none text-sm mb-2"
            onFocus={() => { if (!session) router.push('/giris') }}
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="post-category" className="sr-only">Gönderi kategorisi</label>
              <select
                id="post-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-navy-700"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)}
                  className="rounded border-gray-300 text-navy-700 focus:ring-navy-700 w-3.5 h-3.5" />
                <HiEyeSlash className="w-3.5 h-3.5" /> Anonim
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button aria-label="Fotoğraf ekle" className="p-1.5 rounded-lg text-gray-400 hover:text-navy-700 hover:bg-gray-100 transition-colors">
                <HiPhoto className="w-4 h-4" />
              </button>
              <button
                onClick={submit}
                disabled={loading || !content.trim()}
                className="btn-primary text-sm px-4 py-1.5 flex items-center gap-1.5 disabled:opacity-50"
              >
                <HiPaperAirplane className="w-3.5 h-3.5" />
                {loading ? 'Paylaşılıyor…' : 'Paylaş'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
