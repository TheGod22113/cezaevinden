'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdRestaurant, MdDry, MdForest, MdStyle, MdChair, MdSettings } from 'react-icons/md';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: { name: string; slug: string };
}

const categoryMeta: Record<string, { Icon: React.ElementType; color: string; bg: string; iconColor: string }> = {
  'gida-urunleri':        { Icon: MdRestaurant, color: 'text-green-700',  bg: 'bg-green-100',  iconColor: '#15803d' },
  'tekstil-urunleri':     { Icon: MdDry,        color: 'text-blue-700',   bg: 'bg-blue-100',   iconColor: '#1d4ed8' },
  'ahsap-urunler':        { Icon: MdForest,     color: 'text-amber-700',  bg: 'bg-amber-100',  iconColor: '#b45309' },
  'dokuma':               { Icon: MdStyle,      color: 'text-purple-700', bg: 'bg-purple-100', iconColor: '#7e22ce' },
  'mobilya-urunleri':     { Icon: MdChair,      color: 'text-rose-700',   bg: 'bg-rose-100',   iconColor: '#be123c' },
  'demir-metal-urunleri': { Icon: MdSettings,   color: 'text-slate-700',  bg: 'bg-slate-100',  iconColor: '#334155' },
};

const productEmojis: Record<string, string> = {
  'badem':'🌰','biber-receli':'🫙','biber-salcasi':'🌶️','domates-salcasi':'🍅',
  'findik':'🥜','incir-receli':'🍓','kuru-baklagil':'🫘','pirinc':'🍚',
  'tereyag':'🧈','yesil-zeytin':'🫒','zeytinyag':'🫒','peynir':'🧀',
  'havlu-beyaz':'🛁','havlu-renkli':'🛁','ahsap-sandalye':'🪑','ahsap-masa':'🪑',
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ])
      .then(([cats, prods]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods.slice(0, 8) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ─── HERO BANNER ─── */}
      <section className="bg-gradient-to-r from-[#1B2E5E] via-[#1e3a78] to-[#FF6000] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-xl">
            <span className="inline-block bg-[#FF6000] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Adalet Bakanlığı Onaylı
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              İşyurtlarında <br className="hidden md:block" />
              <span className="text-orange-300">Üretilen</span> Kalite
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Her satın aldığınız ürün, cezaevi işyurtlarındaki üretimi ve sosyal programları destekler.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/gida-urunleri"
                className="bg-[#FF6000] hover:bg-[#e55500] text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
              >
                Alışverişe Başla
              </Link>
              <Link
                href="/hakkimizda"
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg transition-colors border border-white/30"
              >
                Hakkımızda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK TRUST BAR ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { icon: '🚚', text: 'Türkiye\'ye Kargo' },
              { icon: '🔐', text: 'Güvenli Ödeme' },
              { icon: '🏭', text: 'Resmi Üretim' },
              { icon: '❤️', text: 'Sosyal Proje' },
            ].map((item) => (
              <div key={item.text} className="flex items-center justify-center gap-2 py-3 px-4">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">

        {/* ─── CATEGORIES ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const meta = categoryMeta[cat.slug];
                const Icon = meta?.Icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-md transition-all p-4 flex flex-col items-center justify-center text-center"
                  >
                    <div className={`w-14 h-14 ${meta?.bg ?? 'bg-gray-100'} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      {Icon ? (
                        <Icon size={28} color={meta.iconColor} />
                      ) : (
                        <MdSettings size={28} color="#64748b" />
                      )}
                    </div>
                    <p className={`text-xs font-bold ${meta?.color ?? 'text-gray-700'} leading-tight`}>{cat.name}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── CAMPAIGN BANNERS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/gida-urunleri" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-6 flex items-center justify-between min-h-36 hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <p className="text-green-100 text-sm font-medium mb-1">Doğal & Taze</p>
              <h3 className="text-white text-2xl font-extrabold mb-2">Gıda Ürünleri</h3>
              <span className="inline-block bg-white text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                İncele →
              </span>
            </div>
            <span className="text-7xl opacity-60 group-hover:scale-110 transition-transform">🍽️</span>
          </Link>

          <Link href="/tekstil-urunleri" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 p-6 flex items-center justify-between min-h-36 hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium mb-1">El Yapımı</p>
              <h3 className="text-white text-2xl font-extrabold mb-2">Tekstil Ürünleri</h3>
              <span className="inline-block bg-white text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                İncele →
              </span>
            </div>
            <span className="text-7xl opacity-60 group-hover:scale-110 transition-transform">🧵</span>
          </Link>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
            <Link href="/gida-urunleri" className="text-[#FF6000] hover:text-[#cc4e00] text-sm font-semibold transition-colors">
              Tümünü gör →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">
              <span className="text-5xl block mb-3">📦</span>
              <p>Ürünler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/urun/${product.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Image area */}
                  <div className="relative h-44 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {productEmojis[product.slug] || '📦'}
                      </span>
                    )}
                    {product.quantity === 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Tükendi</span>
                      </div>
                    )}
                    {product.quantity > 0 && product.price > 0 && (
                      <span className="absolute top-2 left-2 bg-[#FF6000] text-white text-xs font-bold px-2 py-0.5 rounded">
                        Stokta
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-[#FF6000] transition-colors">
                      {product.name}
                    </h3>
                    {product.price > 0 ? (
                      <p className="text-lg font-extrabold text-[#FF6000]">
                        ₺{product.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Fiyat belirleniyor</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ─── BOTTOM CAMPAIGN BANNERS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/mobilya-urunleri" className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-md transition-all p-5 flex items-center gap-4">
            <span className="text-4xl group-hover:scale-110 transition-transform">🛋️</span>
            <div>
              <p className="font-bold text-gray-900">Mobilya</p>
              <p className="text-xs text-gray-500">El yapımı kaliteli ürünler</p>
            </div>
          </Link>
          <Link href="/ahsap-urunler" className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-md transition-all p-5 flex items-center gap-4">
            <span className="text-4xl group-hover:scale-110 transition-transform">🪵</span>
            <div>
              <p className="font-bold text-gray-900">Ahşap Ürünler</p>
              <p className="text-xs text-gray-500">Doğal malzemelerden üretim</p>
            </div>
          </Link>
          <Link href="/demir-metal-urunleri" className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-md transition-all p-5 flex items-center gap-4">
            <span className="text-4xl group-hover:scale-110 transition-transform">⚙️</span>
            <div>
              <p className="font-bold text-gray-900">Metal Ürünler</p>
              <p className="text-xs text-gray-500">Dayanıklı ve güvenilir</p>
            </div>
          </Link>
        </section>

        {/* ─── WHY US ─── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-center text-gray-900 mb-6">Neden İsyurtları?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏭',
                title: 'Resmi Üretim',
                desc: 'Adalet Bakanlığı cezaevi işyurtlarında denetim altında üretilmektedir.',
              },
              {
                icon: '✅',
                title: 'Kalite Güvencesi',
                desc: 'Her ürün kalite kontrol süreçlerinden geçerek size ulaşır.',
              },
              {
                icon: '❤️',
                title: 'Sosyal Katkı',
                desc: 'Alışverişiniz rehabilitasyon ve sosyal programları destekler.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
