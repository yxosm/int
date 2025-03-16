'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container py-10 flex flex-col items-center">
      <Alert variant="destructive" className="mb-6 max-w-md w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An unexpected error occurred while loading this page.
        </AlertDescription>
      </Alert>
      
      <div className="text-center max-w-md">
        <h2 className="text-xl font-medium mb-2">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          Please try refreshing the page or click the button below to try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}