import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-8 text-muted-foreground max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" size="lg">
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/services">
            View Our Services
          </Link>
        </Button>
      </div>
    </div>
  )
}