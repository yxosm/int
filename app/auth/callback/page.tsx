'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'

// Configure this page to be dynamically rendered
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    // Get code from URL
    const code = new URL(window.location.href).searchParams.get('code')
    
    async function handleCallback() {
      if (code) {
        try {
          const supabase = createClient()
          await supabase.auth.exchangeCodeForSession(code)
          
          // For GitHub Pages, ensure we redirect to the correct path with the /create prefix
          const isGitHubPages = window.location.hostname.includes('github.io')
          const dashboardPath = isGitHubPages ? '/create/dashboard' : '/dashboard'
          
          router.push(dashboardPath)
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          // Redirect to home with the correct path prefix
          const isGitHubPages = window.location.hostname.includes('github.io')
          const homePath = isGitHubPages ? '/create' : '/'
          
          router.push(homePath)
        }
      } else {
        // No code in URL, redirect to home with correct path
        const isGitHubPages = window.location.hostname.includes('github.io')
        const homePath = isGitHubPages ? '/create' : '/'
        
        router.push(homePath)
      }
    }

    handleCallback()
  }, [router])

  return <div className="flex justify-center p-8">Processing login...</div>
}