'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';

import {
  Github,
  Linkedin,
  Twitter,
  DiscIcon,
  ArrowUpRight,
  Award,
  Users,
  Zap,
  Star,
  Calendar,
  Building,
  TrendingUp,
  Shield,
  Clock,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { AuthModal } from '@/components/auth-modal';
import { OnboardingModal } from '@/components/onboarding-modal';
import { useAuth } from '@/context/AuthContext';
import { CertificateVerificationModal } from '@/components/certificate-verification-modal';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const authTriggerRef = useRef<HTMLDivElement>(null);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-[3px] border-white/10 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogin = () => {};

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
        {/* Ambient Void Lighting */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-fuchsia-600/10 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* Floating Capsule Navbar */}
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-full w-full max-w-5xl shadow-2xl">
            <div className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-white" />
              <span className="text-sm font-bold tracking-widest uppercase">CertiNova</span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase text-white/60">
              <a href="#platform" className="hover:text-white transition-colors">
                Platform
              </a>
              <a href="#infrastructure" className="hover:text-white transition-colors">
                Infrastructure
              </a>
            </div>

            <div ref={authTriggerRef}>
              <AuthModal onLogin={handleLogin} />
            </div>
          </nav>
        </div>

        <main className="relative z-10">
          {/* Asymmetrical Hero Section */}
          <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Massive Left-Aligned Typography */}
              <motion.div
                className="lg:col-span-8 flex flex-col items-start"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                  {/* <div className="w-2 h-2 rounded-full bg-transparent animate-pulse" /> */}
                  {/* <span className="text-xs font-mono tracking-widest text-white/70 uppercase">System Operational V2.0</span> */}
                </div>

                <h1 className="text-[12vw] lg:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase">
                  Automate <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
                    Authority.
                  </span>
                </h1>

                <p className="mt-8 text-lg md:text-xl text-white/50 max-w-xl font-light leading-relaxed">
                  The infrastructure for verifying digital achievements. Generate, distribute, and
                  validate millions of certificates with uncompromising cryptographic precision.
                </p>

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Button
                      className="relative h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 text-sm font-bold tracking-widest uppercase"
                      onClick={() => {
                        const signInBtn = authTriggerRef.current?.querySelector('button');
                        signInBtn?.click();
                      }}
                    >
                      Initialize Workflow
                    </Button>
                  </div>

                  <button
                    onClick={() => setShowVerificationModal(true)}
                    className="group flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-white/70 hover:text-white transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                      <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                    Verify Asset
                  </button>
                </div>
              </motion.div>

              {/* Right Side Abstract Visual / Stats */}
              {/* Right Side Abstract Visual / Stats */}
              <motion.div style={{ y: y1 }} className="hidden lg:flex lg:col-span-4 flex-col gap-6">
                {/* Box 1: 50k+ Certificates (Isometric Cards UI) */}
                <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-xl p-8 relative overflow-hidden group">
                  {/* Interactive Glow Flare */}
                  <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Internal Micro-UI: Isometric Floating Assets */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700 mt-8">
                    <div className="relative w-32 h-32 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 ease-out">
                      {/* Back Layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl transform translate-x-6 translate-y-6 shadow-2xl backdrop-blur-md animate-pulse" />
                      {/* Middle Layer */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 border border-white/30 rounded-2xl transform translate-x-3 translate-y-3 shadow-xl backdrop-blur-md" />
                      {/* Front Layer */}
                      <div className="absolute inset-0 bg-white/10 border border-white/40 rounded-2xl shadow-lg backdrop-blur-md flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                        <Award className="w-8 h-8 text-white/70" />
                      </div>
                    </div>
                  </div>

                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                      <Award className="w-8 h-8 text-white/30 group-hover:text-white/50 transition-colors" />
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-indigo-300 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        LIVE
                      </span>
                    </div>
                    <div>
                      <div className="text-6xl font-black tracking-tighter">
                        50k<span className="text-indigo-400">+</span>
                      </div>
                      <div className="text-xs font-mono tracking-widest text-white/40 uppercase mt-2">
                        Assets Minted
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box 2: 99.9% Rate (Live Waveform UI) */}
                <div className="h-48 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group flex flex-col justify-between p-8">
                  {/* Background Noise */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0" />

                  {/* Internal Micro-UI: Live Animated Waveform */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-8 pb-4 opacity-20 group-hover:opacity-50 transition-opacity gap-1.5 z-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-full bg-emerald-500/60 rounded-t-sm"
                        initial={{ height: '10%' }}
                        animate={{ height: ['10%', `${Math.random() * 70 + 30}%`, '10%'] }}
                        transition={{
                          duration: Math.random() * 1.5 + 1,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 flex justify-between items-start">
                    <Shield className="w-6 h-6 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                      <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">
                        Secure
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-4xl font-bold tracking-tight">99.9%</div>
                    <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mt-1">
                      Verification Rate
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Bento Box Feature Grid (The Core Unorthodox Layout) */}
          {/* Bento Box Feature Grid (High-End Micro-UIs) */}
          <section id="platform" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Architecture.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
              {/* Feature 1: Large Span with Terminal Micro-UI */}
              <div className="md:col-span-2 md:row-span-1 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-colors duration-700" />

                <div className="h-full flex flex-col md:flex-row gap-8 p-10 relative z-10">
                  <div className="flex-1 flex flex-col justify-center">
                    <Zap className="w-10 h-10 text-white/50 mb-8" />
                    <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
                      Lightning Engine
                    </h3>
                    <p className="text-white/50 text-lg leading-relaxed">
                      Generate thousands of certificates simultaneously. Our optimized pipeline
                      ensures zero bottlenecks during massive events.
                    </p>
                  </div>

                  {/* Internal Micro-UI: Mock Terminal */}
                  <div className="flex-1 hidden md:flex items-center justify-center relative">
                    <div className="w-full h-full max-h-[180px] bg-black border border-white/10 rounded-2xl p-5 flex flex-col gap-3 font-mono text-[11px] sm:text-xs text-white/40 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />

                      <div className="relative z-10 flex justify-between border-b border-white/10 pb-3 mb-2">
                        <span className="text-white/60">sys_compiler_v2.exe</span>
                        <span className="text-emerald-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />{' '}
                          Live
                        </span>
                      </div>
                      <div className="relative z-10 flex gap-3">
                        <span className="text-indigo-400">&gt;</span>
                        <span>Allocating memory for batch [50,000]...</span>
                      </div>
                      <div className="relative z-10 flex gap-3">
                        <span className="text-indigo-400">&gt;</span>
                        <span>Injecting cryptographic signatures...</span>
                      </div>
                      <div className="relative z-10 flex gap-3">
                        <span className="text-indigo-400">&gt;</span>
                        <span className="text-white/80">Processed: 48,291 / 50,000</span>
                      </div>

                      <div className="relative z-10 mt-auto w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: '0%' }}
                          whileInView={{ width: '96%' }}
                          transition={{ duration: 2.5, ease: 'easeOut', delay: 0.2 }}
                          className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Tall Profile with Cryptographic Rings Micro-UI */}
              <div className="md:col-span-1 md:row-span-2 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-[#0a0a0a] border border-white/5 p-1 relative group overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0"></div>

                <div className="h-full flex flex-col p-10 relative z-10">
                  {/* Internal Micro-UI: Rotating Rings */}
                  <div className="flex-1 flex items-center justify-center relative min-h-[250px] mb-8">
                    {/* Outer Ring */}
                    <div className="absolute w-48 h-48 rounded-full border border-white/5 flex items-center justify-center animate-[spin_12s_linear_infinite]">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    {/* Inner Ring */}
                    <div className="absolute w-32 h-32 rounded-full border border-white/10 border-t-white/40 border-r-white/20 flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]" />

                    {/* Center Node */}
                    <div className="w-20 h-20 bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] z-10 group-hover:scale-110 transition-transform duration-700">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <div className="mt-auto text-center">
                    <h3 className="text-2xl font-bold tracking-tight mb-4">
                      Enterprise
                      <br />
                      Grade Security
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Bank-level encryption standards. Every certificate is cryptographically
                      signed, ensuring zero risk of forgery or unauthorized tampering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Standard Square with Off-Axis Structural UI */}
              <div className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative">
                {/* Internal Micro-UI: Floating Elements */}
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-[2rem] rotate-12 border border-white/10 group-hover:rotate-6 group-hover:bg-white/10 transition-all duration-700 flex items-end justify-start p-6">
                  <Users className="w-10 h-10 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>

                <div className="relative z-10 mt-20">
                  <h3 className="text-xl font-bold tracking-tight mb-3">Bulk Workflows</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Upload raw CSV data. We handle the mapping, generation, and distribution
                    automatically.
                  </p>
                </div>
              </div>

              {/* Feature 4: Standard Square with Abstract Wireframe UI */}
              <div className="md:col-span-1 md:row-span-1 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute right-0 bottom-0 w-full h-2/3 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />

                {/* Internal Micro-UI: Document Wireframe lines */}
                <div className="flex flex-col gap-3 mb-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                  <div className="flex gap-2">
                    <div className="h-1.5 w-12 bg-white/40 rounded-full" />
                    <div className="h-1.5 w-4 bg-fuchsia-500/50 rounded-full" />
                  </div>
                  <div className="h-1.5 w-32 bg-white/20 rounded-full" />
                  <div className="h-1.5 w-20 bg-white/20 rounded-full" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold tracking-tight mb-3">Pristine Output</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Vector-perfect PDF generation ensures your branding remains razor-sharp on any
                    display.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Minimalist Footer */}
          <footer className="border-t border-white/10 bg-black pt-24 pb-12 mt-32">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
                <div>
                  <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter leading-none uppercase mb-6">
                    CertiNova.
                  </h2>
                  <p className="text-white/40 max-w-sm">
                    The modern standard for digital certificate generation and cryptographic
                    verification.
                  </p>
                </div>

                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs font-mono tracking-widest text-white/40 uppercase">
                <p>© 2026 CERTINOVA. ALL SYSTEM RIGHTS RESERVED.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>

        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
        <CertificateVerificationModal
          open={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
        />
      </div>
    );
  }
}
