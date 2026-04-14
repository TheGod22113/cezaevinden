import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session && session.user && (session.user as any).role === 'ADMIN'
}

// GET — Son gönderiler ve forum konuları
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'posts' // 'posts' | 'topics'

  if (type === 'topics') {
    const topics = await prisma.forumTopic.findMany({
      select: {
        id: true, title: true, category: true, createdAt: true,
        author: { select: { name: true, username: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(topics)
  }

  const posts = await prisma.post.findMany({
    select: {
      id: true, content: true, category: true, createdAt: true, isPinned: true,
      author: { select: { name: true, username: true } },
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(posts)
}

// DELETE — Gönderi veya forum konusu sil
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id, type } = await req.json()

  if (type === 'topic') {
    await prisma.forumTopic.delete({ where: { id } })
  } else {
    await prisma.post.delete({ where: { id } })
  }

  return NextResponse.json({ ok: true })
}

// PATCH — Gönderiyi sabitle / sabitlemeden kaldır
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id, isPinned } = await req.json()
  const post = await prisma.post.update({ where: { id }, data: { isPinned } })
  return NextResponse.json(post)
}
