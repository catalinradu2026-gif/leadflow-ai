import type { Metadata } from 'next'
import NidoContent from './NidoContent'

export const metadata: Metadata = {
  title: 'Nido — siguranța copiilor și vârstnicilor',
  description:
    'Nido — aplicația care veghează asupra copiilor și vârstnicilor tăi. GPS live, SOS, AI Guard, detectare cădere și rezumat AI zilnic. 15 zile Premium gratuit. Android.',
  alternates: { canonical: 'https://www.aicraiova.ro/nido' },
  openGraph: {
    title: 'Nido — aproape de cei dragi',
    description:
      'Aplicația care veghează asupra copiilor și vârstnicilor tăi. GPS live, SOS, AI Guard. 15 zile Premium gratuit.',
    url: 'https://www.aicraiova.ro/nido',
    siteName: 'AI Craiova',
    locale: 'ro_RO',
    type: 'website',
    images: [{ url: 'https://www.aicraiova.ro/nido-og.png', width: 1024, height: 1024, alt: 'Nido' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nido — aproape de cei dragi',
    description: 'Aplicația care veghează asupra copiilor și vârstnicilor tăi. 15 zile Premium gratuit.',
    images: ['https://www.aicraiova.ro/nido-og.png'],
  },
  icons: { icon: '/nido-og.png' },
}

export default function NidoPage() {
  return <NidoContent />
}
