import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Touch event helpers
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Performance optimizations for mobile
export const mobileOptimizations = {
  // Reduce motion for users who prefer it
  prefersReducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // Optimize animations based on device capability
  shouldUseReducedMotion() {
    if (typeof window === 'undefined') return false
    return this.prefersReducedMotion || !window.matchMedia('(min-width: 768px)').matches
  },

  // Get optimized animation settings
  getAnimationSettings(defaultSettings: any = {}) {
    if (this.shouldUseReducedMotion()) {
      return {
        ...defaultSettings,
        duration: Math.min(defaultSettings.duration || 0.3, 0.3),
        transition: {
          duration: 0.2,
          ease: 'easeOut'
        }
      }
    }
    return defaultSettings
  },

  // Touch-friendly hover states
  getTouchFriendlyHoverProps(defaultProps: any = {}) {
    if (isTouchDevice()) {
      return {
        ...defaultProps,
        onTouchStart: (e: TouchEvent) => {
          e.preventDefault()
          const element = e.currentTarget as HTMLElement
          element.click()
        }
      }
    }
    return defaultProps
  }
}
