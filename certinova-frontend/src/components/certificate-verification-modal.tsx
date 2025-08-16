"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { CheckCircle, XCircle } from "lucide-react"
import { certificateService } from "@/services/certificate"

interface CertificateVerificationModalProps {
  open: boolean
  onClose: () => void
}

interface VerificationStep {
  id: number
  verify: string
  initialText: string
  completedText: string
  progress: number
  isCompleted: boolean
  hasError?: boolean
  errorMessage?: string
}

interface VerificationData {
  uuid: string
  organisation: string
  issuerName: string
  eventName: string
  eventDate: string
  certificateGeneratedDate: string
  certificateId: string
  verificationId: string
  isValid: boolean
  verifiedAt: string
}

export function CertificateVerificationModal({ open, onClose }: CertificateVerificationModalProps) {
  const [certificateNumber, setCertificateNumber] = useState(["", "", "", "", ""])
  const [showVerification, setShowVerification] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: 1,
      verify: "UUID",
      initialText: "Searching for UUID in verification records",
      completedText: "UUID found in verification database",
      progress: 0,
      isCompleted: false,
      hasError: false
    },
    {
      id: 2,
      verify: "Certificate",
      initialText: "Fetching certificate data and validation",
      completedText: "Certificate record verified and validated",
      progress: 0,
      isCompleted: false,
      hasError: false
    },
    {
      id: 3,
      verify: "Issuer & Organization",
      initialText: "Verifying issuer credentials and organization",
      completedText: "Issuer and organization verified successfully",
      progress: 0,
      isCompleted: false,
      hasError: false
    },
  ])

  const handleInputChange = (index: number, value: string) => {
    const newCertificateNumber = [...certificateNumber];
    
    // Set different max lengths for each part
    const maxLengths = [8, 4, 4, 4, 12]; // Standard UUID format
    
    if (value.length <= maxLengths[index]) {
      newCertificateNumber[index] = value;
      
      // Auto-focus next input when current reaches max length
      if (value.length === maxLengths[index] && index < 4) {
        const nextInput = document.getElementById(`uuid-part-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
      
      setCertificateNumber(newCertificateNumber);
    }
  }

  const isValidCertificate = certificateNumber.every((part, index) => {
    const requiredLengths = [8, 4, 4, 4, 12];
    return part.length === requiredLengths[index];
  });

  const handleVerify = async () => {
    if (!isValidCertificate) return
    
    setShowVerification(true)
    setIsVerifying(true)
    setCurrentStep(0)
    setVerificationComplete(false)
    setVerificationError(null)
    setVerificationData(null)

    // Reset steps
    setSteps((prev) => prev.map((step) => ({ 
      ...step, 
      progress: 0, 
      isCompleted: false, 
      hasError: false,
      errorMessage: undefined 
    })))

    // Get the full UUID from the input
    const fullUUID = certificateNumber.join("-")
    
    try {
      // Start verification process with real API
      // console.log("FULL UUID: ", fullUUID)
      await startRealVerificationProcess(fullUUID)
    } catch (error) {
      console.error('Verification failed:', error)
      setVerificationError('Verification process failed. Please try again.')
      setIsVerifying(false)
    }
  }

  const startRealVerificationProcess = async (uuid: string) => {
    try {
      // Step 1: UUID Lookup
      setCurrentStep(0)
      await animateProgress(0)
      
      const result = await certificateService.verifyUUID(uuid)
      
      if (!result.success) {
        // Handle specific error at the step where it failed
        const errorStep = getErrorStepIndex(result.step)
        setSteps((prev) => prev.map((step, index) => 
          index === errorStep ? { 
            ...step, 
            hasError: true, 
            errorMessage: result.message || result.error || 'Verification failed',
            progress: 100 
          } : step
        ))
        setVerificationError(result.message || result.error || 'Verification failed')
        setIsVerifying(false)
        return
      }

      // All steps completed successfully
      if (result.data) {
        setVerificationData(result.data)
        
        // Update steps with real data
        setSteps((prev) => [
          {
            ...prev[0],
            completedText: `UUID verified in verification database`,
            isCompleted: true
          },
          {
            ...prev[1],
            completedText: `Certificate issued on ${new Date(result.data!.certificateGeneratedDate).toLocaleDateString()}`,
            isCompleted: true
          },
          {
            ...prev[2],
            completedText: `${result.data!.issuerName} from ${result.data!.organisation} for ${result.data!.eventName}`,
            isCompleted: true
          }
        ])
      }

      // Animate remaining steps
      await animateProgress(1)
      await animateProgress(2)
      
      setIsVerifying(false)
      setVerificationComplete(true)

    } catch (error) {
      console.error('API verification error:', error)
      setVerificationError('Network error. Please check your connection and try again.')
      setIsVerifying(false)
    }
  }

  const getErrorStepIndex = (errorStep: string): number => {
    switch (errorStep) {
      case 'uuid_lookup':
        return 0
      case 'certificate_lookup':
      case 'config_lookup':
        return 1
      case 'event_lookup':
        return 2
      default:
        return 0
    }
  }

  const animateProgress = (stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5

        setSteps((prev) => prev.map((step, index) => 
          index === stepIndex ? { ...step, progress } : step
        ))

        if (progress >= 100) {
          clearInterval(interval)
          
          setSteps((prev) => prev.map((step, index) => 
            index === stepIndex ? { ...step, isCompleted: true } : step
          ))

          setTimeout(resolve, 300)
        }
      }, 30)
    })
  }

  const handleClose = () => {
    setCertificateNumber(["", "", "", "", ""])
    setShowVerification(false)
    setIsVerifying(false)
    setVerificationComplete(false)
    setVerificationError(null)
    setVerificationData(null)
    setCurrentStep(0)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-max">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showVerification ? "Credential Verification" : "Verify Certificate"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!showVerification ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Enter your certificate number to verify its authenticity</p>

                <div className="flex items-center justify-center space-x-2 mb-6">
                  {certificateNumber.map((part, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        id={`uuid-part-${index}`}
                        value={part}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`text-center font-mono text-sm ${
                          [0, 4].includes(index) ? 'w-24' : 'w-16'
                        }`} // Wider for first and last parts
                        placeholder={
                          index === 0 ? 'xxxxxxxx' : 
                          index === 4 ? 'xxxxxxxxxxxx' : 'xxxx'
                        }
                        maxLength={[8, 4, 4, 4, 12][index]}
                      />
                      {index < certificateNumber.length - 1 && (
                        <span className="mx-1 text-gray-400">-</span>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mb-6">Format: 279c109d-dd92-4bbd-9a53-648119ba8892</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={!isValidCertificate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Verify
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-4"
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <CircularProgressbar
                      value={step.progress}
                      text={
                        step.hasError ? "✗" : step.isCompleted ? "✓" : `${Math.round(step.progress)}%`
                      }
                      styles={buildStyles({
                        textSize: step.isCompleted || step.hasError ? "24px" : "16px",
                        pathColor: step.hasError ? "#ef4444" : step.isCompleted ? "#10b981" : "#3b82f6",
                        textColor: step.hasError ? "#ef4444" : step.isCompleted ? "#10b981" : "#3b82f6",
                        trailColor: "#e5e7eb",
                        pathTransitionDuration: 0.3,
                      })}
                    />
                  </div>

                  <div className="flex-1">
                    <motion.p
                      key={step.isCompleted || step.hasError ? "completed" : "initial"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-sm font-medium ${
                        step.hasError 
                          ? "text-red-600" 
                          : step.isCompleted 
                          ? "text-green-600" 
                          : "text-gray-700"
                      }`}
                    > 
                      {step.hasError ? (
                        <>
                          <span className="text-red-700 font-bold text-base">Error in {step.verify}</span>
                          <br />
                          <span className="text-xs">{step.errorMessage}</span>
                        </>
                      ) : step.isCompleted ? (
                        <>
                          <span className="text-gray-700 font-bold text-base">Verified {step.verify}</span>
                          <br />
                          <span className="text-xs">{step.completedText}</span>
                        </>
                      ) : (
                        <span>{step.initialText}</span>
                      )}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

              {verificationComplete && verificationData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Certificate Verified Successfully</span>
                  </div>
                  <div className="space-y-2 text-sm text-green-700">
                    <div><strong>Organization:</strong> {verificationData.organisation}</div>
                    <div><strong>Event:</strong> {verificationData.eventName}</div>
                    <div><strong>Issued by:</strong> {verificationData.issuerName}</div>
                    <div><strong>Event Date:</strong> {new Date(verificationData.eventDate).toLocaleDateString()}</div>
                    <div><strong>Certificate Generated:</strong> {new Date(verificationData.certificateGeneratedDate).toLocaleDateString()}</div>
                    <div><strong>Verified At:</strong> {new Date(verificationData.verifiedAt).toLocaleString()}</div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    This credential was securely issued and verified by CertiNova.
                  </p>
                </motion.div>
              )}

              {verificationError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800">Verification Failed</span>
                  </div>
                  <p className="text-sm text-red-700">
                    {verificationError}
                  </p>
                </motion.div>
              )}

              {(verificationComplete || verificationError) && (
                <Button 
                  onClick={handleClose} 
                  className={`w-full ${
                    verificationError 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {verificationError ? 'Try Again' : 'Close'}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
