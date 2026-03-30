import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import AnnouncementBar from '@/components/AnnouncementBar'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: { default: 'Cezaevinden.com — Mahkumlar, Aileler ve Hukuk Platformu', template: '%s | Cezaevinden.com' },
  description: 'Tutuklu ve hükümlüler ile ailelerinin buluşma, dayanışma ve ücretsiz hukuki destek platformu. Avukat soruları, forum ve destek ağı.',
  keywords: ['cezaevi', 'mahkum', 'tutuklu', 'hukuki yardım', 'avukat', 'tahliye', 'infaz', 'denetimli serbestlik', 'koşullu salıverilme'],
  authors: [{ name: 'Cezaevinden.com', url: 'https://cezaevinden.com' }],
  creator: 'Cezaevinden.com',
  metadataBase: new URL('https://cezaevinden.com'),
  alternates: { canonical: 'https://cezaevinden.com' },
  openGraph: {
    title: 'Cezaevinden.com — Mahkumlar, Aileler ve Hukuk Platformu',
    description: 'Mahkumlar, aileler ve gönüllü avukatların bir arada olduğu dayanışma ve hukuki destek platformu.',
    url: 'https://cezaevinden.com',
    siteName: 'Cezaevinden.com',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cezaevinden.com',
    description: 'Mahkumlar, aileler ve gönüllü avukatların bir arada olduğu dayanışma platformu.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  verification: { google: 'LgD37TK4v1C0op24TRRRSs-TxQ4VT-4XA4Np8GuUHBQ' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="pt-16 pb-16 lg:pb-0">
            {children}
          </main>
          <BottomNav />
          <Footer className="hidden lg:block" />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}
