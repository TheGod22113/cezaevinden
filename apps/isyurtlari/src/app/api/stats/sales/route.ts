import { prisma } from '@isyurtlari/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all completed orders
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0), 0);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Training hours: 5 hours per item
    const totalTrainingHours = totalItems * 5;

    // Prisoners supported: 0.5 per item
    const prisonersSupportedCount = Math.ceil(totalItems * 0.5);

    return NextResponse.json({
      totalOrders,
      totalItems,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalTrainingHours,
      prisonersSupportedCount,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler yüklenemedi' },
      { status: 500 }
    );
  }
}
