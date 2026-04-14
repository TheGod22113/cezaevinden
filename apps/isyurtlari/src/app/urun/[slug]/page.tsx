'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  'geleneksel-hali': '🧵',
  'kilim-2x3m': '🧵',
  'masa-ortusü': '🧵',
  'yaslik-ortüsü': '🧵',
  'perde-metre': '🧵',
  'duvar-ortüsü': '🧵',
  'sofra-havlusu': '🧵',
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ürün yüklenirken hata:', error);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (!product) return <div className="text-center py-8 text-red-600">Ürün bulunamadı</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Geri
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center border border-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <span className="text-9xl drop-shadow-lg">
                    {productEmojis[product.slug] || '📦'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category Badge */}
            <div className="inline-block">
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                {product.category.name}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="mb-6">
              {product.quantity > 0 && product.price > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {product.quantity} adet stokta
                </div>
              ) : product.quantity === 0 ? (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Tükendi
                </div>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Price Section */}
            <div className="mb-8">
              {product.price === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800 font-medium">
                    Fiyat Belirleniyor
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Bu ürünün fiyatı yakında açıklanacaktır.
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-sm text-gray-500">Fiyat</span>
                  <p className="text-5xl font-bold text-blue-600 mb-4">
                    ₺{product.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
                ✓ {message}
              </div>
            )}

            {/* Add to Cart Section */}
            {product.price === 0 ? (
              <button disabled className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
                Fiyat Beklemede
              </button>
            ) : product.quantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-2 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded transition font-bold text-lg"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-transparent outline-none font-bold text-lg"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-700 hover:bg-gray-200 rounded transition font-bold text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setMessage(`${quantity} adet sepete eklendi!`)}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
                >
                  🛒 Sepete Ekle ({quantity} adet)
                </button>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
                Tükendi
              </button>
            )}

            {/* Info Cards */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-2xl mb-2">🏭</div>
                <p className="font-semibold text-gray-900 text-sm">İşyurtlarda Üretilmiş</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-2xl mb-2">✨</div>
                <p className="font-semibold text-gray-900 text-sm">Yüksek Kalite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
