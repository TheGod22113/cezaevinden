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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Geri Dön
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Resim */}
        <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <span className="text-9xl">{productEmojis[product.slug] || '📦'}</span>
              <p className="text-blue-600 text-xl mt-4">{product.name}</p>
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div>
          <p className="text-gray-500 mb-2">{product.category.name}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-2xl font-bold text-blue-600 mb-6">
            {product.price === 0 ? 'Fiyat Belirleniyor' : `₺${product.price.toFixed(2)}`}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <p className={`text-lg font-semibold ${
              product.quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.quantity > 0 ? `${product.quantity} adet stokta` : 'Tükendi'}
            </p>
          </div>

          {message && (
            <div className="p-3 rounded mb-6 bg-blue-100 text-blue-800">
              {message}
            </div>
          )}

          {product.price === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 rounded p-4 text-yellow-800">
              <p className="font-semibold">ℹ️ Bu ürünün fiyatı henüz belirlenmemiştir.</p>
            </div>
          ) : product.quantity > 0 ? (
            <div className="flex gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-l border-r outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-4 py-2 text-gray-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => setMessage(`${quantity} adet sepete eklendi!`)}
                className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
              >
                Sepete Ekle
              </button>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-400 rounded p-4 text-red-800">
              <p className="font-semibold">Bu ürün şu anda tükendi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
