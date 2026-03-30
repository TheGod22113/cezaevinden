import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/token'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/dogrula?error=missing', req.url))
  }

  const result = verifyToken(token)
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/dogrula?error=${encodeURIComponent(result.error)}`, req.url))
  }

  const user = await prisma.user.findUnique({ where: { id: result.userId } })
  if (!user) {
    return NextResponse.redirect(new URL('/dogrula?error=notfound', req.url))
  }
  if (user.emailVerified) {
    return NextResponse.redirect(new URL('/dogrula?status=already', req.url))
  }

  await prisma.user.update({
    where: { id: result.userId },
    data:  { emailVerified: new Date() },
  })

  return NextResponse.redirect(new URL('/dogrula?status=success', req.url))
}
