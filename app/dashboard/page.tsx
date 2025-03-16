'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import ErrorBoundary from '@/components/error-boundary'
import { Calendar, Clock, CarFront, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

type Appointment = {
  id: string
  name: string
  email: string
  phone: string
  preferred_date: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  car_model: string
  message: string | null
  created_at: string
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        router.push('/')
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setAppointments(data || [])
      } catch (error: any) {
        console.error('Error fetching appointments:', error)
        toast({
          title: "Error",
          description: "Could not load your appointments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user, router, toast])

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const filterAppointments = (status: Appointment['status'] | 'all') => {
    if (status === 'all') {
      return appointments
    }
    return appointments.filter(apt => apt.status === status)
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <p>Please sign in to view your dashboard.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[600px]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p>Loading your appointments...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user.email}</p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Appointments</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {appointments.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-6">
            {filterAppointments('confirmed').length === 0 ? (
              <EmptyState message="No upcoming appointments" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterAppointments('confirmed').map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            {filterAppointments('completed').length === 0 ? (
              <EmptyState message="No past appointments" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterAppointments('completed').map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'confirmed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'completed': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{appointment.car_model}</CardTitle>
            <CardDescription>
              Appointment {format(new Date(appointment.created_at), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <Badge 
            variant="secondary"
            className={`${getStatusColor(appointment.status)} text-white`}
          >
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">
            Preferred Date: {format(new Date(appointment.preferred_date), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <CarFront className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm truncate">
            {appointment.car_model}
          </p>
        </div>
        {appointment.message && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm whitespace-pre-wrap line-clamp-3">
              {appointment.message}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {appointment.status === 'confirmed' && (
          <p className="text-sm text-muted-foreground">
            Contact us at (614) 649-1542 if you need to reschedule.
          </p>
        )}
      </CardFooter>
    </Card>
  )
}

function EmptyState({ message = "No appointments found" }: { message?: string }) {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
      <div className="mb-4 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
        <Calendar className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground text-center mb-6">
        Schedule a service appointment to get your car in top shape.
      </p>
      <Button onClick={() => router.push('/')}>
        Book an Appointment
      </Button>
    </div>
  )
}