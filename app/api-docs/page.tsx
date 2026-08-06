'use client'
import { useRouter } from 'next/navigation'

const BASE = 'https://aicraiova.ro/api/v1'

const RESURSE = [
  { path: 'unitati', desc: 'Unități care și-au depus autoevaluarea (A/B/C).', params: 'judet, limit' },
  { path: 'autorizari', desc: 'Cereri de autorizare de funcționare provizorie (unități noi).', params: 'judet, limit' },
  { path: 'evaluari', desc: 'Cereri de acreditare și evaluare externă periodică.', params: 'judet, tip (acreditare|evaluare_periodica), limit' },
  { path: 'raei', desc: 'RAEI generate de unități (rapoarte anuale de evaluare internă).', params: 'judet, limit' },
  { path: 'formare', desc: 'Statistici agregate de formare (formabili A.2 / evaluatori A.3, certificate).', params: '—' },
]

export default function ApiDocs() {
  const router = useRouter()
  const card: React.CSSProperties = { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, padding: 20, marginBottom: 16 }
  const code: React.CSSProperties = { background: '#020617', border: '1px solid #1e293b', borderRadius: 8, padding: '12px 14px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12.5, color: '#a5b4fc', overflowX: 'auto', whiteSpace: 'pre', display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#e2e8f0', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 60px' }}>
        <button onClick={() => router.push('/aracip')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: '#94a3b8', cursor: 'pointer', fontSize: 13, marginBottom: 24 }}>← Înapoi</button>

        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: '#fff' }}>API ARACIP <span style={{ fontSize: 16, color: '#818cf8', fontWeight: 700 }}>v1</span></h1>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginTop: 8 }}>
          API REST (read-only) pentru integrarea datelor de asigurare a calității: autorizări, acreditări, evaluări periodice, RAEI, autoevaluări și statistici de formare. Date instituționale și agregate — <strong style={{ color: '#cbd5e1' }}>fără date cu caracter personal</strong>.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 32 }}>Autentificare</h2>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>Fiecare cerere trebuie să conțină cheia API în headerul <code style={{ color: '#a5b4fc' }}>x-api-key</code> (sau parametrul <code style={{ color: '#a5b4fc' }}>?api_key=</code>). Cheia se obține de la administratorul platformei.</p>
        <div style={card}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>URL DE BAZĂ</div>
          <code style={code}>{BASE}</code>
          <div style={{ fontSize: 12, color: '#64748b', margin: '16px 0 8px', fontWeight: 700 }}>EXEMPLU (cURL)</div>
          <code style={code}>{`curl -H "x-api-key: CHEIA_TA" \\
  "${BASE}/autorizari?judet=Cluj&limit=50"`}</code>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 24 }}>Resurse</h2>
        {RESURSE.map(r => (
          <div key={r.path} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6 }}>GET</span>
              <code style={{ fontSize: 14, color: '#a5b4fc', fontFamily: 'ui-monospace, Menlo, monospace' }}>/api/v1/{r.path}</code>
            </div>
            <div style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>{r.desc}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Parametri: <span style={{ color: '#94a3b8' }}>{r.params}</span></div>
          </div>
        ))}

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 24 }}>Exemplu de răspuns</h2>
        <div style={card}>
          <code style={code}>{`{
  "ok": true,
  "resource": "autorizari",
  "count": 1,
  "data": [
    {
      "nr_inregistrare": "AUT-2026-3837",
      "denumire": "Grădinița „Căsuța Piticilor”",
      "judet": "Cluj",
      "nivel": "Preșcolar",
      "status": "depusa"
    }
  ]
}`}</code>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 24 }}>Coduri de răspuns</h2>
        <div style={card}>
          {[['200', 'OK'], ['401', 'Cheie API lipsă sau invalidă'], ['404', 'Resursă necunoscută'], ['429', 'Prea multe cereri (rate limit)'], ['503', 'API neconfigurat']].map(([c, d]) => (
            <div key={c} style={{ display: 'flex', gap: 14, padding: '6px 0', borderBottom: '1px solid #1e293b', fontSize: 13 }}>
              <span style={{ color: c === '200' ? '#4ade80' : '#fbbf24', fontWeight: 800, fontFamily: 'ui-monospace, monospace', width: 40 }}>{c}</span>
              <span style={{ color: '#94a3b8' }}>{d}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: '#475569', marginTop: 24, textAlign: 'center' }}>
          API ARACIP v1 · read-only · NewTime Concept Solutions S.R.L.
        </div>
      </div>
    </div>
  )
}
