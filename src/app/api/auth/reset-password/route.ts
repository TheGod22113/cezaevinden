import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// POST — şifre sıfırlama emaili gönder
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-posta zorunludur' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  // Güvenlik: kullanıcı bulunamasa da başarılı döndür (email enumeration önleme)
  if (!user) return NextResponse.json({ ok: true })

  // Eski tokenları temizle
  await prisma.passwordResetToken.deleteMany({ where: { email } })

  const token     = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 saat

  await prisma.passwordResetToken.create({ data: { token, email, expiresAt } })

  const resetUrl = `https://cezaevinden.com/sifre-sifirla?token=${token}`

  await resend.emails.send({
    from:    'Cezaevinden.com <noreply@cezaevinden.com>',
    to:      email,
    subject: 'Şifre Sıfırlama — Cezaevinden.com',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1e3a5f; margin-bottom: 8px;">Şifre Sıfırlama</h2>
        <p style="color: #444; margin-bottom: 24px;">
          Merhaba <strong>${user.name}</strong>,<br/>
          Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.
          Bu link <strong>1 saat</strong> geçerlidir.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block; background:#1e3a5f; color:#fff; padding:12px 28px;
                  border-radius:8px; text-decoration:none; font-weight:600; font-size:15px;">
          Şifremi Sıfırla
        </a>
        <p style="color:#999; font-size:13px; margin-top:24px;">
          Bu isteği siz yapmadıysanız bu emaili görmezden gelin.<br/>
          Link çalışmıyorsa şu adresi kopyalayın:<br/>
          <a href="${resetUrl}" style="color:#1e3a5f;">${resetUrl}</a>
        </p>
        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;"/>
        <p style="color:#bbb; font-size:12px;">Cezaevinden.com — cezaevinden.com</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}

// PATCH — yeni şifreyi kaydet
export async function PATCH(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  if (password.length < 8)  return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })

  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş link' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await prisma.user.update({
    where: { email: record.email },
    data:  { password: hash },
  })

  await prisma.passwordResetToken.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}
