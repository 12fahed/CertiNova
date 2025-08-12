"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Building, Link, QrCode, Trophy, Download, Save, X } from "lucide-react"
import { toast } from "sonner"
import { useCertificates } from "@/context/CertificateContext"

interface Certificate {
  id?: string
  name: string
  event: string
  date: string
  image?: string
  fields: {
    recipientName?: { x: number; y: number; width: number; height: number }
    organizationName?: { x: number; y: number; width: number; height: number }
    certificateLink?: { x: number; y: number; width: number; height: number }
    certificateQR?: { x: number; y: number; width: number; height: number }
    rank?: { x: number; y: number; width: number; height: number }
  }
}

interface CertificateEditorProps {
  certificate: Partial<Certificate>
  onSave: (certificate: Certificate) => void
  onClose: () => void
}

type FieldType = "recipientName" | "organizationName" | "certificateLink" | "certificateQR" | "rank"

export function CertificateEditor({ certificate, onSave, onClose }: CertificateEditorProps) {
  const { uploadTemplate, isLoading } = useCertificates();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [fields, setFields] = useState(certificate.fields || {});
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldOptions = [
    {
      key: "recipientName" as FieldType,
      label: "Recipient Name",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      key: "organizationName" as FieldType,
      label: "Organization Name",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      key: "certificateLink" as FieldType,
      label: "Certificate Link",
      icon: Link,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      key: "certificateQR" as FieldType,
      label: "Certificate QR",
      icon: QrCode,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    { key: "rank" as FieldType, label: "Rank", icon: Trophy, color: "text-red-600", bgColor: "bg-red-50" },
  ]

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // First, show a local preview for immediate feedback
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server and get the path
        const imagePath = await uploadTemplate(file);
        if (imagePath) {
          setUploadedImagePath(imagePath);
          // Update the image to use the server URL
          const serverUrl = `http://localhost:5000${imagePath}`;
          setUploadedImage(serverUrl);
        }
      } catch (error) {
        console.error('Failed to upload template:', error);
        toast.error('Failed to upload certificate template');
      }
    }
  };

  const handleFieldSelect = (fieldType: FieldType) => {
    if (!uploadedImage) {
      toast("Upload Required", {
          description: "Please upload a certificate template first.",
        }
      )
      return
    }

    setSelectedField(fieldType)
    setIsSelecting(true)
    toast("Selection Mode", {
      description: "Click and drag to select the area for this field.",
    })
  }

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isSelecting || !selectedField || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (!selectionStart) {
        setSelectionStart({ x, y })
      } else {
        const width = Math.abs(x - selectionStart.x)
        const height = Math.abs(y - selectionStart.y)
        const finalX = Math.min(x, selectionStart.x)
        const finalY = Math.min(y, selectionStart.y)

        setFields((prev) => ({
          ...prev,
          [selectedField]: { x: finalX, y: finalY, width, height },
        }))

        setIsSelecting(false)
        setSelectedField(null)
        setSelectionStart(null)

        const option = fieldOptions.find((f) => f.key === selectedField)
        toast("Field Added", {
          description: `${option?.label} has been positioned.`,
        })
      }
    },
    [isSelecting, selectedField, selectionStart],
  )

  const handleSave = () => {
    if (!uploadedImage) {
      toast("Upload Required", {
        description: "Please upload a certificate template first.",
      })
      return
    }

    const savedCertificate: Certificate = {
      id: certificate.id || Date.now().toString(),
      name: certificate.name || "Untitled Certificate",
      event: certificate.event || "Unknown Event",
      date: certificate.date || new Date().toLocaleDateString(),
      image: uploadedImagePath || uploadedImage || "/placeholder-certificate.jpg",
      fields,
    }

    onSave(savedCertificate)
    toast("Certificate Saved", {
      description: "Your certificate template has been saved successfully.",
    })
  }

  const handleDownloadSample = () => {
    // Create a sample certificate with placeholder data
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      // Add sample text to each field
      if (ctx) {
        ctx.font = "24px Arial"
        ctx.fillStyle = "#000000"

        Object.entries(fields).forEach(([fieldType, position]) => {
          let sampleText = ""
          switch (fieldType) {
            case "recipientName":
              sampleText = "John Doe"
              break
            case "organizationName":
              sampleText = "Sample Organization"
              break
            case "certificateLink":
              sampleText = "https://example.com/cert/123"
              break
            case "certificateQR":
              sampleText = "[QR Code]"
              break
            case "rank":
              sampleText = "1st Place"
              break
          }

          ctx.fillText(sampleText, position.x, position.y + 20)
        })
      }

      // Download the canvas as image
      const link = document.createElement("a")
      link.download = "sample-certificate.png"
      link.href = canvas.toDataURL()
      link.click()
    }

    if (uploadedImage) {
      img.src = uploadedImage
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-gray-200"
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Certificate Editor</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Card className="mb-6 border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-700">Upload Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadedImage ? "Change Template" : "Upload Certificate Template"}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6 border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-gray-700">Add Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fieldOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant="outline"
                      className="w-full justify-start border-gray-200 hover:bg-gray-50 bg-transparent"
                      onClick={() => handleFieldSelect(option.key)}
                      disabled={!uploadedImage}
                    >
                      <div className={`w-8 h-8 ${option.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                        <option.icon className={`h-4 w-4 ${option.color}`} />
                      </div>
                      {option.label}
                      {fields[option.key] && (
                        <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                          ✓
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Certificate
              </Button>
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                className="w-full border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-auto bg-white">
            <div className="h-full flex items-center justify-center">
              {uploadedImage ? (
                <div
                  ref={canvasRef}
                  className="relative border-2 border-gray-200 rounded-lg overflow-hidden cursor-crosshair shadow-sm"
                  onClick={handleCanvasClick}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                >
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Certificate Template"
                    className="max-w-full max-h-full object-contain"
                    draggable={false}
                  />

                  {/* Render field overlays */}
                  {Object.entries(fields).map(([fieldType, position]) => {
                    const option = fieldOptions.find((f) => f.key === fieldType)
                    return (
                      <div
                        key={fieldType}
                        className={`absolute border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center`}
                        style={{
                          left: position.x,
                          top: position.y,
                          width: position.width,
                          height: position.height,
                        }}
                      >
                        <Badge variant="secondary" className="text-xs bg-white border border-gray-200">
                          {option?.label}
                        </Badge>
                      </div>
                    )
                  })}

                  {/* Selection indicator */}
                  {isSelecting && selectedField && (
                    <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 border-dashed">
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-600">
                          Selecting: {fieldOptions.find((f) => f.key === selectedField)?.label}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600">Upload a certificate template to get started</p>
                  <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, PDF</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
