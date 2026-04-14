import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'Cezaevinden.com',
    short_name:       'Cezaevinden',
    description:      'Mahkumlar, aileler ve gönüllü avukatların dayanışma platformu',
    start_url:        '/',
    display:          'standalone',
    background_color: '#F0F2F5',
    theme_color:      '#1B2B6B',
    orientation:      'portrait',
    icons: [
      { src: '/logo.jpg', sizes: '192x192', type: 'image/jpeg' },
      { src: '/logo.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'maskable' },
    ],
    categories: ['social', 'legal', 'community'],
    lang: 'tr',
  }
}
