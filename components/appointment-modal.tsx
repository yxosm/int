'use client'
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Phone, CheckCircle, AlertCircle, AlertOctagon } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { cn } from "@/lib/utils"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

type Appointment = {
  name: string
  email: string
  phone: string
  preferred_date: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  user_id: string
  car_model: string
  message?: string | null
}

const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g,'') // Remove < and > to prevent HTML injection
    .replace(/['"]/g,'') // Remove quotes to prevent attribute injection
    .replace(/javascript:/gi,'') // Remove javascript: to prevent script injection
    .trim()
}

const validateName = (name: string): boolean => {
  return /^[A-Za-z\s]{2,}$/.test(name.trim()) // Only letters and spaces, at least 2 chars
}

const validatePhone = (phone: string): boolean => {
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone.trim())
}

// Format phone to (123) 456-7890 pattern
const formatPhone = (phone: string): string => {
  // First strip all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // If we have 10 digits, format it as (123) 456-7890
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`
  }
  
  // For partial inputs with at least 3 digits
  if (digits.length >= 3 && digits.length < 6) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3)}`
  }
  
  // For partial inputs with at least 6 digits
  if (digits.length >= 6 && digits.length < 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`
  }
  
  // For inputs with less than 3 digits
  if (digits.length > 0 && digits.length < 3) {
    return `(${digits}`
  }
  
  // Otherwise return the original input
  return phone
}

export function AppointmentModal({ children }: { children: React.ReactNode }) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [carModel, setCarModel] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()

  // Check daily limit whenever user changes
  useEffect(() => {
    if (user) {
      checkDailyLimit(user.id).then(count => {
        setDailyCount(count)
      })
    }
  }, [user])

  const checkDailyLimit = async (userId: string) => {
    const supabase = createClient()
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('request_date', new Date().toISOString().split('T')[0])

    return count || 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedPhone = sanitizeInput(formatPhone(phone)) // Format the phone number
    const sanitizedMessage = sanitizeInput(message)
    const sanitizedCarModel = sanitizeInput(carModel)

    if (!sanitizedCarModel.trim()) {
      toast({
        title: "Car Model Required",
        description: "Please enter your car model",
        variant: "destructive",
      })
      return
    }

    if (!validateName(sanitizedName)) {
      toast({
        title: "Invalid Name",
        description: "Please enter a valid name (letters only)",
        variant: "destructive",
      })
      return
    }

    if (!validatePhone(sanitizedPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number (e.g., 123-456-7890)",
        variant: "destructive",
      })
      return
    }

    if (sanitizedMessage.length > 1000) {
      toast({
        title: "Message Too Long",
        description: "Service details must be less than 1000 characters.",
        variant: "destructive",
      })
      return
    }

    // Validation checks
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book an appointment.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Please select a date",
        description: "A preferred date is required for your appointment.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Refresh the daily count
      const currentCount = await checkDailyLimit(user.id)
      setDailyCount(currentCount)
      
      if (currentCount >= 3) {
        toast({
          title: "Daily Limit Reached",
          description: "You can only schedule up to 3 appointments per day. Please try again tomorrow.",
          variant: "destructive",
        })
        return
      }

      const supabase = createClient()

      const appointment: Omit<Appointment, 'id' | 'created_at'> = {
        name: sanitizedName,
        email: user.email!,
        phone: sanitizedPhone,
        car_model: sanitizedCarModel,
        preferred_date: date.toISOString(),
        message: sanitizedMessage,
        status: 'pending',
        user_id: user.id,
      }

      const { error, data } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update the daily count
      setDailyCount(prevCount => prevCount + 1)
      setIsSubmitted(true)
      toast({
        title: "Appointment Scheduled",
        description: "We'll contact you shortly to confirm your appointment.",
      })
    } catch (error) {
      console.error('Error scheduling appointment:', error instanceof Error ? error.message : 'Unknown error')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem scheduling your appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setDate(undefined)
    setName("")
    setPhone("")
    setCarModel("")
    setMessage("")
    setIsSubmitted(false)
  }

  const renderContent = () => {
    if (!user) {
      return (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Sign in to Book an Appointment</h3>
          <p className="text-muted-foreground mb-6">Please sign in or create an account to schedule your appointment.</p>
          <AuthModal>
            <Button className="multi-gradient-button">
              Sign In / Create Account
            </Button>
          </AuthModal>
        </div>
      )
    }

    if (isSubmitted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8 text-center space-y-4"
        >
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Appointment Request Sent!</h3>
          <p className="text-muted-foreground">
            We'll contact you shortly to confirm your appointment.
          </p>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </motion.div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {dailyCount >= 3 && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle className="font-bold">Daily Limit Reached</AlertTitle>
            <AlertDescription>
              You've reached your limit of 3 appointments per day. Please try again tomorrow.
            </AlertDescription>
          </Alert>
        )}
        
        {dailyCount > 0 && dailyCount < 3 && (
          <Alert variant="default" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Appointment Limit</AlertTitle>
            <AlertDescription>
              You've scheduled {dailyCount} of 3 allowed daily appointments.
              {dailyCount === 2 && (
                <span className="font-semibold"> This is your last available appointment for today.</span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1"
                disabled={isSubmitting || dailyCount >= 3}
                onBlur={(e) => {
                  if (!validateName(e.target.value)) {
                    toast({
                      title: "Invalid Name",
                      description: "Please use only letters in your name",
                      variant: "destructive",
                    })
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  // Allow only digits, parentheses, spaces, dashes
                  const value = e.target.value.replace(/[^\d\s\(\)\-\.]/g, '')
                  
                  // Try to auto-format as user types
                  const formatted = formatPhone(value)
                  setPhone(formatted)
                }}
                onBlur={(e) => {
                  // Format on blur for final validation
                  const formatted = formatPhone(e.target.value)
                  setPhone(formatted)
                }}
                placeholder="(123) 456-7890"
                required
                className="mt-1"
                disabled={isSubmitting || dailyCount >= 3}
              />
            </div>
            <div>
              <Label htmlFor="carModel">Car Model</Label>
              <div className="relative">
                <Input
                  id="carModel"
                  value={carModel}
                  onChange={(e) => {
                    // Limit to 25 characters
                    if (e.target.value.length <= 25) {
                      setCarModel(e.target.value)
                    }
                  }}
                  placeholder="e.g., Honda Civic 2020"
                  required
                  className="mt-1"
                  disabled={isSubmitting || dailyCount >= 3}
                  maxLength={25}
                />
                <div className="absolute right-2 bottom-1 text-xs text-muted-foreground">
                  {carModel.length}/25
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
          </div>
          <div>
            <Label>Preferred Date</Label>
            <div className="border rounded-md mt-1 overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const easternDate = new Date(selectedDate.toLocaleString("en-US", { timeZone: "America/New_York" }))
                    setDate(easternDate)
                  }
                }}
                disabled={(date) => {
                  const now = new Date()
                  const easternTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
                  easternTime.setHours(0, 0, 0, 0)
                  const compareDate = new Date(date)
                  compareDate.setHours(0, 0, 0, 0)
                  return compareDate < easternTime || dailyCount >= 3
                }}
                className={cn(
                  "rounded-md border",
                  "dark:bg-black dark:text-white dark:border-white/10",
                  "[&_.rdp-day:focus]:bg-primary [&_.rdp-day:focus]:text-primary-foreground",
                  "[&_.rdp-day:hover]:bg-muted [&_.rdp-day:hover]:text-accent-foreground",
                  "[&_.rdp-day.rdp-day_selected]:bg-primary [&_.rdp-day.rdp-day_selected]:text-primary-foreground",
                  // Add styles to hide today highlighting
                  "[&_.rdp-day_today]:bg-inherit [&_.rdp-day_today]:text-inherit [&_.rdp-day_today]:font-normal [&_.rdp-day_today]:border-none"
                )}
              />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="message">Service Details</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your service needs"
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            disabled={isSubmitting || dailyCount >= 3}
            onBlur={(e) => {
              if (e.target.value.length > 1000) {
                toast({
                  title: "Message Too Long",
                  description: "Service details must be less than 1000 characters.",
                  variant: "destructive",
                })
              }
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="multi-gradient-button w-full md:w-auto"
            disabled={isSubmitting || dailyCount >= 3}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <Dialog onOpenChange={(open) => !open && resetForm()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background border-border/50 shadow-xl">
        <Tabs defaultValue="schedule" className="w-full">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-center">Schedule Service</DialogTitle>
            <TabsList className="grid grid-cols-2 mt-4">
              <TabsTrigger value="schedule" className="text-sm">
                Schedule Online
              </TabsTrigger>
              <TabsTrigger value="call" className="text-sm">
                Call Now
              </TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="schedule" className="p-6 pt-2">
            {renderContent()}
          </TabsContent>
          <TabsContent value="call" className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Operating Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri: 7 AM–7 PM
                  <br />
                  Sat: 8 AM–4 PM
                  <br />
                  Sun: Closed
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="font-semibold">(614) 649-1542</p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <a href="tel:+16146491542">
                <Button className="multi-gradient-button">
                  <Phone className="mr-2 h-4 w-4" /> Call Now
                </Button>
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

