import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const { barNo, city, expertise, bio } = await req.json()

  if (!barNo || !city || !expertise?.length) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
  }

  // Update user to AVUKAT role with PENDING status
  await prisma.user.update({
    where: { id: userId },
    data: {
      role:     'AVUKAT',
      status:   'PENDING',
      verified: false,
      bio:      bio || undefined,
      city:     city,
    },
  })

  // Notify admins
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  await Promise.all(admins.map(admin =>
    prisma.notification.create({
      data: {
        userId:  admin.id,
        type:    'SYSTEM',
        message: 'Yeni avukat başvurusu inceleme bekliyor.',
        link:    '/admin',
      },
    })
  ))

  return NextResponse.json({ ok: true, message: 'Başvurunuz alındı. İnceleme sonucu bildirilecektir.' })
}
