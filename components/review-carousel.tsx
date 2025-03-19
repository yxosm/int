"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

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
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setActiveIndex((current) => (current === reviews.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setDirection(-1)
    setActiveIndex((current) => (current === 0 ? reviews.length - 1 : current - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="relative">
      <div className="p-8 md:p-12">
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-white/80 fill-white/80" />
          ))}
        </div>

        <div className="relative h-[200px] overflow-hidden">
          <AnimatePresence custom={direction} initial={false}>
            <motion.blockquote
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="text-xl md:text-2xl text-center mb-8 italic text-white/90">"{reviews[activeIndex].text}"</p>

              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4 avatar-futuristic">
                  <AvatarFallback className="text-white font-medium">
                    {reviews[activeIndex].author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-white">{reviews[activeIndex].author}</div>
                  <div className="text-sm text-gray-400">{reviews[activeIndex].date}</div>
                </div>
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === activeIndex ? "bg-white" : "bg-white/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous review</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next review</span>
      </Button>
    </div>
  )
}

