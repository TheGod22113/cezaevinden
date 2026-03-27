import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — kullanıcının kaydettikleri
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
        include: {
          author: { select: { name: true, username: true, role: true, verified: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const posts = bookmarks.map(b => ({
    ...b.post,
    author: b.post.isAnonymous ? null : b.post.author,
  }))

  return NextResponse.json(posts)
}

// POST — kaydet / kayıttan çıkar (toggle)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const { postId } = await req.json()

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  })

  if (existing) {
    await prisma.bookmark.delete({ where: { userId_postId: { userId, postId } } })
    return NextResponse.json({ saved: false })
  }

  await prisma.bookmark.create({ data: { userId, postId } })
  return NextResponse.json({ saved: true })
}
