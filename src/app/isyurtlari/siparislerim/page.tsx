'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Ödeme Bekleniyor' },
  CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Onaylandı' },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Gönderildi' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Teslim Edildi' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'İptal' },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/isyurtlari/orders');

      if (res.status === 401) {
        router.push('/giris');
        return;
      }

      if (!res.ok) {
        throw new Error('Siparişler yüklenemedi');
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-6">Henüz siparişiniz yok</p>
          <Link
            href="/isyurtlari"
            className="bg-blue-600 text-white px-6 py-2 rounded inline-block hover:bg-blue-700 transition"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Siparişlerim ({orders.length})</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const statusInfo = statusColors[order.status] || statusColors.PENDING;
          const createdDate = new Date(order.createdAt);

          return (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{order.orderNumber}</h2>
                    <p className="text-gray-600 text-sm">
                      {createdDate.toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-4 py-2 rounded text-sm font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      {statusInfo.label}
                    </span>
                    <p className="text-2xl font-bold text-blue-600">
                      ₺{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Ürünler */}
                <div className="mb-4 pb-4 border-t border-b">
                  <p className="text-sm font-semibold text-gray-600 mb-3">Ürünler:</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="text-gray-700">
                          ₺{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ödeme Yöntemi */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Ödeme Yöntemi: <span className="font-semibold">
                      {order.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Banka Transferi'}
                    </span>
                  </p>
                </div>

                {/* Detay Linki */}
                <Link
                  href={`/isyurtlari/odeme/${order.id}`}
                  className="text-blue-600 hover:underline text-sm font-semibold"
                >
                  Detayları Gör →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          href="/isyurtlari"
          className="text-blue-600 hover:underline font-semibold"
        >
          ← Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}
