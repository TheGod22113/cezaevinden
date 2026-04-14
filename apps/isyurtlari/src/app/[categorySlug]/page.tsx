'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  'badem': '🌰',
  'biber-receli': '🫙',
  'biber-salcasi': '🌶️',
  'cekirdek': '🌻',
  'domates-salcasi': '🍅',
  'findik': '🥜',
  'hasas-ezme': '🫙',
  'incir-receli': '🍓',
  'kuru-baklagil': '🫘',
  'pirinc': '🍚',
  'sari-uzum': '🍇',
  'siyah-uzum': '🍇',
  'tereyag': '🧈',
  'uzum-pekmezi': '🫙',
  'yer-fistagi': '🥜',
  'yesil-zeytin': '🫒',
  'zeytinyag': '🫒',
  'peynir': '🧀',
  'havlu-beyaz': '🛁',
  'havlu-renkli': '🛁',
  'carsaf-seti-cift': '🛏️',
  'yastig-pamuk': '🛌',
  'tulbent-beyaz': '🧵',
  'uyku-gomlekleri': '👕',
  'ahsap-sandalye': '🪑',
  'ahsap-masa': '🪑',
  'kitap-rafi-ahsap': '📚',
  'sehpa-ahsap': '🛋️',
  'yatak-basligi-ahsap': '🛏️',
  'elbise-dolabi-ahsap': '🚪',
  'kapi-kollari': '🚪',
  'sarniyeler': '🔧',
  'civi-seti': '🔨',
  'vida-civi-seti': '🔩',
  'metal-aski': '⚙️',
  'kilitler': '🔐',
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?category=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ürünler yüklenirken hata:', error);
        setLoading(false);
      });
  }, [categorySlug]);

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-500">Hiç ürün bulunamadı.</div>;
  }

  const categoryName = products[0]?.category.name || 'Ürünler';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Geri
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryName}</h1>
          <p className="text-gray-600 max-w-2xl">
            Adalet Bakanlığı İsyurtları tarafından dikkatli şekilde seçilmiş ve üretilen {categoryName.toLowerCase()} ürünleri. Kalite ve sosyal sorumluluk birleştirilmiştir.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Toplam {products.length} ürün
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/urun/${product.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-6xl drop-shadow-lg">
                      {productEmojis[product.slug] || '📦'}
                    </span>
                  </div>
                )}
                {product.price > 0 && product.quantity > 0 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Stokta
                  </div>
                )}
                {product.quantity === 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Tükendi
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-10">
                  {product.description}
                </p>

                {/* Price & Badge */}
                <div className="flex items-baseline justify-between pt-4 border-t border-gray-100">
                  <div>
                    {product.price === 0 ? (
                      <span className="text-sm text-gray-500 italic">Fiyat Belirleniyor</span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ₺{product.price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
