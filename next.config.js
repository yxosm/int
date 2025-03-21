/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/create' : '',
  images: {
    unoptimized: true,
  },
  // Skip TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Environment variables for client side - using GitHub repository secrets
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://yxosm.github.io/create'
  },
  // Configure static generation
  generateBuildId: async () => {
    return 'build'
  }
}

module.exports = nextConfig