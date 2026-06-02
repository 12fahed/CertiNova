import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-white px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-8xl font-extrabold tracking-tighter text-blue-600">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-lg">
          Oops! The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href="/">Return Home</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 sm:w-auto"
          >
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
