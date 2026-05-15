"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Award,
  Users,
  Zap,
  Star,
  Calendar,
  Building,
  TrendingUp,
  Shield,
  Clock,
  Lock,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { OnboardingModal } from "@/components/onboarding-modal"
import { useAuth } from "@/context/AuthContext"
import { CertificateVerificationModal } from "@/components/certificate-verification-modal"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Certificates Generated", value: "50,000+", icon: Award, color: "text-blue-400", bg: "bg-blue-500/10 border border-blue-500/20" },
    { label: "Organizations", value: "1,200+", icon: Building, color: "text-emerald-400", bg: "bg-emerald-500/10 border border-emerald-500/20" },
    { label: "Events Covered", value: "5,000+", icon: Calendar, color: "text-violet-400", bg: "bg-violet-500/10 border border-violet-500/20" },
    { label: "Success Rate", value: "99.9%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10 border border-amber-500/20" },
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Generate thousands of certificates in seconds with our optimized processing engine.",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data transmission and secure certificate storage.",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      icon: Users,
      title: "Bulk Processing",
      description: "Upload CSV files or enter data manually to create certificates for multiple recipients.",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "group-hover:shadow-violet-500/20",
    },
    {
      icon: Award,
      title: "Custom Templates",
      description: "Upload your own certificate templates and customize positioning with our visual editor.",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      border: "border-amber-500/20",
      glow: "group-hover:shadow-amber-500/20",
    },
    {
      icon: Clock,
      title: "Time Efficient",
      description: "Reduce certificate generation time from hours to minutes with automated workflows.",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      border: "border-pink-500/20",
      glow: "group-hover:shadow-pink-500/20",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Professional-grade certificates with consistent formatting and high-resolution output.",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "group-hover:shadow-cyan-500/20",
    },
  ]

  const handleLogin = () => {}

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">

        <nav className="border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CertiNova</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <AuthModal onLogin={handleLogin} />
              </motion.div>
            </div>
          </div>
        </nav>

        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-transparent pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8"
              >
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Trusted by 1,200+ Organizations</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                Professional Certificate
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-500 bg-clip-text text-transparent"> Generation</span>
                <br />
                Made Simple
              </h1>
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Streamline your certificate generation process with our enterprise-grade platform. Perfect for
                educational institutions, corporate training, and professional certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal onLogin={handleLogin} triggerText="Start Free Trial" />
                <Button
                  variant="outline"
                  size="lg"
                  className="text-gray-300 border-white/10 hover:bg-white/5 bg-transparent"
                >
                  <Lock className="mr-2 h-4 w-4 text-yellow-400" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVerificationModal(true)}
                  className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10 bg-transparent"
                >
                  Verify Certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 border-y border-white/5 bg-white/2">
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
                  className={`rounded-2xl p-6 text-center ${stat.bg}`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-white/5">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose CertiNova?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                  className={`group relative bg-white/3 rounded-2xl p-8 border ${feature.border} hover:shadow-xl ${feature.glow} transition-all duration-300`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-xl mb-6`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-violet-600/20 to-blue-600/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gray-950/60 pointer-events-none" />
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Certificate Process?
              </h2>
              <p className="text-gray-400 text-lg mb-10">
                Join thousands of organizations already using CertiNova to streamline their certification workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal onLogin={handleLogin} triggerText="Get Started Today" />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVerificationModal(true)}
                  className="text-gray-300 border-white/10 hover:bg-white/5 bg-transparent"
                >
                  Verify a Certificate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-semibold">CertiNova</span>
              </div>
              <p className="text-gray-500 text-sm">© 2025 CertiNova. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
        <CertificateVerificationModal open={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      </div>
    )
  }
}
