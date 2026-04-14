import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekir' },
        { status: 401 }
      );
    }

    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Geçersiz miktar' },
        { status: 400 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: { cart: true, product: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Sepet öğesi bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || cartItem.cart.userId !== user.id) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      );
    }

    // Stok kontrolü
    if (cartItem.product.quantity < quantity) {
      return NextResponse.json(
        { error: 'Yetersiz stok' },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Miktar güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Miktar güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekir' },
        { status: 401 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: params.itemId },
      include: { cart: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Sepet öğesi bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || cartItem.cart.userId !== user.id) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      );
    }

    await prisma.cartItem.delete({
      where: { id: params.itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sepetten çıkarma hatası:', error);
    return NextResponse.json(
      { error: 'Sepetten çıkarılamadı' },
      { status: 500 }
    );
  }
}
