import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="footer-futuristic pt-16 pb-8">
      <div className="container footer-content">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6 flex justify-start">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO-GHL9UpZiSY96FVqaaufmDnpWVmpKFN.png"
                alt="CarMaster Auto Body Logo"
                width={210}
                height={70}
                className="object-contain h-[70px]"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Specializing in total loss assistance and professional auto body repair services.
            </p>
            <div className="flex space-x-3">
              <SocialLink href="#" icon={<Facebook size={16} />} />
              <SocialLink href="#" icon={<Instagram size={16} />} />
              <SocialLink href="#" icon={<Twitter size={16} />} />
              <SocialLink href="#" icon={<Linkedin size={16} />} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 relative inline-block text-white">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/projects">Projects</FooterLink>
              <FooterLink href="/reviews">Reviews</FooterLink>
              <FooterLink href="/about">About</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 relative inline-block text-white">
              Services
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="transition-colors duration-200 hover:text-white">Professional Assessment</li>
              <li className="transition-colors duration-200 hover:text-white">Rental Assistance</li>
              <li className="transition-colors duration-200 hover:text-white">Insurance Support</li>
              <li className="transition-colors duration-200 hover:text-white">Quality Repairs</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 relative inline-block text-white">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-white/30 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400 group">
                <MapPin className="mr-3 h-5 w-5 text-white/70 flex-shrink-0 mt-0.5" />
                <span className="group-hover:text-white transition-colors duration-200">
                  3803 Sullivant Ave, Columbus, OH 43228
                </span>
              </li>
              <li className="flex items-center text-gray-400 group">
                <Phone className="mr-3 h-5 w-5 text-white/70 flex-shrink-0" />
                <span className="group-hover:text-white transition-colors duration-200">(614) 649-1542</span>
              </li>
              <li className="flex items-center text-gray-400 group">
                <Mail className="mr-3 h-5 w-5 text-white/70 flex-shrink-0" />
                <span className="group-hover:text-white transition-colors duration-200">
                  info@carmasterautobody.com
                </span>
              </li>
              <li className="flex items-start text-gray-400 group">
                <Clock className="mr-3 h-5 w-5 text-white/70 flex-shrink-0 mt-0.5" />
                <div className="group-hover:text-white transition-colors duration-200">
                  <p>Mon-Fri: 7 AM–7 PM</p>
                  <p>Sat: 8 AM–4 PM</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-futuristic my-8"></div>
        <div className="text-center">
          <p className="text-gray-400">&copy; 2025 CarMaster Auto Body. All rights reserved.</p>
          <p className="mt-2 font-medium text-white">WE ARE CERTIFIED BY BBB AND HAVE AN A- RATING</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-300"
      aria-label="Social media link"
    >
      {icon}
    </a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition-colors duration-200 inline-block">
        {children}
      </Link>
    </li>
  )
}

