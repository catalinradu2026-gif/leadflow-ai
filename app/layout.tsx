import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadFlow AI — Automatizări AI Premium',
  description: 'Implementăm soluții AI care atrag, califică și convertesc clienți fără intervenție manuală. Agenție de automatizări AI din Craiova.',
  keywords: 'automatizari AI, lead generation, sales automation, inteligenta artificiala, Craiova',
  openGraph: {
    title: 'LeadFlow AI — Automatizări AI Premium',
    description: 'Transformăm afacerea ta într-un sistem automat de vânzare.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
