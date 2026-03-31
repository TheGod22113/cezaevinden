import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arama',
  description: 'Cezaevinden.com\'da konu, kullanıcı ve haber arayın.',
  robots: { index: false, follow: false },
}

export default function AramaLayout({ children }: { children: React.ReactNode }) {
  return children
}
