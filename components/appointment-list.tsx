'use client'
import React, { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CarFront } from 'lucide-react'
import { useVirtualizer } from '@tanstack/react-virtual'

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
  service_type?: string
}

interface AppointmentCardProps {
  appointment: Appointment
}

// Memoized appointment card for better performance with large lists
const AppointmentCard = memo(({ appointment }: AppointmentCardProps) => {
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
    <Card className="h-full">
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
})

AppointmentCard.displayName = 'AppointmentCard'

interface AppointmentListProps {
  appointments: Appointment[]
  emptyMessage?: string
}

// Virtualized list for better performance with large datasets
export function AppointmentList({ appointments, emptyMessage = "No appointments found" }: AppointmentListProps) {
  // Optimize for small lists by not virtualizing
  if (appointments.length < 20) {
    return (
      <>
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </>
    )
  }
  
  // Use virtualization for larger lists
  const parentRef = React.useRef<HTMLDivElement>(null)
  
  const rowVirtualizer = useVirtualizer({
    count: appointments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  })
  
  return (
    <>
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div 
          ref={parentRef} 
          className="h-[600px] overflow-auto"
          style={{
            width: '100%',
            height: `600px`,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualItem => (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  padding: '8px',
                }}
              >
                <AppointmentCard appointment={appointments[virtualItem.index]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default AppointmentList