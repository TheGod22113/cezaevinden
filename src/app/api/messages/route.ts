import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — Konuşma listesi (her kullanıcıyla son mesaj)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const userId = (session.user as any).id

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: 'desc' },
    include: {
      sender:   { select: { id: true, name: true, username: true, role: true, verified: true } },
      receiver: { select: { id: true, name: true, username: true, role: true, verified: true } },
    },
  })

  // Group by conversation partner — keep only latest message per partner
  const convMap = new Map<string, any>()
  for (const msg of messages) {
    const isMe = msg.senderId === userId
    const other = isMe ? msg.receiver : msg.sender
    const otherId = other.id
    if (!convMap.has(otherId)) {
      convMap.set(otherId, {
        userId:      otherId,
        name:        other.name,
        username:    other.username,
        role:        other.role,
        verified:    other.verified,
        lastMessage: msg.content,
        lastTime:    msg.createdAt,
        unread:      0,
      })
    }
    // Count unread messages sent by the other person to me
    if (!msg.read && msg.receiverId === userId && msg.senderId === otherId) {
      convMap.get(otherId)!.unread++
    }
  }

  return NextResponse.json(Array.from(convMap.values()))
}

// POST — Mesaj gönder
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { receiverId, content } = await req.json()
  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: 'Alıcı ve içerik zorunludur' }, { status: 400 })
  }
  if (receiverId === (session.user as any).id) {
    return NextResponse.json({ error: 'Kendinize mesaj gönderemezsiniz' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      senderId:   (session.user as any).id,
      receiverId,
      content:    content.trim(),
    },
  })

  return NextResponse.json(message, { status: 201 })
}
