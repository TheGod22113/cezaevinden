import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const resource = await prisma.supportResource.findUnique({
    where: { id: params.id },
  })

  if (!resource) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(resource)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  await prisma.supportResource.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
