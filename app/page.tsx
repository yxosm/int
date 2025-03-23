"use client"

import type React from "react"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, PenToolIcon as Tools, Shield, CreditCard, ChevronRight, Phone } from "lucide-react"
import { ReviewCarousel } from "@/components/review-carousel"
import { AppointmentModal } from "@/components/appointment-modal"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Banner */}
      <section ref={heroRef} className="relative w-full h-[80vh] min-h-[600px] overflow-hidden hero-futuristic">
        <motion.div style={{ opacity, scale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2248.jpg-NVMVs1FIrXpkEDIL99HkpHQBil8cCZ.jpeg"
            alt="Recent Project"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="container relative z-20 h-full flex flex-col justify-center items-start hero-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="outline" className="mb-4 badge-futuristic px-4 py-1.5 text-white">
              Expert Auto Repair
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl leading-tight hero-title glow-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Professional Auto Body Repair
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 max-w-xl text-gray-300 hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience excellence in auto body repair. Our skilled technicians and state-of-the-art facility ensure
            precision repairs and complete customer satisfaction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AppointmentModal>
              <Button className="glow-button text-lg px-8 py-4 rounded-md shadow-lg hover:shadow-xl">
                Schedule Service
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </AppointmentModal>
          </motion.div>

          <motion.div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full sm:w-auto"
            >
              <AppointmentModal>
                <Button className="multi-gradient-button w-full sm:w-auto text-lg py-6 px-8">
                  Book Appointment
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </AppointmentModal>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full sm:w-auto"
            >
              <a href="tel:+16146491542" className="block">
                <Button className="glow-button w-full sm:w-auto text-lg py-6 px-8">
                  <Phone className="mr-2 h-5 w-5" />
                  (614) 649-1542
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative overflow-hidden bg-radial-gradient">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2" />

        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-3 px-4 py-1.5 badge-futuristic">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">Expert Auto Body Solutions</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Professional repairs with quality you can trust</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              variants={fadeIn}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<Tools className="h-8 w-8" />}
                title="Expert Diagnostics"
                description="Thorough assessment and detailed repair planning"
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<Car className="h-8 w-8" />}
                title="Smart Rentals"
                description="App-based rental car service with contactless pickup"
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<Shield className="h-8 w-8" />}
                title="Digital Claims"
                description="Automated insurance processing with blockchain verification"
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              custom={4}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<Shield className="h-8 w-8" />}
                title="Insurance Assistance"
                description="We work directly with insurance companies and help expedite your claim process"
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              custom={5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<Car className="h-8 w-8" />}
                title="Free Rental Cars"
                description="Complimentary rental car service while your vehicle is being repaired"
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              custom={6}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ServiceCard3D
                icon={<CreditCard className="h-8 w-8" />}
                title="Deductible Assistance"
                description="Help with deductibles and maximizing your settlement value"
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <Link href="/services">
              <Button variant="outline" size="lg" className="neo-button group">
                View All Services
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-grid">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-3 px-4 py-1.5 badge-futuristic">Recent Work</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">Latest Projects</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">See our expert restorations and repairs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <ProjectCardFuturistic
                image="https://img001.prntscr.com/file/img001/U1WXUpGjTyOigh88fCsB8Q.png"
                title="Complete Body Restoration"
                description="Full exterior restoration with precision repairs."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProjectCardFuturistic
                image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2252.jpg-i6LqP7xSbHUhDvFhBpLSkSbTlLaXYa.jpeg"
                title="Precision Panel Repair"
                description="ML-powered damage assessment and repair execution."
              />
            </motion.div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/projects">
              <Button variant="outline" size="lg" className="neo-button group">
                View All Projects
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-radial-gradient">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-3 px-4 py-1.5 badge-futuristic">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">Customer Stories</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">What our clients say about us</p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReviewCarouselFuturistic />
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/reviews">
              <Button variant="outline" size="lg" className="neo-button group">
                Read More Reviews
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

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

function ProjectCardFuturistic({
  image,
  title,
  description,
}: {
  image: string
  title: string
  description: string
}) {
  return (
    <div className="project-card-futuristic">
      <div className="project-image-container h-64">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover project-image" />
        <div className="project-overlay"></div>
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
      </div>
    </div>
  )
}

function ReviewCarouselFuturistic() {
  return (
    <div className="glass-morphism p-8">
      <ReviewCarousel />
    </div>
  )
}

