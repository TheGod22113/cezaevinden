import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'Cezaevinden.com hakkında sıkça sorulan sorular ve yanıtları.',
}
export default function SSSLayout({ children }: { children: React.ReactNode }) {
  return children
}
