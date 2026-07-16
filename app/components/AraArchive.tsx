'use client'
import { useState, useEffect, useRef } from 'react'

interface AraArchiveDoc {
  id: string
  titlu: string
  tip: 'PDF' | 'Word' | 'Text' | 'Altele'
  descriere?: string
  uploadedAt: string
  uploadedBy: string
  judet: string
  textBlobKey: string
  textPreview: string
  size: number
}

interface AraArchiveProps {
  password?: string
  readOnly?: boolean
}

const TIP_COLORS: Record<string, { bg: string; color: string }> = {
  PDF:    { bg: '#7f1d1d', color: '#fca5a5' },
  Word:   { bg: '#1e3a5f', color: '#93c5fd' },
  Text:   { bg: '#064e3b', color: '#6ee7b7' },
  Altele: { bg: '#374151', color: '#9ca3af' },
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso.slice(0, 10)
  }
}

export default function AraArchive({ password, readOnly = false }: AraArchiveProps) {
  const [docs, setDocs] = useState<AraArchiveDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Upload modal state
  const [showModal, setShowModal] = useState(false)
  const [uploadTitlu, setUploadTitlu] = useState('')
  const [uploadDescriere, setUploadDescriere] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadDone, setUploadDone] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchDocs() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ara-archive')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { docs: AraArchiveDoc[] }
      setDocs(data.docs || [])
    } catch {
      setError('Nu s-au putut încărca documentele. Reîncercați.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()
  }, [])

  function openModal() {
    setUploadTitlu('')
    setUploadDescriere('')
    setUploadFile(null)
    setUploadError('')
    setUploadDone(false)
    setShowModal(true)
  }

  function closeModal() {
    if (uploading) return
    setShowModal(false)
  }

  async function handleUpload() {
    if (!uploadTitlu.trim()) {
      setUploadError('Titlul este obligatoriu.')
      return
    }
    if (!uploadFile) {
      setUploadError('Selectați un fișier.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const fd = new FormData()
      fd.append('titlu', uploadTitlu.trim())
      if (uploadDescriere.trim()) fd.append('descriere', uploadDescriere.trim())
      fd.append('file', uploadFile)
      fd.append('uploadedBy', 'Inspector Național')
      fd.append('judet', 'national')

      const res = await fetch('/api/ara-archive', {
        method: 'POST',
        headers: { 'x-password': password || '' },
        body: fd,
      })
      const data = await res.json() as { ok?: boolean; doc?: AraArchiveDoc; error?: string }
      if (!res.ok || !data.ok) {
        setUploadError(data.error || 'Eroare la încărcare.')
        setUploading(false)
        return
      }
      setUploadDone(true)
      if (data.doc) setDocs(prev => [data.doc!, ...prev])
      setTimeout(() => {
        setShowModal(false)
        setUploadDone(false)
        setUploading(false)
      }, 2000)
    } catch {
      setUploadError('Eroare de rețea. Reîncercați.')
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true)
    try {
      const res = await fetch('/api/ara-archive', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-password': password || '',
        },
        body: JSON.stringify({ id }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error || 'Eroare la ștergere.')
        setConfirmDeleteId(null)
        setDeleting(false)
        return
      }
      setDocs(prev => prev.filter(d => d.id !== id))
      setConfirmDeleteId(null)
    } catch {
      setError('Eroare de rețea la ștergere.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#e2e8f0',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  }

  const btnPrimary: React.CSSProperties = {
    background: '#1d4ed8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const btnSecondary: React.CSSProperties = {
    background: '#334155',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  const btnDanger: React.CSSProperties = {
    background: '#7f1d1d',
    color: '#fca5a5',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#e2e8f0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            Arhiva Documente — ARA le citeste automat
          </h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
            Documentele incarcate aici sunt citite integral de ARA la fiecare conversatie.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={fetchDocs}
            style={{ ...btnSecondary, padding: '8px 14px', fontSize: '12px' }}
          >
            Reincarca
          </button>
          {!readOnly && (
            <button onClick={openModal} style={btnPrimary}>
              Adauga document
            </button>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            background: '#7f1d1d',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#fca5a5',
            marginBottom: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '14px' }}>
          Se incarca documentele...
        </div>
      )}

      {/* Empty state */}
      {!loading && docs.length === 0 && (
        <div
          style={{
            background: '#1e293b',
            border: '1px dashed #334155',
            borderRadius: '10px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '14px',
          }}
        >
          Niciun document in arhiva. Adaugati primul document pentru ca ARA sa il poata citi.
        </div>
      )}

      {/* Document list */}
      {!loading && docs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {docs.map(doc => {
            const tipColors = TIP_COLORS[doc.tip] || TIP_COLORS['Altele']
            const isConfirmingDelete = confirmDeleteId === doc.id

            return (
              <div key={doc.id} style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          background: tipColors.bg,
                          color: tipColors.color,
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          flexShrink: 0,
                        }}
                      >
                        {doc.tip}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#f1f5f9',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {doc.titlu}
                      </span>
                    </div>

                    {/* Meta */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: doc.textPreview ? '8px' : '0',
                      }}
                    >
                      {formatDate(doc.uploadedAt)} · {formatBytes(doc.size)} · {doc.uploadedBy}
                    </div>

                    {/* Description */}
                    {doc.descriere && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          marginBottom: '6px',
                          fontStyle: 'italic',
                        }}
                      >
                        {doc.descriere}
                      </div>
                    )}

                    {/* Text preview */}
                    {doc.textPreview && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#475569',
                          background: '#0f172a',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          lineHeight: 1.5,
                          borderLeft: '3px solid #334155',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {doc.textPreview}
                      </div>
                    )}
                  </div>

                  {/* Delete button — right side */}
                  {!readOnly && (
                    <div style={{ flexShrink: 0 }}>
                      {isConfirmingDelete ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            alignItems: 'flex-end',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: '#fca5a5' }}>Sigur stergeti?</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              disabled={deleting}
                              style={{ ...btnSecondary, padding: '4px 10px', fontSize: '11px' }}
                            >
                              Nu
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              disabled={deleting}
                              style={btnDanger}
                            >
                              {deleting ? 'Se sterge...' : 'Da, sterge'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(doc.id)}
                          style={btnDanger}
                          title="Sterge document"
                        >
                          Sterge
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {uploadDone ? (
              <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#052e16',
                    border: '2px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                  }}
                >
                  ✓
                </div>
                <h3 style={{ color: '#22c55e', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                  Document adaugat cu succes!
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px' }}>
                  ARA va citi documentul la urmatoarea conversatie.
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                    Adauga document in arhiva
                  </h3>
                  <button
                    onClick={closeModal}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Titlu */}
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                    }}
                  >
                    Titlu document *
                  </label>
                  <input
                    value={uploadTitlu}
                    onChange={e => setUploadTitlu(e.target.value)}
                    placeholder="ex: Metodologia de evaluare periodica 2026"
                    style={inputStyle}
                    autoFocus
                  />
                </div>

                {/* Descriere */}
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                    }}
                  >
                    Descriere (optional)
                  </label>
                  <textarea
                    value={uploadDescriere}
                    onChange={e => setUploadDescriere(e.target.value)}
                    placeholder="Scurta descriere a documentului..."
                    rows={2}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '64px',
                    }}
                  />
                </div>

                {/* File input */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      color: '#64748b',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                    }}
                  >
                    Fisier *
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#0f172a',
                      border: `1.5px dashed ${uploadFile ? '#3b82f6' : '#334155'}`,
                      borderRadius: '8px',
                      padding: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>📎</span>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: uploadFile ? '#93c5fd' : '#64748b',
                          fontWeight: uploadFile ? 600 : 400,
                        }}
                      >
                        {uploadFile ? uploadFile.name : 'Selectati fisier PDF, Word sau text...'}
                      </div>
                      {uploadFile && (
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                          {formatBytes(uploadFile.size)}
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) setUploadFile(f)
                      }}
                    />
                  </label>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                    Formate acceptate: PDF, Word (.docx), text (.txt) · Maxim 10 MB
                  </div>
                </div>

                {/* Info box */}
                <div
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1d4ed8',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: '#60a5fa',
                    marginBottom: '16px',
                    lineHeight: 1.5,
                  }}
                >
                  ARA va citi textul extras automat din document si il va folosi la toate conversatiile
                  viitoare pentru a raspunde cu informatii exacte din acest document.
                </div>

                {/* Error */}
                {uploadError && (
                  <div
                    style={{
                      background: '#7f1d1d',
                      border: '1px solid #dc2626',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: '#fca5a5',
                      marginBottom: '14px',
                    }}
                  >
                    {uploadError}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={closeModal}
                    disabled={uploading}
                    style={{ ...btnSecondary, flex: 1 }}
                  >
                    Anuleaza
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !uploadTitlu.trim() || !uploadFile}
                    style={{
                      ...btnPrimary,
                      flex: 2,
                      opacity: !uploadTitlu.trim() || !uploadFile ? 0.5 : 1,
                      cursor: !uploadTitlu.trim() || !uploadFile ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {uploading ? 'Se incarca si extrage text...' : 'Adauga in arhiva'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
