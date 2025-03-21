import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // Get the correct request URL that accounts for the base path in production
    const url = new URL(request.url)
    const basePath = process.env.NODE_ENV === 'production' ? '/create' : ''
    
    // Create client with the correct base path awareness
    const { supabase, response } = createClient(request)
    
    // Check auth state
    await supabase.auth.getSession()
    
    // If this is an auth callback redirect with a missing base path,
    // redirect to the correct URL with the base path included
    if (url.pathname === '/auth/callback' && basePath && !url.pathname.startsWith(basePath)) {
      // Redirect to the correct callback URL with the base path
      const correctUrl = new URL(`${url.origin}${basePath}/auth/callback${url.search}`)
      return NextResponse.redirect(correctUrl)
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}