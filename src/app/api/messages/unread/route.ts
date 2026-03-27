import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ count: 0 })

  const myId = (session.user as any).id

  const count = await prisma.message.count({
    where: { receiverId: myId, read: false },
  })

  return NextResponse.json({ count })
}
