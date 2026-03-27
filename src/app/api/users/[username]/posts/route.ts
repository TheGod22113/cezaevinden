import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')

  const user = await prisma.user.findUnique({ where: { username: params.username } })
  if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

  const posts = await prisma.post.findMany({
    where:   { authorId: user.id, isAnonymous: false },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip:    (page - 1) * 20,
    take:    20,
  })

  return NextResponse.json(posts)
}
