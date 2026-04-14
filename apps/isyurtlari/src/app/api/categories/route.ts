import { prisma } from '@isyurtlari/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    return NextResponse.json(
      { error: 'Kategoriler yüklenemedi' },
      { status: 500 }
    );
  }
}
