"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Upload, User, FileSpreadsheet, Award, Download, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { useCertificates } from "@/context/CertificateContext"
import JSZip from "jszip"
import { saveAs } from "file-saver"

interface Certificate {
  id: string
  name: string
  event: string
  date: string
  image: string
}

interface SendCertificatesModalProps {
  open: boolean
  onClose: () => void
  certificates: Certificate[]
}

interface Recipient {
  name: string
  email?: string
  rank?: string
}

export function SendCertificatesModal({ open, onClose, certificates }: SendCertificatesModalProps) {
  const { getCertificateConfig } = useCertificates();
  const [step, setStep] = useState(1)
  const [selectedCertificate, setSelectedCertificate] = useState<string>("")
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [manualName, setManualName] = useState("")
  const [manualEmail, setManualEmail] = useState("")
  const [manualRank, setManualRank] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [certificateConfig, setCertificateConfig] = useState<any>(null)
  const [generatedCertificates, setGeneratedCertificates] = useState<string[]>([])
  const [zipBlob, setZipBlob] = useState<Blob | null>(null)

  // Load certificate configuration when a certificate is selected
  useEffect(() => {
    if (selectedCertificate) {
      const fetchCertificateConfig = async () => {
        try {
          const config = await getCertificateConfig(selectedCertificate);
          if (config) {
            setCertificateConfig(config);
            // console.log("Certificate configuration loaded:", config);
          }
        } catch (error) {
          console.error("Error fetching certificate config:", error);
          toast.error("Failed to load certificate configuration");
        }
      };
      fetchCertificateConfig();
    }
  }, [selectedCertificate, getCertificateConfig]);

  const handleAddManualRecipient = () => {
    if (manualName.trim()) {
      setRecipients((prev) => [
        ...prev,
        {
          name: manualName.trim(),
          email: manualEmail.trim() || undefined,
          rank: manualRank.trim() || undefined,
        },
      ])
      setManualName("")
      setManualEmail("")
      setManualRank("")
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        const newRecipients: Recipient[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim())
          if (values.length >= headers.length && values[0]) {
            const recipient: Recipient = { name: "" }

            headers.forEach((header, index) => {
              if (header.includes("name")) recipient.name = values[index]
              if (header.includes("email")) recipient.email = values[index]
              if (header.includes("rank")) recipient.rank = values[index]
            })

            if (recipient.name) {
              newRecipients.push(recipient)
            }
          }
        }

        setRecipients(newRecipients)
        toast("CSV Uploaded", {
          description: `${newRecipients.length} recipients loaded from CSV.`,
        })
      }
      reader.readAsText(file)
    }
  }

  const handleGenerateCertificates = async () => {
    if (!selectedCertificate || recipients.length === 0 || !certificateConfig) {
      toast("Missing Information", {
        description: "Please select a certificate and add recipients.",
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Get the selected certificate
      const certificate = certificates.find(c => c.id === selectedCertificate);
      if (!certificate) throw new Error("Certificate not found");
      
      let imageUrl = certificate.image;
      
      // Check if the URL is external (has http/https) and needs a proxy
      if (imageUrl.startsWith('http') && !imageUrl.includes('localhost')) {
        // This adds a CORS proxy - you might need to replace with your own solution
        // or implement a server-side proxy
        console.log("Using original image URL:", imageUrl);
      } else if (imageUrl.startsWith('/')) {
        // If it's a local path starting with '/', make sure it's using the full URL
        imageUrl = `http://localhost:5000${imageUrl}`;
        console.log("Using local backend URL:", imageUrl);
      }
      
      const zip = new JSZip();
      const generatedUrls: string[] = [];
      
      // Create a folder in the zip for the certificates
      const folder = zip.folder("certificates");
      if (!folder) throw new Error("Failed to create folder in zip");
      
      // Process each recipient
      for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        
        // Create a canvas to draw the certificate
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");
        
        // Load the certificate image
        const img = new window.Image();
        img.crossOrigin = "anonymous"; // Add CORS support
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = (e) => {
            console.error("Image load error:", e);
            reject(new Error("Failed to load certificate image"));
          };
          
          // First try with the original URL
          img.src = imageUrl;
          
          // If the image is from the same origin or has proper CORS headers, this will work
          // Otherwise, we'll get a security error when we try to export the canvas
        });
        
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the background image
        ctx.drawImage(img, 0, 0);
        
        console.log("Image dimensions:", img.width, img.height);
        
        // Helper function to calculate optimal font size and center text
        const drawCenteredText = (text: string, boundingBox: [number, number, number, number], fontFamily: string = "Arial", maxFontSize: number = 72) => {
          const [x, y, width, height] = boundingBox;
          
          // Start with a large font size and scale down until text fits
          let fontSize = maxFontSize;
          ctx.font = `${fontSize}px ${fontFamily}`;
          
          // Measure text and reduce font size until it fits within the bounding box
          let textMetrics = ctx.measureText(text);
          while ((textMetrics.width > width * 0.9 || fontSize > height * 0.8) && fontSize > 8) {
            fontSize -= 2;
            ctx.font = `${fontSize}px ${fontFamily}`;
            textMetrics = ctx.measureText(text);
          }
          
          // Calculate centered position
          const textX = x + (width - textMetrics.width) / 2;
          const textY = y + (height + fontSize * 0.3) / 2; // 0.3 accounts for font baseline
          
          // Draw the text
          ctx.fillText(text, textX, textY);
          
          console.log(`Drew "${text}" at (${textX}, ${textY}) with font size ${fontSize}px in bounding box [${x}, ${y}, ${width}, ${height}]`);
        };
        
        // Apply recipient name if coordinates exist
        if (certificateConfig.validFields.recipientName) {
          console.log("Recipient name coordinates:", certificateConfig.validFields.recipientName);
          ctx.fillStyle = "#000000";
          drawCenteredText(recipient.name, certificateConfig.validFields.recipientName, "Arial", 72);
        }
        
        // Apply rank if coordinates exist and recipient has rank
        if (certificateConfig.validFields.rank && recipient.rank) {
          ctx.fillStyle = "#000000";
          drawCenteredText(recipient.rank, certificateConfig.validFields.rank, "Arial", 48);
        }
        
        // Apply organisation name if coordinates exist
        if (certificateConfig.validFields.organisationName) {
          // You can get organisation name from the certificate config or make it configurable
          const orgName = certificateConfig.eventId?.organisation || "Sample Organization";
          ctx.fillStyle = "#000000";
          drawCenteredText(orgName, certificateConfig.validFields.organisationName, "Arial", 36);
        }
        
        // Convert canvas to blob
        let blob: Blob;
        try {
          // Try to export the canvas directly
          blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((result) => {
              if (result) resolve(result);
              else reject(new Error("Failed to convert canvas to blob"));
            }, "image/png");
          });
        } catch (error) {
          console.warn("Canvas export failed due to CORS, using fetch API as fallback:", error);
          
          // Fallback: If the canvas is tainted, we need to fetch the image directly
          // and use it without drawing on canvas
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
          
          blob = await response.blob();
          
          // Note: in this fallback, we won't have the custom text on the certificate
          console.warn("Using original image without custom text due to CORS restrictions");
        }
        
        // Add to zip
        const fileName = `${recipient.name.replace(/[^a-z0-9]/gi, '_')}_certificate.png`;
        folder.file(fileName, blob);
        
        // Store data URL for preview if needed
        const dataUrl = canvas.toDataURL("image/png");
        generatedUrls.push(dataUrl);
      }
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipBlob(zipBlob);
      setGeneratedCertificates(generatedUrls);
      
      setIsGenerating(false);
      setGenerationComplete(true);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast("Certificates Generated!", {
        description: `${recipients.length} certificates have been generated and are ready for download.`,
      });
    } catch (error) {
      console.error("Error generating certificates:", error);
      let errorMessage = "Failed to generate certificates";
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.name === "SecurityError") {
          errorMessage = "Security error: Cannot access image due to CORS restrictions";
        } else if (error.message.includes("tainted")) {
          errorMessage = "Cannot export canvas due to cross-origin image restrictions";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = () => {
    if (zipBlob) {
      // Use FileSaver to download the zip
      saveAs(zipBlob, `certificates-${selectedCertificate}-${Date.now()}.zip`);
      
      toast("Download Started", {
        description: "Your certificate zip file is being downloaded.",
      });
    } else {
      toast.error("No certificates available to download");
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedCertificate("");
    setRecipients([]);
    setGenerationComplete(false);
    setCertificateConfig(null);
    setZipBlob(null);
    setGeneratedCertificates([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">Send Certificates</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Choose Input Method</h3>
                <p className="text-gray-600">How would you like to add recipients?</p>
              </div>

              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="manual" className="data-[state=active]:bg-white">
                    Enter Manually
                  </TabsTrigger>
                  <TabsTrigger value="csv" className="data-[state=active]:bg-white">
                    Upload CSV
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center text-gray-700">
                        <User className="h-4 w-4 mr-2" />
                        Add Recipients Manually
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="manualName" className="text-gray-700">
                            Name *
                          </Label>
                          <Input
                            id="manualName"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            placeholder="Enter recipient name"
                            className="border-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manualEmail" className="text-gray-700">
                            Email (Optional)
                          </Label>
                          <Input
                            id="manualEmail"
                            type="email"
                            value={manualEmail}
                            onChange={(e) => setManualEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="border-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="manualRank" className="text-gray-700">
                            Rank (Optional)
                          </Label>
                          <Input
                            id="manualRank"
                            value={manualRank}
                            onChange={(e) => setManualRank(e.target.value)}
                            placeholder="e.g., 1st Place"
                            className="border-gray-200"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddManualRecipient} className="w-full bg-blue-600 hover:bg-blue-700">
                        Add Recipient
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="csv" className="space-y-4">
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center text-gray-700">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Upload CSV File
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="hidden"
                            id="csvUpload"
                          />
                          <label htmlFor="csvUpload" className="cursor-pointer">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload CSV file</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Expected columns: name, email (optional), rank (optional)
                            </p>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {recipients.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-700">Recipients ({recipients.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {recipients.map((recipient, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <span className="font-medium text-gray-900">{recipient.name}</span>
                            {recipient.email && <span className="text-sm text-gray-500 ml-2">({recipient.email})</span>}
                            {recipient.rank && (
                              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                                {recipient.rank}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRecipients((prev) => prev.filter((_, i) => i !== index))}
                            className="text-gray-400 hover:text-red-500"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={recipients.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue to Certificate Selection
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Select Certificate Template</h3>
                <p className="text-gray-600">Choose which certificate to use for generation</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((certificate) => (
                  <Card
                    key={certificate.id}
                    className={`cursor-pointer transition-all duration-200 border-2 ${
                      selectedCertificate === certificate.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedCertificate(certificate.id)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200">
                        {certificate.image ? (
                          <Image 
                            src={certificate.image}
                            alt={certificate.name}
                            width={300}
                            height={170}
                            className="w-full h-full object-cover rounded-lg"
                            unoptimized
                          />
                        ) : (
                          <Award className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <h4 className="font-semibold mb-1 text-gray-900">{certificate.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{certificate.event}</p>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {certificate.date}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {certificates.length === 0 && (
                <div className="text-center py-8">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No certificates available. Create one first.</p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedCertificate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Generate Certificates
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center">
                {generationComplete ? (
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {generationComplete ? "Certificates Generated!" : "Generating Certificates..."}
                </h3>
                <p className="text-gray-600">
                  {generationComplete
                    ? "Your certificates are ready for download"
                    : "Please wait while we generate your certificates"}
                </p>
              </div>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-700">Generation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificate Template:</span>
                      <span className="font-medium text-gray-900">
                        {certificates.find((c) => c.id === selectedCertificate)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipients:</span>
                      <span className="font-medium text-gray-900">{recipients.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        variant={generationComplete ? "default" : "secondary"}
                        className={generationComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                      >
                        {generationComplete ? "Complete" : "Processing..."}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {!generationComplete && (
                <Button
                  onClick={handleGenerateCertificates}
                  disabled={isGenerating}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Start Generation
                    </>
                  )}
                </Button>
              )}

              {generationComplete && (
                <div className="space-y-3">
                  <Button onClick={handleDownloadZip} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download ZIP File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
