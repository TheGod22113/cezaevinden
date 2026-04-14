import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where:  { username: params.username },
    select: {
      id: true, name: true, username: true, role: true,
      verified: true, bio: true, city: true, avatar: true,
      coverImage: true, website: true, createdAt: true, status: true,
      _count: {
        select: { posts: true, followers: true, following: true },
      },
    },
  })

  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  if (user.status === 'BANNED') return NextResponse.json({ error: 'Bu hesap askıya alınmıştır' }, { status: 403 })

  return NextResponse.json(user)
}
