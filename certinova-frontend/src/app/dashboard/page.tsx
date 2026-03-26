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
  Download,
  LayoutGrid,
  TableOfContents,
  Trash2,
} from "lucide-react";
import { CreateCertificateModal } from "@/components/create-certificate-modal";
import { CertificateEditor } from "@/components/certificate-editor";
import { SendCertificatesModal } from "@/components/send-certificates-modal";
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ViewHistoryButton } from "@/components/view-history-button";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventContext";
import { useCertificates } from "@/context/CertificateContext";
import { Event } from "@/types/event";
import { CertificateConfig } from "@/types/certificate";
import { PremiumCard } from "@/components/premium-card";

export default function DashboardPage() {
  const { user } = useAuth();
  const { events, createEvent, fetchEvents, deleteEvent } = useEvents();
  const {
    createCertificateConfig,
    getCertificateConfig,
    updateCertificateConfig,
    convertValidFieldsToEditorFields,
    convertEditorFieldsToValidFields,
  } = useCertificates();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [currentCertificateConfig, setCurrentCertificateConfig] =
    useState<CertificateConfig | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [certificateImages, setCertificateImages] = useState<
    Record<string, string>
  >({});
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedEventForPreview, setSelectedEventForPreview] =
    useState<Event | null>(null);

  // Load events when component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create certificate images mapping from events data
  useEffect(() => {
    const images: Record<string, string> = {};

    events.forEach((event) => {
      if (event.certificateConfig?.imagePath) {
        images[event.id] = `${event.certificateConfig.imagePath}`;
      }
    });

    setCertificateImages(images);
  }, [events]);

  const handleCreateCertificate = async (
    eventName: string,
    issuerName: string,
  ) => {
    // First create the event
    const newEvent = await createEvent({
      eventName: eventName,
      issuerName: issuerName,
      date: new Date().toISOString(),
    });

    if (newEvent) {
      setCurrentEvent(newEvent);
      setCurrentCertificateConfig(null);
      setIsEditing(false); // Set to false for new certificate creation
      setShowEditor(true);
      setShowCreateModal(false);
    }
  };

  const handleSaveCertificate = async (updatedCertificate: {
    fields: Record<
      string,
      {
        x: number;
        y: number;
        width: number;
        height: number;
        fontFamily?: string;
        fontWeight?: string;
        fontStyle?: string;
        textDecoration?: string;
        color?: string;
      }
    >;
    image?: string;
  }) => {
    if (!currentEvent) return;

    // console.log('handleSaveCertificate - updatedCertificate:', updatedCertificate);

    // Extract the image path and fields from the certificate
    const { fields: editorFields, image } = updatedCertificate;

    // console.log('handleSaveCertificate - editorFields:', editorFields);

    // Convert editor fields to API format
    const validFields = convertEditorFieldsToValidFields(editorFields);

    // console.log('handleSaveCertificate - validFields:', validFields);

    const requestPayload = {
      eventId: currentEvent.id,
      imagePath: image || "/placeholder-certificate.jpg",
      validFields,
    };

    // console.log('handleSaveCertificate - Final API payload:', JSON.stringify(requestPayload, null, 2));
    // console.log('handleSaveCertificate - isEditing:', isEditing);

    try {
      let config;

      if (isEditing && currentCertificateConfig) {
        // Update existing certificate configuration
        // console.log('Updating certificate config with ID:', currentCertificateConfig.id);
        config = await updateCertificateConfig(
          currentCertificateConfig.id,
          requestPayload,
        );
      } else {
        // Create new certificate configuration
        // console.log('Creating new certificate config');
        config = await createCertificateConfig(requestPayload);
      }

      if (config && image) {
        // Update the image in our local state
        setCertificateImages((prev) => ({
          ...prev,
          [currentEvent.id]: `${image}`,
        }));
      }

      setShowEditor(false);
      setCurrentEvent(null);
      setIsEditing(false);
      // console.log("Certificate config result: ", config);
      setCurrentCertificateConfig(null);
      await fetchEvents();
    } catch (error) {
      console.error("Error saving certificate:", error);
    }
  };

  const handleEditCertificate = async (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true); // Set to true for editing existing certificate
    // console.log("BEFORE IF: ", event);

    // Use certificate config from event data (new backend response includes this)
    if (event.certificateConfig) {
      const config: CertificateConfig = {
        id: event.certificateConfig.id,
        eventId: event.id,
        imagePath: event.certificateConfig.imagePath,
        validFields: event.certificateConfig.validFields,
        createdAt: event.certificateConfig.createdAt,
        updatedAt: event.certificateConfig.updatedAt,
      };
      setCurrentCertificateConfig(config);
    } else {
      // Fallback to API call if config not in event data (legacy support)
      const config = await getCertificateConfig(event.id);
      // console.log("IN EDIT: ", config);
      setCurrentCertificateConfig(config);
    }

    setShowEditor(true);
  };

  const handleDeleteCertificate = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDeleteCertificate = async () => {
    if (!eventToDelete) return;

    const success = await deleteEvent(eventToDelete.id);
    if (success) {
      // Remove from certificate images
      setCertificateImages((prev) => {
        const updated = { ...prev };
        delete updated[eventToDelete.id];
        return updated;
      });
      setEventToDelete(null);
    }
  };

  const handleDownloadSample = async (event: Event) => {
    if (!event.certificateConfig) {
      console.error("No certificate config available for this event");
      return;
    }

    try {
      // Create a sample certificate with the actual certificate config data
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Fetch the image as blob to avoid CORS issues
      const imageUrl = certificateImages[event.id];
      if (!imageUrl) {
        console.error("No certificate image available for this event");
        return;
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = new window.Image();

      // Create object URL from blob and set as image source
      const objectUrl = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Add sample text to each field using the actual config
        if (ctx && event.certificateConfig) {
          ctx.fillStyle = "#000000";

          // Helper function to draw centered text
          const drawCenteredText = (
            text: string,
            position: {
              x: number;
              y: number;
              width: number;
              height: number;
              fontFamily?: string;
              fontWeight?: string;
              fontStyle?: string;
              textDecoration?: string;
              color?: string;
            },
            maxFontSize = 72,
          ) => {
            // Set text color
            ctx.fillStyle = position.color || "#000000";

            // Calculate font size based on field dimensions
            const calculatedFontSize = Math.min(
              (position.width / text.length) * 1.5, // Width-based calculation
              position.height * 0.8, // Height-based calculation
              maxFontSize, // Maximum allowed
            );
            const fontSize = Math.max(calculatedFontSize, 8); // Minimum font size of 8

            const fontFamily = position.fontFamily || "Inter"; // Use Google Font as fallback
            const fontWeight = position.fontWeight || "normal";
            const fontStyle = position.fontStyle || "normal";

            ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

            // Measure text and reduce font size until it fits within the bounding box
            let textMetrics = ctx.measureText(text);
            let adjustedFontSize = fontSize;
            while (
              (textMetrics.width > position.width * 0.9 ||
                adjustedFontSize > position.height * 0.8) &&
              adjustedFontSize > 8
            ) {
              adjustedFontSize -= 2;
              ctx.font = `${fontStyle} ${fontWeight} ${adjustedFontSize}px ${fontFamily}`;
              textMetrics = ctx.measureText(text);
            }

            // Calculate centered position
            const textX = position.x + (position.width - textMetrics.width) / 2;
            const textY =
              position.y + (position.height + adjustedFontSize * 0.3) / 2;

            // Draw the text
            ctx.fillText(text, textX, textY);

            // Handle text decoration
            if (position.textDecoration === "underline") {
              ctx.strokeStyle = position.color || "#000000";
              ctx.beginPath();
              ctx.moveTo(textX, textY + 2);
              ctx.lineTo(textX + textMetrics.width, textY + 2);
              ctx.stroke();
            }
          };

          // Use the actual certificate config fields
          Object.entries(event.certificateConfig.validFields).forEach(
            ([fieldType, position]) => {
              let sampleText = "";
              switch (fieldType) {
                case "recipientName":
                  sampleText = "John Doe";
                  break;
                case "organisationName":
                  sampleText = event.issuerName || "Sample Organization";
                  break;
                case "certificateLink":
                  sampleText = "https://example.com/cert/123";
                  break;
                case "certificateQR":
                  sampleText = "[QR Code]";
                  break;
                case "rank":
                  sampleText = "1st Place";
                  break;
              }

              if (position) {
                drawCenteredText(sampleText, position, 72);
              }
            },
          );
        }

        // Download the canvas as image
        try {
          const link = document.createElement("a");
          link.download = `${event.eventName}-sample-certificate.png`;
          link.href = canvas.toDataURL();
          link.click();
        } catch (error) {
          console.error("Error generating sample certificate:", error);
          alert(
            "Error generating sample certificate. This may be due to CORS restrictions. Please try again or contact support.",
          );
        }

        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        console.error("Failed to load certificate image");
        alert("Failed to load certificate image. Please try again.");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    } catch (error) {
      console.error("Error downloading sample certificate:", error);
      alert(
        "Error downloading sample certificate. Please try again or contact support.",
      );
    }
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
                      <p className="text-sm font-medium text-gray-600">
                        Total Certificates
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {events.length}
                      </p>
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
              <PremiumCard
                title="Recipients"
                value="2,847"
                icon={<Users className="h-6 w-6" />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                trend="from last month"
                trendValue="+8%"
                isPremium={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PremiumCard
                title="Success Rate"
                value="98.5%"
                icon={<Zap className="h-6 w-6" />}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                trend="from last month"
                trendValue="+2%"
                isPremium={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PremiumCard
                title="Active Events"
                value="12"
                icon={<Calendar className="h-6 w-6" />}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                trend="from last month"
                trendValue="+5%"
                isPremium={true}
              />
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
              <h2 className="text-2xl font-bold text-gray-900">
                Your Certificates
              </h2>
              <div className="flex items-center space-x-3">
                <div className="flex bg-white rounded-md border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "table"
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title="Table View"
                  >
                    <TableOfContents className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
                <ViewHistoryButton />
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
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 group h-full flex flex-col">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {event.eventName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {event.issuerName}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-4 whitespace-nowrap">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(event.date)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              .replace(/\//g, "/")}
                          </div>
                        </div>

                        {/* Certificate Image Preview */}
                        {certificateImages[event.id] && (
                          <div className="mb-4 rounded-md overflow-hidden border border-gray-200 flex-grow">
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

                        <div className="flex space-x-2 mt-auto">
                          <Button
                            onClick={() => handleEditCertificate(event)}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          {event.certificateConfig && (
                            <Button
                              onClick={() => handleDownloadSample(event)}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              title="Download Sample"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteCertificate(event)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                {/* Table View */}
                <Card className="bg-white border-gray-200 flex-1 flex flex-col shadow-sm overflow-hidden h-full">
                  <div className="overflow-y-auto w-full flex-1">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 font-semibold">
                            Event Name
                          </th>
                          <th className="px-6 py-4 font-semibold">Issuer</th>
                          <th className="px-6 py-4 font-semibold w-32">Date</th>
                          <th className="px-6 py-4 font-semibold text-right w-36">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {events.map((event) => (
                          <tr
                            key={event.id}
                            onClick={() => setSelectedEventForPreview(event)}
                            className={`cursor-pointer group transition-colors ${
                              selectedEventForPreview?.id === event.id
                                ? "bg-blue-50/50 hover:bg-blue-50/70"
                                : "bg-white hover:bg-gray-50"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                {event.eventName}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {event.issuerName}
                            </td>
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                                {new Date(event.date).toLocaleDateString(
                                  "en-GB",
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCertificate(event);
                                  }}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                  title="Edit Template"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                {event.certificateConfig && (
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadSample(event);
                                    }}
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-600 hover:text-green-600 hover:bg-green-50"
                                    title="Download Sample"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCertificate(event);
                                  }}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                                  title="Delete Event"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Preview Sidebar */}
                <div className="w-full lg:w-1/3 min-w-[320px] max-w-[400px] flex-shrink-0 h-full">
                  {selectedEventForPreview ? (
                    <Card className="bg-white border-gray-200 h-full flex flex-col shadow-sm">
                      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center">
                          <LayoutGrid className="h-4 w-4 mr-2" />
                          Certificate Preview
                        </h3>
                        {selectedEventForPreview.certificateConfig && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 font-normal"
                          >
                            Active Config
                          </Badge>
                        )}
                      </div>
                      <CardContent className="flex flex-col h-full overflow-y-auto">
                        <div className="mb-5 last:mb-0">
                          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                            Event Name
                          </p>
                          <h4 className="text-lg font-semibold text-gray-900 leading-tight">
                            {selectedEventForPreview.eventName}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                              Issuer
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {selectedEventForPreview.issuerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
                              Date
                            </p>
                            <p className="text-sm text-gray-700 font-medium flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {new Date(
                                selectedEventForPreview.date,
                              ).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </div>

                        {/* Certificate Image Preview */}
                        {certificateImages[selectedEventForPreview.id] ? (
                          <div className="mt-2 mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 shrink-0">
                            <Image
                              src={
                                certificateImages[selectedEventForPreview.id]
                              }
                              alt={`Certificate for ${selectedEventForPreview.eventName}`}
                              width={400}
                              height={300}
                              className="w-full h-auto object-contain max-h-[300px]"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="mt-2 mb-6 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8 text-center h-[200px] shrink-0">
                            <FileText className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm font-medium text-gray-500">
                              No layout configured
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Edit to add a background
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col space-y-2 mt-auto">
                          <Button
                            onClick={() =>
                              handleEditCertificate(selectedEventForPreview)
                            }
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full shadow-sm"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Edit Template
                          </Button>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedEventForPreview.certificateConfig && (
                              <Button
                                onClick={() =>
                                  handleDownloadSample(selectedEventForPreview)
                                }
                                variant="outline"
                                className="w-full text-green-600 border-green-200 hover:bg-green-50"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                            <Button
                              onClick={() =>
                                handleDeleteCertificate(selectedEventForPreview)
                              }
                              variant="outline"
                              className="w-full text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gray-50 border-gray-200 border-dashed border-2 h-full flex items-center justify-center text-gray-400 shadow-none">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <TableOfContents className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-600 font-medium mb-1">
                          No Selection
                        </h3>
                        <p className="text-sm">
                          Select an event from the table
                        </p>
                        <p className="text-sm mt-1">to preview details</p>
                      </div>
                    </Card>
                  )}
                </div>
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
              fields: currentCertificateConfig
                ? convertValidFieldsToEditorFields(
                    currentCertificateConfig.validFields,
                  )
                : {},
            }}
            isEditing={isEditing}
            onSave={(updatedCertificate) => {
              handleSaveCertificate(updatedCertificate);
            }}
            onClose={() => {
              setShowEditor(false);
              setCurrentEvent(null);
              setCurrentCertificateConfig(null);
              setIsEditing(false);
            }}
          />
        )}

        <SendCertificatesModal
          open={showSendModal}
          certificates={events
            .filter((event) => event.certificateConfig) // Only include events with certificate configs
            .map((event) => ({
              id: event.id,
              name: event.eventName,
              event: event.issuerName,
              date: new Date(event.date).toLocaleDateString(),
              image:
                certificateImages[event.id] || "/placeholder-certificate.jpg",
              fields: {},
            }))}
          onClose={() => setShowSendModal(false)}
        />

        <DeleteConfirmationModal
          open={showDeleteModal}
          eventName={eventToDelete?.eventName || ""}
          onClose={() => {
            setShowDeleteModal(false);
            setEventToDelete(null);
          }}
          onConfirm={confirmDeleteCertificate}
        />
      </div>
    </ProtectedRoute>
  );
}
