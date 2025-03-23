"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/appointment-modal"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { 
  DropdownMenu, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuContent 
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth-modal"
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  
  const handleSignOut = () => {
    signOut()
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 navbar-futuristic ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 z-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-GHL9UpZiSY96FVqaaufmDnpWVmpKFN.png"
            alt="CarMaster Logo"
            width={210}
            height={70}
            priority
            className="object-contain h-[50px] sm:h-[70px]"
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-white/70'
              }`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <AppointmentModal>
            <Button className="glow-button text-white font-medium px-6 py-2 rounded-md transition-all duration-300">
              Book Appointment
            </Button>
          </AppointmentModal>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="relative z-20 bg-white/5 hover:bg-white/10">
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-80 bg-black/95 backdrop-blur-lg border-l border-white/10">
            <div className="flex flex-col space-y-6 mt-8">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-sm font-medium transition-colors hover:text-white ${
                    pathname === link.href ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {link.label}
                </MobileNavLink>
              ))}
              <AppointmentModal>
                <Button className="glow-button w-full text-white font-medium py-6 rounded-md transition-all duration-300 hover:shadow-lg mt-4">
                  Book Appointment
                </Button>
              </AppointmentModal>
            </div>
          </SheetContent>
        </Sheet>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white">
                <span className="mr-2">{user.email}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {user.email === 'ykxglobal@gmail.com' && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleSignOut}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <AuthModal>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
              Log In
            </Button>
          </AuthModal>
        )}
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-white/80 hover:text-white font-medium transition-colors duration-300 animated-underline"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <Link
        href={href}
        className="text-xl font-medium py-2 block text-white/80 hover:text-white transition-colors"
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  )
}

