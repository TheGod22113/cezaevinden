import { Resend } from 'resend'

const FROM  = process.env.EMAIL_FROM  || 'info@cezaevinden.com'
const ADMIN = process.env.ADMIN_EMAIL || 'info@cezaevinden.com'

export async function sendVerificationEmail(to: string, name: string, token: string) {
  // Lazy init — env var build zamanında olmayabilir
  const resend = new Resend(process.env.RESEND_API_KEY!)
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cezaevinden.vercel.app'
  const link    = `${baseUrl}/api/auth/verify-email?token=${token}`

  await resend.emails.send({
    from:    `Cezaevinden.com <${FROM}>`,
    to:      [to],
    subject: 'E-posta adresinizi doğrulayın',
    html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8" /></head>
<body style="font-family:Inter,sans-serif;background:#f0f2f5;padding:24px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#1B2B6B;padding:28px 32px;text-align:center">
      <span style="color:#fff;font-size:22px;font-weight:700">Cezaevinden</span><span style="color:#CC2229;font-size:22px;font-weight:700">.com</span>
      <p style="color:#93a8d8;margin:6px 0 0;font-size:13px">Dayanışma ve Hukuki Destek Platformu</p>
    </div>
    <div style="padding:32px">
      <h1 style="font-size:20px;font-weight:700;color:#1c1e21;margin:0 0 8px">Merhaba ${name} 👋</h1>
      <p style="color:#65676b;font-size:15px;line-height:1.6;margin:0 0 24px">
        Hesabınızı oluşturduğunuz için teşekkürler. Lütfen e-posta adresinizi doğrulayın.
      </p>
      <div style="text-align:center;margin:0 0 28px">
        <a href="${link}" style="display:inline-block;background:#CC2229;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none">
          E-postamı Doğrula
        </a>
      </div>
      <p style="color:#65676b;font-size:13px;margin:0">
        Buton çalışmıyorsa:<br/>
        <a href="${link}" style="color:#1B2B6B;word-break:break-all">${link}</a>
      </p>
      <hr style="border:none;border-top:1px solid #e4e6eb;margin:24px 0"/>
      <p style="color:#bcc0c4;font-size:12px;margin:0">
        Bu link 24 saat geçerlidir. Kayıt olmadıysanız görmezden gelebilirsiniz.
      </p>
    </div>
  </div>
</body>
</html>`,
  })
}

export async function sendAdminNewUserNotification(userName: string, userEmail: string, userRole: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!)
  const roleLabels: Record<string, string> = {
    MAHKUM: 'Mahkum/Tutuklu', AILE: 'Aile Üyesi', AVUKAT: 'Avukat',
    TAHLIYE: 'Tahliye Olan', GONULLU: 'Gönüllü',
  }
  const roleLabel = roleLabels[userRole] || userRole

  await resend.emails.send({
    from:    `Cezaevinden.com <${FROM}>`,
    to:      [ADMIN],
    subject: `Yeni Kayıt: ${userName} (${roleLabel})`,
    html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8" /></head>
<body style="font-family:Inter,sans-serif;background:#f0f2f5;padding:24px;margin:0">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
    <div style="background:#1B2B6B;padding:28px 32px;text-align:center">
      <span style="color:#fff;font-size:22px;font-weight:700">Cezaevinden</span><span style="color:#CC2229;font-size:22px;font-weight:700">.com</span>
      <p style="color:#93a8d8;margin:6px 0 0;font-size:13px">Yönetici Bildirimi</p>
    </div>
    <div style="padding:32px">
      <h1 style="font-size:18px;font-weight:700;color:#1c1e21;margin:0 0 16px">Yeni Kullanıcı Kaydı</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#65676b;width:120px">Ad Soyad</td><td style="padding:8px 0;font-weight:600;color:#1c1e21">${userName}</td></tr>
        <tr><td style="padding:8px 0;color:#65676b">E-posta</td><td style="padding:8px 0;font-weight:600;color:#1c1e21">${userEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#65676b">Rol</td><td style="padding:8px 0;font-weight:600;color:#CC2229">${roleLabel}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e4e6eb;margin:20px 0"/>
      <a href="https://cezaevinden.vercel.app/admin" style="display:inline-block;background:#1B2B6B;color:#fff;font-weight:600;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none">
        Admin Panele Git
      </a>
    </div>
  </div>
</body>
</html>`,
  })
}
