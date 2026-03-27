import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET — current user profile
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, username: true, email: true, bio: true,
      city: true, role: true, status: true, verified: true,
      avatar: true, coverImage: true, website: true, createdAt: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  })

  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
  return NextResponse.json(user)
}

// PATCH — update profile
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const body = await req.json()

  const allowedFields = ['name', 'bio', 'city', 'website', 'avatar', 'coverImage']
  const updates: Record<string, any> = {}

  for (const key of allowedFields) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  // Password change
  if (body.currentPassword && body.newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.password) return NextResponse.json({ error: 'Şifre değiştirilemedi' }, { status: 400 })
    const match = await bcrypt.compare(body.currentPassword, user.password)
    if (!match) return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 })
    updates.password = await bcrypt.hash(body.newPassword, 12)
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: { id: true, name: true, username: true, bio: true, city: true, avatar: true },
  })

  return NextResponse.json({ ok: true, user: updated })
}
