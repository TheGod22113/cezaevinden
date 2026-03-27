import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city     = searchParams.get('city')     || undefined
  const category = searchParams.get('category') || undefined

  const resources = await prisma.supportResource.findMany({
    where: {
      ...(city     ? { city:     { contains: city,     mode: 'insensitive' } } : {}),
      ...(category ? { category: { contains: category, mode: 'insensitive' } } : {}),
    },
    orderBy: [{ verified: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(resources)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const data = await req.json()

  const resource = await prisma.supportResource.create({
    data: {
      name:        data.name,
      description: data.description,
      category:    data.category,
      city:        data.city     || null,
      phone:       data.phone    || null,
      email:       data.email    || null,
      website:     data.website  || null,
      verified:    data.verified ?? false,
    },
  })

  return NextResponse.json(resource, { status: 201 })
}
