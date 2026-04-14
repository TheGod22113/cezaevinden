import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const user = session.user as any
  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

  const comment = await prisma.legalComment.create({
    data: {
      content: content.trim(),
      authorId: user.id,
      questionId: params.id,
    },
    include: {
      author: { select: { name: true, username: true, role: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
