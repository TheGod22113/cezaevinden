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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            İsyurtları Ürünleri
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Adalet Bakanlığı cezaevi işyurtlarında üretilen, kaliteli ürünler. Her satın alma sosyal projeleri destekler.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all p-6 flex flex-col items-center justify-center text-center min-h-32"
              >
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {categoryEmojis[category.slug] || '📦'}
                </span>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="mt-16 bg-white rounded-lg border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="text-3xl">🏭</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">İşyurtlarda Üretilmiş</h3>
              <p className="text-sm text-gray-600">Adalet Bakanlığı cezaevi işyurtlarında özel olarak üretilmiştir</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Kalite Garantisi</h3>
              <p className="text-sm text-gray-600">Titiz üretim süreçleri ve kalite kontrolü garantisi</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-3xl">❤️</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Sosyal Etki</h3>
              <p className="text-sm text-gray-600">Satın aldığınız ürünler sosyal programları destekler</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
