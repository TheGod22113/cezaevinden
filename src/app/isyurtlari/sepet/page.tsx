'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    slug: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/isyurtlari/cart');

      if (res.status === 401) {
        // Giriş yapılmamış
        setLoading(false);
        return;
      }

      const data = await res.json();
      setItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemoving(itemId);
    try {
      const res = await fetch(`/api/isyurtlari/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    try {
      const res = await fetch(`/api/isyurtlari/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sepetim</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-6">Sepetiniz boş</p>
          <Link
            href="/isyurtlari"
            className="bg-blue-600 text-white px-6 py-2 rounded inline-block hover:bg-blue-700 transition"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Sepetim ({items.length} ürün)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ürünler */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
              <div className="flex-1">
                <Link
                  href={`/isyurtlari/${item.product.slug}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {item.product.name}
                </Link>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  ₺{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={updating === item.id}
                    className="px-3 py-1 text-gray-600 disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    disabled={updating === item.id}
                    className="w-12 text-center border-l border-r outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    disabled={updating === item.id}
                    className="px-3 py-1 text-gray-600 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={removing === item.id}
                  className="text-red-600 text-sm hover:underline disabled:opacity-50"
                >
                  {removing === item.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Özet */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

          <div className="space-y-2 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam:</span>
              <span className="font-semibold">₺{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo:</span>
              <span className="font-semibold">Ücretsiz</span>
            </div>
          </div>

          <div className="flex justify-between mb-6 text-lg font-bold">
            <span>Toplam:</span>
            <span className="text-blue-600">₺{totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={() => router.push('/isyurtlari/kasa')}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Kasaya Git
          </button>

          <Link
            href="/isyurtlari"
            className="block text-center text-blue-600 hover:underline mt-4"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
