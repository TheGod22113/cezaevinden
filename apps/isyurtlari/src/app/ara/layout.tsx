import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ürün Arama | İşyurtları Online Mağaza',
  description: 'İşyurtları online mağazasında ürün ara. Adalet Bakanlığı tarafından üretilen sosyal girişim ürünlerinde arama yapın.',
  keywords: 'işyurtları arama, ürün ara, işyurtları ürünleri, adalet bakanlığı ürün',
  robots: 'noindex',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
