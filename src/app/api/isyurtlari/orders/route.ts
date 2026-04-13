import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekir' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const { shippingAddress, paymentMethod, customerName, customerEmail, customerPhone } =
      await req.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Eksik bilgiler' },
        { status: 400 }
      );
    }

    // Sepeti getir
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş' },
        { status: 400 }
      );
    }

    // Toplam tutarı hesapla
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Sipariş oluştur
    const orderNumber = `ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        totalAmount,
        paymentMethod: paymentMethod as 'CREDIT_CARD' | 'TRANSFER',
        shippingAddress,
        status: 'PENDING',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Ödeme kaydı oluştur
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        method: paymentMethod as 'CREDIT_CARD' | 'TRANSFER',
        status: 'PENDING',
        description: `Sipariş ${orderNumber}`,
      },
    });

    // Sepeti boşalt
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekir' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Siparişler getirme hatası:', error);
    return NextResponse.json(
      { error: 'Siparişler yüklenemedi' },
      { status: 500 }
    );
  }
}
