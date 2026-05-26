import { list, put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const PREFIX = 'elevi-acasa/'

type ContElev = {
  nr: string; nume: string; user: string; parola: string
  minutePlatforma: number; ultimaConectare: string | null
  activitateModul?: Record<string, number>
  riscNivel: 'ridicat' | 'mediu' | 'ok'; riscCategorie: string[]
  coins: number; nivel: number; streak: number; badges: string[]
}

type ClasaData = {
  clasaKey: string
  nrClasa: string
  gradNr: number // 8 sau 12
  modulClasa: string[]
  diriginte: string
  conturi: ContElev[]
  updatedAt: string
}

type Activity = {
  user: string
  weekendStart?: number   // timestamp activare sesiune weekend
  minuteUsedWeekend: number
  modulAccesate: Record<string, number> // modul -> minute
  totalMinute: number
  ultimaConectare: string
}

// GET: login validation
export async function GET(req: NextRequest) {
  const user = req.nextUrl.searchParams.get('user')?.toLowerCase().trim()
  const pass = req.nextUrl.searchParams.get('pass')?.trim()
  if (!user || !pass) return NextResponse.json({ ok: false, error: 'missing' }, { status: 400 })

  try {
    const { blobs } = await list({ prefix: `${PREFIX}clase/`, token: TOKEN })
    for (const blob of blobs) {
      const res = await fetch(blob.url, { cache: 'no-store' })
      if (!res.ok) continue
      const data: ClasaData = await res.json()
      const elev = data.conturi.find(c =>
        c.user.toLowerCase() === user && c.parola === pass
      )
      if (elev) {
        // load activity
        let activity: Activity | null = null
        try {
          const { blobs: ab } = await list({ prefix: `${PREFIX}activity/${user}.json`, token: TOKEN })
          if (ab.length) {
            const ar = await fetch(ab[0].url, { cache: 'no-store' })
            if (ar.ok) activity = await ar.json()
          }
        } catch {}
        return NextResponse.json({
          ok: true,
          elev,
          clasaKey: data.clasaKey,
          nrClasa: data.nrClasa,
          gradNr: data.gradNr,
          modulClasa: data.modulClasa,
          diriginte: data.diriginte,
          activity,
        })
      }
    }
    return NextResponse.json({ ok: false, error: 'not found' })
  } catch (e) { console.error("[elevi-acasa]", e)
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}

// POST: save class accounts (called by diriginte)
export async function POST(req: NextRequest) {
  try {
    const body: ClasaData = await req.json()
    if (!body.clasaKey || !body.conturi) return NextResponse.json({ error: 'missing' }, { status: 400 })

    await put(`${PREFIX}clase/${body.clasaKey}.json`, JSON.stringify(body), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      allowOverwrite: true,
      token: TOKEN,
    })
    return NextResponse.json({ ok: true })
  } catch (e) { console.error("[elevi-acasa]", e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}

// PATCH: update activity
export async function PATCH(req: NextRequest) {
  try {
    const { user, activity }: { user: string; activity: Activity } = await req.json()
    if (!user) return NextResponse.json({ error: 'missing' }, { status: 400 })

    await put(`${PREFIX}activity/${user}.json`, JSON.stringify(activity), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      allowOverwrite: true,
      token: TOKEN,
    })
    return NextResponse.json({ ok: true })
  } catch (e) { console.error("[elevi-acasa]", e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
