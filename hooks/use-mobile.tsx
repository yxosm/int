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

interface TouchInfo {
  startX: number
  startY: number
  startTime: number
}

export function useMobileInteraction() {
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [touchInfo, setTouchInfo] = useState<TouchInfo | null>(null)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Handle viewport height changes (e.g., when keyboard opens)
    const handleResize = () => {
      const vh = window.innerHeight
      setViewportHeight(vh)
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`)
      
      // Detect if keyboard is likely open on mobile
      if (isMobile) {
        setIsKeyboardOpen(window.innerHeight < window.outerHeight * 0.75)
      }
    }

    checkMobile()
    handleResize()

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [isMobile])

  const handleTouchStart = (e: TouchEvent) => {
    setTouchInfo({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now()
    })
  }

  const handleTouchEnd = (e: TouchEvent, onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void) => {
    if (!touchInfo) return

    const deltaX = e.changedTouches[0].clientX - touchInfo.startX
    const deltaY = e.changedTouches[0].clientY - touchInfo.startY
    const duration = Date.now() - touchInfo.startTime

    // Only trigger for quick swipes (less than 500ms)
    if (duration < 500) {
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)
      
      // Minimum distance for a swipe
      if (Math.max(absX, absY) > 50) {
        if (absX > absY) {
          // Horizontal swipe
          onSwipe?.(deltaX > 0 ? 'right' : 'left')
        } else {
          // Vertical swipe
          onSwipe?.(deltaY > 0 ? 'down' : 'up')
        }
      }
    }

    setTouchInfo(null)
  }

  // Ensure content is visible when keyboard is open
  useEffect(() => {
    if (isKeyboardOpen) {
      window.scrollTo(0, 0)
    }
  }, [isKeyboardOpen])

  return {
    isMobile,
    viewportHeight,
    isKeyboardOpen,
    touchHandlers: {
      handleTouchStart,
      handleTouchEnd
    }
  }
}

export default useIsMobile
