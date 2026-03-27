import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const userId = (session.user as any).id
  const postId = params.id

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  } else {
    await prisma.like.create({ data: { userId, postId } })
    return NextResponse.json({ liked: true })
  }
}
