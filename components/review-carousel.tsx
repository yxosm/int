"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface Review {
  author: string
  text: string
  rating: number
  date: string
}

const reviews = [
  {
    author: "brukie kassa",
    text: "They are NOT a scam. They are LEGIT! They helped me with the entire process of dealing with my insurance and has been 100% transparent and walked me through every step of the way.",
    date: "1 week ago",
    rating: 5,
  },
  {
    author: "Mike Sweigart",
    text: "I just had a great experience with the people at CarMaster. They were fantastic, they got me my check way before the insurance company would have and I give them a triple A Plus. Thank you CarMaster for a great job!",
    date: "2 weeks ago",
    rating: 5,
  },
  {
    author: "Tatyana Royal",
    text: "My experience with them has been amazing, even after my vehicle being total, they done everything they can to help better my situation. I very much recommend this company, especially if your insurance company gives you problems.",
    date: "3 weeks ago",
    rating: 5,
  },
  {
    author: "Basim Al Rimawi",
    text: "Very dependable company. If your car is totaled they will get you the most out of your car.",
    date: "1 month ago",
    rating: 5,
  },
  {
    author: "Dana Adams",
    text: "You did a wonderful job very professional and nice and the customer service was excellent.",
    date: "2 months ago",
    rating: 5,
  },
  {
    author: "Edward Zimmelman",
    text: "Year after year CarMaster Auto has been there for all my repair needs. Professional and thorough every time.",
    date: "2 months ago",
    rating: 5,
  },
  {
    author: "American Eagle",
    text: "I want to thank Christina for her outstanding help with my total loss car. She got me a great price and made the entire process incredibly fast and smooth for us. Her professionalism and efficiency truly stood out. Highly recommend!",
    date: "3 months ago",
    rating: 5,
  },
  {
    author: "Twilight Auto Sale",
    text: "Christina was professional to work with on my total loss car. She worked very hard to give a fair price and handled everything quickly and efficiently. The process was stress-free thanks to her expertise.",
    date: "3 months ago",
    rating: 5,
  }
]

export function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection
      if (newIndex < 0) newIndex = reviews.length - 1
      if (newIndex >= reviews.length) newIndex = 0
      return newIndex
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.touches[0].clientX
    const diff = touchStart - currentTouch

    if (Math.abs(diff) > 50) {
      paginate(diff > 0 ? 1 : -1)
      setTouchStart(null)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  return (
    <div 
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[400px] md:h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute w-full h-full"
          >
            <div className="review-card-futuristic p-8 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < reviews[currentIndex].rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-500"
                      )}
                    />
                  ))}
                </div>
                <blockquote className="flex-grow mb-6">
                  <p className="text-lg md:text-xl leading-relaxed text-gray-200">
                    "{reviews[currentIndex].text}"
                  </p>
                </blockquote>
                <footer>
                  <div className="flex items-center">
                    <div className="avatar-futuristic w-12 h-12 flex items-center justify-center text-lg font-semibold">
                      {reviews[currentIndex].author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <cite className="font-semibold not-italic">
                        {reviews[currentIndex].author}
                      </cite>
                      <div className="text-sm text-gray-400">
                        {reviews[currentIndex].date}
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2 mt-6">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/10 hidden md:flex"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-white/10 hidden md:flex"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

