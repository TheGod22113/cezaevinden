export const metadata = { title: 'Gizlilik Politikası — Cezaevinden.com' }

export default function GizlilikPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-navy-700 mb-2">Gizlilik Politikası</h1>
      <p className="text-sm text-gray-400 mb-8">Son güncelleme: Mart 2025</p>
      <div className="card p-6 space-y-6 text-gray-700 text-sm leading-relaxed">
        {[
          { title: 'Gizliliğiniz Bizim Önceliğimiz',
            content: 'Cezaevinden.com, kullanıcılarının gizliliğini en üst düzeyde korumayı taahhüt eder. Bu platform, hassas bir kullanıcı kitlesine hizmet verdiğinden gizlilik ilkelerimiz standart platformlardan çok daha kapsamlıdır.' },
          { title: 'Topladığımız Veriler',
            content: 'Yalnızca hizmetin işleyişi için zorunlu olan veriler toplanır: e-posta, şifreli parola, kullanıcı adı ve rol. Telefon numarası, kimlik numarası veya adres toplanmaz.' },
          { title: 'Anonim Mod',
            content: 'Anonim modda paylaşılan içerikler diğer kullanıcılara tamamen anonim görünür. İsim, profil fotoğrafı veya rol bilgisi gösterilmez. Bu mod özellikle hassas içerik paylaşanlar için tasarlanmıştır.' },
          { title: 'Çerezler',
            content: 'Yalnızca oturum yönetimi için zorunlu çerezler kullanılır. Takip veya reklamcılık amaçlı çerez kullanılmaz.' },
          { title: 'Veri Saklama',
            content: 'Hesabınızı sildiğinizde tüm kişisel verileriniz 30 gün içinde kalıcı olarak silinir. Anonim gönderiler içerik olarak kalabilir ancak kimliğinizle ilişkilendirilemez.' },
          { title: 'Üçüncü Taraf',
            content: 'Verileriniz reklam şirketleri, veri brokerları veya herhangi bir üçüncü tarafla satılmaz veya paylaşılmaz.' },
          { title: 'İletişim',
            content: 'Gizlilik konusundaki sorularınız için: gizlilik@cezaevinden.com' },
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
