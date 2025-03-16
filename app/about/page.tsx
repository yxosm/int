"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, DollarSign, Users } from "lucide-react"

export default function AboutPage() {
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
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <Badge className="mb-3 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">OUR STORY</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Excellence in Auto Body Services</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Decades of Experience in Total Loss Assistance and Quality Repairs
            </p>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
              <MetricCard number="7+" label="Years Experience" variant="red" />
            </motion.div>
            <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
              <MetricCard number="4-5" label="Days Average Claim" variant="white" />
            </motion.div>
            <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible">
              <MetricCard number="100+" label="Satisfied Clients" variant="gray" />
            </motion.div>
            <motion.div variants={fadeIn} custom={4} initial="hidden" animate="visible">
              <MetricCard number="5.0" label="Star Rating" variant="darkred" />
            </motion.div>
          </div>

          {/* Timeline */}
          <motion.div
            className="max-w-3xl mx-auto mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={5}
          >
            <div className="space-y-8">
              <TimelineItem
                title="Our Foundation"
                description="Built on decades of auto industry expertise, we specialized in providing exceptional total loss assistance and auto body repairs to our community."
              />
              <TimelineItem
                title="Customer-First Approach"
                description="We developed a streamlined process for handling insurance claims and total loss situations, making the experience stress-free for our clients."
              />
              <TimelineItem
                title="Growing Impact"
                description="Our dedication to customer service and expertise in total loss assistance has helped thousands of clients navigate challenging situations with ease."
              />
            </div>
          </motion.div>

          {/* Expertise */}
          <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={fadeIn} custom={6}>
            <h2 className="text-3xl font-bold mb-12">Our Expertise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div variants={fadeIn} custom={7} initial="hidden" animate="visible">
                <ExpertiseCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Insurance Claims"
                  description="Expert Claims Handling"
                  variant="red"
                />
              </motion.div>
              <motion.div variants={fadeIn} custom={8} initial="hidden" animate="visible">
                <ExpertiseCard
                  icon={<DollarSign className="h-6 w-6" />}
                  title="Total Loss"
                  description="Fast Settlement Process"
                  variant="white"
                />
              </motion.div>
              <motion.div variants={fadeIn} custom={9} initial="hidden" animate="visible">
                <ExpertiseCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Auto Body"
                  description="Quality Repairs"
                  variant="gray"
                />
              </motion.div>
              <motion.div variants={fadeIn} custom={10} initial="hidden" animate="visible">
                <ExpertiseCard
                  icon={<Users className="h-6 w-6" />}
                  title="Customer Service"
                  description="Personalized Support"
                  variant="darkred"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// Update the MetricCard component to use the new color scheme
function MetricCard({
  number,
  label,
  variant = "red",
}: { number: string; label: string; variant?: "red" | "white" | "gray" | "darkred" }) {
  return (
    <Card className={`car-panel-${variant} border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full`}>
      <CardContent className="p-8 text-center">
        <div
          className={`text-4xl font-bold text-gradient-${variant === "gray" ? "white" : variant === "white" ? "white" : "red"} mb-3`}
        >
          {number}
        </div>
        <p className="text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

function TimelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative pl-10 border-l-2 border-primary/20 py-6 hover:border-primary/50 transition-colors duration-300">
      <div className="absolute left-[-9px] top-7 w-4 h-4 rounded-full bg-primary shadow-md shadow-primary/20"></div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

// Update the ExpertiseCard component
function ExpertiseCard({
  icon,
  title,
  description,
  variant = "red",
}: {
  icon: React.ReactNode
  title: string
  description: string
  variant?: "red" | "white" | "gray" | "darkred"
}) {
  return (
    <div
      className={`car-panel-${variant} p-6 text-center h-full border border-border/30 hover:border-${variant === "red" ? "accent-red" : variant === "white" ? "accent-white" : variant === "gray" ? "accent-gray" : "accent-darkred"}/20 transition-all duration-300`}
    >
      <div
        className={`w-16 h-16 mx-auto bg-background rounded-xl shadow-md flex items-center justify-center mb-4 text-${variant === "red" ? "accent-red" : variant === "white" ? "accent-white" : variant === "gray" ? "accent-gray" : "accent-darkred"} transform -rotate-3 hover:rotate-0 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

