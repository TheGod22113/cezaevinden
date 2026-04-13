'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: 'CREDIT_CARD' | 'TRANSFER';
  status: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/isyurtlari/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push('/isyurtlari');
        } else {
          setOrder(data);
        }
      })
      .catch(() => router.push('/isyurtlari'))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Sipariş bulunamadı</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Sipariş Numarası</p>
          <p className="text-2xl font-bold">{order.orderNumber}</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
          <div className="space-y-3 mb-6 pb-6 border-b">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  ₺{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Toplam:</span>
            <span className="text-blue-600">₺{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Kredi Kartı */}
      {order.paymentMethod === 'CREDIT_CARD' && (
        <div className="bg-blue-50 rounded-lg shadow p-6 mb-6 border border-blue-200">
          <h2 className="text-lg font-semibold mb-4 text-blue-900">💳 Kredi Kartı ile Ödeme</h2>
          <p className="text-gray-700 mb-4">
            Ödeme sistemi henüz kurulumda. Lütfen biraz sonra tekrar deneyin veya havale yöntemiyle ödeme yapın.
          </p>
          <button
            onClick={() => router.push('/isyurtlari')}
            className="text-blue-600 hover:underline"
          >
            Geri Dön
          </button>
        </div>
      )}

      {/* Havale */}
      {order.paymentMethod === 'TRANSFER' && (
        <div className="bg-amber-50 rounded-lg shadow p-6 border border-amber-200">
          <h2 className="text-lg font-semibold mb-4 text-amber-900">🏦 Banka Transferi / Havale</h2>

          <div className="bg-white p-4 rounded mb-4 space-y-3">
            <div>
              <p className="text-gray-600 text-sm">Alıcı Adı</p>
              <p className="font-semibold">Adalet Bakanlığı İsyurtları Müdürlüğü</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm">IBAN</p>
              <p className="font-mono font-bold text-lg">TR12 0001 2345 6789 0123</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Banka</p>
                <p className="font-semibold">Ziraat Bankası</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Şube</p>
                <p className="font-semibold">Ankara</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm">Açıklama (Referans)</p>
              <p className="font-mono bg-gray-100 p-2 rounded">
                {order.orderNumber}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-800 text-sm">
              <strong>⚠️ Önemli:</strong> Havale yaptıktan sonra sipariş durumu "Bekleniyor" olarak kalacaktır.
              İdari ekip ödemenizi doğruladıktan sonra sipariş onaylanacak ve kargo işlemi başlayacaktır.
              (1-2 iş günü sürebilir)
            </p>
          </div>

          <button
            onClick={() => router.push('/isyurtlari')}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Alışverişe Dön
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <p className="text-gray-600 mb-4">Siparişlerinizi görmek için:</p>
        <Link href="/isyurtlari/siparislerim" className="text-blue-600 hover:underline font-semibold">
          Siparişlerim
        </Link>
      </div>
    </div>
  );
}
