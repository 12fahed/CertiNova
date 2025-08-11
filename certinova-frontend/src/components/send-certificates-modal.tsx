"use client"

import type React from "react"

import { useState } from "react"
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
  const [step, setStep] = useState(1)
  const [selectedCertificate, setSelectedCertificate] = useState<string>("")
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [manualName, setManualName] = useState("")
  const [manualEmail, setManualEmail] = useState("")
  const [manualRank, setManualRank] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

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
    if (!selectedCertificate || recipients.length === 0) {
      toast( "Missing Information", {
        description: "Please select a certificate and add recipients.",
      })
      return
    }

    setIsGenerating(true)

    // Simulate certificate generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsGenerating(false)
    setGenerationComplete(true)

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    toast("Certificates Generated!", {
      description: `${recipients.length} certificates have been generated and are ready for download.`,
    })
  }

  const handleDownloadZip = () => {
    // Simulate zip download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `certificates-${selectedCertificate}-${Date.now()}.zip`
    link.click()

    toast("Download Started", {
      description: "Your certificate zip file is being downloaded.",
    })
  }

  const resetModal = () => {
    setStep(1)
    setSelectedCertificate("")
    setRecipients([])
    setGenerationComplete(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

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
                          <img
                            src={certificate.image || "/placeholder.svg"}
                            alt={certificate.name}
                            className="w-full h-full object-cover rounded-lg"
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
