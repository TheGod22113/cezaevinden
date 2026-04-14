import type { Metadata } from 'next';
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
        {children}
      </body>
    </html>
  );
}
