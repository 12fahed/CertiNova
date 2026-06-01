import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-extrabold tracking-tighter text-primary">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
