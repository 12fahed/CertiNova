'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react'; // Assuming you use lucide-react for icons with shadcn

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service here
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-md flex flex-col items-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
        <p className="text-muted-foreground text-lg">
          An unexpected error occurred while trying to load this page. We've been notified and are
          looking into it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => reset()} size="lg" className="w-full sm:w-auto">
            Try again
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
