import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || undefined
  const sort     = searchParams.get('sort')     || 'new'
  const page     = parseInt(searchParams.get('page')  || '1')
  const limit    = parseInt(searchParams.get('limit') || '20')

  const orderBy = sort === 'popular'
    ? [{ replies: { _count: 'desc' as const } }, { createdAt: 'desc' as const }]
    : [{ isPinned: 'desc' as const }, { createdAt: 'desc' as const }]

  const topics = await prisma.forumTopic.findMany({
    where: category ? { category: category as any } : undefined,
    include: {
      author: { select: { id: true, name: true, username: true, role: true, verified: true } },
      _count: { select: { replies: true } },
    },
    orderBy,
    skip:  (page - 1) * limit,
    take:  limit,
  })

  const sanitized = topics.map(t => ({
    ...t,
    author: t.isAnonymous
      ? { id: null, name: 'Anonim', username: null, role: t.author.role, verified: false }
      : t.author,
  }))

  return NextResponse.json(sanitized)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { title, content, category, isAnonymous } = await req.json()
  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Başlık ve içerik zorunludur' }, { status: 400 })
  }

  const topic = await prisma.forumTopic.create({
    data: {
      authorId:    (session.user as any).id,
      title:       title.trim(),
      content:     content.trim(),
      category:    category || 'Genel',
      isAnonymous: !!isAnonymous,
    },
  })

  return NextResponse.json(topic, { status: 201 })
}
