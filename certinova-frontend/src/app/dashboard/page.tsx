"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
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
import { ViewHistoryButton } from "@/components/view-history-button";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventContext";
import { useCertificates } from "@/context/CertificateContext";
import { Event } from "@/types/event";
import { CertificateConfig } from "@/types/certificate";

export default function DashboardPage() {
  const { user } = useAuth();
  const { events, createEvent, fetchEvents } = useEvents();
  const { 
    createCertificateConfig, 
    getCertificateConfig,
    convertValidFieldsToEditorFields,
    convertEditorFieldsToValidFields 
  } = useCertificates();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentCertificateConfig, setCurrentCertificateConfig] = useState<CertificateConfig | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [certificateImages, setCertificateImages] = useState<Record<string, string>>({});

  // Load events when component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create certificate images mapping from events data
  useEffect(() => {
    const images: Record<string, string> = {};
    
    events.forEach(event => {
      if (event.certificateConfig?.imagePath) {
        images[event.id] = `http://localhost:5000${event.certificateConfig.imagePath}`;
      }
    });
    
    setCertificateImages(images);
  }, [events]);

  const handleCreateCertificate = async (eventName: string, issuerName: string) => {
    // First create the event
    const newEvent = await createEvent({
      eventName: eventName,
      issuerName: issuerName,
      date: new Date().toISOString(),
    });

    if (newEvent) {
      setCurrentEvent(newEvent);
      setCurrentCertificateConfig(null);
      setShowEditor(true);
      setShowCreateModal(false);
    }
  };

  const handleSaveCertificate = async (updatedCertificate: { 
    fields: Record<string, { 
      x: number; 
      y: number; 
      width: number; 
      height: number;
      fontFamily?: string;
      fontWeight?: string;
      fontStyle?: string;
      textDecoration?: string;
      color?: string;
    }>; 
    image?: string 
  }) => {
    if (!currentEvent) return;

    console.log('handleSaveCertificate - updatedCertificate:', updatedCertificate);

    // Extract the image path and fields from the certificate
    const { fields: editorFields, image } = updatedCertificate;
    
    console.log('handleSaveCertificate - editorFields:', editorFields);
    
    // Convert editor fields to API format
    const validFields = convertEditorFieldsToValidFields(editorFields);

    console.log('handleSaveCertificate - validFields:', validFields);

    const requestPayload = {
      eventId: currentEvent.id,
      imagePath: image || '/placeholder-certificate.jpg',
      validFields,
    };
    
    console.log('handleSaveCertificate - Final API payload:', JSON.stringify(requestPayload, null, 2));

    try {
      const config = await createCertificateConfig(requestPayload);

      if (config && image) {
        // Update the image in our local state

        setCertificateImages(prev => ({
          ...prev,
          [currentEvent.id]: `http://localhost:5000${image}`
        }));
      }
      
      setShowEditor(false);
      setCurrentEvent(null);
      console.log("IN NEW: ", config)
      setCurrentCertificateConfig(null);
      await fetchEvents();
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  const handleEditCertificate = async (event: Event) => {
    setCurrentEvent(event);
    console.log("BEGORE IF: ", event)
    // Use certificate config from event data (new backend response includes this)
    if (event.certificateConfig) {
      const config: CertificateConfig = {
        id: event.certificateConfig.id,
        eventId: event.id,
        imagePath: event.certificateConfig.imagePath,
        validFields: event.certificateConfig.validFields,
        createdAt: event.certificateConfig.createdAt,
        updatedAt: event.certificateConfig.updatedAt
      };
      setCurrentCertificateConfig(config);
    } else {
      // Fallback to API call if config not in event data (legacy support)
      const config = await getCertificateConfig(event.id);
      console.log("IN EDIT: ", config)
      setCurrentCertificateConfig(config);
    }
    
    setShowEditor(true);
  };

  const handleDeleteCertificate = (id: string) => {
    // For now, we'll implement event deletion later
    console.log('Delete event:', id);
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
                      <p className="text-3xl font-bold text-gray-900">{events.length}</p>
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
              <div className="flex space-x-3">
                <ViewHistoryButton />
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </div>

            {events.length === 0 ? (
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
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {event.issuerName}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        </div>

                        {/* Certificate Image Preview */}
                        {certificateImages[event.id] && (
                          <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
                            <Image 
                              src={certificateImages[event.id]} 
                              alt={`Certificate for ${event.eventName}`}
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover object-center" 
                              unoptimized // Use this for external images
                            />
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditCertificate(event)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteCertificate(event.id)}
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

        {showEditor && currentEvent && (
          <CertificateEditor
            certificate={{
              id: currentEvent.id,
              name: currentEvent.eventName,
              event: currentEvent.issuerName,
              date: new Date(currentEvent.date).toLocaleDateString(),
              image: currentCertificateConfig?.imagePath,
              fields: currentCertificateConfig ? 
                convertValidFieldsToEditorFields(currentCertificateConfig.validFields) : 
                {}
            }}
            onSave={(updatedCertificate) => {
              handleSaveCertificate(updatedCertificate);
            }}
            onClose={() => {
              setShowEditor(false);
              setCurrentEvent(null);
              setCurrentCertificateConfig(null);
            }}
          />
        )}

        <SendCertificatesModal
          open={showSendModal}
          certificates={events
            .filter(event => event.certificateConfig) // Only include events with certificate configs
            .map(event => ({
              id: event.id,
              name: event.eventName,
              event: event.issuerName,
              date: new Date(event.date).toLocaleDateString(),
              image: certificateImages[event.id] || '/placeholder-certificate.jpg',
              fields: {}
            }))}
          onClose={() => setShowSendModal(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
