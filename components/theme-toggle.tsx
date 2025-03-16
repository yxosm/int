"use client"
import { Button } from "@/components/ui/button"
import { Moon } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
      aria-label="Dark mode"
    >
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="h-5 w-5 text-white" />
      </motion.div>
    </Button>
  )
}

