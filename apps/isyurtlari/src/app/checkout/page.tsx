'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug: string;
  imageUrl?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'transfer'>('credit_card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/sepet');
      return;
    }
    setCart(savedCart);
    setLoading(false);
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    if (paymentMethod === 'credit_card') {
      // TODO: Iyzico ödeme entegrasyonu
      alert('Kredi kartı ödeme entegrasyonu yapılıyor...');
      console.log('Credit card payment:', { ...formData, cart, total });
    } else {
      // TODO: Havale ödeme
      alert('Havale talimatları e-mailinize gönderilecektir');
      console.log('Transfer payment:', { ...formData, cart, total });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <Link href="/sepet" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Geri
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Ödeme</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Kişisel Bilgiler */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Kişisel Bilgiler</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adınız Soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+90 (5XX) XXX XX XX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Teslimat Adresi */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Teslimat Adresi</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ev/İş adresi"
                    required
                  />
                </div>
              </div>

              {/* Ödeme Yöntemi */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ödeme Yöntemi</h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{borderColor: paymentMethod === 'credit_card' ? '#2563eb' : undefined,
                            backgroundColor: paymentMethod === 'credit_card' ? '#eff6ff' : undefined}}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Kredi Kartı</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard ve daha fazla</p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{borderColor: paymentMethod === 'transfer' ? '#2563eb' : undefined,
                            backgroundColor: paymentMethod === 'transfer' ? '#eff6ff' : undefined}}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-4 flex-1">
                      <p className="font-semibold text-gray-900">Havale / EFT</p>
                      <p className="text-sm text-gray-600">Manuel ödeme onayı gerekir</p>
                    </div>
                    <span className="text-2xl">🏦</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {paymentMethod === 'credit_card' ? 'Kredi Kartı ile Ödeme Yap' : 'Havale ile Devam Et'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">×{item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KDV (%10)</span>
                  <span>₺{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
