import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public: aktif duyuruları getir (AnnouncementBar için)
export async function GET() {
  const now = new Date()
  const announcements = await prisma.announcement.findMany({
    where: {
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  return NextResponse.json(announcements)
}
