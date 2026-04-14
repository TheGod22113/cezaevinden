'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiPlus, HiTrash, HiPencil, HiEye, HiEyeSlash } from 'react-icons/hi2'
import { timeAgo } from '@/lib/utils'

export default function AdminHaberlerPage() {
  const [news, setNews]       = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]        = useState({ title: '', summary: '', content: '', category: 'Haber', imageUrl: '' })
  const [saving, setSaving]    = useState(false)

  const load = () => {
    fetch('/api/news?admin=true')
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setSaving(true)
    await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, published: true }),
    })
    setSaving(false)
    setShowForm(false)
    setForm({ title: '', summary: '', content: '', category: 'Haber', imageUrl: '' })
    load()
  }

  const toggle = async (id: string, published: boolean) => {
    await fetch(`/api/news/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return
    await fetch(`/api/news/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-gray-900">Haber Yönetimi</h1>
        </div>
        <button onClick={() => setShowForm(f => !f)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <HiPlus className="w-4 h-4" /> Yeni Haber
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Yeni Haber Ekle</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Başlık *"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="input-field" />
            <input type="text" placeholder="Özet *"
              value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
              className="input-field" />
            <textarea rows={5} placeholder="İçerik *"
              value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              className="input-field resize-none" />
            <input type="text" placeholder="Görsel URL (opsiyonel)"
              value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              className="input-field" />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="input-field">
              {['Haber', 'Duyuru', 'Mevzuat', 'Etkinlik'].map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={create} disabled={saving || !form.title || !form.content}
                className="btn-primary disabled:opacity-50">
                {saving ? 'Kaydediliyor…' : 'Yayınla'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-16" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {news.map(n => (
            <div key={n.id} className="card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{n.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <span>{n.category}</span>
                  <span>·</span>
                  <span>{timeAgo(n.createdAt)}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${n.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {n.published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/haberler/${n.id}`}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors">
                  <HiPencil className="w-4 h-4" />
                </Link>
                <button onClick={() => toggle(n.id, n.published)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy-700 transition-colors">
                  {n.published ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
                <button onClick={() => del(n.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {news.length === 0 && (
            <p className="text-center py-8 text-gray-400 text-sm">Henüz haber yok.</p>
          )}
        </div>
      )}
    </div>
  )
}
