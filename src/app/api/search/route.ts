import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q   = searchParams.get('q')?.trim()
  const tab = searchParams.get('tab') || 'all'

  if (!q || q.length < 2) return NextResponse.json({ users: [], posts: [], topics: [], questions: [] })

  const [posts, users, topics, questions] = await Promise.all([
    (tab === 'all' || tab === 'posts')
      ? prisma.post.findMany({
          where: { content: { contains: q, mode: 'insensitive' }, isAnonymous: false },
          include: { _count: { select: { likes: true, comments: true } } },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      : [],

    (tab === 'all' || tab === 'users')
      ? prisma.user.findMany({
          where: {
            OR: [
              { name:     { contains: q, mode: 'insensitive' } },
              { username: { contains: q, mode: 'insensitive' } },
            ],
            status: 'ACTIVE',
          },
          select: { name: true, username: true, role: true, verified: true, city: true },
          take: 5,
        })
      : [],

    (tab === 'all' || tab === 'forum')
      ? prisma.forumTopic.findMany({
          where: {
            OR: [
              { title:   { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          },
          include: { _count: { select: { replies: true } } },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      : [],

    (tab === 'all' || tab === 'legal')
      ? prisma.legalQuestion.findMany({
          where: {
            OR: [
              { title:   { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
            ],
          },
          include: { _count: { select: { answers: true } } },
          take: 5,
          orderBy: { createdAt: 'desc' },
        })
      : [],
  ])

  return NextResponse.json({ posts, users, topics, questions })
}
