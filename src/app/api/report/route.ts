import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const reporterId = (session.user as any).id
  const { postId, reportedUserId, reason } = await req.json()

  if (!reason?.trim()) return NextResponse.json({ error: 'Neden belirtin' }, { status: 400 })
  if (!postId && !reportedUserId) return NextResponse.json({ error: 'Hedef belirtin' }, { status: 400 })

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedUserId: reportedUserId || undefined,
      postId:         postId || undefined,
      reason:         reason.trim(),
      status:         'PENDING',
    },
  })

  return NextResponse.json({ ok: true, id: report.id }, { status: 201 })
}
