import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
  }

  const [
    totalUsers, activeUsers, pendingLawyers,
    totalPosts, totalTopics, totalQuestions,
    answeredQuestions, pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.user.count({ where: { role: 'AVUKAT', status: 'PENDING' } }),
    prisma.post.count(),
    prisma.forumTopic.count(),
    prisma.legalQuestion.count(),
    prisma.legalQuestion.count({ where: { isAnswered: true } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ])

  return NextResponse.json({
    users:     { total: totalUsers, active: activeUsers, pendingLawyers },
    content:   { posts: totalPosts, topics: totalTopics },
    legal:     { total: totalQuestions, answered: answeredQuestions },
    moderation:{ pendingReports },
  })
}
