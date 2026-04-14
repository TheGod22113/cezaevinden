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
      <body className="bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              İsyurtları Ürünleri
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="text-blue-600 hover:underline">
                Ürünler
              </Link>
              <a href="https://cezaevinden.com" className="text-blue-600 hover:underline">
                Sosyal Platform
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2026 Adalet Bakanlığı İsyurtları. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
