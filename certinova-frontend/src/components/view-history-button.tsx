"use client"

import { Button } from "@/components/ui/button"
import { History } from "lucide-react"
import { useRouter } from "next/navigation"

export function ViewHistoryButton({ className = "" }: { className?: string }) {
  const router = useRouter()

  const handleViewHistory = () => {
    router.push('/certificates')
  }

  return (
    <Button 
      onClick={handleViewHistory}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      <History className="h-4 w-4" />
      View History
    </Button>
  )
}
