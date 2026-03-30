import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forum — Cezaevinden.com',
  description: 'Mahkumlar, aile üyeleri ve tahliye olmuşların deneyimlerini paylaştığı, sorularını sorduğu dayanışma forumu.',
  keywords: ['cezaevi forum', 'mahkum deneyimleri', 'aile destek', 'infaz hukuku', 'tahliye sonrası'],
  openGraph: {
    title: 'Forum — Cezaevinden.com',
    description: 'Deneyimlerinizi paylaşın, sorularınızı sorun, birlikte destek olun.',
    url: 'https://cezaevinden.com/forum',
  },
}

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return children
}
