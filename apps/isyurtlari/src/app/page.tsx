'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdRestaurant, MdDry, MdForest, MdStyle, MdChair, MdSettings, MdLocalShipping, MdVerified, MdStar, MdArrowForward } from 'react-icons/md';

interface Category { id: string; name: string; slug: string; }
interface Product { id: string; name: string; slug: string; price: number; quantity: number; imageUrl?: string; category: { name: string; slug: string }; }

const categoryConfig: Record<string, { Icon: React.ElementType; gradient: string; textColor: string }> = {
  'gida-urunleri':        { Icon: MdRestaurant, gradient: 'from-emerald-500 to-green-400',   textColor: 'text-white' },
  'tekstil-urunleri':     { Icon: MdDry,        gradient: 'from-blue-600 to-cyan-400',        textColor: 'text-white' },
  'ahsap-urunler':        { Icon: MdForest,     gradient: 'from-amber-600 to-yellow-400',     textColor: 'text-white' },
  'dokuma':               { Icon: MdStyle,      gradient: 'from-purple-600 to-pink-400',      textColor: 'text-white' },
  'mobilya-urunleri':     { Icon: MdChair,      gradient: 'from-rose-600 to-orange-400',      textColor: 'text-white' },
  'demir-metal-urunleri': { Icon: MdSettings,   gradient: 'from-slate-600 to-gray-400',       textColor: 'text-white' },
};

