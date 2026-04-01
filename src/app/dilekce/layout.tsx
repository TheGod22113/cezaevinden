import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dilekçe Şablonları',
  description: 'Cezaevi süreçlerinde kullanabileceğiniz ücretsiz dilekçe şablonları. Denetimli serbestlik, koşullu salıverilme, açık cezaevi ve daha fazlası.',
  keywords: ['dilekçe', 'denetimli serbestlik dilekçe', 'koşullu salıverilme', 'açık cezaevi', 'cezaevi dilekçe'],
}

export default function DilekceLayout({ children }: { children: React.ReactNode }) {
  return children
}
