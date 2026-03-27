export const metadata = { title: 'Kullanım Koşulları — Cezaevinden.com' }

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-navy-700 mb-2">Kullanım Koşulları</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: Mart 2025</p>
      <div className="card p-6 space-y-6 text-gray-700 text-sm leading-relaxed">
        {[
          { title: '1. Kabul',
            content: 'Platforma kaydolarak veya platformu kullanarak bu koşulları kabul etmiş sayılırsınız.' },
          { title: '2. Kullanım Amacı',
            content: 'Platform; tutuklu ve hükümlüler, aileler ve gönüllüler arasında dayanışma, bilgi paylaşımı ve hukuki destek amacıyla kullanılabilir. Ticari amaçlı kullanım yasaktır.' },
          { title: '3. Yasak İçerikler',
            content: 'Kişisel saldırı, nefret söylemi, yanlış hukuki bilgi, üçüncü şahısların kişisel bilgilerinin paylaşımı, suç teşvik eden içerikler kesinlikle yasaktır.' },
          { title: '4. Avukatlar İçin Özel Koşullar',
            content: 'Avukat olarak kaydolan kullanıcılar, baro sicil numaralarının doğruluğunu taahhüt eder. Yanıltıcı hukuki bilgi paylaşımı hesap kapatmayı ve yasal sorumluluğu doğurur.' },
          { title: '5. Anonim Mod Sorumluluğu',
            content: 'Anonim mod kimliğinizi diğer kullanıcılardan gizler ancak platform yönetiminden gizlemez. Yasal zorunluluk halinde kimlik bilgileri yetkili makamlara verilebilir.' },
          { title: '6. İçerik Sahipliği',
            content: 'Paylaştığınız içeriklerin fikri mülkiyeti size aittir. Platformun, içerikleri site içinde gösterme, arşivleme ve moderasyon amacıyla işleme hakkı saklıdır.' },
          { title: '7. Hesap Kapatma',
            content: 'Kuralları ihlal eden hesaplar uyarı, askıya alma veya kalıcı kapatma yaptırımıyla karşılaşabilir. İtiraz için iletisim@cezaevinden.com adresine başvurabilirsiniz.' },
          { title: '8. Sorumluluk Reddi',
            content: 'Platformdaki içerikler bilgilendirme amaçlıdır. Avukat yanıtları dahil hiçbir içerik profesyonel hukuki tavsiye yerine geçmez. Platform bu konuda sorumluluk kabul etmez.' },
        ].map(({ title, content }) => (
          <div key={title}>
            <h2 className="font-bold text-gray-900 mb-1">{title}</h2>
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
