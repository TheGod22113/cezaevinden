export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://cezaevinden.com/#website',
        url: 'https://cezaevinden.com',
        name: 'Cezaevinden.com',
        description: 'Tutuklu ve hükümlüler ile ailelerinin buluşma, dayanışma ve hukuki destek platformu.',
        inLanguage: 'tr-TR',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://cezaevinden.com/arama?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://cezaevinden.com/#organization',
        name: 'Cezaevinden.com',
        url: 'https://cezaevinden.com',
        logo: 'https://cezaevinden.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'info@cezaevinden.com',
          contactType: 'customer support',
          availableLanguage: 'Turkish',
        },
        sameAs: [],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
