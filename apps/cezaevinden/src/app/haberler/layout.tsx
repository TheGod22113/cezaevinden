import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Haberler — Cezaevinden.com',
  description: 'Cezaevi haberleri, infaz mevzuatı değişiklikleri, tahliye haberleri ve hukuki gelişmeler.',
  keywords: ['cezaevi haberleri', 'infaz düzenlemesi', 'tahliye haberleri', 'af yasası', 'ceza indirimi'],
  openGraph: {
    title: 'Haberler — Cezaevinden.com',
    description: 'Cezaevi haberleri ve hukuki gelişmeler.',
    url: 'https://cezaevinden.com/haberler',
  },
}

export default function HaberlerLayout({ children }: { children: React.ReactNode }) {
  return children
}
