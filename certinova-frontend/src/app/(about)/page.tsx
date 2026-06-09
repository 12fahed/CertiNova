'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  ShieldCheck,
  Clock,
  UploadCloud,
  FileText,
  Sparkles,
  Download,
  PlayCircle,
  Lock,
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

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Certificates Generated',
      value: '50,000+',
      icon: Award,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border border-blue-100',
    },
    {
      label: 'Organizations',
      value: '1,200+',
      icon: Building,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border border-emerald-100',
    },
    {
      label: 'Events Covered',
      value: '5,000+',
      icon: Calendar,
      color: 'text-violet-600',
      bg: 'bg-violet-50 border border-violet-100',
    },
    {
      label: 'Success Rate',
      value: '99.9%',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border border-amber-100',
    },
  ];

  //  Footer Quicks links pairs
  const quickLinks = [
    { label: 'Contact Us', href: '#' },
    { label: 'Developer Info', href: '#' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Support & Complaints', href: '#' },
    { label: 'Other Products', href: '#' },
  ];

  const SocialMediaLinks = [
    { label: 'Twitter', href: 'https://x.com/12fahedk', Icon: Twitter },
    { label: 'GitHub', href: 'https://github.com/12fahed/CertiNova', Icon: Github },
    { label: 'Discord', href: 'https://discord.gg/sQ4sSMRjP', Icon: DiscIcon },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/fahed-khan-13b11025b/',
      Icon: Linkedin,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description:
        'Generate thousands of certificates in seconds with our optimized processing engine.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      border: 'border-blue-100',
      glow: 'group-hover:shadow-blue-100',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Bank-level security with encrypted data transmission and secure certificate storage.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      border: 'border-emerald-100',
      glow: 'group-hover:shadow-emerald-100',
    },
    {
      icon: Users,
      title: 'Bulk Processing',
      description:
        'Upload CSV files or enter data manually to create certificates for multiple recipients.',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      border: 'border-violet-100',
      glow: 'group-hover:shadow-violet-100',
    },
    {
      icon: Award,
      title: 'Custom Templates',
      description:
        'Upload your own certificate templates and customize positioning with our visual editor.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      border: 'border-amber-100',
      glow: 'group-hover:shadow-amber-100',
    },
    {
      icon: Clock,
      title: 'Time Efficient',
      description:
        'Reduce certificate generation time from hours to minutes with automated workflows.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      border: 'border-pink-100',
      glow: 'group-hover:shadow-pink-100',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description:
        'Professional-grade certificates with consistent formatting and high-resolution output.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      border: 'border-cyan-100',
      glow: 'group-hover:shadow-cyan-100',
    },
  ];

  const howItWorksSteps = [
    {
      title: 'Upload Certificate Template',
      description:
        'Upload or design your certificate layout with logos, text placeholders, and branding.',
      icon: UploadCloud,
      accent: 'from-blue-500 to-sky-500',
    },
    {
      title: 'Upload Recipient Data',
      description:
        'Import recipient details from CSV or supported templates to personalize each certificate.',
      icon: FileText,
      accent: 'from-violet-500 to-fuchsia-500',
    },
    {
      title: 'Generate Certificates',
      description: 'Automatically create personalized certificates in bulk with a single click.',
      icon: Sparkles,
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Download & Share',
      description: 'Download your batch of certificates and share them directly with recipients.',
      icon: Download,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Verify Certificates',
      description:
        'Recipients can validate certificates instantly through the verification portal.',
      icon: ShieldCheck,
      accent: 'from-cyan-500 to-blue-500',
    },
  ];

  const handleLogin = () => {};

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        {/* Navbar */}
        <nav className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-xl bg-white/90 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CertiNova</span>
              </motion.div>

              <motion.div
                ref={authTriggerRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <AuthModal onLogin={handleLogin} />
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-violet-50/50 to-white pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-gray-900">
                Professional Certificate
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600 bg-clip-text text-transparent">
                  {' '}
                  Generation
                </span>
                <br />
                Made Simple
              </h1>
              <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                Streamline your certificate generation process with our enterprise-grade platform.
                Perfect for educational institutions, corporate training, and professional
                certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal onLogin={handleLogin} triggerText="Start Free Trial" />
                <Button
                  variant="outline"
                  size="lg"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() =>
                    toast('Sign in to watch the demo', {
                      description:
                        'Create a free account or sign in to access the full demo tutorial.',
                      icon: <Lock className="h-4 w-4" />,
                      action: {
                        label: 'Sign In',
                        onClick: () => {
                          const signInBtn = authTriggerRef.current?.querySelector('button');
                          signInBtn?.click();
                        },
                      },
                    })
                  }
                >
                  <PlayCircle className="mr-2 h-4 w-4 text-blue-500" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVerificationModal(true)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white"
                >
                  Verify Certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950/90">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
                How It Works
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
                Build certificates in five clear steps
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300">
                From template upload to recipient verification, CertiNova guides you through a fast,
                secure, and transparent certificate workflow.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, rotateX: -15 }}
                  whileInView={{ opacity: 1, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ rotateY: -5, scale: 1.02 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="group perspective-1000"
                >
                  <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md transition-all duration-500 hover:shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/90">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5" />

                    <div className="absolute bottom-2 right-2 text-8xl font-black text-slate-100 opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:opacity-50 dark:text-slate-800">
                      {index + 1}
                    </div>

                    <div className="relative mb-4">
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accent} blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-40`}
                      />
                      <div
                        className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent} text-white shadow-md`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="relative mb-2 text-lg font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="relative text-sm text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>

                    <div className="absolute bottom-4 right-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-gray-100 bg-gray-50/50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`rounded-2xl p-6 text-center ${stat.bg} transition-all duration-300 hover:shadow-md`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-white shadow-sm">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose CertiNova?
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Built for organizations that value efficiency, security, and professional quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`group relative bg-white rounded-2xl p-8 border ${feature.border} hover:shadow-xl ${feature.glow} transition-all duration-300`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-xl mb-6`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 via-violet-50 to-white">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-100/80 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-violet-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Certificate Process?
              </h2>
              <p className="text-gray-500 text-lg mb-10">
                Join thousands of organizations already using CertiNova to streamline their
                certification workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal onLogin={handleLogin} triggerText="Get Started Today" />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVerificationModal(true)}
                  className="text-gray-600 border-gray-200 hover:bg-white bg-white/80"
                >
                  Verify a Certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="relative border-t border-slate-200 bg-white">
          {/* Soft Background Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb08,transparent_30%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-16">
            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-14 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-4 md:justify-start"
                >
                  {/* Logo */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-100 transition duration-300 hover:scale-105">
                    <Award className="h-8 w-8 text-white" />
                  </div>

                  {/* Heading */}
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">CertiNova</h1>

                    <p className="mt-1 text-base font-medium text-blue-600">
                      Bulk Certificate Generator and Validation Platform
                    </p>
                  </div>
                </motion.div>

                {/* Description */}
                <p className="mt-7 max-w-xl text-[17px] leading-8 text-slate-600 md:text-left">
                  CertiNova empowers institutions, organizations, and event managers to generate,
                  manage, and verify certificates securely with modern automation and scalable
                  workflows.
                </p>

                {/* Badge */}
                <div className="mt-7 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:shadow-md">
                  Trusted • Secure • Fast Verification
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col items-center md:items-start">
                <h2 className="mb-6 text-xl font-semibold text-slate-900">Quick Links</h2>

                <ul className="space-y-4 text-center md:text-left">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-[16px] font-medium text-slate-600 transition-all duration-300 hover:text-blue-600"
                      >
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Handles */}
              <div className="flex flex-col items-center md:items-start">
                <h2 className="mb-6 text-xl font-semibold text-slate-900">Social Handles</h2>

                <div className="grid grid-cols-2 gap-3">
                  {SocialMediaLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="group flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                    >
                      <link.Icon className="h-4 w-4 transition group-hover:scale-110" />
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="mt-6 max-w-xs text-[15px] leading-7 text-slate-500 md:text-left">
                  Follow updates, feature releases, and open-source contributions.
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-7 text-[15px] text-slate-500 md:flex-row">
              <p className="text-center md:text-left">© 2026 CertiNova. All rights reserved.</p>

              <p className="flex items-center gap-2 text-center">
                Built with
                <span className="text-red-500">❤</span>
                using TypeScript & Tailwind CSS
              </p>
            </div>
          </div>
        </footer>

        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />

        <CertificateVerificationModal
          open={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
        />
      </div>
    );
  }
}
