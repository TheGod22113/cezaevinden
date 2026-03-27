import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Basit token store (production'da Redis kullanın)
const resetTokens = new Map<string, { email: string; expires: number }>()

// POST /api/auth/reset-password — Token gönder
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-posta zorunludur' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  // Güvenlik: kullanıcı bulunamasa da başarılı döndür
  if (!user) return NextResponse.json({ ok: true })

  const token   = crypto.randomBytes(32).toString('hex')
  const expires = Date.now() + 1000 * 60 * 60 // 1 saat

  resetTokens.set(token, { email, expires })

  // TODO: Gerçek e-posta gönderimi (nodemailer veya Resend)
  console.log(`Şifre sıfırlama linki: /sifre-sifirla?token=${token}`)

  return NextResponse.json({ ok: true })
}

// PATCH /api/auth/reset-password — Şifreyi güncelle
export async function PATCH(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  if (password.length < 8)  return NextResponse.json({ error: 'Şifre en az 8 karakter' }, { status: 400 })

  const data = resetTokens.get(token)
  if (!data || data.expires < Date.now()) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş link' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.user.update({
    where: { email: data.email },
    data:  { password: hash },
  })

  resetTokens.delete(token)
  return NextResponse.json({ ok: true })
}
