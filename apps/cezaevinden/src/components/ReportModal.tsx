'use client'

import { useState } from 'react'
import { HiFlag, HiXMark, HiCheckCircle } from 'react-icons/hi2'

const reasons = [
  'Spam veya reklam içeriği',
  'Taciz veya tehdit',
  'Yanlış/yanıltıcı bilgi',
  'Uygunsuz içerik',
  'Nefret söylemi',
  'Diğer',
]

interface Props {
  postId?: string
  userId?: string
  onClose: () => void
}

export default function ReportModal({ postId, userId, onClose }: Props) {
  const [selected, setSelected] = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  const submit = async () => {
    if (!selected) return
    setLoading(true)
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, reportedUserId: userId, reason: selected }),
    })
    setLoading(false)
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <HiFlag className="w-5 h-5 text-red-500" /> Şikayet Et
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <HiXMark className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          {done ? (
            <div className="text-center py-6">
              <HiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-800">Şikayetiniz alındı.</p>
              <p className="text-sm text-gray-500">Ekibimiz inceleyecektir.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-3">Şikayet nedeninizi seçin:</p>
              <div className="space-y-2">
                {reasons.map(r => (
                  <label key={r} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={selected === r}
                      onChange={() => setSelected(r)}
                      className="text-navy-700 focus:ring-navy-700"
                    />
                    <span className="text-sm text-gray-700">{r}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={submit}
                disabled={!selected || loading}
                className="btn-primary w-full mt-4 disabled:opacity-50">
                {loading ? 'Gönderiliyor…' : 'Şikayet Gönder'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
