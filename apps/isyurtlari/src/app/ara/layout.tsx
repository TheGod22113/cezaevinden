import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ürün Arama | isyurtlari.com.tr',
  description: 'isyurtlari.com.tr üzerinde ürün ara. Adalet Bakanlığı Sosyal Girişimi\'nin tüm ürünlerinde arama yapın.',
  robots: 'noindex',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
