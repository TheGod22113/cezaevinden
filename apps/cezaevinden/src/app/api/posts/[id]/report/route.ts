import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const reporterId = (session.user as any).id
  const { reason } = await req.json()

  if (!reason?.trim()) return NextResponse.json({ error: 'Neden belirtin' }, { status: 400 })

  // Get post author
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  })

  if (!post) return NextResponse.json({ error: 'Gönderi bulunamadı' }, { status: 404 })

  await prisma.report.create({
    data: {
      reporterId,
      reportedUserId: post.authorId || undefined,
      postId:         params.id,
      reason:         reason.trim(),
      status:         'PENDING',
    },
  })

  return NextResponse.json({ ok: true })
}
