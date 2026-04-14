import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // last 7 days

  const [trendingPosts, trendingTopics, trendingLegal] = await Promise.all([
    prisma.post.findMany({
      where: { createdAt: { gte: since }, isAnonymous: false },
      include: {
        author: { select: { name: true, username: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: [{ likes: { _count: 'desc' } }, { comments: { _count: 'desc' } }],
      take: 5,
    }),

    prisma.forumTopic.findMany({
      where: { createdAt: { gte: since } },
      include: { _count: { select: { replies: true } } },
      orderBy: { replies: { _count: 'desc' } },
      take: 5,
    }),

    prisma.legalQuestion.findMany({
      where: { createdAt: { gte: since } },
      include: { _count: { select: { answers: true } } },
      orderBy: { answers: { _count: 'desc' } },
      take: 5,
    }),
  ])

  return NextResponse.json({ posts: trendingPosts, topics: trendingTopics, legal: trendingLegal })
}
