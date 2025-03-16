"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ProjectGallery } from "@/components/project-gallery"

export default function ProjectsPage() {
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
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <Badge className="mb-3 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">CASE STUDIES</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert Restorations</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Quality results backed by experience</p>
          </motion.div>

          <div className="space-y-16">
            <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
              <ProjectCase
                title="GMC Terrain Front Collision"
                description="A devastating front-end collision led to a total loss. Our expert technicians performed a comprehensive inspection, uncovering critical structural failures that rendered the vehicle beyond repair."
                imageSrc="https://i.ibb.co/GvgD5ymF/IMG-2248-jpg.jpg"
                tags={["Expert Diagnostics", "Structural Repair", "Quality Assurance"]}
                metrics={[
                  { value: "100%", label: "Total Loss Evaluations" },
                  { value: "20+", label: "Claims & Inspections" },
                  { value: "4-Step", label: "Damage Assessment Process" },
                  { value: "5-Star", label: "Service Rating" },
                ]}
              />
            </motion.div>

            <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
              <ProjectCase
                title="Honda Civic Rear Collision"
                description="Following a severe rear-end collision, the vehicle was declared a total loss. Our skilled technicians conducted a meticulous and thorough assessment, carefully evaluating the extent of the structural damage and determining that the repairs were not feasible due to the severity of the impact."
                imageSrc="https://i.ibb.co/fdwdy48T/IMG-2255.jpg"
                tags={["Expert Assessment", "OEM Parts", "Quality Control"]}
                metrics={[
                  { value: "100%", label: "Total Loss Evaluations" },
                  { value: "Advanced", label: "Automotive Expertise" },
                  { value: "3-Step", label: "Damage Assessment Process" },
                  { value: "5-Star", label: "Customer Satisfaction" },
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

interface ProjectCaseProps {
  title: string
  description: string
  imageSrc: string
  tags: string[]
  metrics: { value: string; label: string }[]
}

function ProjectCase({ title, description, imageSrc, tags, metrics }: ProjectCaseProps) {
  return (
    <Card className="car-panel overflow-hidden border-0 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="font-medium bg-primary/10 text-primary border-primary/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mb-6">{description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-64 lg:h-auto overflow-hidden">
          <ProjectGallery images={[imageSrc, imageSrc]} />
        </div>
      </div>
    </Card>
  )
}

