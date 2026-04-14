import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session && session.user && (session.user as any).role === 'ADMIN'
}

// GET — Tüm duyuruları getir (admin)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(announcements)
}

// POST — Yeni duyuru oluştur
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { text, link, linkText, color, expiresAt } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Metin zorunlu' }, { status: 400 })

  const ann = await prisma.announcement.create({
    data: {
      text: text.trim(),
      link:      link     || null,
      linkText:  linkText || null,
      color:     color    || 'bg-gold-500 text-navy-800',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      active: true,
    },
  })
  return NextResponse.json(ann)
}

// PATCH — Aktif/pasif toggle veya güncelle
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id, active } = await req.json()
  const ann = await prisma.announcement.update({
    where: { id },
    data: { active },
  })
  return NextResponse.json(ann)
}

// DELETE — Duyuruyu sil
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const { id } = await req.json()
  await prisma.announcement.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
