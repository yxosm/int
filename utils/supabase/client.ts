import { createBrowserClient } from "@supabase/ssr";

// Function to determine the correct site URL for GitHub Pages
const getSiteUrl = () => {
  if (typeof window === 'undefined') {
    // During build time or server-side rendering
    return 'https://yxosm.github.io/int';
  }
  
  // In the browser, for GitHub Pages deployment
  if (window.location.hostname.includes('github.io')) {
    return 'https://yxosm.github.io/create';
  }
  
  // For local development
  return `${window.location.protocol}//${window.location.host}`;
};

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        // Always use the correct site URL for GitHub Pages
        redirectTo: `${getSiteUrl()}/auth/callback`,
      },
    }
  );
