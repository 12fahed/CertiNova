"use client"

import type React from "react"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  User,
  Building,
  Link,
  QrCode,
  Trophy,
  Download,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { toast } from "sonner"
import { useCertificates } from "@/context/CertificateContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Certificate {
  id?: string
  name: string
  event: string
  date: string
  image?: string
  fields: {
    recipientName?: {
      x: number
      y: number
      width: number
      height: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
    organizationName?: {
      x: number
      y: number
      width: number
      height: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
    certificateLink?: {
      x: number
      y: number
      width: number
      height: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
    certificateQR?: {
      x: number
      y: number
      width: number
      height: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
    rank?: {
      x: number
      y: number
      width: number
      height: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
  }
}

interface CertificateEditorProps {
  certificate: Partial<Certificate>
  onSave: (certificate: Certificate) => void
  onClose: () => void
}

type FieldType = "recipientName" | "organizationName" | "certificateLink" | "certificateQR" | "rank"

export function CertificateEditor({ certificate, onSave, onClose }: CertificateEditorProps) {
  const { uploadTemplate, isLoading } = useCertificates()
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    certificate.image && certificate.image.startsWith("/uploads")
      ? `http://localhost:5000${certificate.image}`
      : certificate.image || null,
  )
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    certificate.image && certificate.image.startsWith("/uploads") ? certificate.image : null,
  )
  const [selectedField, setSelectedField] = useState<FieldType | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
  const [fields, setFields] = useState(certificate.fields || {})
  const [imageLoaded, setImageLoaded] = useState(false)
  const [draggedField, setDraggedField] = useState<FieldType | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [selectedFieldForToolbar, setSelectedFieldForToolbar] = useState<FieldType | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null)

  const fontFamilies = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Georgia",
    "Verdana",
    "Trebuchet MS",
    "Comic Sans MS",
    "Impact",
    "Lucida Console",
    "Tahoma",
  ]

  // Update fields when certificate prop changes
  useEffect(() => {
    if (certificate.fields) {
      setFields(certificate.fields)
    }
    // Reset image loaded state when certificate changes
    setImageLoaded(false)
  }, [certificate.fields])

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fieldOptions = useMemo(
    () => [
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
    ],
    [],
  )

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setImageLoaded(false) // Reset image loaded state

        // First, show a local preview for immediate feedback
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to server and get the path
        const imagePath = await uploadTemplate(file)
        if (imagePath) {
          setUploadedImagePath(imagePath)
          // Update the image to use the server URL
          const serverUrl = `http://localhost:5000${imagePath}`
          setUploadedImage(serverUrl)
        }
      } catch (error) {
        console.error("Failed to upload template:", error)
        toast.error("Failed to upload certificate template")
      }
    }
  }

  const handleFieldSelect = (fieldType: FieldType) => {
    if (!uploadedImage) {
      toast("Upload Required", {
        description: "Please upload a certificate template first.",
      })
      return
    }

    setSelectedField(fieldType)
    setIsSelecting(true)
    setSelectedFieldForToolbar(null)
    toast("Selection Mode", {
      description: "Click and drag to select the area for this field.",
    })
  }

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return

      if (!isSelecting && !isDragging) {
        const img = canvasRef.current.querySelector("img")
        if (!img) return

        const imgRect = img.getBoundingClientRect()
        const clickX = e.clientX - imgRect.left
        const clickY = e.clientY - imgRect.top

        // Check if clicking on an existing field
        const clickedField = Object.entries(fields).find(([, position]) => {
          const displayScaleX = img.offsetWidth / img.naturalWidth
          const displayScaleY = img.offsetHeight / img.naturalHeight
          const displayX = position.x * displayScaleX
          const displayY = position.y * displayScaleY
          const displayWidth = position.width * displayScaleX
          const displayHeight = position.height * displayScaleY

          return (
            clickX >= displayX &&
            clickX <= displayX + displayWidth &&
            clickY >= displayY &&
            clickY <= displayY + displayHeight
          )
        })

        if (clickedField) {
          setSelectedFieldForToolbar(clickedField[0] as FieldType)
        } else {
          // Deselect if clicking outside
          setSelectedFieldForToolbar(null)
        }
        return
      }

      // Handle field selection for new fields (existing logic)
      if (!isSelecting || !selectedField) return

      const img = canvasRef.current.querySelector("img")
      if (!img) return

      const imgRect = img.getBoundingClientRect()
      const clickX = e.clientX - imgRect.left
      const clickY = e.clientY - imgRect.top
      const imgDisplayedWidth = imgRect.width
      const imgDisplayedHeight = imgRect.height
      const scaleX = img.naturalWidth / imgDisplayedWidth
      const scaleY = img.naturalHeight / imgDisplayedHeight
      const actualX = clickX * scaleX
      const actualY = clickY * scaleY

      if (!selectionStart) {
        setSelectionStart({ x: actualX, y: actualY })
      } else {
        const width = Math.abs(actualX - selectionStart.x)
        const height = Math.abs(actualY - selectionStart.y)
        const finalX = Math.min(actualX, selectionStart.x)
        const finalY = Math.min(actualY, selectionStart.y)

        setFields((prev) => ({
          ...prev,
          [selectedField]: {
            x: finalX,
            y: finalY,
            width,
            height,
            fontFamily: "Arial",
            fontWeight: "normal",
            fontStyle: "normal",
            textDecoration: "none",
          },
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
    [isSelecting, selectedField, selectionStart, fieldOptions, fields, isDragging],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggedField && dragStartPos && !isDragging) {
        const currentX = e.clientX
        const currentY = e.clientY
        const distance = Math.sqrt(Math.pow(currentX - dragStartPos.x, 2) + Math.pow(currentY - dragStartPos.y, 2))

        // Start dragging only if mouse moved more than 5 pixels
        if (distance > 5) {
          setIsDragging(true)
        }
      }

      if (!isDragging || !draggedField || !canvasRef.current) return

      const img = canvasRef.current.querySelector("img")
      if (!img) return

      const imgRect = img.getBoundingClientRect()
      const mouseX = e.clientX - imgRect.left - dragOffset.x
      const mouseY = e.clientY - imgRect.top - dragOffset.y

      const scaleX = img.naturalWidth / img.offsetWidth
      const scaleY = img.naturalHeight / img.offsetHeight
      const actualX = Math.max(0, mouseX * scaleX)
      const actualY = Math.max(0, mouseY * scaleY)

      setFields((prev) => ({
        ...prev,
        [draggedField]: {
          ...prev[draggedField]!,
          x: actualX,
          y: actualY,
        },
      }))
    },
    [draggedField, dragOffset, isDragging, dragStartPos],
  )

  const handleMouseUp = useCallback(() => {
    if (draggedField) {
      setDraggedField(null)
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
      setDragStartPos(null)
    }
  }, [draggedField])

  const updateFieldStyle = (fieldType: FieldType, styleProperty: string, value: string | number) => {
    setFields((prev) => ({
      ...prev,
      [fieldType]: {
        ...prev[fieldType]!,
        [styleProperty]: value,
      },
    }))
  }

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
        ctx.fillStyle = "#000000"

        // Helper function to draw centered text (same as in send-certificates-modal)
        const drawCenteredText = (
          text: string,
          position: {
            x: number
            y: number
            width: number
            height: number
            fontFamily?: string
            fontWeight?: string
            fontStyle?: string
            textDecoration?: string
          },
          maxFontSize = 72
        ) => {
          // Calculate font size based on field dimensions
          const calculatedFontSize = Math.min(
            position.width / text.length * 1.5, // Width-based calculation
            position.height * 0.8, // Height-based calculation
            maxFontSize // Maximum allowed
          );
          const fontSize = Math.max(calculatedFontSize, 8); // Minimum font size of 8
          
          const fontFamily = position.fontFamily || "Arial"
          const fontWeight = position.fontWeight || "normal"
          const fontStyle = position.fontStyle || "normal"

          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

          // Measure text and reduce font size until it fits within the bounding box
          let textMetrics = ctx.measureText(text)
          let adjustedFontSize = fontSize
          while (
            (textMetrics.width > position.width * 0.9 || adjustedFontSize > position.height * 0.8) &&
            adjustedFontSize > 8
          ) {
            adjustedFontSize -= 2
            ctx.font = `${fontStyle} ${fontWeight} ${adjustedFontSize}px ${fontFamily}`
            textMetrics = ctx.measureText(text)
          }

          // Calculate centered position
          const textX = position.x + (position.width - textMetrics.width) / 2
          const textY = position.y + (position.height + adjustedFontSize * 0.3) / 2

          // Draw the text
          ctx.fillText(text, textX, textY)

          // Handle text decoration
          if (position.textDecoration === "underline") {
            ctx.beginPath()
            ctx.moveTo(textX, textY + 2)
            ctx.lineTo(textX + textMetrics.width, textY + 2)
            ctx.stroke()
          }
        }

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

          drawCenteredText(sampleText, position, 72)
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
        <AnimatePresence>
          {selectedFieldForToolbar && fields[selectedFieldForToolbar] && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-gray-50 border-b border-gray-200 p-3"
            >
              <div className="flex items-center gap-4 justify-center">
                {/* Font Family Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[140px] justify-between bg-transparent">
                      {fields[selectedFieldForToolbar]?.fontFamily || "Arial"}
                      <span className="ml-2">▼</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 max-h-64 overflow-y-auto">
                    {fontFamilies.map((font) => (
                      <DropdownMenuItem
                        key={font}
                        onClick={() => updateFieldStyle(selectedFieldForToolbar, "fontFamily", font)}
                        className={`${fields[selectedFieldForToolbar]?.fontFamily === font ? "bg-blue-50" : ""}`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Text Style Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant={fields[selectedFieldForToolbar]?.fontWeight === "bold" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFieldStyle(
                        selectedFieldForToolbar,
                        "fontWeight",
                        fields[selectedFieldForToolbar]?.fontWeight === "bold" ? "normal" : "bold",
                      )
                    }
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={fields[selectedFieldForToolbar]?.fontStyle === "italic" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFieldStyle(
                        selectedFieldForToolbar,
                        "fontStyle",
                        fields[selectedFieldForToolbar]?.fontStyle === "italic" ? "normal" : "italic",
                      )
                    }
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={fields[selectedFieldForToolbar]?.textDecoration === "underline" ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFieldStyle(
                        selectedFieldForToolbar,
                        "textDecoration",
                        fields[selectedFieldForToolbar]?.textDecoration === "underline" ? "none" : "underline",
                      )
                    }
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                {/* Alignment Buttons */}
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Close Toolbar */}
                <Button variant="ghost" size="sm" onClick={() => setSelectedFieldForToolbar(null)} className="ml-4">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Certificate Editor</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <AnimatePresence>
              {!uploadedImage && (
                <motion.div
                  initial={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                >
                  <Card className="border-gray-200">
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
                          <p className="text-sm text-gray-600">Upload Certificate Template</p>
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
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{
                y: uploadedImage ? -24 : 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
              className="space-y-6"
            >
              <Card className="border-gray-200">
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
            </motion.div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-6 overflow-auto bg-white">
            <div className="h-full flex items-center justify-center">
              {uploadedImage ? (
                <div
                  ref={canvasRef}
                  className="relative border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  onClick={handleCanvasClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    cursor: isSelecting ? "crosshair" : isDragging ? "grabbing" : "default",
                  }}
                >
                  <div className="relative inline-block">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Certificate Template"
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(false)}
                    />

                    {imageLoaded &&
                      Object.entries(fields).map(([fieldType, position]) => {
                        const option = fieldOptions.find((f) => f.key === fieldType)

                        // Get the displayed image for scaling calculation
                        const img = canvasRef.current?.querySelector("img")
                        if (!img || !img.complete || img.naturalWidth === 0) {
                          return null
                        }

                        // Calculate scaling factors to convert from actual image coordinates to display coordinates
                        const displayScaleX = img.offsetWidth / img.naturalWidth
                        const displayScaleY = img.offsetHeight / img.naturalHeight

                        // Convert stored actual coordinates to display coordinates
                        const displayX = position.x * displayScaleX
                        const displayY = position.y * displayScaleY
                        const displayWidth = position.width * displayScaleX
                        const displayHeight = position.height * displayScaleY

                        const isSelected = selectedFieldForToolbar === fieldType

                        return (
                          <motion.div
                            key={fieldType}
                            className={`absolute border-2 border-dashed ${
                              isSelected ? "border-blue-600 bg-blue-100/50" : "border-blue-400 bg-blue-50/50"
                            } flex items-center justify-center group hover:border-blue-500 transition-colors ${
                              isDragging && draggedField === fieldType ? "cursor-grabbing" : "cursor-grab"
                            }`}
                            style={{
                              left: displayX,
                              top: displayY,
                              width: displayWidth,
                              height: displayHeight,
                            }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              const img = canvasRef.current?.querySelector("img")
                              if (!img) return

                              const imgRect = img.getBoundingClientRect()
                              const mouseX = e.clientX - imgRect.left
                              const mouseY = e.clientY - imgRect.top

                              setDraggedField(fieldType as FieldType)
                              setDragOffset({
                                x: mouseX - displayX,
                                y: mouseY - displayY,
                              })
                              setDragStartPos({ x: e.clientX, y: e.clientY })
                              setIsDragging(false) // Don't start dragging immediately
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!isDragging) {
                                setSelectedFieldForToolbar(fieldType as FieldType)
                              }
                            }}
                          >
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white border border-gray-200 pointer-events-none"
                            >
                              {option?.label}
                            </Badge>
                          </motion.div>
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
