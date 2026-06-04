'use client';

import { ErrorFallback } from '@/components/error-fallback';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback onRetry={reset} />;
}
