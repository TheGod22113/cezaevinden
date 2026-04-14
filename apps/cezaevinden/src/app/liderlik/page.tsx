import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { HiTrophy, HiStar, HiCheckBadge, HiCheckCircle } from 'react-icons/hi2'

async function getLeaderboard() {
  return prisma.user.findMany({
    where: { role: 'AVUKAT', verified: true, status: 'ACTIVE' },
    select: {
      id: true, name: true, username: true, city: true, verified: true,
      _count: { select: { answers: true, followers: true } },
    },
    orderBy: { answers: { _count: 'desc' } },
    take: 20,
  })
}

const medals = ['🥇', '🥈', '🥉']

export default async function LiderlikPage() {
  const lawyers = await getLeaderboard()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <HiTrophy className="w-12 h-12 text-gold-500 mx-auto mb-2" />
        <h1 className="text-2xl font-black text-gray-900">Avukat Lider Tablosu</h1>
        <p className="text-gray-500 text-sm mt-1">En çok hukuki soruyu yanıtlayan gönüllü avukatlarımız</p>
      </div>

      <div className="space-y-3">
        {lawyers.map((lawyer, i) => (
          <div key={lawyer.id}
            className={`card p-4 flex items-center gap-4 ${i < 3 ? 'border-l-4 ' + ['border-gold-500','border-gray-400','border-amber-600'][i] : ''}`}>
            <div className="w-10 text-center flex-shrink-0">
              {i < 3
                ? <span className="text-2xl">{medals[i]}</span>
                : <span className="text-lg font-black text-gray-400">#{i + 1}</span>
              }
            </div>

            <div className="w-11 h-11 bg-navy-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
              {lawyer.name.split(' ').pop()?.charAt(0) ?? 'A'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link href={`/profil/${lawyer.username}`} className="font-bold text-gray-900 hover:underline truncate">
                  {lawyer.name}
                </Link>
                <HiCheckBadge className="w-4 h-4 text-blue-500 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-400">{lawyer.city}</p>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
              <span className="flex items-center gap-1 text-sm font-bold text-navy-700">
                <HiCheckCircle className="w-4 h-4 text-green-500" />
                {lawyer._count.answers} yanıt
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <HiStar className="w-3.5 h-3.5 text-gold-500" />
                {lawyer._count.followers} takipçi
              </span>
            </div>
          </div>
        ))}

        {lawyers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <HiTrophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Henüz onaylı avukat yok.</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-3">Avukat mısınız? Platforma katılın.</p>
        <Link href="/avukat-ol" className="btn-primary inline-block px-6 py-2">
          Gönüllü Avukat Ol
        </Link>
      </div>
    </div>
  )
}
