import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Lock } from "lucide-react"

interface PremiumCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconBgColor: string
  iconColor: string
  trend: string
  trendValue: string
  isPremium?: boolean
}

export function PremiumCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  trend,
  trendValue,
  isPremium = false,
}: PremiumCardProps) {
  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-500">{trendValue}</span>
          <span className="text-gray-500 ml-1">{trend}</span>
        </div>
      </CardContent>

      {/* Premium Overlay */}
      {isPremium && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all duration-300 hover:bg-white/85">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-full shadow-lg mb-3 animate-pulse">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div className="text-center px-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Premium Feature</h3>
            <p className="text-sm text-gray-600 leading-relaxed">This is for premium purpose only</p>
            <div className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-medium rounded-full shadow-sm">
              Upgrade to unlock
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
