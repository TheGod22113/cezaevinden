import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const role   = searchParams.get('role')   || undefined
  const status = searchParams.get('status') || undefined
  const page   = parseInt(searchParams.get('page') || '1')

  const users = await prisma.user.findMany({
    where: {
      ...(role   ? { role:   role   as any } : {}),
      ...(status ? { status: status as any } : {}),
    },
    select: {
      id: true, name: true, username: true, email: true,
      role: true, status: true, verified: true, createdAt: true,
      _count: { select: { posts: true, followers: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip:  (page - 1) * 50,
    take:  50,
  })

  return NextResponse.json(users)
}

// PATCH — Kullanıcı durumu güncelle (ban/unban/verify)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { userId, action } = await req.json()

  const updates: any = {}
  if (action === 'ban')      { updates.status   = 'BANNED'  }
  if (action === 'unban')    { updates.status   = 'ACTIVE'  }
  if (action === 'verify')   { updates.verified = true; updates.status = 'ACTIVE' }
  if (action === 'suspend')  { updates.status   = 'SUSPENDED' }

  const user = await prisma.user.update({ where: { id: userId }, data: updates })
  return NextResponse.json({ ok: true, user })
}
