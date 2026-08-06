import type { Metadata } from 'next'
import EvaluareContent from './EvaluareContent'

export const metadata: Metadata = {
  title: 'Evaluare gratuită NIS2 / ISO 27001 — AI Craiova',
  description:
    'Aflați gratuit, în 10 minute, unde stă firma dvs. față de cerințele NIS2 și ISO 27001. Evaluare fără obligații, de la NEWTIME CONCEPT SOLUTIONS.',
  alternates: { canonical: 'https://www.aicraiova.ro/evaluare-nis2' },
  openGraph: {
    title: 'Evaluare gratuită NIS2 / ISO 27001',
    description: 'Aflați gratuit unde stă firma dvs. față de cerințele NIS2 și ISO 27001, fără obligații.',
    url: 'https://www.aicraiova.ro/evaluare-nis2',
    siteName: 'AI Craiova',
    locale: 'ro_RO',
    type: 'website',
  },
  icons: { icon: '/icon.svg' },
}

export default function EvaluareNis2Page() {
  return <EvaluareContent />
}
