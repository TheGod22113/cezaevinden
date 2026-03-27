'use client'

import { useEffect } from 'react'
import { HiArrowPath } from 'react-icons/hi2'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h1>
        <p className="text-gray-500 mb-6">Beklenmeyen bir sorun meydana geldi. Lütfen tekrar deneyin.</p>
        <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
          <HiArrowPath className="w-4 h-4" /> Tekrar Dene
        </button>
      </div>
    </div>
  )
}
