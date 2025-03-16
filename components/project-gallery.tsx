"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react"

interface ProjectGalleryProps {
  images: string[]
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const nextSlide = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const handleImageError = (index: number) => {
    setImageError((prev) => ({ ...prev, [index]: true }))
  }

  // Don't render if no images are provided
  if (!images || images.length === 0) {
    return (
      <div className="relative h-full flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          {images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={imageError[index] ? "/placeholder.svg?height=400&width=600" : src}
                alt={`Project image ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(index)}
                priority={index === activeIndex}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        {/* Controls - only show if there are multiple images */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white shadow-md z-10"
              onClick={prevSlide}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white shadow-md z-10"
              onClick={nextSlide}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Zoom button */}
        <div className="absolute top-4 right-4 z-10">
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white shadow-md"
                aria-label="Zoom image"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-0 bg-black/90 border-none">
              <div className="relative h-[80vh] w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </Button>

                <Image
                  src={imageError[activeIndex] ? "/placeholder.svg?height=800&width=1200" : images[activeIndex]}
                  alt={`Project image ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  onError={() => handleImageError(activeIndex)}
                  priority
                  sizes="100vw"
                />

                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => {
                        prevSlide()
                      }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => {
                        nextSlide()
                      }}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Indicators - only show if there are multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

