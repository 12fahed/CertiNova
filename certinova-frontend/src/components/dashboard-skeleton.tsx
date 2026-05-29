import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <div className="flex items-center mt-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

interface SkeletonListProps {
  count?: number;
}

export function CertificateGridSkeleton({ count = 6 }: SkeletonListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card
          key={i}
          className="bg-white border-gray-200 h-full flex flex-col"
        >
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-48 w-full mb-4 flex-grow" />
            <div className="flex space-x-2 mt-auto">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CertificateTableSkeleton({ count = 6 }: SkeletonListProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
      <Card className="bg-white border-gray-200 flex-1 flex flex-col shadow-sm overflow-hidden h-full">
        <div className="overflow-y-auto w-full flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Event Name</th>
                <th className="px-6 py-4 font-semibold">Issuer</th>
                <th className="px-6 py-4 font-semibold w-32">Date</th>
                <th className="px-6 py-4 font-semibold text-right w-36">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: count }).map((_, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="w-full lg:w-1/3 min-w-[320px] max-w-[400px] flex-shrink-0 h-full">
        <Card className="bg-white border-gray-200 h-full flex flex-col shadow-sm">
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="p-6 space-y-4 flex-1">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Card>
      </div>
    </div>
  );
}
