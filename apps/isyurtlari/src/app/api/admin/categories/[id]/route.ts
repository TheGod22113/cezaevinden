import { prisma } from '@isyurtlari/database';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.productCategory.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
