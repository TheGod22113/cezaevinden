import { prisma } from '@isyurtlari/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [products, categories, orders, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.productCategory.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
    ]);

    return NextResponse.json({ products, categories, orders, pendingOrders });
  } catch {
    return NextResponse.json({ products: 0, categories: 0, orders: 0, pendingOrders: 0 });
  }
}
