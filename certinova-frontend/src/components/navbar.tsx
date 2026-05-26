'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Award,
  Plus,
  Send,
  User,
  Settings,
  LogOut,
  ArrowLeft,
  Lock,
  Book,
  PlayCircle,
} from 'lucide-react';
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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl shadow-2xl"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all duration-500">
              <Award className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-widest text-white uppercase">
              Certi<span className="text-white/40">Nova</span>
            </span>
          </Link>

          {/* Core Actions */}
          <div className="flex items-center space-x-4">
            {variant === 'dashboard' ? (
              <>
                <Button
                  onClick={onLearn}
                  variant="ghost"
                  className="hidden md:flex text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Documentation
                </Button>

                <Button
                  onClick={onSendCertificates}
                  className="hidden sm:flex h-10 rounded-full border border-white/10 bg-white/5 px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <Send className="h-4 w-4 mr-2 text-white/70" />
                  Dispatch
                </Button>

                <Button
                  onClick={onCreateNew}
                  className="relative h-10 rounded-full bg-white px-6 text-xs font-bold uppercase tracking-widest text-black hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Mint Asset
                </Button>

                {/* Assuming ViewHistoryButton handles its own styling, but wrapping in a class if it exposes one */}
                <div className="hidden lg:block border-l border-white/10 pl-4 ml-2">
                  <ViewHistoryButton />
                </div>
              </>
            ) : (
              <Button
                onClick={handleBackToDashboard}
                className="h-10 rounded-full border border-white/10 bg-white/5 px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Matrix
              </Button>
            )}

            {/* User Profile / Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 border border-white/10 hover:border-white/30 transition-colors ml-2"
                >
                  <Avatar className="h-full w-full rounded-full">
                    <AvatarFallback className="bg-[#111] text-white/70 text-xs font-mono border border-white/10">
                      {user ? getUserInitials(user.organisation) : 'CN'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#050505]" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-2xl p-2"
                align="end"
              >
                <div className="px-3 py-2">
                  <div className="text-sm font-bold tracking-tight text-white">
                    {user?.organisation || 'System Admin'}
                  </div>
                  <div className="text-xs font-mono text-white/40">
                    {user?.email || 'admin@certinova.io'}
                  </div>
                </div>

                <DropdownMenuSeparator className="bg-white/10 my-2" />

                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors text-white/70">
                  <Lock className="mr-2 h-4 w-4 text-white/40" />
                  Security Protocol
                </DropdownMenuItem>

                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors text-white/70">
                  <Settings className="mr-2 h-4 w-4 text-white/40" />
                  System Preferences
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10 my-2" />

                <DropdownMenuItem
                  onClick={logout}
                  className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors text-red-400/70"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Terminate Session
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
