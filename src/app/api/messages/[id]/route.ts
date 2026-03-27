import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — messages between current user and :id (userId)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const myId = (session.user as any).id
  const otherId = params.id

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: myId,    receiverId: otherId },
        { senderId: otherId, receiverId: myId    },
      ],
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  // Mark as read
  await prisma.message.updateMany({
    where: { senderId: otherId, receiverId: myId, read: false },
    data:  { read: true },
  })

  return NextResponse.json(messages)
}
