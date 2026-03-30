'use client'

import Link from 'next/link'
import { HiHome, HiArrowLeft } from 'react-icons/hi2'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-navy-700 opacity-10 mb-4">404</div>
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-gray-500 mb-8">
          Aradığınız sayfa kaldırılmış, taşınmış ya da hiç var olmamış olabilir.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <HiHome className="w-4 h-4" /> Ana Sayfa
          </Link>
          <button onClick={() => history.back()} className="btn-secondary flex items-center gap-2">
            <HiArrowLeft className="w-4 h-4" /> Geri Dön
          </button>
        </div>
      </div>
    </div>
  )
}
