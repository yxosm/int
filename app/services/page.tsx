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
            <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<Car className="h-8 w-8" />}
                title="Collision Repair"
                description="Expert repair for all types of collision damage, ensuring your vehicle is restored to pre-accident condition."
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<Palette className="h-8 w-8" />}
                title="Paint Services"
                description="Professional paint matching and application using premium materials and modern techniques."
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<Tools className="h-8 w-8" />}
                title="Frame Repair"
                description="Precise frame straightening and structural repairs using advanced equipment."
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={4} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<Shield className="h-8 w-8" />}
                title="Insurance Claims"
                description="Direct insurance billing and assistance with claims processing for a hassle-free experience."
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={5} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<CarFront className="h-8 w-8" />}
                title="Rental Assistance"
                description="We help coordinate rental vehicles through your insurance coverage during repairs."
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={6} initial="hidden" animate="visible">
              <ServiceCard3D
                icon={<Zap className="h-8 w-8" />}
                title="Express Service"
                description="Quick turnaround for minor repairs and touch-ups."
              />
            </motion.div>
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
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="service-card-3d p-8 h-full">
      <div className="content">
        <div className="icon-container">{icon}</div>
        <h3 className="service-title">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

