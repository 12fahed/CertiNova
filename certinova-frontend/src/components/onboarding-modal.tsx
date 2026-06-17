'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import {
  Upload,
  Building,
  User,
  Calendar,
  Globe,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    organizationLogo: null as File | null,
    eventTypes: '',
    referralSource: '',
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    organization?: string;
    eventTypes?: string;
  }>({});

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSubmitting(false);
      setErrors({});
      setFormData({
        fullName: '',
        organization: '',
        organizationLogo: null,
        eventTypes: '',
        referralSource: '',
      });
    }
  }, [open]);

  const handleNext = async () => {
    setErrors({});
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrors({ fullName: 'Full name is required' });
        return;
      }
    } else if (step === 2) {
      if (!formData.organization.trim()) {
        setErrors({ organization: 'Organization name is required' });
        return;
      }
    } else if (step === 3) {
      if (!formData.eventTypes) {
        setErrors({ eventTypes: 'Please select an event type' });
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    const ok = await updateProfile({
      fullName: formData.fullName,
      eventTypes: formData.eventTypes,
      referralSource: formData.referralSource,
    });
    setSubmitting(false);

    if (ok) {
      onClose();
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, organizationLogo: file }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg bg-white border border-gray-200"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            Welcome! Let&apos;s get you set up
          </DialogTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Step {step} of {totalSteps}
            </p>
          </div>
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
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Tell us about yourself</h3>
                <p className="text-gray-600">We&apos;d like to know who we&apos;re working with</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, fullName: e.target.value }));
                      setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    placeholder="Enter your full name"
                    className={`border-gray-200 ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}`}
                  />
                  {errors.fullName && (
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>{errors.fullName}</span>
                    </div>
                  )}
                </div>
              </div>
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
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Your Organization</h3>
                <p className="text-gray-600">Help us understand your organization better</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-gray-700">
                    Organization Name *
                  </Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, organization: e.target.value }));
                      setErrors((prev) => ({ ...prev, organization: undefined }));
                    }}
                    placeholder="Enter your organization name"
                    className={`border-gray-200 ${errors.organization ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}`}
                  />
                  {errors.organization && (
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>{errors.organization}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-gray-700">
                    Organization Logo (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="logo" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                      {formData.organizationLogo && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {formData.organizationLogo.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
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
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Event Information</h3>
                <p className="text-gray-600">What kind of events do you organize?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventTypes" className="text-gray-700">
                    Types of Events *
                  </Label>
                  <Select
                    value={formData.eventTypes}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, eventTypes: value }));
                      setErrors((prev) => ({ ...prev, eventTypes: undefined }));
                    }}
                  >
                    <SelectTrigger
                      className={`border-gray-200 ${errors.eventTypes ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200'}`}
                    >
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic Events</SelectItem>
                      <SelectItem value="corporate">Corporate Training</SelectItem>
                      <SelectItem value="workshops">Workshops & Seminars</SelectItem>
                      <SelectItem value="competitions">Competitions</SelectItem>
                      <SelectItem value="conferences">Conferences</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.eventTypes && (
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>{errors.eventTypes}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 py-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">How did you find us?</h3>
                <p className="text-gray-600">Help us improve our reach</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="referralSource" className="text-gray-700">
                    Referral Source
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, referralSource: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="How did you hear about us?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="friend">Friend/Colleague</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : step === totalSteps ? (
              'Get Started'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
