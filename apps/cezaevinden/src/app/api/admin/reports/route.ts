import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — Bekleyen şikayetler
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const reports = await prisma.report.findMany({
    where:   { status: 'PENDING' },
    include: {
      reporter:     { select: { name: true, username: true } },
      reportedUser: { select: { name: true, username: true } },
      post:         { select: { content: true, authorId: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(reports)
}

// PATCH — Şikayeti çözümle
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { reportId, action } = await req.json()
  // action: 'RESOLVED' | 'DISMISSED'

  const report = await prisma.report.update({
    where: { id: reportId },
    data:  { status: action },
  })

  // İçeriği kaldır
  if (action === 'RESOLVED' && report.postId) {
    await prisma.post.delete({ where: { id: report.postId } })
  }

  return NextResponse.json({ ok: true })
}
