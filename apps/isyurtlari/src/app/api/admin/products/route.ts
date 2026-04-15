import { prisma } from '@isyurtlari/database';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { name, slug, description, categoryId, price, quantity, imageUrl } = await req.json();

  if (!name || !slug || !description || !categoryId) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: { name, slug, description, categoryId, price: Number(price) || 0, quantity: Number(quantity) || 0, imageUrl: imageUrl || null },
  });
  return NextResponse.json(product, { status: 201 });
}
