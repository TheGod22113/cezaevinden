import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_: NextRequest, { params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const target = await prisma.user.findUnique({ where: { username: params.username } })
  if (!target) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  if (target.id === session.user.id) return NextResponse.json({ error: 'Kendinizi takip edemezsiniz' }, { status: 400 })

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: target.id } },
  })

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return NextResponse.json({ following: false })
  }

  await prisma.follow.create({
    data: { followerId: session.user.id, followingId: target.id },
  })

  // Bildirim gönder
  await prisma.notification.create({
    data: {
      userId:  target.id,
      type:    'FOLLOW',
      message: `${session.user.name} sizi takip etmeye başladı.`,
      link:    `/profil/${session.user.username}`,
    },
  })

  return NextResponse.json({ following: true })
}
