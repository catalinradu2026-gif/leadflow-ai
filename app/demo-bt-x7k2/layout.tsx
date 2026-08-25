import type { Metadata } from 'next'

// Segment complet noindex — demo privat, nu trebuie indexat niciodată de Google.
// Se aplică automat tuturor paginilor din /demo-bt-x7k2/* (App Router moștenește metadata).
export const metadata: Metadata = {
  title: 'Demo privat',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function DemoBtLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
