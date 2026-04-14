import { prisma } from '@isyurtlari/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Ürün yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Ürün yüklenemedi' },
      { status: 500 }
    );
  }
}
