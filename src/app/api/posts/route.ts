import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/posts — Feed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page     = parseInt(searchParams.get('page')     || '1')
  const limit    = parseInt(searchParams.get('limit')    || '20')
  const category = searchParams.get('category') || undefined

  const posts = await prisma.post.findMany({
    where: category ? { category: { contains: category, mode: 'insensitive' } } : undefined,
    include: {
      author: { select: { id: true, name: true, username: true, role: true, verified: true, avatar: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    skip:  (page - 1) * limit,
    take:  limit,
  })

  // Anonim gönderilerde yazar bilgisini gizle
  const sanitized = posts.map(post => ({
    ...post,
    author: post.isAnonymous ? null : post.author,
  }))

  return NextResponse.json(sanitized)
}

// POST /api/posts — Yeni Gönderi
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { content, category, isAnonymous } = await req.json()

  if (!content?.trim()) return NextResponse.json({ error: 'İçerik boş olamaz' }, { status: 400 })
  if (content.length > 2000) return NextResponse.json({ error: 'İçerik 2000 karakteri geçemez' }, { status: 400 })

  const post = await prisma.post.create({
    data: {
      authorId:    (session.user as any).id,
      content:     content.trim(),
      category:    category || 'Genel',
      isAnonymous: !!isAnonymous,
    },
    include: {
      author: { select: { id: true, name: true, username: true, role: true, verified: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
  })

  const sanitized = { ...post, author: post.isAnonymous ? null : post.author }
  return NextResponse.json(sanitized, { status: 201 })
}
