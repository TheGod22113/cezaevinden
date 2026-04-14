'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: {
    name: string;
    slug: string;
  };
}

const productEmojis: Record<string, string> = {
  'kapi-kollari': '🚪',
  'sarniyeler': '🔧',
  'civi-seti': '🔨',
  'vida-civi-seti': '🔩',
  'metal-aski': '⚙️',
  'kilitler': '🔐',
};

export default function DemirMetalUrunleriPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/isyurtlari/products?category=demir-metal-urunleri')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ürünler yüklenirken hata:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">Hiç ürün bulunamadı.</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/isyurtlari" className="text-blue-600 hover:underline">
          ← Geri
        </Link>
        <h1 className="text-3xl font-bold mt-2">Demir ve Metal Ürünleri</h1>
        <p className="text-gray-600 mt-2">Adalet Bakanlığı İsyurtları tarafından üretilen demir ve metal ürünleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/isyurtlari/${product.slug}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition border"
          >
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <span className="text-6xl">{productEmojis[product.slug] || '📦'}</span>
                  <p className="text-gray-700 text-xs mt-2 px-2">{product.name}</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-gray-700">
                  ₺{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {product.quantity > 0 ? 'Stokta' : 'Tükendi'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
