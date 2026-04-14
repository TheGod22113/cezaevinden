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

  const handleAddToCart = () => {
    if (!product) return;

    try {
      // localStorage'dan sepeti al
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Aynı ürün varsa miktarını artır
      const existingItem = cart.find((item: any) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          slug: product.slug,
          imageUrl: product.imageUrl,
        });
      }

      // Sepeti kaydet
      localStorage.setItem('cart', JSON.stringify(cart));

      // Badge'i güncelle
      window.dispatchEvent(new Event('cartUpdated'));

      setMessage(`✓ ${quantity} adet sepete eklendi!`);
      setQuantity(1);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Sepete eklerken hata oluştu');
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (!product) return <div className="text-center py-8 text-red-600">Ürün bulunamadı</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Geri
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center border border-gray-200">
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
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {product.category.name}
            </span>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="mb-6">
              {product.quantity > 0 && product.price > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {product.quantity} adet stokta
                </div>
              ) : product.quantity === 0 ? (
                <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Tükendi
                </div>
              ) : null}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* Price Section */}
            <div className="mb-8">
              {product.price === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800 font-medium text-sm">
                    Fiyat Belirleniyor
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Bu ürünün fiyatı yakında açıklanacaktır.
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-sm text-gray-500">Fiyat</span>
                  <p className="text-4xl font-bold text-blue-600 mb-4">
                    ₺{product.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 text-sm">
                {message}
              </div>
            )}

            {/* Add to Cart Section */}
            {product.price === 0 ? (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed">
                Fiyat Beklemede
              </button>
            ) : product.quantity > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-0 bg-gray-100 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent outline-none font-bold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  🛒 Sepete Ekle
                </button>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed">
                Tükendi
              </button>
            )}

            {/* Info Cards */}
            <div className="mt-12 space-y-3">
              <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl">🏭</span>
                <div>
                  <p className="font-semibold text-sm text-gray-900">İşyurtlarda Üretilmiş</p>
                  <p className="text-xs text-gray-600">Adalet Bakanlığı cezaevi işyurtlarında</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Kalite Garantisi</p>
                  <p className="text-xs text-gray-600">Titiz üretim ve kalite kontrolü</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
