'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

type ContElev = {
  nr: string; nume: string; user: string; parola: string
  minutePlatforma: number; ultimaConectare: string | null
  activitateModul?: Record<string, number>
  riscNivel: 'ridicat' | 'mediu' | 'ok'; riscCategorie: string[]
  coins: number; nivel: number; streak: number; badges: string[]
}
type CatalogEntry = {
  elevNr: string; note: Record<string, string>; absMot: number; absNemot: number; observatii?: string
}

export default function ParintiPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const [view, setView] = useState<'login' | 'dashboard'>('login')
  const [userInput, setUserInput] = useState('')
  const [passInput, setPassInput] = useState('')
  const [err, setErr] = useState('')
  const [logging, setLogging] = useState(false)

  type ProfEntry = { nota: string; absMot: number; absNemot: number; observatii: string }
  type ProfCatalogs = Record<string, Record<string, ProfEntry>>

  const [copil, setCopil] = useState<ContElev | null>(null)
  const [catalogEntry, setCatalogEntry] = useState<CatalogEntry | null>(null)
  const [modulClasa, setModulClasa] = useState<string[]>([])
  const [nrClasa, setNrClasa] = useState('')
  const [profCatalogs, setProfCatalogs] = useState<ProfCatalogs>({})

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!userInput || !passInput) { setErr('Completați utilizatorul și parola copilului.'); return }
    setLogging(true); setErr('')
    await new Promise(r => setTimeout(r, 700))
    setLogging(false)

    try {
      const conturi: ContElev[] = JSON.parse(localStorage.getItem('dir_conturi') || '[]')
      const catalog: CatalogEntry[] = JSON.parse(localStorage.getItem('dir_catalog') || '[]')
      const modul: string[] = JSON.parse(localStorage.getItem('dir_modul') || '[]')
      const clasa: string = localStorage.getItem('dir_clasa') || ''

      const gasit = conturi.find(c =>
        c.user.toLowerCase() === userInput.toLowerCase().trim() &&
        c.parola === passInput.trim()
      )

      if (!gasit) {
        setErr('Utilizator sau parolă incorectă. Verificați foaia primită de la diriginte.')
        return
      }

      const entry = catalog.find(e => e.elevNr === gasit.nr) || {
        elevNr: gasit.nr, note: {}, absMot: 0, absNemot: 0, observatii: ''
      }

      const profCat: ProfCatalogs = JSON.parse(localStorage.getItem('prof_catalogs') || '{}')

      setCopil(gasit)
      setCatalogEntry(entry)
      setModulClasa(modul)
      setNrClasa(clasa)
      setProfCatalogs(profCat)
      setView('dashboard')
    } catch {
      setErr('Eroare la accesarea datelor. Reîncercați.')
    }
  }

  if (view === 'login') {
    return (
      <div style={{
        minHeight: '100vh', background: '#060b14',
        fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '20px 16px 40px' : '40px 20px',
      }}>
        <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}>👨‍👩‍👧‍👦</div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>Portal Părinți</div>
          <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>EDU DIGITAL · AIcraiova</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', padding: isMobile ? '28px 20px' : '36px 40px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Contul copilului tău</h2>
          <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginBottom: '24px' }}>
            Folosește datele din foaia primită de la dirigintele clasei
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              placeholder="Utilizator copil (ex: ion.popescu)"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              style={inputStyle}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Parola copilului"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
            {err && <div style={{ fontSize: '12px', color: '#ef4444', textAlign: 'center' }}>{err}</div>}
            <button type="submit" disabled={logging} style={btnBlue}>
              {logging ? 'Se verifică...' : 'Intră în cont →'}
            </button>
          </form>
          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '10px', fontSize: '11px', color: '#38bdf8', textAlign: 'center', lineHeight: 1.6 }}>
            Nu ai datele? Cere foaia cu conturi de la dirigintele clasei.
          </div>
        </div>
        <style>{`input::placeholder { color: #334155; }`}</style>
      </div>
    )
  }

  if (!copil || !catalogEntry) return null

  const nivelLabel = ['Nou', 'Începător', 'Mediu', 'Avansat', 'Expert', 'Master'][copil.nivel] || 'Nou'
  const coinsPentruNivel = [0, 30, 80, 150, 250, 400]
  const progresNivel = copil.nivel < 5
    ? Math.round(((copil.coins - coinsPentruNivel[copil.nivel]) / (coinsPentruNivel[copil.nivel + 1] - coinsPentruNivel[copil.nivel])) * 100)
    : 100

  const noteModule = modulClasa.filter(m => catalogEntry.note[m])
  const medieNote = noteModule.length
    ? (noteModule.reduce((s, m) => s + parseFloat(catalogEntry.note[m] || '0'), 0) / noteModule.length)
    : null

  const riscColor = copil.riscNivel === 'ridicat' ? '#f87171' : copil.riscNivel === 'mediu' ? '#fbbf24' : '#4ade80'
  const riscBg = copil.riscNivel === 'ridicat' ? 'rgba(239,68,68,0.08)' : copil.riscNivel === 'mediu' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'
  const riscBorder = copil.riscNivel === 'ridicat' ? 'rgba(239,68,68,0.25)' : copil.riscNivel === 'mediu' ? 'rgba(245,158,11,0.25)' : 'rgba(34,197,94,0.25)'
  const riscLabel = copil.riscNivel === 'ridicat' ? '🔴 Risc Ridicat' : copil.riscNivel === 'mediu' ? '🟡 Risc Mediu' : '🟢 Totul OK'

  return (
    <div style={{
      minHeight: '100vh', background: '#060b14',
      fontFamily: "'Segoe UI', Arial, sans-serif", color: '#f1f5f9',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: isMobile ? '20px 16px 60px' : '40px 20px 60px',
    }}>
      <button onClick={() => router.push('/scoala')} style={backBtn}>← Înapoi</button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px', boxShadow: '0 6px 20px rgba(14,165,233,0.3)' }}>👨‍👩‍👧‍👦</div>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>Portal Părinți</div>
        <div style={{ fontSize: '11px', color: '#334155', marginTop: '3px' }}>EDU DIGITAL · AIcraiova</div>
      </div>

      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Header copil */}
        <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: '20px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'linear-gradient(135deg, #0369a1, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🎓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{copil.nume}</div>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginTop: '2px' }}>
              Clasa {nrClasa}{modulClasa.length > 0 ? ` · ${modulClasa.join(', ')}` : ''}
            </div>
          </div>
          <div style={{ background: riscBg, border: `1px solid ${riscBorder}`, borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: riscColor, flexShrink: 0 }}>
            {riscLabel}
          </div>
        </div>

        {/* Alerta daca e risc */}
        {copil.riscNivel !== 'ok' && (
          <div style={{ background: riscBg, border: `1px solid ${riscBorder}`, borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '22px', flexShrink: 0 }}>{copil.riscNivel === 'ridicat' ? '⚠️' : '💛'}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: riscColor, marginBottom: '6px' }}>
                {copil.riscNivel === 'ridicat' ? 'Atenție — copilul tău necesită sprijin' : 'Copilul tău ar putea fi mai activ'}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {copil.riscCategorie.map(cat => (
                  <span key={cat} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#94a3b8' }}>
                    {cat === 'Abandon' ? '🚪 Risc abandon' : cat === 'Performanță' ? '📉 Performanță scăzută' : '💙 Stare emoțională'}
                  </span>
                ))}
                {!copil.ultimaConectare && <span style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#f87171' }}>Nu s-a conectat niciodată</span>}
                {catalogEntry.absNemot >= 3 && <span style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', color: '#f87171' }}>🚫 {catalogEntry.absNemot} absențe nemotivate</span>}
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>Contactați dirigintele pentru mai multe detalii.</div>
            </div>
          </div>
        )}

        {/* Note */}
        {modulClasa.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📝</span> Note
              </div>
              {medieNote !== null && (
                <div style={{ fontSize: '13px', fontWeight: 800, color: medieNote >= 5 ? '#4ade80' : '#f87171' }}>
                  Medie generală: {medieNote.toFixed(2)}
                </div>
              )}
            </div>
            {noteModule.length === 0 ? (
              <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>Nicio notă introdusă încă de diriginte.</div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {modulClasa.map(m => {
                  const nota = catalogEntry.note[m]
                  const val = nota ? parseFloat(nota) : null
                  return (
                    <div key={m} style={{ flex: '1', minWidth: '100px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${val === null ? 'rgba(255,255,255,0.06)' : val < 5 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#475569', marginBottom: '8px', lineHeight: 1.3 }}>{m.replace('BAC ', '').replace('Capacitate ', '')}</div>
                      <div style={{ fontSize: '28px', fontWeight: 900, color: val === null ? '#334155' : val < 5 ? '#f87171' : val < 7 ? '#fbbf24' : '#4ade80' }}>
                        {val !== null ? nota : '—'}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Note profesori materie */}
        {(() => {
          if (!copil) return null
          const clsKey = localStorage.getItem('dir_clasa') || ''
          const profPentruClasa = profCatalogs[clsKey] || {}
          const materiiCuDate = Object.keys(profPentruClasa).filter(m => profPentruClasa[m]?.[copil.nr])
          if (materiiCuDate.length === 0) return null
          return (
            <div style={{ background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: '16px', padding: '18px 20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🧑‍💻</span> Note profesori materie
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {materiiCuDate.map(m => {
                  const pe = profPentruClasa[m][copil.nr]
                  const val = pe.nota ? parseFloat(pe.nota) : null
                  return (
                    <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px 14px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{m}</div>
                        {(pe.absMot > 0 || pe.absNemot > 0) && (
                          <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px' }}>
                            {pe.absMot > 0 && <span style={{ color: '#4ade80', marginRight: '8px' }}>{pe.absMot} motivate</span>}
                            {pe.absNemot > 0 && <span style={{ color: '#f87171' }}>{pe.absNemot} nemotivate</span>}
                          </div>
                        )}
                        {pe.observatii && <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', fontStyle: 'italic' }}>&ldquo;{pe.observatii}&rdquo;</div>}
                      </div>
                      {val !== null && (
                        <div style={{ fontSize: '32px', fontWeight: 900, color: val < 5 ? '#f87171' : val < 7 ? '#fbbf24' : '#4ade80', flexShrink: 0 }}>{pe.nota}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Absente */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span> Absențe
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#4ade80' }}>{catalogEntry.absMot}</div>
              <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600, marginTop: '4px' }}>Motivate</div>
            </div>
            <div style={{ flex: 1, background: catalogEntry.absNemot > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${catalogEntry.absNemot > 0 ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: catalogEntry.absNemot > 0 ? '#f87171' : '#334155' }}>{catalogEntry.absNemot}</div>
              <div style={{ fontSize: '11px', color: catalogEntry.absNemot > 0 ? '#ef4444' : '#475569', fontWeight: 600, marginTop: '4px' }}>Nemotivate</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#a5b4fc' }}>{catalogEntry.absMot + catalogEntry.absNemot}</div>
              <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>Total</div>
            </div>
          </div>
        </div>

        {/* Activitate pe platformă */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💻</span> Activitate pe platformă
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '100px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: 900, color: copil.minutePlatforma > 0 ? '#a5b4fc' : '#334155' }}>{copil.minutePlatforma}</div>
              <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: 600, marginTop: '4px' }}>minute totale</div>
            </div>
            <div style={{ flex: 2, minWidth: '160px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
              <div style={{ fontSize: '11px', color: '#475569' }}>Ultima conectare</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: copil.ultimaConectare ? '#f1f5f9' : '#334155' }}>
                {copil.ultimaConectare || 'Niciodată'}
              </div>
            </div>
          </div>
          {modulClasa.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {modulClasa.map(m => {
                const min = copil.activitateModul?.[m] ?? 0
                const maxBar = 60
                return (
                  <div key={m}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#475569' }}>{m.replace('BAC ', '').replace('Capacitate ', '')}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: min > 10 ? '#4ade80' : min > 0 ? '#fbbf24' : '#334155' }}>{min > 0 ? `${min} min` : '—'}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, (min / maxBar) * 100)}%`, height: '100%', background: min > 10 ? 'linear-gradient(90deg,#4ade80,#22c55e)' : min > 0 ? 'linear-gradient(90deg,#fbbf24,#f59e0b)' : 'transparent', borderRadius: '3px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Gamification */}
        <div style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '16px', padding: '18px 20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏆</span> Progres & Recompense
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>🪙</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#fbbf24' }}>{copil.coins}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>AI Coins</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', background: 'rgba(99,102,241,0.15)', borderRadius: '6px', padding: '2px 8px' }}>Nivel {copil.nivel} · {nivelLabel}</span>
                {copil.streak > 0 && <span style={{ fontSize: '11px', color: '#f97316' }}>🔥 {copil.streak} zile streak</span>}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px' }}>Spre nivelul {copil.nivel + 1}</div>
              <div style={{ width: 80, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progresNivel}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #fbbf24)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px' }}>{progresNivel}%</div>
            </div>
          </div>
          {copil.badges.length > 0 ? (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {copil.badges.map(b => (
                <div key={b} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#a5b4fc' }}>{b}</div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>Niciun badge obținut încă. Încurajați copilul să acceseze platforma!</div>
          )}
        </div>

        {/* Observatii */}
        {catalogEntry.observatii && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📌</span> Observații diriginte
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, fontStyle: 'italic' }}>
              &ldquo;{catalogEntry.observatii}&rdquo;
            </div>
          </div>
        )}

        {/* Deconectare */}
        <button
          onClick={() => { setView('login'); setCopil(null); setUserInput(''); setPassInput('') }}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', color: '#475569', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
        >
          Deconectare
        </button>
      </div>

      <style>{`input::placeholder { color: #334155; }`}</style>
    </div>
  )
}

const backBtn: React.CSSProperties = {
  position: 'fixed', top: 20, left: 20,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '8px 16px',
  color: '#94a3b8', cursor: 'pointer',
  fontSize: '13px', fontFamily: "'Segoe UI', Arial, sans-serif",
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px', padding: '12px 16px',
  fontSize: '14px', color: '#f1f5f9',
  outline: 'none', fontFamily: "'Segoe UI', Arial, sans-serif",
  width: '100%', boxSizing: 'border-box',
}

const btnBlue: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
  border: 'none', borderRadius: '12px', padding: '13px 24px',
  fontSize: '14px', fontWeight: 700, color: '#fff',
  cursor: 'pointer', fontFamily: "'Segoe UI', Arial, sans-serif",
  boxShadow: '0 4px 16px rgba(14,165,233,0.35)', transition: 'opacity 0.2s',
}
