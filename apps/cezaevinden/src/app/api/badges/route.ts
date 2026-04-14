import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkAndAwardBadges, BADGE_META } from '@/lib/badges'

// GET /api/badges?userId=xxx  — Kullanıcının rozetlerini getir
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json([], { status: 400 })

  const badges = await prisma.userBadge.findMany({
    where: { userId },
    orderBy: { awardedAt: 'asc' },
  })

  const result = badges.map(b => ({
    ...b,
    meta: BADGE_META[b.type] ?? { label: b.type, emoji: '🎖️', desc: '', color: 'bg-gray-100 text-gray-700' },
  }))

  return NextResponse.json(result)
}

// POST /api/badges/check  — Oturum açık kullanıcı için rozet kontrol
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const newBadges = await checkAndAwardBadges(userId)

  return NextResponse.json({
    awarded: newBadges,
    meta: newBadges.map(t => ({ type: t, ...BADGE_META[t] })),
  })
}
