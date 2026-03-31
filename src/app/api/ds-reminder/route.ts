import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

// POST — Bugünkü hatırlatmaları gönder (admin veya cron)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const authHeader = req.headers.get('x-cron-secret')
  const isAdmin = session && (session.user as any).role === 'ADMIN'
  const isCron  = authHeader === process.env.CRON_SECRET

  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const today = new Date()
  const todayDay = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][today.getDay()]
  const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD

  const schedules = await prisma.dsSchedule.findMany({
    where: { aktif: true },
    include: { user: { select: { name: true, email: true } } },
  })

  const resend = new Resend(process.env.RESEND_API_KEY!)
  let sent = 0

  for (const s of schedules) {
    const hatirlatmaGun = s.hatirlatmaGun ?? 1

    // İmza günü hatırlatması
    const imzaGunleri: string[] = s.imzaGunleri ? JSON.parse(s.imzaGunleri) : []
    if (imzaGunleri.length > 0) {
      // Bugünden hatirlatmaGun gün sonrası imza günü mü?
      const hedef = new Date(today)
      hedef.setDate(hedef.getDate() + hatirlatmaGun)
      const hedefDay = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'][hedef.getDay()]
      if (imzaGunleri.includes(hedefDay)) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to:   s.user.email,
          subject: `⏰ İmza Hatırlatması — ${hedefDay}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2 style="color:#1e3a5f">İmza Günü Hatırlatması</h2>
              <p>Merhaba <strong>${s.user.name}</strong>,</p>
              <p>${hatirlatmaGun === 1 ? 'Yarın' : `${hatirlatmaGun} gün sonra`} <strong>${hedefDay}</strong> günü denetimli serbestlik imza gününüz.</p>
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

    // Seminer tarihi hatırlatması
    const seminerler: string[] = s.seminerler ? JSON.parse(s.seminerler) : []
    for (const semTarih of seminerler) {
      const hedef = new Date(today)
      hedef.setDate(hedef.getDate() + hatirlatmaGun)
      const hedefStr = hedef.toISOString().split('T')[0]
      if (semTarih === hedefStr) {
        const semDate = new Date(semTarih)
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to:   s.user.email,
          subject: `📚 Seminer Hatırlatması — ${semDate.toLocaleDateString('tr-TR')}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
              <h2 style="color:#1e3a5f">Seminer Tarihi Hatırlatması</h2>
              <p>Merhaba <strong>${s.user.name}</strong>,</p>
              <p>${hatirlatmaGun === 1 ? 'Yarın' : `${hatirlatmaGun} gün sonra`} <strong>${semDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> tarihinde seminere katılmanız gerekmektedir.</p>
              <p style="color:#666;font-size:13px">Seminere zamanında katılmak denetimli serbestlik koşullarının bir parçasıdır.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
              <p style="font-size:12px;color:#999">Cezaevinden.com — <a href="https://cezaevinden.com/profil/ayarlar">Hatırlatmaları yönet</a></p>
            </div>
          `,
        }).catch(() => {})
        sent++
      }
    }
  }

  return NextResponse.json({ ok: true, sent, checked: schedules.length })
}
