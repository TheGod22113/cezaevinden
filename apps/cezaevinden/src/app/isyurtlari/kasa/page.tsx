'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: string;
    paymentMethod: 'CREDIT_CARD' | 'TRANSFER';
  }>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'CREDIT_CARD',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/isyurtlari/cart');

      if (res.status === 401) {
        router.push('/giris');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/isyurtlari/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: formData.address,
          paymentMethod: formData.paymentMethod,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Sipariş oluşturulamadı');
        return;
      }

      // Başarı - ödeme sayfasına yönlendir
      router.push(`/isyurtlari/odeme/${data.orderId}`);
    } catch (error) {
      setMessage('Sipariş oluştururken hata oluştu');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>
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
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {message && (
              <div className={`p-3 rounded ${
                message.includes('hata') || message.includes('Sipariş')
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {message}
              </div>
            )}

            {/* Kişisel Bilgiler */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Ad Soyad"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded outline-none focus:border-blue-600"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded outline-none focus:border-blue-600"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Kargo Adresi */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Kargo Adresi</h2>
              <textarea
                name="address"
                placeholder="Tam adres (Mahalle, Sokak, No, İlçe, İl)"
                value={formData.address}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded outline-none focus:border-blue-600"
              />
            </div>

            {/* Ödeme Yöntemi */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Ödeme Yöntemi</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CREDIT_CARD"
                    checked={formData.paymentMethod === 'CREDIT_CARD'}
                    onChange={handleChange}
                  />
                  <div>
                    <p className="font-semibold">Kredi Kartı</p>
                    <p className="text-sm text-gray-600">Anında ödeme ve sipariş onayı</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="TRANSFER"
                    checked={formData.paymentMethod === 'TRANSFER'}
                    onChange={handleChange}
                  />
                  <div>
                    <p className="font-semibold">Banka Transferi / Havale</p>
                    <p className="text-sm text-gray-600">
                      Transferi yaptıktan sonra sipariş onaya gider
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'İşleniyor...' : 'Devam Et'}
            </button>
          </form>
        </div>

        {/* Özet */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

          <div className="space-y-3 mb-6 pb-6 border-b">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  ₺{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

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

          <div className="flex justify-between text-lg font-bold">
            <span>Toplam:</span>
            <span className="text-blue-600">₺{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
