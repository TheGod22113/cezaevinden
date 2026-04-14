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

export default function IsyurtlariPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/isyurtlari/categories')
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

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;

  if (categories.length === 0) {
    return <div className="text-center py-8 text-gray-500">Hiç kategori bulunamadı.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Adalet Bakanlığı İsyurtları</h1>
      <p className="text-gray-600 mb-8">Cezaevi işyurtlarında üretilen kaliteli ürünleri keşfedin</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/isyurtlari/${category.slug}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition border overflow-hidden group"
          >
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-7xl">{categoryEmojis[category.slug] || '📦'}</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600 text-sm">
                {category.description || 'Ürünleri keşfet'}
              </p>
              <div className="mt-4 text-blue-600 font-medium text-sm">
                Ürünleri Gör →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
