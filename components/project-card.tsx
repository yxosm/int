"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface ProjectCardProps {
  image: string
  title: string
  description: string
}

export function ProjectCard({ image, title, description }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="project-card-futuristic"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="project-image-container h-64">
        <motion.div animate={{ scale: isHovered ? 1.05 : 1 }} transition={{ duration: 0.5 }} className="h-full w-full">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover project-image" />
        </motion.div>
        <div className="project-overlay"></div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full z-10"
          animate={{ y: isHovered ? 0 : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white/80">{description}</p>
          </div>
        </motion.div>
      </div>

      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </div>
    </motion.div>
  )
}

