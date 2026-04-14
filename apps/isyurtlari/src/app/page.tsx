'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const categoryEmojis: Record<string, string> = {
  'gida-urunleri': '🍽️',
  'tekstil-urunleri': '🧵',
  'ahsap-urunler': '🪵',
  'dokuma': '🧣',
  'mobilya-urunleri': '🛋️',
  'demir-metal-urunleri': '⚙️',
};

const categoryGradients: Record<string, string> = {
  'gida-urunleri': 'from-orange-100 to-red-100',
  'tekstil-urunleri': 'from-purple-100 to-pink-100',
  'ahsap-urunler': 'from-yellow-100 to-amber-100',
  'dokuma': 'from-indigo-100 to-blue-100',
  'mobilya-urunleri': 'from-amber-100 to-yellow-100',
  'demir-metal-urunleri': 'from-gray-100 to-slate-100',
};

const categoryColors: Record<string, string> = {
  'gida-urunleri': 'text-orange-600',
  'tekstil-urunleri': 'text-purple-600',
  'ahsap-urunler': 'text-yellow-700',
  'dokuma': 'text-indigo-600',
  'mobilya-urunleri': 'text-amber-700',
  'demir-metal-urunleri': 'text-gray-700',
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Kategoriler yüklenirken hata:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-16 text-gray-500">Yükleniyor...</div>;

  if (categories.length === 0) {
    return <div className="text-center py-16 text-gray-500">Hiç kategori bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            İsyurtları Ürünleri
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Adalet Bakanlığı cezaevi işyurtlarında üretilen, kaliteli ve güvenilir ürünler
          </p>
          <p className="text-blue-100 text-lg">
            Sosyal sorumluluk projelerini destekleyin, kaliteli ürünler satın alın
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Kategorilerimiz
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Altı farklı kategoride yüzden fazla ürün keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              {/* Card Image */}
              <div className={`h-56 bg-gradient-to-br ${categoryGradients[category.slug] || 'from-gray-100 to-gray-200'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-7xl drop-shadow-lg">
                  {categoryEmojis[category.slug] || '📦'}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className={`text-2xl font-bold ${categoryColors[category.slug] || 'text-gray-900'} mb-2`}>
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {category.description || 'Kaliteli ürünleri keşfet'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Ürünleri Gör
                  </span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Info Section */}
      <section className="bg-gray-50 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Işyurtlarda Üretilmiş</h3>
              <p className="text-gray-600">Tüm ürünler cezaevi işyurtlarında özel olarak üretilmiştir</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Yüksek Kalite</h3>
              <p className="text-gray-600">Titiz üretim süreçleri ve kalite kontrolü garantisi</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sosyal Etki</h3>
              <p className="text-gray-600">Satın aldığınız ürünler sosyal programları destekler</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
