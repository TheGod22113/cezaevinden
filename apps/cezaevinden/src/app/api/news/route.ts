import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || undefined
  const page     = parseInt(searchParams.get('page') || '1')
  const limit    = parseInt(searchParams.get('limit') || '20')
  const isAdmin  = searchParams.get('admin') === 'true'

  const news = await prisma.news.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(isAdmin  ? {} : { published: true }),
    },
    include: {
      author: { select: { name: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip:    (page - 1) * limit,
    take:    limit,
  })

  return NextResponse.json(news)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const { title, summary, content, imageUrl, category, published } = body

  if (!title || !summary || !content) {
    return NextResponse.json({ error: 'Başlık, özet ve içerik zorunlu' }, { status: 400 })
  }

  const news = await prisma.news.create({
    data: {
      title,
      summary,
      content,
      imageUrl:  imageUrl  || null,
      category:  category  || 'Haber',
      published: published ?? false,
      authorId:  (session.user as any).id,
    },
  })

  return NextResponse.json(news, { status: 201 })
}
