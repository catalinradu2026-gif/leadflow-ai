'use client'
import { useEffect } from 'react'

// Boundary la nivelul rădăcinii (prinde erorile din layout). Trebuie să-și randeze
// propriile <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: error?.message, digest: error?.digest, url: typeof window !== 'undefined' ? window.location.href : '' }),
        keepalive: true,
      }).catch(() => {})
    } catch {}
  }, [error])

  return (
    <html lang="ro">
      <body style={{ margin: 0 }}>
        <div role="alert" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0', background: '#0f172a' }}>
          <div style={{ fontSize: 44 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>A apărut o eroare</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
            Ne pare rău, ceva nu a funcționat corect. Puteți încerca din nou.
          </p>
          <button onClick={() => reset()} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Reîncearcă
          </button>
        </div>
      </body>
    </html>
  )
}
