import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bildirimler',
  description: 'Bildirimleriniz',
  robots: { index: false, follow: false },
}

export default function BildirimlerLayout({ children }: { children: React.ReactNode }) {
  return children
}
