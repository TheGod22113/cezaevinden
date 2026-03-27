import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category  = searchParams.get('category') || undefined
  const answered  = searchParams.get('answered')
  const page      = parseInt(searchParams.get('page') || '1')

  const questions = await prisma.legalQuestion.findMany({
    where: {
      ...(category ? { category: category as any } : {}),
      ...(answered !== null ? { isAnswered: answered === 'true' } : {}),
    },
    include: {
      author: { select: { id: true, name: true, username: true, role: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * 20,
    take: 20,
  })

  const sanitized = questions.map(q => ({
    ...q,
    author: q.isAnonymous ? null : q.author,
  }))

  return NextResponse.json(sanitized)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Giriş yapınız' }, { status: 401 })

  const { title, content, category, isAnonymous } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'Başlık ve içerik zorunludur' }, { status: 400 })

  const question = await prisma.legalQuestion.create({
    data: {
      authorId:    (session.user as any).id,
      title:       title.trim(),
      content:     content.trim(),
      category:    category || 'Diğer',
      isAnonymous: !!isAnonymous,
    },
  })

  return NextResponse.json(question, { status: 201 })
}
