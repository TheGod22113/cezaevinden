import { prisma } from '@isyurtlari/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const categorySlug = req.nextUrl.searchParams.get('category');

    const where = categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Ürün listesi hatası:', error);
    return NextResponse.json(
      { error: 'Ürünler yüklenemedi' },
      { status: 500 }
    );
  }
}
