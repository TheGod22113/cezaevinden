'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Geri
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Hakkımızda</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
          {/* Misyon */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              İsyurtları, Adalet Bakanlığı cezaevi işyurtlarında üretilen yüksek kaliteli ürünleri
              müşterilerimize sunarak sosyal sorumluluk taşımaktır. Her satın alma, ceza infaz kurumlarındaki
              bireylerin rehabilitasyonunu ve sosyal entegrasyonunu desteklemeye yardımcı olur.
            </p>
          </section>

          {/* Vizyon */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              Toplumun tüm kesimlerinin işyurtları ürünlerine güvenle erişebildiği, ceza infaz kurumlarında
              üretilen ürünlerin kalitesi ve çeşitliliğinin arttığı, sosyal rehabilitasyonun ön planda
              tutulduğu bir Türkiye'yi hedefliyoruz.
            </p>
          </section>

          {/* Değerler */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Kalite</h3>
                  <p className="text-sm text-gray-600">Her ürün titiz üretim süreçleri ve kalite kontrolünden geçer</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">🤝</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Güvenilirlik</h3>
                  <p className="text-sm text-gray-600">Adalet Bakanlığı'nın denetimi altında işletilen işyurtları</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">❤️</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Sosyal Sorumluluk</h3>
                  <p className="text-sm text-gray-600">Her satın alma sosyal programları ve rehabilitasyonu destekler</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl">🌱</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Sürdürülebilirlik</h3>
                  <p className="text-sm text-gray-600">Çevreye duyarlı ve sürdürülebilir üretim yöntemleri</p>
                </div>
              </div>
            </div>
          </section>

          {/* İşyurtları */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">İşyurtları Nedir?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              İşyurtları, Adalet Bakanlığı Ceza İnfaz Kurumları tarafından işletilen ve cezaevi
              mahkûmlarının çalıştırıldığı işletmelerdir. Bu işletmelerde üretilen ürünler,
              mahkûmların rehabilitasyonuna, meslek sahibi olmalarına ve topluma kazı kişi olarak
              dönüşlerine katkı sağlar.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-blue-900 text-sm">
                <strong>Sosyal Etki:</strong> İşyurtlarından alışveriş yaparak, ceza infaz kurumlarındaki
                bireylerin sosyal entegrasyonunu desteklemiş olursunuz.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
