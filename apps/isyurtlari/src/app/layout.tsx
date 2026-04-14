import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'İsyurtları | Adalet Bakanlığı İşyurtları Ürünleri',
  description: 'Cezaevi işyurtlarında üretilen yüksek kaliteli ürünler. Gıda, tekstil, mobilya ve daha fazlası.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-white text-gray-900">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 hover:opacity-75 transition">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  Î
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">İsyurtları</h1>
                  <p className="text-xs text-gray-500">Adalet Bakanlığı</p>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:bg-gray-50 transition"
                />
              </div>

              {/* Navigation */}
              <nav className="flex items-center gap-8">
                <a
                  href="https://cezaevinden.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition hidden sm:inline"
                >
                  Platform
                </a>
                <Link
                  href="/sepet"
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Hakkında</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Biz Kimiz</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Haberler</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Kariyer</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Kategoriler</h3>
                <ul className="space-y-2">
                  <li><Link href="/gida-urunleri" className="text-gray-400 hover:text-white text-sm transition">Gıda</Link></li>
                  <li><Link href="/tekstil-urunleri" className="text-gray-400 hover:text-white text-sm transition">Tekstil</Link></li>
                  <li><Link href="/mobilya-urunleri" className="text-gray-400 hover:text-white text-sm transition">Mobilya</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Yardım</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">İletişim</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">SSS</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Gizlilik</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">Sosyal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Instagram</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm transition">Facebook</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wide">İletişim</h3>
                <p className="text-gray-400 text-sm">info@isyurtlari.com.tr</p>
                <p className="text-gray-400 text-sm mt-2">+90 (212) 123 45 67</p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm text-center">
                © 2026 Adalet Bakanlığı İsyurtları. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
