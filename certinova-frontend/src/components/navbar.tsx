'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Award, Plus, Send, User, Settings, LogOut, ArrowLeft, Lock, Book } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { ViewHistoryButton } from '@/components/view-history-button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  variant?: 'dashboard' | 'certificate';
  onCreateNew?: () => void;
  onSendCertificates?: () => void;
}

export function Navbar({ variant = 'dashboard', onCreateNew, onSendCertificates }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const onLearn = () => {
    window.open('https://youtu.be/M2zUsVVCerY', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">CertiNova</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {variant === 'dashboard' ? (
              <>
                {/* "Learn how to use" – hidden on mobile, shown sm+ */}
                <Button
                  onClick={onLearn}
                  className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Book className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Learn how to use</span>
                </Button>

                {/* "Create Certificate" – always visible; icon-only on xs, text on sm+ */}
                <Button
                  onClick={onCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-4"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Create Certificate</span>
                </Button>

                {/* "Send Certificates" – hidden on mobile */}
                <Button
                  onClick={onSendCertificates}
                  variant="outline"
                  className="hidden md:inline-flex border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Send className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Send Certificates</span>
                </Button>

                {/* "View History" – hidden on mobile */}
                <div className="hidden md:block">
                  <ViewHistoryButton />
                </div>
              </>
            ) : (
              <Button
                onClick={handleBackToDashboard}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-2.5 sm:px-4"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  aria-label="User menu"
                >
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
  );
}
