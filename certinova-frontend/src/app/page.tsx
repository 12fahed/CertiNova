"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Users,
  Zap,
  Star,
  Calendar,
  Building,
  Plus,
  Download,
  FileText,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { OnboardingModal } from "@/components/onboarding-modal"
import { CreateCertificateModal } from "@/components/create-certificate-modal"
import { CertificateEditor } from "@/components/certificate-editor"
import { SendCertificatesModal } from "@/components/send-certificates-modal"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/context/AuthContext"

interface Certificate {
  id: string
  name: string
  event: string
  date: string
  image: string
  fields: {
    recipientName?: { x: number; y: number; width: number; height: number }
    organizationName?: { x: number; y: number; width: number; height: number }
    certificateLink?: { x: number; y: number; width: number; height: number }
    certificateQR?: { x: number; y: number; width: number; height: number }
    rank?: { x: number; y: number; width: number; height: number }
  }
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [currentCertificate, setCurrentCertificate] = useState<Partial<Certificate> | null>(null)
  const [showSendModal, setShowSendModal] = useState(false)

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading screen while checking authentication
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

  const handleLogin = () => {
    // This will be handled by the redirect useEffect
  }

  const handleCreateCertificate = (eventName: string, issuerName: string) => {
    setCurrentCertificate({
      id: Date.now().toString(),
      name: `${eventName} Certificate`,
      event: eventName,
      date: new Date().toLocaleDateString(),
      fields: {},
    })
    setShowCreateModal(false)
    setShowEditor(true)
  }

  const handleSaveCertificate = (certificate: Certificate) => {
    setCertificates((prev) => [...prev, certificate])
    setShowEditor(false)
    setCurrentCertificate(null)
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
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

        {/* Hero Section */}
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
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
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

        {/* Features Section */}
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

        {/* CTA Section */}
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCreateNew={() => setShowCreateModal(true)} onSendCertificates={() => setShowSendModal(true)} />

      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Dashboard</h1>
          <p className="text-gray-600">Manage and create certificates for your events</p>
        </motion.div>

        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No certificates yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first certificate template to get started with bulk generation
            </p>
            <Button onClick={() => setShowCreateModal(true)} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Certificate
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center border-b border-gray-200">
                    {certificate.image ? (
                      <img
                        src={certificate.image || "/placeholder.svg"}
                        alt={certificate.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{certificate.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {certificate.date}
                    </div>
                    <Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-700">
                      {certificate.event}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CreateCertificateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCertificate}
      />

      {showEditor && currentCertificate && (
        <CertificateEditor
          certificate={currentCertificate}
          onSave={handleSaveCertificate}
          onClose={() => {
            setShowEditor(false)
            setCurrentCertificate(null)
          }}
        />
      )}

      <SendCertificatesModal open={showSendModal} onClose={() => setShowSendModal(false)} certificates={certificates} />
    </div>
  )
}
