'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  'pirnic': '🍚',
  'sari-uzum': '🍇',
  'siyah-uzum': '🍇',
  'tereyag': '🧈',
  'uzum-pekmezi': '🫙',
  'yer-fistagi': '🥜',
  'yesil-zeytin': '🫒',
  'zeytinyag': '🫒',
  'turk-bayragi-ozlu-havlu': '🛁',
  'organik-pamuk-carsaf-seti': '🛏️',
  'el-dokuma-hali-150x100': '🧵',
  'ahsap-kesme-tahtasi-seti': '🪵',
  'mermerli-mendil': '🧷',
  'ahsap-mutfak-takimi': '🥄',
  'ici-pamuk-yastig': '🛌',
  'dekoratif-ahsap-kutu': '📦',
  'dokuma-sal-merino-yun': '🧣',
  'organik-pamuk-elbise-kumasi': '🧵',
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/isyurtlari/products/${slug}`)
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

  const handleAddToCart = async () => {
    if (!product) return;

    setAdding(true);
    setMessage('');

    try {
      const res = await fetch('/api/isyurtlari/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setMessage('Lütfen giriş yapınız');
          setTimeout(() => router.push('/giris'), 1500);
        } else {
          setMessage(data.error || 'Sepete eklenemedi');
        }
        return;
      }

      setMessage(`${quantity} adet sepete eklendi!`);
      setQuantity(1);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Sepete eklerken hata oluştu');
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (!product) return <div className="text-center py-8 text-red-600">Ürün bulunamadı</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/isyurtlari" className="text-blue-600 hover:underline mb-6 inline-block">
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
            <div className={`p-3 rounded mb-6 ${
              message.includes('Lütfen giriş') || message.includes('hata')
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {message}
            </div>
          )}

          {product.price === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 rounded p-4 text-yellow-800">
              <p className="font-semibold">ℹ️ Bu ürünün fiyatı henüz belirlenmemiştir.</p>
              <p className="text-sm mt-1">Fiyat belirlendiğinde sepete ekleyebileceksiniz.</p>
            </div>
          ) : product.quantity > 0 ? (
            <div className="flex gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={adding}
                  className="px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={adding}
                  className="w-16 text-center border-l border-r outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  disabled={adding}
                  className="px-4 py-2 text-gray-600 disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {adding ? 'Ekleniyor...' : 'Sepete Ekle'}
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
