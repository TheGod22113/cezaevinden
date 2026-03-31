import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — kendi DS programını getir
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const schedule = await prisma.dsSchedule.findUnique({ where: { userId } })
  return NextResponse.json(schedule ?? {})
}

// PATCH — DS programını kaydet/güncelle
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

  const userId = (session.user as any).id
  const body = await req.json()
  const { imzaGunleri, imzaSaati, seminerler, hatirlatmaGun, telefon, aktif } = body

  const schedule = await prisma.dsSchedule.upsert({
    where:  { userId },
    update: { imzaGunleri, imzaSaati, seminerler, hatirlatmaGun, telefon, aktif },
    create: { userId, imzaGunleri, imzaSaati, seminerler, hatirlatmaGun, telefon, aktif },
  })

  return NextResponse.json({ ok: true, schedule })
}
