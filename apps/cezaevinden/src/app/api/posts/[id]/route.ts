import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { name: true, username: true, role: true, verified: true } },
      _count: { select: { likes: true, comments: true, bookmarks: true } },
    },
  })

  if (!post) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const sanitized = {
    ...post,
    author: post.isAnonymous ? null : post.author,
  }

  return NextResponse.json(sanitized)
}
