import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — personalized feed (posts from followed users)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')

  // Get followed user IDs
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  })
  const followedIds = follows.map(f => f.followingId)

  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: followedIds },
    },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip:    (page - 1) * 20,
    take:    20,
  })

  const sanitized = posts.map(p => ({
    ...p,
    author: p.isAnonymous ? null : p.author,
  }))

  return NextResponse.json(sanitized)
}
