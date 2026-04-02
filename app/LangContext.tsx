'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { Lang } from './translations'

interface LangCtx { lang: Lang; toggleLang: () => void }
const LangContext = createContext<LangCtx>({ lang: 'ro', toggleLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ro')
  const toggleLang = () => setLang(l => l === 'ro' ? 'en' : 'ro')
  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

export function useLang() { return useContext(LangContext) }
