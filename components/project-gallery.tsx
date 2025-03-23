"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/button'

interface Project {
  beforeImage: string
  afterImage: string
  title: string
  description: string
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAfterImage, setIsAfterImage] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projects.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === projects.length - 1 ? 0 : prevIndex + 1))
  }

  const openLightbox = (image: string, isAfter: boolean) => {
    setSelectedImage(image)
    setIsAfterImage(isAfter)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = ''
  }

  return (
    <>
      <div className="relative overflow-hidden touch-pan-y">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="project-card-futuristic group"
            >
              <div className="relative aspect-video">
                <div className="absolute inset-0 flex">
                  <div 
                    className="w-1/2 h-full cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(project.beforeImage, false)}
                  >
                    <img
                      src={project.beforeImage}
                      alt={`${project.title} - Before`}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium">
                      Before
                    </div>
                  </div>
                  <div 
                    className="w-1/2 h-full cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(project.afterImage, true)}
                  >
                    <img
                      src={project.afterImage}
                      alt={`${project.title} - After`}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium">
                      After
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile navigation buttons */}
        <div className="md:hidden flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 backdrop-blur-sm border-white/10 hover:bg-white/10"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 backdrop-blur-sm border-white/10 hover:bg-white/10"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg"
            onClick={closeLightbox}
          >
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 hover:bg-white/10"
                onClick={closeLightbox}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center justify-center h-full p-4">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={selectedImage}
                alt={`${projects[currentIndex].title} - ${isAfterImage ? 'After' : 'Before'}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded">
              {isAfterImage ? 'After' : 'Before'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

