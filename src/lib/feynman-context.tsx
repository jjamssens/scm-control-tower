// Feynman overlay context — provides openFeynman/closeFeynman globally within the Control Tower layout
"use client"

import { createContext, useCallback, useContext, useState } from "react"

interface FeynmanContextValue {
  activeTerm: string | null
  openFeynman: (termId: string) => void
  closeFeynman: () => void
}

const FeynmanContext = createContext<FeynmanContextValue | null>(null)

export function FeynmanProvider({ children }: { children: React.ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null)

  const openFeynman  = useCallback((termId: string) => setActiveTerm(termId), [])
  const closeFeynman = useCallback(() => setActiveTerm(null), [])

  return (
    <FeynmanContext.Provider value={{ activeTerm, openFeynman, closeFeynman }}>
      {children}
    </FeynmanContext.Provider>
  )
}

export function useFeynman(): FeynmanContextValue {
  const ctx = useContext(FeynmanContext)
  if (!ctx) throw new Error("useFeynman must be used inside FeynmanProvider")
  return ctx
}
