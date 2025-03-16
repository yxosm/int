'use client'
import { useState, useEffect } from 'react'

type Breakpoints = {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useMobile(): Breakpoints {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: undefined,
    height: undefined,
  })

  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Call handler right away so state gets updated with initial window size
    handleResize()
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (windowSize.width !== undefined) {
      setBreakpoints({
        isMobile: windowSize.width < 768, // Mobile: less than 768px
        isTablet: windowSize.width >= 768 && windowSize.width < 1024, // Tablet: 768px - 1023px
        isDesktop: windowSize.width >= 1024, // Desktop: 1024px and above
      })
    }
  }, [windowSize])

  return breakpoints
}

export default useMobile
