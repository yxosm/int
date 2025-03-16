"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div className="text-center mb-16" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
            <Badge className="mb-3 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">CUSTOMER REVIEWS</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Success Stories</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">What our clients say about us</p>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible">
              <StatCard value="5.0" label="Customer Rating" variant="red" />
            </motion.div>
            <motion.div variants={fadeIn} custom={2} initial="hidden" animate="visible">
              <StatCard value="4-5" label="Days Average Processing" variant="white" />
            </motion.div>
            <motion.div variants={fadeIn} custom={3} initial="hidden" animate="visible">
              <StatCard value="30+" label="Years Experience" variant="gray" />
            </motion.div>
          </div>

          {/* Rating Distribution */}
          <motion.div variants={fadeIn} custom={4} initial="hidden" animate="visible" className="mb-16">
            <Card className="car-panel-red mb-12 border-0 shadow-md">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center">
                    <div className="text-5xl md:text-6xl font-bold text-gradient-red mr-6">5.0</div>
                    <div>
                      <div className="flex text-accent-red mb-1">
                        <Star className="fill-accent-red" />
                        <Star className="fill-accent-red" />
                        <Star className="fill-accent-red" />
                        <Star className="fill-accent-red" />
                        <Star className="fill-accent-red" />
                      </div>
                      <p className="text-muted-foreground">From verified reviews</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <RatingBar rating={5} percentage={100} color="accent-red" />
                    <RatingBar rating={4} percentage={0} color="accent-red" />
                    <RatingBar rating={3} percentage={0} color="accent-red" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div key={index} variants={fadeIn} custom={index + 5} initial="hidden" animate="visible">
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

// Update the StatCard component to use the new color scheme
function StatCard({
  value,
  label,
  variant = "red",
}: { value: string; label: string; variant?: "red" | "white" | "gray" }) {
  return (
    <Card className={`car-panel-${variant} border-0 shadow-md hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-8 text-center">
        <div
          className={`text-3xl md:text-4xl font-bold text-gradient-${variant === "gray" ? "white" : variant === "white" ? "white" : "red"} mb-3`}
        >
          {value}
        </div>
        <p className="text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

// Update the RatingBar component
function RatingBar({
  rating,
  percentage,
  color = "accent-red",
}: { rating: number; percentage: number; color?: string }) {
  return (
    <div className="flex items-center">
      <div className="w-8 text-sm font-medium">{rating}★</div>
      <div className="flex-1 h-3 mx-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full bg-${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        ></motion.div>
      </div>
      <div className="w-10 text-sm text-muted-foreground">{percentage}%</div>
    </div>
  )
}

interface Review {
  author: string
  text: string
  rating: number
}

// Update the ReviewCard component to use the new color scheme
function ReviewCard({ review }: { review: Review }) {
  const initials = review.author
    .split(" ")
    .map((name) => name[0])
    .join("")

  // Make color selection deterministic based on author name
  const colorVariants = ["red", "white", "gray", "darkred"]
  const colorIndex = review.author.length % colorVariants.length
  const color = colorVariants[colorIndex]

  const getColorClass = (baseColor: string) => {
    switch(baseColor) {
      case "red": return "accent-red";
      case "white": return "accent-white";
      case "gray": return "accent-gray";
      case "darkred": return "accent-darkred";
      default: return "accent-red";
    }
  }

  const colorClass = getColorClass(color)

  return (
    <Card className={`car-panel-${color} h-full border-0 shadow-md hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar
            className={`h-10 w-10 mr-3 bg-${colorClass}/10 text-${colorClass}`}
          >
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{review.author}</h3>
            <div className={`flex text-${colorClass}`}>
              {[...Array(review.rating)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 fill-${colorClass}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">{review.text}</p>
      </CardContent>
    </Card>
  )
}

const reviews: Review[] = [
  {
    author: "brukie kassa",
    text: "They are NOT a scam. They are LEGIT! They helped me with the entire process of dealing with my insurance and has been 100% transparent and walked me through every step of the way.",
    rating: 5,
  },
  {
    author: "Mike Sweigart",
    text: "I just had a great experience with the people at CarMaster. They were fantastic, they got me my check way before the insurance company would have and I give them a triple A Plus. Thank you CarMaster for a great job!",
    rating: 5,
  },
  {
    author: "Tatyana Royal",
    text: "My experience with them has been amazing, even after my vehicle being total, they done everything they can to help better my situation. I very much recommend this company, especially if your insurance company gives you problems.",
    rating: 5,
  },
  {
    author: "Basim Al Rimawi",
    text: "Very dependable company. If your car is totaled they will get you the most out of your car.",
    rating: 5,
  },
  {
    author: "American Eagle",
    text: "I want to thank Christina for her outstanding help with my total loss car. She got me a great price and made the entire process incredibly fast and smooth for us. Her professionalism and efficiency truly stood out. Highly recommend!",
    rating: 5,
  },
  {
    author: "Twilight Auto Sale",
    text: "Christina was professional to work with on my total loss car. She worked very hard to give a fair price and handled everything quickly and efficiently. The process was stress-free thanks to her expertise.",
    rating: 5,
  },
]

