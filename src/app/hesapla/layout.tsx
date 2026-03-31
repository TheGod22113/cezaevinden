import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İnfaz Hesap Makinası',
  description: 'Koşullu salıverilme, denetimli serbestlik ve açık cezaevine geçiş tarihlerini ücretsiz hesaplayın. CGTİHK md. 107 esas alınır.',
  keywords: ['infaz hesaplama', 'koşullu salıverilme', 'denetimli serbestlik', 'tahliye tarihi', 'ceza hesaplama'],
  openGraph: {
    title: 'İnfaz Hesap Makinası — Cezaevinden.com',
    description: 'Koşullu salıverilme, denetimli serbestlik ve açık cezaevine geçiş tarihlerini hesaplayın.',
    url: 'https://cezaevinden.com/hesapla',
  },
}

export default function HesaplaLayout({ children }: { children: React.ReactNode }) {
  return children
}
