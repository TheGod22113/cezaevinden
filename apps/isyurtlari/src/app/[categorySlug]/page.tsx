'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MdRestaurant, MdDry, MdForest, MdStyle, MdChair, MdSettings, MdShoppingCart, MdHome } from 'react-icons/md';

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

const categoryMeta: Record<string, { Icon: React.ElementType; iconColor: string; bg: string; banner: string }> = {
  'gida-urunleri':        { Icon: MdRestaurant, iconColor: '#15803d', bg: 'bg-green-100',  banner: 'from-green-600 to-emerald-500'  },
  'tekstil-urunleri':     { Icon: MdDry,        iconColor: '#1d4ed8', bg: 'bg-blue-100',   banner: 'from-blue-600 to-indigo-500'    },
  'ahsap-urunler':        { Icon: MdForest,     iconColor: '#b45309', bg: 'bg-amber-100',  banner: 'from-amber-600 to-yellow-500'   },
  'dokuma':               { Icon: MdStyle,      iconColor: '#7e22ce', bg: 'bg-purple-100', banner: 'from-purple-600 to-violet-500'  },
  'mobilya-urunleri':     { Icon: MdChair,      iconColor: '#be123c', bg: 'bg-rose-100',   banner: 'from-rose-600 to-pink-500'      },
  'demir-metal-urunleri': { Icon: MdSettings,   iconColor: '#334155', bg: 'bg-slate-100',  banner: 'from-slate-600 to-gray-500'    },
};

const productPlaceholders: Record<string, string> = {
  'gida-urunleri': '🍽️', 'tekstil-urunleri': '🧵',
  'ahsap-urunler': '🪵', 'dokuma': '🧣',
  'mobilya-urunleri': '🛋️', 'demir-metal-urunleri': '⚙️',
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('default');

  useEffect(() => {
    fetch(`/api/products?category=${categorySlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categorySlug]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name, 'tr');
    return 0;
  });

  const meta = categoryMeta[categorySlug];
  const Icon = meta?.Icon ?? MdSettings;
  const categoryName = products[0]?.category.name ?? 'Ürünler';

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ─── CATEGORY BANNER ─── */}
      <div className={`bg-gradient-to-r ${meta?.banner ?? 'from-gray-600 to-gray-500'} text-white`}>
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <MdHome size={16} />
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-white font-medium">{loading ? '...' : categoryName}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon size={30} color="white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{loading ? '...' : categoryName}</h1>
              <p className="text-white/80 text-sm mt-1">
                {loading ? '' : `${products.length} ürün bulundu`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* ─── SORT BAR ─── */}
        <div className="flex items-center justify-between mb-5 bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500 font-medium">
            {loading ? '' : <><span className="text-gray-900 font-bold">{products.length}</span> ürün</>}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Sırala:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#FF6000] cursor-pointer"
            >
              <option value="default">Varsayılan</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
              <option value="name">İsim: A-Z</option>
            </select>
          </div>
        </div>

        {/* ─── LOADING ─── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* ─── EMPTY ─── */}
        {!loading && products.length === 0 && (
          <div className="bg-white rounded-2xl p-16 text-center">
            <span className="text-6xl block mb-4">{productPlaceholders[categorySlug] ?? '📦'}</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Bu kategoride ürün bulunamadı</h3>
            <p className="text-gray-400 mb-6">Yakında yeni ürünler eklenecek.</p>
            <Link href="/" className="bg-[#FF6000] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e55500] transition-colors">
              Ana Sayfaya Dön
            </Link>
          </div>
        )}

        {/* ─── PRODUCT GRID ─── */}
        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((product) => (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="group bg-white rounded-xl border border-gray-200 hover:border-[#FF6000] hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                      {productPlaceholders[categorySlug] ?? '📦'}
                    </span>
                  )}

                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Tükendi</span>
                    </div>
                  )}
                  {product.quantity > 0 && (
                    <span className="absolute top-2 left-2 bg-[#FF6000] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      Stokta
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] group-hover:text-[#FF6000] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {product.price > 0 ? (
                      <span className="text-lg font-extrabold text-[#FF6000]">
                        ₺{product.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Fiyat belirleniyor</span>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); /* sepet işlemi */ }}
                      className="w-8 h-8 bg-[#FF6000] hover:bg-[#e55500] text-white rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Sepete ekle"
                    >
                      <MdShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
