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
  Lock
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Certificates Generated", value: "50,000+", icon: Award, color: "text-blue-600" },
    { label: "Organizations", value: "1,200+", icon: Building, color: "text-green-600" },
    { label: "Events Covered", value: "5,000+", icon: Calendar, color: "text-purple-600" },
    { label: "Success Rate", value: "99.9%", icon: TrendingUp, color: "text-orange-600" },
  ]

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Generate thousands of certificates in seconds with our optimized processing engine.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with encrypted data transmission and secure certificate storage.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "Bulk Processing",
      description: "Upload CSV files or enter data manually to create certificates for multiple recipients.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Award,
      title: "Custom Templates",
      description: "Upload your own certificate templates and customize positioning with our visual editor.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Clock,
      title: "Time Efficient",
      description: "Reduce certificate generation time from hours to minutes with automated workflows.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Professional-grade certificates with consistent formatting and high-resolution output.",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  const handleLogin = () => {}

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">CertiNova</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <AuthModal onLogin={handleLogin} />
              </motion.div>
            </div>
          </div>
        </nav>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Certificate
                <span className="text-blue-600"> Generation</span>
                <br />
                Made Simple
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Streamline your certificate generation process with our enterprise-grade platform. Perfect for
                educational institutions, corporate training, and professional certifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthModal onLogin={handleLogin} triggerText="Start Free Trial" />
                <Button
                  variant="outline"
                  size="lg"
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <Lock className="mr-2 h-4 w-4 text-yellow-400" />
                  Watch Demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowVerificationModal(true)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent"
                >
                  Verify Certificate
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CertiNova?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built for organizations that value efficiency, security, and professional quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 ${feature.bgColor} rounded-lg mb-6`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Certificate Process?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of organizations already using CertiNova to streamline their certification workflows.
              </p>
              <AuthModal onLogin={handleLogin} triggerText="Get Started Today" />
            </motion.div>
          </div>
        </section>

        <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />
        <CertificateVerificationModal open={showVerificationModal} onClose={() => setShowVerificationModal(false)} />
      </div>
    )
  }
}
