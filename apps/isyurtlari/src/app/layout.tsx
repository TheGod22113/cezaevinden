import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'İsyurtları - Adalet Bakanlığı',
  description: 'Cezaevi işyurtları tarafından üretilen kaliteli ürünler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="text-3xl">🏭</div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">İsyurtları</h1>
                <p className="text-xs text-gray-500">Adalet Bakanlığı</p>
              </div>
            </Link>
            <nav className="flex gap-6 items-center">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Ürünler
              </Link>
              <a
                href="https://cezaevinden.com"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sosyal Platform
              </a>
              <Link
                href="/sepet"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                🛒 Sepet
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-4">İsyurtları</h3>
                <p className="text-gray-400 text-sm">
                  Adalet Bakanlığı cezaevi işyurtlarında üretilen kaliteli ürünler
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Kategoriler</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link href="/gida-urunleri" className="hover:text-white transition">Gıda Ürünleri</Link></li>
                  <li><Link href="/tekstil-urunleri" className="hover:text-white transition">Tekstil Ürünleri</Link></li>
                  <li><Link href="/mobilya-urunleri" className="hover:text-white transition">Mobilya</Link></li>
                  <li><Link href="/dokuma" className="hover:text-white transition">Dokuma</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Hızlı Linkler</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Hakkında</a></li>
                  <li><a href="#" className="hover:text-white transition">İletişim</a></li>
                  <li><a href="#" className="hover:text-white transition">Gizlilik</a></li>
                  <li><a href="#" className="hover:text-white transition">Kullanım Koşulları</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">İletişim</h3>
                <p className="text-gray-400 text-sm">
                  <a href="mailto:info@isyurtlari.com.tr" className="hover:text-white transition">
                    info@isyurtlari.com.tr
                  </a>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  <a href="tel:+905551234567" className="hover:text-white transition">
                    +90 555 123 4567
                  </a>
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2026 Adalet Bakanlığı İsyurtları. Tüm hakları saklıdır.
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
                  <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
                  <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
