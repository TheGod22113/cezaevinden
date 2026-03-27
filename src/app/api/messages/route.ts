import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — Konuşma listesi
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const userId = session.user.id

  // Son mesaj olan kullanıcıları getir
  const conversations = await prisma.$queryRaw`
    SELECT DISTINCT ON (other_user_id)
      other_user_id,
      content,
      created_at,
      read,
      sender_id
    FROM (
      SELECT
        CASE WHEN sender_id = ${userId} THEN receiver_id ELSE sender_id END as other_user_id,
        content, created_at, read, sender_id
      FROM "Message"
      WHERE sender_id = ${userId} OR receiver_id = ${userId}
      ORDER BY created_at DESC
    ) sub
    ORDER BY other_user_id, created_at DESC
  `

  return NextResponse.json(conversations)
}

// POST — Mesaj gönder
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { receiverId, content } = await req.json()
  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: 'Alıcı ve içerik zorunludur' }, { status: 400 })
  }
  if (receiverId === session.user.id) {
    return NextResponse.json({ error: 'Kendinize mesaj gönderemezsiniz' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      senderId:   session.user.id,
      receiverId,
      content:    content.trim(),
    },
  })

  return NextResponse.json(message, { status: 201 })
}
