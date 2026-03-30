import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hukuki Yardım — Cezaevinden.com',
  description: 'Gönüllü avukatlardan ücretsiz hukuki danışmanlık. İnfaz hukuku, denetimli serbestlik, koşullu salıverilme ve daha fazlası.',
  keywords: ['ücretsiz hukuki yardım', 'infaz hukuku', 'denetimli serbestlik', 'avukat', 'koşullu salıverilme', 'ceza hukuku'],
  openGraph: {
    title: 'Hukuki Yardım — Cezaevinden.com',
    description: 'Gönüllü avukatlardan ücretsiz hukuki danışmanlık alın.',
    url: 'https://cezaevinden.com/hukuki-yardim',
  },
}

export default function HukukiYardimLayout({ children }: { children: React.ReactNode }) {
  return children
}
