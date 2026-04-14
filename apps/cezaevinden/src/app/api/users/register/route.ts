import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerifyToken } from '@/lib/token'
import { sendVerificationEmail, sendAdminNewUserNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, password, role, baroNo } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunludur' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır' }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 409 })

  // Username oluştur
  const base     = name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')
  const username = `${base}.${Math.floor(Math.random() * 9999)}`

  const hash         = await bcrypt.hash(password, 12)
  const normalizedRole = ((role as string) || 'AILE').toUpperCase()
  const status         = normalizedRole === 'AVUKAT' ? 'PENDING' : 'ACTIVE'

  const user = await prisma.user.create({
    data: { name, email, password: hash, username, role: normalizedRole as any, status: status as any, baroNo },
    select: { id: true, name: true, email: true, username: true, role: true, status: true },
  })

  // E-posta doğrulama gönder (arka planda — hata olsa bile kayıt başarılı)
  try {
    if (process.env.RESEND_API_KEY) {
      const token = generateVerifyToken(user.id, user.email)
      await sendVerificationEmail(user.email, user.name, token)
      await sendAdminNewUserNotification(user.name, user.email, user.role)
    }
  } catch (err) {
    console.error('Doğrulama e-postası gönderilemedi:', err)
  }

  return NextResponse.json(user, { status: 201 })
}
