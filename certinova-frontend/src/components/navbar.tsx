"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Award, Plus, Send, User, Settings, LogOut, ArrowLeft, Lock, Book } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { ViewHistoryButton } from "@/components/view-history-button";
import { useRouter } from "next/navigation"

interface NavbarProps {
  variant?: 'dashboard' | 'certificate'
  onCreateNew?: () => void
  onSendCertificates?: () => void
}

export function Navbar({ variant = 'dashboard', onCreateNew, onSendCertificates }: NavbarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  const onLearn = () => {
    window.open('https://youtu.be/M2zUsVVCerY', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CertiNova</span>
          </div>

          <div className="flex items-center space-x-4">
            {variant === 'dashboard' ? (
              <>
                <Button onClick={onLearn} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Book className="h-4 w-4 mr-2" />
                  Learn how to use
                </Button>

                <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Certificate
                </Button>

                <Button
                  onClick={onSendCertificates}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Certificates
                </Button>

                <ViewHistoryButton />
              </>
            ) : (
              <Button
                onClick={handleBackToDashboard}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {user ? getUserInitials(user.organisation) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{user?.organisation}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4 text-yellow-400" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Lock className="mr-2 h-4 w-4 text-yellow-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
