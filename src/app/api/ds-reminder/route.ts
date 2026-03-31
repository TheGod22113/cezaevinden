import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

// Türkiye saatini al (UTC+3)
function turkiyeSaati() {
  const now = new Date()
  const tr  = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }))
  return {
    saat:   tr.getHours(),
    dakika: tr.getMinutes(),
    gun:    ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][tr.getDay()],
    tarih:  tr.toISOString().split('T')[0],
    date:   tr,
  }
}

// "14:30" → toplam dakika
function saatToDakika(saatStr: string): number {
  const [h, m] = saatStr.split(':').map(Number)
  return h * 60 + m
}

async function handleReminder(req: NextRequest) {
  const session    = await getServerSession(authOptions)
  const authHeader = req.headers.get('authorization') ?? req.headers.get('x-cron-secret')
  const isAdmin    = session && (session.user as any).role === 'ADMIN'
  // Vercel cron: Authorization: Bearer <CRON_SECRET>
  const isCron     = authHeader === `Bearer ${process.env.CRON_SECRET}`
                  || authHeader === process.env.CRON_SECRET

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { saat, dakika, gun, tarih, date } = turkiyeSaati()
  const simdikiDakika = saat * 60 + dakika

  const schedules = await prisma.dsSchedule.findMany({
    where: { aktif: true },
    include: { user: { select: { name: true, email: true } } },
  })

  let sent = 0

  for (const s of schedules) {
    const hatirlatmaGun  = s.hatirlatmaGun ?? 1
    const imzaGunleri: string[]  = s.imzaGunleri ? JSON.parse(s.imzaGunleri) : []
    const seminerler:   string[] = s.seminerler  ? JSON.parse(s.seminerler)  : []

    // ── 1. BUGÜN İMZA GÜNÜ → 2 saat öncesi hatırlatma ─────────
    if (imzaGunleri.includes(gun) && s.imzaSaati) {
      const imzaDakika   = saatToDakika(s.imzaSaati)
      const hedefDakika  = imzaDakika - 120 // 2 saat önce
      // Cron saatlik çalışır; ±30 dakika tolerans
      if (Math.abs(simdikiDakika - hedefDakika) <= 30) {
        await resend.emails.send({
          from:    process.env.EMAIL_FROM!,
          to:      s.user.email,
          subject: `⏰ Bugün ${s.imzaSaati} — İmza Hatırlatması`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#1e3a5f">⏰ 2 Saat Kaldı!</h2>
              <p>Merhaba <strong>${s.user.name}</strong>,</p>
              <p>Bugün saat <strong>${s.imzaSaati}</strong>'de denetimli serbestlik imza gününüz.</p>
              <p style="color:#c0392b;font-weight:600">Yaklaşık 2 saat sonra imzanızı atmayı unutmayın!</p>
              <p style="color:#666;font-size:13px">Zamanında gitmeyi, yanınıza kimliğinizi almayı unutmayın.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
              <p style="font-size:12px;color:#999">Cezaevinden.com — <a href="https://cezaevinden.com/profil/ayarlar">Hatırlatmaları yönet</a></p>
            </div>
          `,
        }).catch(() => {})
        sent++
      }
    }

    // ── 2. X GÜN ÖNCESI HATIRLATMA ─────────────────────────────
    if (hatirlatmaGun > 0 && imzaGunleri.length > 0) {
      const hedef = new Date(date)
      hedef.setDate(hedef.getDate() + hatirlatmaGun)
      const hedefGun = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][hedef.getDay()]
      if (imzaGunleri.includes(hedefGun)) {
        await resend.emails.send({
          from:    process.env.EMAIL_FROM!,
          to:      s.user.email,
          subject: `📋 ${hatirlatmaGun === 1 ? 'Yarın' : `${hatirlatmaGun} gün sonra`} İmza Günün`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#1e3a5f">📋 İmza Günü Hatırlatması</h2>
              <p>Merhaba <strong>${s.user.name}</strong>,</p>
              <p><strong>${hatirlatmaGun === 1 ? 'Yarın' : `${hatirlatmaGun} gün sonra`}</strong> (${hedefGun}) denetimli serbestlik imza gününüz.</p>
              ${s.imzaSaati ? `<p>⏰ Saat: <strong>${s.imzaSaati}</strong></p>` : ''}
              <p style="color:#666;font-size:13px">Denetimli Serbestlik Müdürlüğü'ne zamanında gitmeyi unutmayın.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
              <p style="font-size:12px;color:#999">Cezaevinden.com — <a href="https://cezaevinden.com/profil/ayarlar">Hatırlatmaları yönet</a></p>
            </div>
          `,
        }).catch(() => {})
        sent++
      }
    }

    // ── 3. SEMİNER HATIRLATMASI ─────────────────────────────────
    for (const semTarih of seminerler) {
      // Bugün seminer → 2 saat öncesi (eğer saat bilgisi varsa)
      if (semTarih === tarih && s.imzaSaati) {
        const imzaDakika  = saatToDakika(s.imzaSaati)
        const hedefDakika = imzaDakika - 120
        if (Math.abs(simdikiDakika - hedefDakika) <= 30) {
          await resend.emails.send({
            from:    process.env.EMAIL_FROM!,
            to:      s.user.email,
            subject: `📚 Bugün Seminer — ${new Date(semTarih).toLocaleDateString('tr-TR')}`,
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#1e3a5f">📚 Bugün Seminer!</h2>
                <p>Merhaba <strong>${s.user.name}</strong>,</p>
                <p>Bugün <strong>${new Date(semTarih).toLocaleDateString('tr-TR', { day:'numeric', month:'long' })}</strong> tarihli seminerinize yaklaşık 2 saat kaldı.</p>
                <p style="color:#c0392b;font-weight:600">Seminere zamanında katılmayı unutmayın!</p>
                <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
                <p style="font-size:12px;color:#999">Cezaevinden.com — <a href="https://cezaevinden.com/profil/ayarlar">Hatırlatmaları yönet</a></p>
              </div>
            `,
          }).catch(() => {})
          sent++
        }
      }

      // X gün öncesi seminer hatırlatması
      if (hatirlatmaGun > 0) {
        const hedef    = new Date(date)
        hedef.setDate(hedef.getDate() + hatirlatmaGun)
        const hedefStr = hedef.toISOString().split('T')[0]
        if (semTarih === hedefStr) {
          await resend.emails.send({
            from:    process.env.EMAIL_FROM!,
            to:      s.user.email,
            subject: `📚 Seminer Hatırlatması — ${new Date(semTarih).toLocaleDateString('tr-TR')}`,
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
                <h2 style="color:#1e3a5f">📚 Seminer Tarihi Yaklaşıyor</h2>
                <p>Merhaba <strong>${s.user.name}</strong>,</p>
                <p><strong>${hatirlatmaGun === 1 ? 'Yarın' : `${hatirlatmaGun} gün sonra`}</strong> seminere katılmanız gerekmektedir.</p>
                <p>📅 Tarih: <strong>${new Date(semTarih).toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}</strong></p>
                <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
                <p style="font-size:12px;color:#999">Cezaevinden.com — <a href="https://cezaevinden.com/profil/ayarlar">Hatırlatmaları yönet</a></p>
              </div>
            `,
          }).catch(() => {})
          sent++
        }
      }
    }
  }

  return NextResponse.json({ ok: true, sent, checked: schedules.length })
}

// Vercel Cron Jobs GET ile çağırır
export async function GET(req: NextRequest) {
  return handleReminder(req)
}

// Admin manuel tetikleme için POST
export async function POST(req: NextRequest) {
  return handleReminder(req)
}
