import Link from 'next/link'
import { HiQuestionMarkCircle, HiChevronDown, HiArrowRight } from 'react-icons/hi2'

const faqs = [
  {
    q: 'Platforma nasıl üye olabilirim?',
    a: 'Sağ üstteki "Kayıt Ol" butonuna tıklayın. Rolünüzü seçin (mahkum, aile, tahliye edilmiş, avukat veya gönüllü), ardından hesap bilgilerinizi girin.',
  },
  {
    q: 'Anonim paylaşım nedir? Kimliğim gerçekten gizli mi?',
    a: 'Anonim modda paylaşımlarınız "Anonim Kullanıcı" olarak görünür; adınız ve profiliniz diğer kullanıcılara gösterilmez. Ancak yasal zorunluluk hâlinde yetkili makamlara hesap bilgisi sunulabilir.',
  },
  {
    q: 'Hukuki yardım ücretsiz mi?',
    a: 'Evet. Platforma kayıtlı gönüllü avukatlar sorularınızı ücretsiz yanıtlamaktadır. Bu bir hukuki danışmanlık hizmeti değil, bilgilendirme amaçlı topluluk desteğidir.',
  },
  {
    q: 'Avukat olmak istiyorum, nasıl başvurabilirim?',
    a: '"Avukat Ol" sayfasından başvurunuzu yapabilirsiniz. Baro numaranız doğrulandıktan sonra hesabınız aktif hâle gelir.',
  },
  {
    q: 'Şifremi unuttum ne yapmalıyım?',
    a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayın, e-posta adresinizi girin. Sıfırlama bağlantısı e-postanıza gönderilecektir.',
  },
  {
    q: 'Bir içeriği nasıl şikayet edebilirim?',
    a: 'Her gönderi ve yorum altındaki "Şikayet" butonunu kullanabilirsiniz. Moderasyon ekibimiz 24 saat içinde inceleyecektir.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Tüm verileriniz şifreli bağlantı (SSL/TLS) ile iletilir ve güvenli sunucularda saklanır. KVKK kapsamındaki haklarınız için gizlilik politikamızı inceleyin.',
  },
  {
    q: 'Mesajlaşma özelliği nasıl çalışır?',
    a: 'Giriş yaptıktan sonra herhangi bir kullanıcının profiline gidip "Mesaj Gönder" diyebilirsiniz. Mesajlar yalnızca siz ve karşı tarafından görülebilir.',
  },
]

export default function YardimPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <HiQuestionMarkCircle className="w-12 h-12 text-navy-700 mx-auto mb-3" />
        <h1 className="text-3xl font-black text-gray-900 mb-2">Yardım Merkezi</h1>
        <p className="text-gray-500">Sıkça sorulan sorular ve destek</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <input
          type="search"
          placeholder="Soru ara…"
          className="input-field pl-4"
        />
      </div>

      {/* FAQs */}
      <div className="space-y-3 mb-10">
        {faqs.map((faq, i) => (
          <details key={i} className="card group">
            <summary className="p-4 flex items-center justify-between cursor-pointer list-none font-semibold text-gray-900 text-sm">
              {faq.q}
              <HiChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>

      {/* Contact */}
      <div className="card p-6 text-center">
        <p className="font-bold text-gray-900 mb-1">Sorunuz burada yok mu?</p>
        <p className="text-sm text-gray-500 mb-4">
          Destek ekibimize ulaşın. Çalışma saatlerinde yanıtlıyoruz.
        </p>
        <Link href="/iletisim" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5">
          İletişime Geç <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
