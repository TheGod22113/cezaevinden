import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const news = await prisma.news.findUnique({
    where: { id: params.id, published: true },
    include: {
      author: { select: { name: true, username: true } },
    },
  })

  if (!news) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(news)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const data = await req.json()
  const news = await prisma.news.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json(news)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  await prisma.news.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
