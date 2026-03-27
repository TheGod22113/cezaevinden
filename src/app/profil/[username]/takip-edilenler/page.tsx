import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { HiArrowLeft, HiUsers } from 'react-icons/hi2'
import { notFound } from 'next/navigation'

interface Props { params: { username: string } }

export default async function TakipEdilenlerPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      following: {
        include: {
          following: {
            select: { name: true, username: true, bio: true, role: true, verified: true },
          },
        },
      },
    },
  })

  if (!user) notFound()

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/profil/${params.username}`}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <HiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <HiUsers className="w-5 h-5 text-navy-700" /> Takip Edilenler
          </h1>
          <p className="text-xs text-gray-500">@{params.username} · {user.following.length} kişi</p>
        </div>
      </div>

      <div className="space-y-2">
        {user.following.map(({ following: f }) => (
          <Link key={f.username} href={`/profil/${f.username}`}
            className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center text-white font-bold">
              {f.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
              <p className="text-xs text-gray-500 truncate">{f.bio || `@${f.username}`}</p>
            </div>
          </Link>
        ))}

        {user.following.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <HiUsers className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Henüz kimseyi takip etmiyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}
