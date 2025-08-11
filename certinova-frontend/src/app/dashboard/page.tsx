"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Users,
  Zap,
  Calendar,
  Plus,
  FileText,
  TrendingUp,
} from "lucide-react";
import { CreateCertificateModal } from "@/components/create-certificate-modal";
import { CertificateEditor } from "@/components/certificate-editor";
import { SendCertificatesModal } from "@/components/send-certificates-modal";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

interface Certificate {
  id?: string;
  name: string;
  event: string;
  date: string;
  image?: string;
  fields: {
    recipientName?: { x: number; y: number; width: number; height: number };
    organizationName?: { x: number; y: number; width: number; height: number };
    certificateLink?: { x: number; y: number; width: number; height: number };
    certificateQR?: { x: number; y: number; width: number; height: number };
    rank?: { x: number; y: number; width: number; height: number };
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<Partial<Certificate> | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);

  const handleCreateCertificate = (eventName: string, issuerName: string) => {
    setCurrentCertificate({
      id: Date.now().toString(),
      name: eventName,
      event: issuerName,
      date: new Date().toLocaleDateString(),
      image: '/placeholder-certificate.jpg',
      fields: {},
    });
    setShowEditor(true);
    setShowCreateModal(false);
  };

  const handleSaveCertificate = (updatedCertificate: Certificate) => {
    setCertificates(prev => {
      const existingIndex = prev.findIndex(cert => cert.id === updatedCertificate.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedCertificate;
        return updated;
      } else {
        return [...prev, updatedCertificate];
      }
    });
    setShowEditor(false);
    setCurrentCertificate(null);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setCurrentCertificate(certificate);
    setShowEditor(true);
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          onCreateNew={() => setShowCreateModal(true)}
          onSendCertificates={() => setShowSendModal(true)}
        />

        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.organisation}!
            </h1>
            <p className="text-gray-600">
              Manage and create certificates for your organization
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                      <p className="text-3xl font-bold text-gray-900">{certificates.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recipients</p>
                      <p className="text-3xl font-bold text-gray-900">2,847</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+8%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900">98.5%</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+2%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Events</p>
                      <p className="text-3xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+5%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Certificates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Certificates</h2>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            {certificates.length === 0 ? (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No certificates yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first certificate template to get started
                  </p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Certificate
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate, index) => (
                  <motion.div
                    key={certificate.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {certificate.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {certificate.event}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {certificate.date}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditCertificate(certificate)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => certificate.id && handleDeleteCertificate(certificate.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        <CreateCertificateModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCertificate}
        />

        {showEditor && currentCertificate && (
          <CertificateEditor
            certificate={currentCertificate as Certificate}
            onSave={handleSaveCertificate}
            onClose={() => {
              setShowEditor(false);
              setCurrentCertificate(null);
            }}
          />
        )}

        <SendCertificatesModal
          open={showSendModal}
          certificates={certificates}
          onClose={() => setShowSendModal(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
