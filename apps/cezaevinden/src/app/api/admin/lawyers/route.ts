import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — pending lawyer verifications
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const lawyers = await prisma.user.findMany({
    where: { role: 'AVUKAT', verified: false },
    select: {
      id: true, name: true, username: true, email: true,
      status: true, verified: true, createdAt: true,
      _count: { select: { answers: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(lawyers)
}

// PATCH — approve or reject lawyer
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { userId, action } = await req.json()
  // action: 'approve' | 'reject'

  if (action === 'approve') {
    await prisma.user.update({
      where: { id: userId },
      data: { verified: true, status: 'ACTIVE' },
    })
    // Notify user
    await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        message: 'Avukat profiliniz onaylandı! Artık hukuki soruları yanıtlayabilirsiniz.',
        link: '/hukuki-yardim',
      },
    }).catch(() => {})
  } else if (action === 'reject') {
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    })
    await prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        message: 'Avukat başvurunuz incelendi. Daha fazla bilgi için iletişime geçin.',
        link: '/iletisim',
      },
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
