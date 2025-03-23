import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import "./globals.css"

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
}

export const metadata: Metadata = {
  title: "CarMaster Auto Body - Professional Auto Body Repair",
  description: "Expert auto body repair services in Columbus, OH. Collision repair, paint services, frame repair, and more.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <AuthProvider>
            <div className="flex min-h-screen flex-col bg-grid neo-gradient">
              <Navbar />
              <main className="flex-1">
                <div className="transition-all duration-300 ease-in-out">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
