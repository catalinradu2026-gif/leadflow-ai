'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Lang } from './translations'

const LANG_CYCLE: Lang[] = ['ro', 'en', 'de', 'it', 'fr', 'zh']

interface LangCtx { lang: Lang; setLang: (l: Lang) => void; cycleLang: () => void }
const LangContext = createContext<LangCtx>({ lang: 'ro', setLang: () => {}, cycleLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ro')

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(({ lang: detected }: { lang: string }) => {
        if (LANG_CYCLE.includes(detected as Lang)) {
          setLang(detected as Lang)
        }
      })
      .catch(() => {})
  }, [])

  const cycleLang = () => {
    setLang(current => {
      const idx = LANG_CYCLE.indexOf(current)
      return LANG_CYCLE[(idx + 1) % LANG_CYCLE.length]
    })
  }

  return <LangContext.Provider value={{ lang, setLang, cycleLang }}>{children}</LangContext.Provider>
}

export function useLang() { return useContext(LangContext) }
