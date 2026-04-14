import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — forum topic detail with replies
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const topic = await prisma.forumTopic.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      replies: {
        include: {
          author: { select: { name: true, username: true, role: true, verified: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { replies: true } },
    },
  })

  if (!topic) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const sanitized = {
    ...topic,
    author: topic.isAnonymous ? null : topic.author,
    replies: topic.replies.map(r => ({
      ...r,
      author: r.isAnonymous ? null : r.author,
    })),
  }

  return NextResponse.json(sanitized)
}

// POST — add reply
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const { content, isAnonymous } = await req.json()

  if (!content?.trim()) return NextResponse.json({ error: 'İçerik gerekli' }, { status: 400 })

  const reply = await prisma.forumReply.create({
    data: {
      content: content.trim(),
      isAnonymous: Boolean(isAnonymous),
      authorId: userId,
      topicId: params.id,
    },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      _count: { select: { likes: true } },
    },
  })

  const sanitized = {
    ...reply,
    author: reply.isAnonymous ? null : reply.author,
  }

  return NextResponse.json(sanitized, { status: 201 })
}
