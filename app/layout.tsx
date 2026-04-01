import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Craiova — Automatizări AI pentru Afaceri Locale',
  description: 'Prima agenție din Craiova specializată în automatizări AI. Boți WhatsApp, automatizări complete, agenți AI cu memorie. Implementare în 7-14 zile. Sună: 0787 813 485.',
  keywords: 'automatizari AI Craiova, bot WhatsApp Craiova, inteligenta artificiala Craiova, automatizari afaceri, agent AI, n8n automatizari, Craiova Dolj',
  authors: [{ name: 'AI Craiova' }],
  creator: 'AI Craiova',
  metadataBase: new URL('https://aicraiova.ro'),
  alternates: {
    canonical: 'https://aicraiova.ro',
  },
  openGraph: {
    title: 'AI Craiova — Automatizări AI pentru Afaceri Locale',
    description: 'Prima agenție din Craiova specializată în automatizări AI. Boți WhatsApp, automatizări complete, agenți AI. Implementare în 7-14 zile.',
    type: 'website',
    url: 'https://aicraiova.ro',
    siteName: 'AI Craiova',
    locale: 'ro_RO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Craiova — Automatizări AI pentru Afaceri Locale',
    description: 'Prima agenție din Craiova specializată în automatizări AI.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AI Craiova',
  description: 'Prima agenție din Craiova specializată în automatizări AI pentru afaceri locale.',
  url: 'https://aicraiova.ro',
  telephone: '+40787813485',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Craiova',
    addressRegion: 'Dolj',
    addressCountry: 'RO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.3302,
    longitude: 23.7949,
  },
  areaServed: ['Craiova', 'Dolj', 'România'],
  serviceType: ['Automatizări AI', 'Bot WhatsApp', 'Agenți AI', 'Automatizări n8n'],
  priceRange: '€€',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
