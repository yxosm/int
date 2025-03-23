"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppointmentModal } from "@/components/appointment-modal"
import { Car, Palette, PenToolIcon as Tools, Shield, CarFront, Zap } from "lucide-react"

export default function ServicesPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="py-20 md:py-28 bg-grid">
        <div className="container">
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <Badge className="mb-3 px-4 py-1.5 badge-futuristic">OUR SERVICES</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Professional Auto Body Services</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Precision repairs with state-of-the-art technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard3D
              icon={<Car className="h-8 w-8" />}
              title="Collision Repair"
              description="Expert repair for all types of collision damage, ensuring your vehicle is restored to pre-accident condition."
              index={1}
            />

            <ServiceCard3D
              icon={<Palette className="h-8 w-8" />}
              title="Paint Services"
              description="Professional paint matching and application using premium materials and modern techniques."
              index={2}
            />

            <ServiceCard3D
              icon={<Tools className="h-8 w-8" />}
              title="Frame Repair"
              description="Precise frame straightening and structural repairs using advanced equipment."
              index={3}
            />

            <ServiceCard3D
              icon={<Shield className="h-8 w-8" />}
              title="Insurance Claims"
              description="Direct insurance billing and assistance with claims processing for a hassle-free experience."
              index={4}
            />

            <ServiceCard3D
              icon={<CarFront className="h-8 w-8" />}
              title="Rental Assistance"
              description="We help coordinate rental vehicles through your insurance coverage during repairs."
              index={5}
            />

            <ServiceCard3D
              icon={<Zap className="h-8 w-8" />}
              title="Express Service"
              description="Quick turnaround for minor repairs and touch-ups."
              index={6}
            />
          </div>

          <motion.div className="mt-16 text-center" variants={fadeIn} custom={7} initial="hidden" animate="visible">
            <AppointmentModal>
              <Button className="glow-button text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl">
                Schedule Service
              </Button>
            </AppointmentModal>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

function ServiceCard3D({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }),
    }),
  }

  return (
    <motion.div 
      variants={fadeIn} 
      custom={index} 
      initial="hidden" 
      animate="visible" 
      className="relative group"
    >
      <div className="service-card-3d h-full p-6 sm:p-8">
        <div className="icon-container group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div className="content space-y-3">
          <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
          <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <AppointmentModal>
              <Button className="glow-button w-full">
                Book Service
              </Button>
            </AppointmentModal>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

