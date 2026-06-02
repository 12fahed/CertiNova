'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  onRetry: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  onRetry,
  title = 'Something went wrong!',
  description = "An unexpected error occurred while trying to load this page. We've been notified and are looking into it.",
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white px-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-blue-100 p-4">
          <AlertCircle className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-600">{title}</h2>
        <p className="text-muted-foreground text-lg">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            onClick={onRetry}
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
