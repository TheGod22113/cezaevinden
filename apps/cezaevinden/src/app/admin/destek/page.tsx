'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiPlus, HiTrash, HiCheckCircle } from 'react-icons/hi2'

export default function AdminDestekPage() {
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'Hukuki Yardım',
    city: '', phone: '', email: '', website: '',
  })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/support')
      .then(r => r.json())
      .then(d => { setResources(Array.isArray(d) ? d : []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    setSaving(true)
    await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, verified: true }),
    })
    setSaving(false)
    setShowForm(false)
    setForm({ name: '', description: '', category: 'Hukuki Yardım', city: '', phone: '', email: '', website: '' })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await fetch(`/api/support/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-black text-gray-900">Destek Kaynakları</h1>
        </div>
        <button onClick={() => setShowForm(f => !f)} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <HiPlus className="w-4 h-4" /> Yeni Kaynak
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Yeni Destek Kaynağı</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Kuruluş Adı *" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" />
            <select value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
              {['Hukuki Yardım','Barınma','Psikolojik','İş & Kariyer','Maddi Yardım'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Şehir" value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field" />
            <input placeholder="Telefon" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" />
            <input placeholder="E-posta" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" />
            <input placeholder="Web Sitesi" value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="input-field" />
            <textarea placeholder="Açıklama *" value={form.description} rows={3}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="input-field resize-none sm:col-span-2" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={create} disabled={saving || !form.name || !form.description}
              className="btn-primary disabled:opacity-50">
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              İptal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-14" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map(r => (
            <div key={r.id} className="card p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  {r.verified && <HiCheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{r.category}</span>
                  {r.city && <><span>·</span><span>{r.city}</span></>}
                </div>
              </div>
              <button onClick={() => del(r.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                <HiTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {resources.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">Kaynak bulunamadı.</p>}
        </div>
      )}
    </div>
  )
}
