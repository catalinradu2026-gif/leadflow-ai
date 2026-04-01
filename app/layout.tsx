import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Craiova — Automatizări AI | Boți WhatsApp | Agenție Locală',
  description: 'Prima agenție din Craiova specializată în automatizări AI. Boți WhatsApp inteligenți, automatizări complete, agenți AI cu memorie. Implementare în 7-14 zile. Tel: 0787 813 485.',
  keywords: [
    'automatizari AI Craiova',
    'bot WhatsApp Craiova',
    'agentie AI Craiova',
    'inteligenta artificiala Craiova',
    'automatizari afaceri Craiova',
    'agent AI WhatsApp',
    'chatbot WhatsApp Romania',
    'automatizari n8n Craiova',
    'bot rezervari WhatsApp',
    'automatizare clinica Craiova',
    'automatizare restaurant Craiova',
    'automatizare hotel Craiova',
    'AI Dolj',
    'agentie automatizari Romania',
    'bot AI WhatsApp',
    'sistem AI afaceri',
    'automatizare procese AI',
    'AI Craiova',
  ].join(', '),
  authors: [{ name: 'AI Craiova', url: 'https://aicraiova.ro' }],
  creator: 'AI Craiova',
  publisher: 'AI Craiova',
  metadataBase: new URL('https://aicraiova.ro'),
  alternates: { canonical: 'https://aicraiova.ro' },
  category: 'technology',
  openGraph: {
    title: 'AI Craiova — Prima Agenție AI din Craiova',
    description: 'Automatizări AI pentru afaceri locale din Craiova și Dolj. Boți WhatsApp, agenți AI, automatizări complete. Implementare în 7-14 zile. Sună acum: 0787 813 485.',
    type: 'website',
    url: 'https://aicraiova.ro',
    siteName: 'AI Craiova',
    locale: 'ro_RO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Craiova — Automatizări AI pentru Afaceri Locale',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Craiova — Automatizări AI pentru Afaceri Locale',
    description: 'Prima agenție AI din Craiova. Boți WhatsApp, automatizări, agenți AI. Implementare 7-14 zile.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'cb4b164dc90cf9ca',
  },
}

// LocalBusiness schema — apare în Google cu adresă + telefon
const schemaLocalBusiness = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://aicraiova.ro/#business',
  name: 'AI Craiova',
  alternateName: 'AIcraiova',
  description: 'Prima agenție din Craiova specializată în automatizări inteligente cu AI pentru afaceri locale.',
  url: 'https://aicraiova.ro',
  telephone: '+40787813485',
  email: 'contact@aicraiova.ro',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Craiova',
    addressLocality: 'Craiova',
    addressRegion: 'Dolj',
    postalCode: '200000',
    addressCountry: 'RO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 44.3302,
    longitude: 23.7949,
  },
  areaServed: [
    { '@type': 'City', name: 'Craiova' },
    { '@type': 'AdministrativeArea', name: 'Dolj' },
    { '@type': 'Country', name: 'România' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicii AI',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bot WhatsApp AI', description: 'Bot inteligent care preia rezervări și califică lead-uri 24/7' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Automatizări Complete', description: 'Fluxuri automate cu n8n + AI care elimină munca repetitivă' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agenți AI cu Memorie', description: 'Agenți AI care știu istoricul fiecărui client' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Site-uri Automatizate', description: 'Site modern cu bot AI integrat care atrage clienți noi' } },
    ],
  },
  priceRange: '€€',
  openingHours: 'Mo-Su 00:00-24:00',
  sameAs: [
    'https://www.facebook.com/aicraiova',
  ],
}

// WebSite schema — activează sitelinks search box în Google
const schemaWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://aicraiova.ro/#website',
  url: 'https://aicraiova.ro',
  name: 'AI Craiova',
  description: 'Prima agenție AI din Craiova — automatizări inteligente pentru afaceri locale',
  inLanguage: 'ro-RO',
  publisher: { '@id': 'https://aicraiova.ro/#business' },
}

// FAQ schema — Google afișează întrebările direct în rezultate (rich snippets)
const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Ce face un bot WhatsApp AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un bot WhatsApp AI răspunde automat clienților 24/7, preia rezervări, califică lead-uri și trimite confirmări instant — fără nicio intervenție manuală din partea ta.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cât durează implementarea unui sistem AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Implementarea durează între 7 și 14 zile, în funcție de complexitate. Botul WhatsApp simplu poate fi gata în 7 zile, un sistem complet de automatizări în 14 zile.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cât costă un bot WhatsApp AI în Craiova?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Prețurile încep de la 500€ pentru implementare (o singură dată) + 100€/lună mentenanță. Sistemele complete pornesc de la 1.500€. Oferim consultanță gratuită pentru a stabili soluția potrivită.',
      },
    },
    {
      '@type': 'Question',
      name: 'Funcționează botul și noaptea sau în weekend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Da, sistemul AI funcționează 24/7 inclusiv noaptea, în weekend și de sărbători — fără pauze, fără concedii și fără erori.',
      },
    },
    {
      '@type': 'Question',
      name: 'Puteți automatiza și o clinică medicală din Craiova?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Da, avem un pachet special pentru clinici medicale la 3.500€ care include asistent vocal telefonic, bot WhatsApp pentru programări și sistem de notificări urgențe pentru medici.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ce este AI Craiova?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI Craiova este prima agenție specializată în automatizări AI din Craiova, județul Dolj. Implementăm boți WhatsApp, automatizări de procese și agenți AI cu memorie pentru afaceri locale din Craiova, Dolj și toată România.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaLocalBusiness) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
