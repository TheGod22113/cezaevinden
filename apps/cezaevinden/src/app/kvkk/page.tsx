export const metadata = { title: 'KVKK Aydınlatma Metni — Cezaevinden.com' }

export default function KvkkPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-navy-700 mb-2">KVKK Aydınlatma Metni</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: Mart 2025</p>
      <div className="card p-6 prose prose-sm max-w-none text-gray-700 space-y-6">
        {[
          { title: '1. Veri Sorumlusu', content: 'Cezaevinden.com ("Platform"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatını taşımaktadır.' },
          { title: '2. İşlenen Kişisel Veriler', content: 'Ad-soyad, e-posta adresi, şifre (şifreli olarak), kullanıcı adı, rol bilgisi (mahkum/aile/avukat vs.), paylaşılan içerikler, IP adresi ve cihaz bilgileri işlenmektedir.' },
          { title: '3. Kişisel Verilerin İşlenme Amaçları', content: 'Üyelik hizmetinin sunulması, platform güvenliğinin sağlanması, hukuki yükümlülüklerin yerine getirilmesi, gönüllü avukat eşleştirme hizmetinin sunulması ve istatistiksel analizler amacıyla verileriniz işlenmektedir.' },
          { title: '4. Kişisel Verilerin Aktarılması', content: 'Verileriniz; yasal zorunluluklar dışında üçüncü taraflarla paylaşılmamaktadır. Platform altyapısı için kullanılan Neon.tech (Avrupa sunucuları) ile paylaşılmaktadır.' },
          { title: '5. Veri Sahibinin Hakları', content: 'KVKK\'nın 11. maddesi kapsamında; kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme, silinmesini isteme ve itiraz etme haklarına sahipsiniz. Talepleriniz için: kvkk@cezaevinden.com' },
          { title: '6. Veri Güvenliği', content: 'Verileriniz SSL/TLS ile şifreli iletilmekte, bcrypt ile şifrelenmiş parola saklanmakta ve anonim paylaşım modu ile kimlik gizliliği korunmaktadır.' },
          { title: '7. Anonim Mod', content: 'Anonim paylaşım modunda gönderileriniz diğer kullanıcılara anonim görünür. Ancak platform, hukuki zorunluluklar halinde kimlik bilgilerinize erişebilir.' },
        ].map(({ title, content }) => (
          <div key={title}>
            <h2 className="font-bold text-gray-900 mb-1">{title}</h2>
            <p className="leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
