import { prisma } from '@isyurtlari/database';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await prisma.productCategory.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const { name, slug, description } = await req.json();
  if (!name || !slug) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 });
  const category = await prisma.productCategory.create({ data: { name, slug, description: description || null } });
  return NextResponse.json(category, { status: 201 });
}
