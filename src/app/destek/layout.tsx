import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Destek Ağı — Cezaevinden.com',
  description: 'Türkiye genelinde cezaevi ziyareti, hukuki destek, psikolojik yardım ve tahliye sonrası rehabilitasyon hizmetleri.',
  keywords: ['cezaevi ziyareti', 'psikolojik destek', 'tahliye sonrası yardım', 'hukuki destek derneği', 'rehabilitasyon'],
  openGraph: {
    title: 'Destek Ağı — Cezaevinden.com',
    description: 'Türkiye genelinde destek kurum ve kuruluşlarını keşfedin.',
    url: 'https://cezaevinden.com/destek',
  },
}

export default function DestekLayout({ children }: { children: React.ReactNode }) {
  return children
}