const productEmojis: Record<string, string> = {
  'badem':'🌰','biber-receli':'🫙','biber-salcasi':'🌶️','domates-salcasi':'🍅',
  'findik':'🥜','incir-receli':'🍓','kuru-baklagil':'🫘','pirinc':'🍚',
  'tereyag':'🧈','yesil-zeytin':'🫒','zeytinyag':'🫒','peynir':'🧀',
  'havlu-beyaz':'🛁','havlu-renkli':'🛁','ahsap-sandalye':'🪑','ahsap-masa':'🪑',
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [ticker, setTicker]         = useState(0);

  const announcements = [
    '🚚 Tüm siparişlerde ücretsiz kargo!',
    '✅ Adalet Bakanlığı onaylı kalite güvencesi',
    '❤️ Her alışveriş sosyal projelere destek olur',
    '🏭 Cezaevi işyurtlarında el yapımı ürünler',
  ];

  useEffect(() => {
    const id = setInterval(() => setTicker((t) => (t + 1) % announcements.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ]).then(([cats, prods]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods.slice(0, 8) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ─── ANNOUNCEMENT BAR ─── */}
      <div className="bg-[#1B2E5E] text-white text-xs font-medium py-2 text-center overflow-hidden">
        <span className="transition-all duration-500">{announcements[ticker]}</span>
      </div>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-[#1B2E5E]">
        {/* background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6000] opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 opacity-10 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-screen-xl mx-auto px-4 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FF6000]/20 border border-[#FF6000]/40 text-orange-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <MdVerified size={14} /> Adalet Bakanlığı Onaylı
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-[1.05] mb-5">
              Kaliteli <br />
              <span className="text-[#FF6000]">Yerli</span> Ürünler
            </h1>
            <p className="text-blue-200 text-lg mb-8 max-w-md leading-relaxed">
              İşyurtlarında üretilen el yapımı ürünler. Alışverişiniz sosyal projelere katkı sağlar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/gida-urunleri" className="bg-[#FF6000] hover:bg-[#e55500] text-white font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-900/30 flex items-center gap-2">
                Alışverişe Başla <MdArrowForward size={18} />
              </Link>
              <Link href="/hakkimizda" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all border border-white/20">
                Hakkımızda
              </Link>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
              {[['500+', 'Ürün'], ['6', 'Kategori'], ['100%', 'Yerli']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-[#FF6000]">{val}</p>
                  <p className="text-blue-300 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {['Gıda Ürünleri 🍽️', 'Tekstil 🧵', 'Mobilya 🛋️', 'Ahşap 🪵'].map((item, i) => (
              <div
                key={item}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all cursor-default"
                style={{ transform: i % 2 === 1 ? 'translateY(20px)' : 'translateY(0)' }}
              >
                <p className="text-2xl mb-2">{item.split(' ').slice(-1)[0]}</p>
                <p className="text-white font-semibold text-sm">{item.split(' ').slice(0, -1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[#FF6000] text-xs font-bold uppercase tracking-widest mb-1">Kategoriler</p>
            <h2 className="text-2xl font-black text-gray-900">Ne Arıyorsunuz?</h2>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-2xl bg-gray-200 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const cfg = categoryConfig[cat.slug];
              const Icon = cfg?.Icon ?? MdSettings;
              return (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cfg?.gradient ?? 'from-gray-500 to-gray-400'} p-4 flex flex-col items-center justify-center text-center min-h-[7rem] hover:scale-105 hover:shadow-xl transition-all duration-200 shadow-md`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/30 transition-colors">
                    <Icon size={24} color="white" />
                  </div>
                  <p className="text-white text-xs font-bold leading-tight drop-shadow">{cat.name}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ─── CAMPAIGN BANNERS ─── */}
      <section className="max-w-screen-xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/gida-urunleri" className="group col-span-1 md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B2E5E] to-[#2d4a8c] p-7 flex items-center justify-between min-h-40 hover:shadow-xl transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6000]/10 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="relative z-10">
              <span className="bg-[#FF6000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">Öne Çıkan</span>
              <h3 className="text-white text-3xl font-black mb-1">Gıda Ürünleri</h3>
              <p className="text-blue-200 text-sm mb-4">Doğal, taze, güvenilir</p>
              <span className="inline-flex items-center gap-1 bg-white text-[#1B2E5E] text-xs font-black px-4 py-2 rounded-lg group-hover:bg-[#FF6000] group-hover:text-white transition-colors">
                İncele <MdArrowForward size={14} />
              </span>
            </div>
            <span className="text-8xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all">🍽️</span>
          </Link>

          <Link href="/tekstil-urunleri" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 p-7 flex flex-col justify-between min-h-40 hover:shadow-xl transition-all">
            <div>
              <h3 className="text-white text-2xl font-black mb-1">Tekstil</h3>
              <p className="text-purple-100 text-sm">El yapımı kumaşlar</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                Görüntüle <MdArrowForward size={12} />
              </span>
              <span className="text-5xl opacity-50 group-hover:scale-110 transition-transform">🧵</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="max-w-screen-xl mx-auto px-4 pb-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[#FF6000] text-xs font-bold uppercase tracking-widest mb-1">Ürünler</p>
            <h2 className="text-2xl font-black text-gray-900">Öne Çıkanlar</h2>
          </div>
          <Link href="/gida-urunleri" className="flex items-center gap-1 text-[#FF6000] hover:text-[#cc4e00] text-sm font-bold transition-colors">
            Tümü <MdArrowForward size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/urun/${product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative h-44 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{productEmojis[product.slug] ?? '📦'}</span>
                  )}
                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">Tükendi</span>
                    </div>
                  )}
                  {product.quantity > 0 && (
                    <span className="absolute top-2 right-2 bg-[#FF6000] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">YENİ</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{product.category.name}</p>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-[#FF6000] transition-colors leading-snug">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    {[1,2,3,4,5].map((s) => <MdStar key={s} size={11} color="#FF6000" />)}
                    <span className="text-[10px] text-gray-400 ml-1">5.0</span>
                  </div>
                  {product.price > 0 ? (
                    <p className="text-lg font-black text-[#FF6000]">₺{product.price.toFixed(2)}</p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Fiyat belirleniyor</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── WHY US BANNER ─── */}
      <section className="max-w-screen-xl mx-auto px-4 pb-10">
        <div className="bg-gradient-to-r from-[#1B2E5E] to-[#2d4a8c] rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { Icon: MdLocalShipping, title: 'Ücretsiz Kargo',     desc: 'Tüm siparişlerde Türkiye geneli'     },
            { Icon: MdVerified,      title: 'Kalite Güvencesi',   desc: 'Resmi denetimden geçmiş ürünler'    },
            { Icon: MdStar,          title: 'Sosyal Sorumluluk',  desc: 'Her alışveriş fark yaratır'         },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6000] rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={24} color="white" />
              </div>
              <div>
                <p className="text-white font-black">{title}</p>
                <p className="text-blue-200 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
