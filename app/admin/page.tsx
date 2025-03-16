'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useToast } from '@/components/ui/use-toast'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Info, Filter } from 'lucide-react'
import ErrorBoundary from '@/components/error-boundary'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Service categories for classification
const SERVICE_TYPES = [
  "Other"
]

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

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({})
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [serviceFilter, setServiceFilter] = useState<string>("")
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      if (!user) {
        console.log('No user logged in')
        toast({
          title: "Authentication Required",
          description: "Please login with admin credentials.",
          variant: "destructive",
        })
        router.push('/')
        return
      }
 
      if (user.email !== 'ykxglobal@gmail.com') {
        console.log('User not admin:', user.email)
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      console.log('Admin authenticated:', user.email)
      
      try {
        const supabase = createClient()
        
        // First verify we have a valid session
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData.session) {
          throw new Error("No active session found")
        }
        
        console.log('Fetching appointments...')
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching appointments:', error)
          toast({
            title: "Error",
            description: "Failed to load appointments: " + error.message,
            variant: "destructive",
          })
          return
        }

        console.log(`Successfully fetched ${data?.length || 0} appointments`)

        if (!data || data.length === 0) {
          toast({
            title: "No Appointments",
            description: "There are currently no appointments in the system.",
          })
        }

        // Pre-process appointments to extract service types from messages
        const processedAppointments = data?.map(apt => {
          const serviceType = detectServiceType(apt.message || apt.car_model)
          return { ...apt, service_type: serviceType }
        }) || []

        setAppointments(processedAppointments)
      } catch (error: any) {
        console.error('Error in checkAdminAndLoadData:', error)
        toast({
          title: "Error",
          description: error?.message || "An unexpected error occurred while loading appointments.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAdminAndLoadData()
  }, [user, router, toast])

  const detectServiceType = (text: string): string => {
    text = text.toLowerCase()
    
    // Simple keyword matching for service categorization
    const keywords = {
      collision: ['collision', 'accident', 'crash', 'dent', 'bumper'],
      paint: ['paint', 'color', 'scratch', 'finish'],
      mechanical: ['engine', 'transmission', 'brake', 'mechanical'],
      maintenance: ['maintenance', 'service', 'inspection', 'check']
    }

    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => text.includes(word))) {
        return type
      }
    }

    return 'general'
  }

  const updateServiceType = async (id: string, serviceType: string) => {
    setIsProcessing(true)
    
    try {
      // Update the appointment state locally
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, service_type: serviceType } : apt
      ))
      
      // Note: If you decide to store service types in the database,
      // you would add Supabase update code here
      
      toast({
        title: "Service Type Updated",
        description: "Appointment service category has been updated.",
      })
    } catch (error) {
      console.error('Error updating service type:', error)
      toast({
        title: "Error",
        description: "Failed to update service type.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    // Early return if not logged in
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to continue.",
        variant: "destructive",
      })
      router.push('/') 
      return
    }

    // Early return if not admin
    if (user.email !== 'ykxglobal@gmail.com') {
      toast({
        title: "Not Authorized", 
        description: "Only admin can update appointment statuses.",
        variant: "destructive",
      })
      return
    }
    
    setIsProcessing(true)

    try {
      // First update local state immediately for better UX
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: newStatus } : apt
      ))
      
      // Create a fresh Supabase client to ensure we have valid tokens
      const supabase = createClient()
      
      // Get the current session to ensure we're authenticated
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (!sessionData.session) {
        throw new Error("No active session found")
      }
      
      // Now perform the update with proper authentication
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (updateError) {
        // Don't log the entire error object to console, just the message if it exists
        const errorMessage = updateError.message || 'Unknown database error'
        
        // Log just the error message, not the entire object
        console.log('Update error message:', errorMessage)
        
        toast({
          title: "Backend Update Failed",
          description: "Status updated locally but server sync failed. Changes will not persist after page refresh.",
          variant: "destructive", 
        })
        return
      }

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      })

    } catch (error: any) {
      // Don't log the entire error object, just the message
      const errorMessage = error?.message || 'Unknown error'
      console.log('Status update error message:', errorMessage)
      
      toast({
        title: "Status Changed Locally Only",
        description: "Status was updated in your view but failed to sync with the database.",
        variant: "destructive", 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenDialog = (id: string) => {
    setDialogOpen(prev => ({ ...prev, [id]: true }))
  }

  const handleCloseDialog = (id: string) => {
    setDialogOpen(prev => ({ ...prev, [id]: false }))
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

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case 'Oil Change': return 'bg-blue-200 text-blue-800'
      case 'Brake Service': return 'bg-red-200 text-red-800'
      case 'Tire Service': return 'bg-green-200 text-green-800'
      case 'Engine Repair': return 'bg-orange-200 text-orange-800'
      case 'Transmission Service': return 'bg-purple-200 text-purple-800'
      case 'A/C & Heating': return 'bg-cyan-200 text-cyan-800'
      case 'Battery/Electrical': return 'bg-yellow-200 text-yellow-800'
      case 'Suspension/Steering': return 'bg-indigo-200 text-indigo-800'
      case 'General Maintenance': return 'bg-teal-200 text-teal-800'
      default: return 'bg-gray-200 text-gray-800'
    }
  }

  const filteredAppointments = appointments
    .filter(apt => statusFilter.length === 0 || statusFilter.includes(apt.status))
    .filter(apt => serviceFilter === "all" || !serviceFilter || apt.service_type === serviceFilter)

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p>Loading appointments...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Appointment Management</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filters:</span>
            
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Status</span>
                  {statusFilter.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{statusFilter.length}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem 
                  checked={statusFilter.includes('pending')}
                  onCheckedChange={() => toggleStatusFilter('pending')}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={statusFilter.includes('confirmed')}
                  onCheckedChange={() => toggleStatusFilter('confirmed')}
                >
                  Confirmed
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={statusFilter.includes('cancelled')}
                  onCheckedChange={() => toggleStatusFilter('cancelled')}
                >
                  Cancelled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={statusFilter.includes('completed')}
                  onCheckedChange={() => toggleStatusFilter('completed')}
                >
                  Completed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Service Type Filter */}
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setStatusFilter([])
                setServiceFilter("")
              }}
              disabled={statusFilter.length === 0 && !serviceFilter}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {filteredAppointments.length === 0 
                ? "No appointments match the selected filters" 
                : `Showing ${filteredAppointments.length} of ${appointments.length} total appointments`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Car Model</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Preferred Date</TableHead>
                <TableHead>Service Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.car_model}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getServiceColor(appointment.service_type || "Other")}>
                        {appointment.service_type || "Other"}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Service Type</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {SERVICE_TYPES.map(type => (
                            <DropdownMenuItem 
                              key={type}
                              onClick={() => updateServiceType(appointment.id, type)}
                            >
                              {type}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{appointment.email}</span>
                      <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.preferred_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog open={dialogOpen[appointment.id]} onOpenChange={(open) => {
                      if (open) {
                        handleOpenDialog(appointment.id)
                      } else {
                        handleCloseDialog(appointment.id)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleOpenDialog(appointment.id)}
                        >
                          <Info className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Service Details</DialogTitle>
                          <DialogDescription>
                            Details for appointment by {appointment.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 my-4">
                          <div>
                            <h4 className="text-sm font-semibold">Car Model</h4>
                            <p className="mt-1">{appointment.car_model}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">Service Type</h4>
                            <Badge variant="outline" className={`${getServiceColor(appointment.service_type || "Other")} mt-1`}>
                              {appointment.service_type || "Other"}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">Message</h4>
                            <p className="mt-1 whitespace-pre-wrap">
                              {appointment.message || "No additional details provided"}
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button 
                              variant="outline"
                              onClick={() => handleCloseDialog(appointment.id)}
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={`${getStatusColor(appointment.status)} text-white`}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="bg-green-500 hover:bg-green-600"
                            disabled={isProcessing}
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={isProcessing}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ErrorBoundary>
  )
}