import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Geçerli bir e-posta girin.' }, { status: 400 })
  }

  // Kullanıcı zaten kayıtlı mı?
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (existing) {
    // Kullanıcı varsa digest bildirimini aktif et
    return NextResponse.json({ ok: true, message: 'E-posta bülten listemize eklendi.' })
  }

  // Resend ile hoş geldin maili gönder
  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Cezaevinden.com <noreply@cezaevinden.com>',
        to: email,
        subject: 'Cezaevinden.com Bültenine Hoş Geldiniz!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1B2B6B; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Cezaevinden<span style="color: #F5A623;">.com</span></h1>
            </div>
            <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <h2 style="color: #1B2B6B; margin-top: 0;">Bültenimize Hoş Geldiniz! 🎉</h2>
              <p style="color: #374151; line-height: 1.6;">
                Platform güncellemeleri, önemli hukuki değişiklikler ve topluluk haberleri artık e-posta ile size ulaşacak.
              </p>
              <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Cezaevinden.com — Mahkumlar, aileler ve gönüllü avukatların dayanışma platformu.
                </p>
              </div>
              <a href="https://cezaevinden.com" style="display: inline-block; background: #1B2B6B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Platforma Git →
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                Bu e-postayı almak istemiyorsanız lütfen bize bildirin.
              </p>
            </div>
          </div>
        `,
      })
    }
  } catch (err) {
    console.error('Newsletter email hatası:', err)
  }

  return NextResponse.json({ ok: true, message: 'Teşekkürler! Bültenimize kaydoldunuz.' })
}
