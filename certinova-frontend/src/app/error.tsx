'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white px-4 text-center">
      <div className="max-w-md space-y-6 flex flex-col items-center">
        <div className="rounded-full bg-blue-100 p-4">
          <AlertCircle className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">Something went wrong!</h2>
        <p className="text-muted-foreground text-lg">
          An unexpected error occurred while trying to load this page. We&apos;ve been notified and
          are looking into it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          >
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 sm:w-auto"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
