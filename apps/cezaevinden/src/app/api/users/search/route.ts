import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) return NextResponse.json([])

  const users = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { name:     { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      name: true, username: true, bio: true, role: true, verified: true,
      _count: { select: { followers: true } },
    },
    take: 10,
  })

  return NextResponse.json(users)
}
