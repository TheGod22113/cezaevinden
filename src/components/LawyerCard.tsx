import Link from 'next/link'
import { HiCheckBadge, HiStar, HiCheckCircle, HiClock } from 'react-icons/hi2'

interface Lawyer {
  id: string
  name: string
  expertise: string[]
  city: string
  answered: number
  rating: number
  online: boolean
  responseTime: string
}

export default function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="card p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            {lawyer.name.split(' ')[1]?.charAt(0) ?? 'A'}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${lawyer.online ? 'bg-green-400' : 'bg-gray-300'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="font-bold text-sm text-gray-900">{lawyer.name}</span>
            <HiCheckBadge className="w-4 h-4 text-blue-500" />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lawyer.online ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {lawyer.online ? '● Çevrimiçi' : '○ Çevrimdışı'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {lawyer.expertise.map(e => (
              <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{e}</span>
            ))}
            <span className="text-xs text-gray-400">📍 {lawyer.city}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-0.5">
              <HiStar className="w-3.5 h-3.5 text-gold-500" /> {lawyer.rating}
            </span>
            <span className="flex items-center gap-0.5">
              <HiCheckCircle className="w-3.5 h-3.5 text-green-500" /> {lawyer.answered} yanıt
            </span>
            <span className="flex items-center gap-0.5">
              <HiClock className="w-3.5 h-3.5" /> {lawyer.responseTime}
            </span>
          </div>
        </div>

        <Link href="/hukuki-yardim"
          className="flex-shrink-0 bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
          Soru Sor
        </Link>
      </div>
    </div>
  )
}
