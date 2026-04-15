'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LuHouse, LuBadgeCheck, LuHeart, LuGraduationCap, LuUsers } from 'react-icons/lu';

const categoryPurpose: Record<string, { purpose: string; trainingHours: number; skillDescription: string }> = {
  'gida-urunleri': { purpose: 'Beslenme & Aşçılık Eğitimi', trainingHours: 40, skillDescription: 'Profesyonel aşçılık ve beslenme bilgisi' },
  'tekstil-urunleri': { purpose: 'Derzillik Meslek Eğitimi', trainingHours: 48, skillDescription: 'Kumaş işleme ve dikiş becerisi' },
  'ahsap-urunler': { purpose: 'Marangozluk Eğitimi', trainingHours: 60, skillDescription: 'Ahşap işçiliği ve tasarım becerisi' },
  'dokuma': { purpose: 'Dokuma & Sanat Terapisi', trainingHours: 50, skillDescription: 'Geleneksel dokuma teknikleri' },
  'mobilya-urunleri': { purpose: 'Mobilya Tasarım Eğitimi', trainingHours: 65, skillDescription: 'Furniture tasarım ve üretim becerisi' },
  'demir-metal-urunleri': { purpose: 'Metal İşleri Eğitimi', trainingHours: 55, skillDescription: 'Metal işleri ve tornacılık becerisi' },
};

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: { name: string; slug: string };
}

