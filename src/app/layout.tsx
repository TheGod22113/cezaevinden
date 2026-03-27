import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'
import AnnouncementBar from '@/components/AnnouncementBar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Cezaevinden.com — Mahkumlar, Aileler ve Hukuk Platformu',
  description: 'Tutuklu ve hükümlüler ile ailelerinin buluşma, dayanışma ve hukuki destek platformu.',
  keywords: ['cezaevi', 'mahkum', 'tutuklu', 'hukuki yardım', 'avukat', 'tahliye', 'infaz'],
  openGraph: {
    title: 'Cezaevinden.com',
    description: 'Mahkumlar, aileler ve gönüllü avukatların bir arada olduğu dayanışma platformu.',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
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
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  )
}
