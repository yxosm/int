'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

const TouchContext = createContext({ isTouchDevice: false })

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return (
    <TouchContext.Provider value={{ isTouchDevice }}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </TouchContext.Provider>
  )
}

export function useIsTouch() {
  return useContext(TouchContext)
}