const productEmojis: Record<string, string> = {
  'badem':'🌰','biber-receli':'🫙','biber-salcasi':'🌶️','cekirdek':'🌻',
  'domates-salcasi':'🍅','findik':'🥜','hasas-ezme':'🫙','incir-receli':'🍓',
  'kuru-baklagil':'🫘','pirinc':'🍚','sari-uzum':'🍇','siyah-uzum':'🍇',
  'tereyag':'🧈','uzum-pekmezi':'🫙','yer-fistagi':'🥜','yesil-zeytin':'🫒',
  'zeytinyag':'🫒','peynir':'🧀','havlu-beyaz':'🛁','havlu-renkli':'🛁',
  'carsaf-seti-cift':'🛏️','yastig-pamuk':'🛌','tulbent-beyaz':'🧵','uyku-gomlekleri':'👕',
  'ahsap-sandalye':'🪑','ahsap-masa':'🪑','kitap-rafi-ahsap':'📚','sehpa-ahsap':'🛋️',
  'yatak-basligi-ahsap':'🛏️','elbise-dolabi-ahsap':'🚪','kapi-kollari':'🚪',
  'sarniyeler':'🔧','civi-seti':'🔨','vida-civi-seti':'🔩','metal-aski':'⚙️','kilitler':'🔐',
  'geleneksel-hali':'🧵','kilim-2x3m':'🧵','masa-ortusü':'🧵','yaslik-ortüsü':'🧵',
  'perde-metre':'🧵','duvar-ortüsü':'🧵','sofra-havlusu':'🧵',
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => { setProduct(data?.id ? data : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: { id: string }) => i.id === product.id);
    if (existing) { existing.quantity += quantity; }
    else { cart.push({ id: product.id, name: product.name, price: product.price, quantity, slug: product.slug, imageUrl: product.imageUrl }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6000]" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">😕</span>
      <p className="text-gray-600 font-medium">Ürün bulunamadı</p>
      <Link href="/" className="bg-[#FF6000] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e55500] transition-colors">
        Ana Sayfaya Dön
      </Link>
    </div>
  );

  const inStock = product.quantity > 0;
  const hasPrice = product.price > 0;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6000] flex items-center gap-1 transition-colors">
              <LuHouse size={14} strokeWidth={2} /> Ana Sayfa
            </Link>
            <span>/</span>
            <Link href={`/${product.category.slug}`} className="hover:text-[#FF6000] transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── IMAGE ─── */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden aspect-square flex items-center justify-center relative">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[120px] select-none">{productEmojis[product.slug] ?? '📦'}</span>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white text-lg font-bold px-6 py-2 rounded-full">Tükendi</span>
              </div>
            )}
          </div>

          {/* ─── INFO ─── */}
          <div className="flex flex-col">

            {/* Category + stock */}
            <div className="flex items-center gap-3 mb-3">
              <Link
                href={`/${product.category.slug}`}
                className="bg-orange-100 text-[#FF6000] text-xs font-bold px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
              >
                {product.category.name}
              </Link>
              {inStock ? (
                <span className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Stokta
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Tükendi
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed mb-6 text-sm">
              {product.description}
            </p>

            {/* Price box */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 mb-5">
              {hasPrice ? (
                <>
                  <p className="text-sm text-gray-400 mb-1">Fiyat</p>
                  <p className="text-4xl font-extrabold text-[#FF6000]">
                    ₺{product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">KDV dahil · Ücretsiz kargo</p>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700">Fiyat Belirleniyor</p>
                    <p className="text-xs text-gray-400">Bu ürünün fiyatı yakında açıklanacak</p>
                  </div>
                </div>
              )}
            </div>

            {/* Add to cart */}
            {hasPrice && inStock ? (
              <div className="space-y-3">
                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">Adet:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                    >−</button>
                    <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                    >+</button>
                  </div>
                  <span className="text-xs text-gray-400">({product.quantity} adet mevcut)</span>
                </div>

                {/* Button */}
                {added ? (
                  <div className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                    <LuBadgeCheck size={20} strokeWidth={2} /> Sepete Eklendi! Teşekkürler 🙏
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#FF6000] hover:bg-[#e55500] text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-base"
                  >
                    <LuHeart size={18} strokeWidth={2} /> Destekle ve Sepete Ekle
                  </button>
                )}

                <Link
                  href="/sepet"
                  className="w-full border-2 border-[#FF6000] text-[#FF6000] hover:bg-orange-50 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  Sepete Git →
                </Link>
              </div>
            ) : !inStock ? (
              <button disabled className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
                Stokta Yok
              </button>
            ) : (
              <button disabled className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed">
                Fiyat Bekleniyor
              </button>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { Icon: LuGraduationCap, text: 'Meslek Eğitimi'   },
                { Icon: LuBadgeCheck,    text: 'Adalet Bakanlığı' },
                { Icon: LuHeart,         text: 'Sosyal Proje'     },
              ].map(({ Icon, text }) => (
                <div key={text} className="bg-blue-50 rounded-xl border border-blue-200 p-3 flex flex-col items-center gap-1.5 text-center">
                  <Icon size={22} color="#1d4ed8" />
                  <span className="text-xs font-medium text-blue-900">{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ─── MISSION & IMPACT SECTIONS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Purpose section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <LuGraduationCap size={22} color="white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Bu Ürün Kimden Geliyor?</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Bu ürün, <span className="font-semibold text-blue-900">{categoryPurpose[product.category.slug]?.purpose || 'Meslek Eğitimi'}</span> alan hükümlüler tarafından el emeğiyle üretilmiştir.
              </p>
              <p>
                🎯 <span className="font-semibold">Eğitim Hedefi:</span> {categoryPurpose[product.category.slug]?.skillDescription || 'Profesyonel beceri geliştirme'}
              </p>
              <p className="text-xs text-gray-600 italic border-l-4 border-blue-400 pl-3 mt-2">
                Her satın alma, bu bireyin yeniden başlama yolculuğuna ve topluma kazanılmasına direkt katkı sağlar.
              </p>
            </div>
          </div>

          {/* Impact section */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <LuUsers size={22} color="white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Yardımın Nasıl Kullanılacak?</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-lg">📚</span>
                <span><span className="font-semibold">Eğitim Programı:</span> {categoryPurpose[product.category.slug]?.trainingHours || 50} saat mesleki eğitime yatırım</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💼</span>
                <span><span className="font-semibold">Istihdam Desteği:</span> Yeniden başlayan bireyin iş arayışına destek</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">🤝</span>
                <span><span className="font-semibold">Reentegrasyon:</span> Topluma başarılı dönüş için gerekli tüm destek</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
