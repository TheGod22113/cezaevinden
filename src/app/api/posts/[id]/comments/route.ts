import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where:   { postId: params.id, parentId: null },
    include: {
      author:  { select: { id: true, name: true, username: true, role: true, verified: true } },
      replies: {
        include: {
          author: { select: { id: true, name: true, username: true, role: true, verified: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { likes: true, replies: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  const sanitize = (c: any) => ({
    ...c,
    author: c.isAnonymous
      ? { id: null, name: 'Anonim', username: null, role: c.author.role, verified: false }
      : c.author,
  })

  return NextResponse.json(comments.map(sanitize))
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { content, isAnonymous, parentId } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'İçerik boş olamaz' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: {
      postId:     params.id,
      authorId:   (session.user as any).id,
      content:    content.trim(),
      isAnonymous: !!isAnonymous,
      parentId:   parentId || null,
    },
    include: {
      author: { select: { id: true, name: true, username: true, role: true, verified: true } },
    },
  })

  // Gönderi sahibine bildirim gönder
  const post = await prisma.post.findUnique({ where: { id: params.id }, select: { authorId: true } })
  const myId = (session.user as any).id
  if (post && post.authorId !== myId) {
    await prisma.notification.create({
      data: {
        userId:  post.authorId,
        type:    'COMMENT',
        message: `${session.user.name} gönderinize yorum yaptı.`,
        link:    `/${params.id}`,
      },
    })
  }

  return NextResponse.json(comment, { status: 201 })
}
