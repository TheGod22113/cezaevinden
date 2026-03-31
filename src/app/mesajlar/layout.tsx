import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mesajlar',
  description: 'Özel mesajlarınız',
  robots: { index: false, follow: false },
}

export default function MesajlarLayout({ children }: { children: React.ReactNode }) {
  return children
}
