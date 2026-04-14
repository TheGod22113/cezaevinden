import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Toggle like on a forum reply
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId  = (session.user as any).id
  const { replyId } = await req.json()

  const existing = await prisma.like.findFirst({
    where: { userId, forumReplyId: replyId },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }

  await prisma.like.create({ data: { userId, forumReplyId: replyId } })
  return NextResponse.json({ liked: true })
}
