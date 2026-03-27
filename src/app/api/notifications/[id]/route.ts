import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH — mark single notification as read
export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id

  await prisma.notification.updateMany({
    where: { id: params.id, userId },
    data:  { read: true },
  })

  return NextResponse.json({ ok: true })
}

// DELETE — remove notification
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id

  await prisma.notification.deleteMany({
    where: { id: params.id, userId },
  })

  return NextResponse.json({ ok: true })
}
