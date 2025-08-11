"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Award, Building } from "lucide-react"

interface CreateCertificateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (eventName: string, issuerName: string) => void
}

export function CreateCertificateModal({ open, onClose, onSubmit }: CreateCertificateModalProps) {
  const [eventName, setEventName] = useState("")
  const [issuerName, setIssuerName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (eventName.trim() && issuerName.trim()) {
      onSubmit(eventName.trim(), issuerName.trim())
      setEventName("")
      setIssuerName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">Create New Certificate</DialogTitle>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6 py-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600">Let's start by setting up your certificate details</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-gray-700">
                Event Name *
              </Label>
              <div className="relative">
                <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Annual Tech Conference 2024"
                  className="pl-10 border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuerName" className="text-gray-700">
                Issuer Name *
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="issuerName"
                  value={issuerName}
                  onChange={(e) => setIssuerName(e.target.value)}
                  placeholder="e.g., Tech University"
                  className="pl-10 border-gray-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
