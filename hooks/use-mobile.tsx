"use client"

import { useEffect, useState } from "react"

// Define screen size breakpoints
const BREAKPOINTS = {
  mobile: 768, // Below 768px is considered mobile
  tablet: 1024, // Below 1024px is considered tablet
}

export interface Breakpoints {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

// Hook for responsive design
export function useIsMobile(): Breakpoints {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Call handler right away to update initial size
    handleResize()
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, []) // Empty array ensures effect runs only on mount and unmount

  return {
    isMobile: windowSize.width < BREAKPOINTS.mobile,
    isTablet: windowSize.width >= BREAKPOINTS.mobile && windowSize.width < BREAKPOINTS.tablet,
    isDesktop: windowSize.width >= BREAKPOINTS.tablet,
  }
}

export default useIsMobile