import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — legal question detail with answers
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const question = await prisma.legalQuestion.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      answers: {
        include: {
          author: { select: { name: true, username: true, role: true, verified: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { answers: true } },
    },
  })

  if (!question) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const sanitized = {
    ...question,
    author: question.isAnonymous ? null : question.author,
  }

  return NextResponse.json(sanitized)
}

// POST — add answer (lawyers only)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const user = session.user as any
  if (user.role !== 'AVUKAT' && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Sadece avukatlar yanıt verebilir' }, { status: 403 })
  }

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

  const answer = await prisma.legalAnswer.create({
    data: {
      content: content.trim(),
      authorId: user.id,
      questionId: params.id,
    },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
    },
  })

  // Notify question author
  const question = await prisma.legalQuestion.findUnique({ where: { id: params.id } })
  if (question && question.authorId !== user.id) {
    await prisma.notification.create({
      data: {
        userId: question.authorId,
        type: 'COMMENT',
        message: `Hukuki sorunuz yanıtlandı.`,
        link: `/hukuki-yardim/${params.id}`,
      },
    }).catch(() => {})
  }

  return NextResponse.json(answer, { status: 201 })
}
