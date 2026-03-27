"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldX,
  Award,
  Building2,
  Calendar,
  User,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import { certificateService } from "@/services/certificate";
import Link from "next/link";

interface FieldPosition {
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

interface VerificationData {
  uuid: string;
  organisation: string;
  issuerName: string;
  eventName: string;
  eventDate: string;
  certificateGeneratedDate: string;
  verifiedAt: string;
  certificateConfig: {
    imagePath: string;
    validFields: {
      recipientName?: FieldPosition;
      organisationName?: FieldPosition;
      certificateLink?: FieldPosition;
      certificateQR?: FieldPosition;
      rank?: FieldPosition;
    };
  };
}

interface VerificationStep {
  id: number;
  label: string;
  description: string;
  completedText: string;
  progress: number;
  isCompleted: boolean;
  hasError: boolean;
}

const SAMPLE_NAME = "Aarav Sharma";
const SAMPLE_RANK = "1st";

export default function VerifyPage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [verificationData, setVerificationData] =
    useState<VerificationData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [certificateDataUrl, setCertificateDataUrl] = useState<string | null>(
    null,
  );

  const [steps, setSteps] = useState<VerificationStep[]>([
    {
      id: 1,
      label: "UUID Lookup",
      description: "Searching verification records...",
      completedText: "UUID found in verification database",
      progress: 0,
      isCompleted: false,
      hasError: false,
    },
    {
      id: 2,
      label: "Certificate Validation",
      description: "Fetching certificate data...",
      completedText: "Certificate record verified",
      progress: 0,
      isCompleted: false,
      hasError: false,
    },
    {
      id: 3,
      label: "Issuer Verification",
      description: "Verifying issuer credentials...",
      completedText: "Issuer and organization verified",
      progress: 0,
      isCompleted: false,
      hasError: false,
    },
  ]);

  const animateProgress = useCallback((stepIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 8;
        setSteps((prev) =>
          prev.map((step, i) =>
            i === stepIndex
              ? { ...step, progress: Math.min(progress, 100) }
              : step,
          ),
        );
        if (progress >= 100) {
          clearInterval(interval);
          setSteps((prev) =>
            prev.map((step, i) =>
              i === stepIndex
                ? { ...step, isCompleted: true, progress: 100 }
                : step,
            ),
          );
          setTimeout(resolve, 200);
        }
      }, 25);
    });
  }, []);

  // Render certificate on an offscreen canvas and return a data URL
  const renderCertificateToDataUrl = useCallback(
    async (data: VerificationData): Promise<string> => {
      const { certificateConfig } = data;

      // Fetch image as blob to avoid CORS
      const response = await fetch(certificateConfig.imagePath);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Rule-based styling logic
            const applyRuleBasedStyling = (
              fieldType: string,
              text: string,
              basePosition: FieldPosition,
            ) => {
              const position = { ...basePosition };

              switch (fieldType) {
                case "recipientName":
                  if (!position.fontWeight) position.fontWeight = "bold";
                  if (!position.fontFamily) position.fontFamily = "Montserrat";
                  if (!position.color) position.color = "#000000";
                  break;
                case "rank":
                  if (!position.fontWeight) position.fontWeight = "bold";
                  if (!position.fontFamily) position.fontFamily = "Roboto";
                  if (!position.color) position.color = "#000000";
                  if (
                    text.toLowerCase().includes("1st") ||
                    text.toLowerCase().includes("first")
                  ) {
                    if (!position.fontStyle) position.fontStyle = "italic";
                  }
                  break;
                case "organisationName":
                  if (!position.fontFamily) position.fontFamily = "Inter";
                  if (!position.fontWeight) position.fontWeight = "normal";
                  if (!position.color) position.color = "#000000";
                  break;
                case "certificateLink":
                  if (!position.fontFamily) position.fontFamily = "Open Sans";
                  if (!position.textDecoration)
                    position.textDecoration = "underline";
                  if (!position.color) position.color = "#000000";
                  break;
                case "certificateQR":
                  if (!position.fontFamily) position.fontFamily = "Inter";
                  if (!position.fontWeight) position.fontWeight = "bold";
                  if (!position.color) position.color = "#000000";
                  break;
                default:
                  if (!position.fontFamily) position.fontFamily = "Inter";
                  if (!position.color) position.color = "#000000";
                  break;
              }
              return position;
            };

            // Helper: draw centered text in a field
            const drawCenteredText = (
              text: string,
              pos: FieldPosition,
              maxFontSize = 72,
              fieldType?: string,
            ) => {
              const styledPosition = fieldType
                ? applyRuleBasedStyling(fieldType, text, pos)
                : pos;

              const fontFamily = styledPosition.fontFamily || "Inter";
              const fontWeight = styledPosition.fontWeight || "normal";
              const fontStyle = styledPosition.fontStyle || "normal";
              const textDecoration = styledPosition.textDecoration || "none";
              const color = styledPosition.color || "#000000";

              const avgCharWidth = 0.6;
              let fontSize = Math.min(
                styledPosition.width / (text.length * avgCharWidth),
                styledPosition.height * 0.8,
                maxFontSize,
              );
              fontSize = Math.max(fontSize, 8);

              ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
              let metrics = ctx.measureText(text);
              const maxWidth = styledPosition.width * 0.9;
              const maxHeight = styledPosition.height * 0.8;

              if (metrics.width > maxWidth || fontSize > maxHeight) {
                const ratio = Math.min(
                  maxWidth / metrics.width,
                  maxHeight / fontSize,
                );
                fontSize *= ratio;
                ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
                metrics = ctx.measureText(text);
              }

              const textX =
                styledPosition.x + (styledPosition.width - metrics.width) / 2;
              const textY =
                styledPosition.y +
                (styledPosition.height + metrics.actualBoundingBoxAscent) / 2;

              ctx.fillStyle = color;
              ctx.fillText(text, textX, textY);

              if (textDecoration === "underline") {
                const underlineY = textY + 2;
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(textX, underlineY);
                ctx.lineTo(textX + metrics.width, underlineY);
                ctx.lineWidth = Math.max(1, fontSize / 20);
                ctx.stroke();
              }
            };

            // Helper to draw QR code
            const drawQRCode = async (
              dataQR: string,
              position: FieldPosition,
            ) => {
              try {
                const qrDataUrl = await QRCode.toDataURL(dataQR, {
                  width: Math.min(position.width, position.height),
                  margin: 1,
                  color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                  },
                });

                const qrImg = new window.Image();
                qrImg.crossOrigin = "anonymous";
                await new Promise<void>((resolveQR, rejectQR) => {
                  qrImg.onload = () => resolveQR();
                  qrImg.onerror = rejectQR;
                  qrImg.src = qrDataUrl;
                });

                const qrSize = Math.min(position.width, position.height) * 0.8;
                const qrX = position.x + (position.width - qrSize) / 2;
                const qrY = position.y + (position.height - qrSize) / 2;

                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
              } catch (error) {
                console.error("Error generating QR code:", error);
                drawCenteredText(
                  `[QR: ${dataQR}]`,
                  position,
                  16,
                  "certificateQR",
                );
              }
            };

            // Render fields with sample data
            const { validFields } = certificateConfig;

            if (validFields.recipientName) {
              drawCenteredText(
                SAMPLE_NAME,
                validFields.recipientName,
                100,
                "recipientName",
              );
            }
            if (validFields.organisationName) {
              drawCenteredText(
                data.organisation,
                validFields.organisationName,
                72,
                "organisationName",
              );
            }
            if (validFields.rank) {
              drawCenteredText(SAMPLE_RANK, validFields.rank, 150, "rank");
            }
            if (validFields.certificateLink) {
              const verifyUrl =
                typeof window !== "undefined"
                  ? `${window.location.origin}/verify/${data.uuid}`
                  : data.uuid;
              drawCenteredText(
                verifyUrl,
                validFields.certificateLink,
                24,
                "certificateLink",
              );
            }
            if (validFields.certificateQR) {
              const verifyUrl =
                typeof window !== "undefined"
                  ? `${window.location.origin}/verify/${data.uuid}`
                  : data.uuid;
              await drawQRCode(verifyUrl, validFields.certificateQR);
            }

            const dataUrl = canvas.toDataURL("image/png");
            URL.revokeObjectURL(objectUrl);
            resolve(dataUrl);
          } catch (err) {
            URL.revokeObjectURL(objectUrl);
            reject(err);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Failed to load certificate template image"));
        };

        img.src = objectUrl;
      });
    },
    [],
  );

  // Run verification on mount
  useEffect(() => {
    if (!uuid) return;

    const verify = async () => {
      try {
        // Animate step 1
        await animateProgress(0);

        const result = await certificateService.verifyCertificateFull(uuid);

        if (!result.success || !result.verified || !result.data) {
          setSteps((prev) =>
            prev.map((step, i) =>
              i === 0
                ? {
                    ...step,
                    hasError: true,
                    progress: 100,
                    isCompleted: false,
                  }
                : step,
            ),
          );
          setErrorMessage(result.message || "Verification failed");
          setStatus("error");
          return;
        }

        // Steps 2 and 3 (animated)
        setSteps((prev) =>
          prev.map((step, i) =>
            i === 1
              ? {
                  ...step,
                  completedText: `Certificate issued on ${new Date(result.data!.certificateGeneratedDate).toLocaleDateString()}`,
                }
              : i === 2
                ? {
                    ...step,
                    completedText: `${result.data!.issuerName} • ${result.data!.organisation} • ${result.data!.eventName}`,
                  }
                : step,
          ),
        );
        await animateProgress(1);
        await animateProgress(2);

        setVerificationData(result.data);
        setStatus("success");

        // Render certificate on offscreen canvas → data URL
        try {
          const dataUrl = await renderCertificateToDataUrl(result.data);
          setCertificateDataUrl(dataUrl);
        } catch (renderErr) {
          console.error("Certificate rendering failed:", renderErr);
          // Still show success state, just without the certificate image
        }
      } catch {
        setErrorMessage(
          "Network error. Please check your connection and try again.",
        );
        setStatus("error");
      }
    };

    verify();
  }, [uuid, animateProgress, renderCertificateToDataUrl]);

  const handleDownload = () => {
    if (!certificateDataUrl) return;
    const link = document.createElement("a");
    link.download = `certificate-sample-${uuid.slice(0, 8)}.png`;
    link.href = certificateDataUrl;
    link.click();
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden">
      {/* Main container - full height with flex layout */}
      <div className="flex h-full w-full">
        {/* LEFT SIDE - Details Panel */}
        <div className="w-[45%] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-4.5 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  CertiNova
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Secure Certificate Verification
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable content area for left side (if needed) */}
          <div className="flex-1 overflow-y-auto px-8 py-3 space-y-6">
            {/* UUID Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                Verification ID
              </p>
              <code className="text-sm font-mono text-gray-700 break-all">
                {uuid}
              </code>
            </motion.div>

            {/* Verification Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verification Progress
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 flex-shrink-0 relative">
                      <svg
                        viewBox="0 0 40 40"
                        className="w-full h-full -rotate-90"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke={
                            step.hasError
                              ? "#ef4444"
                              : step.isCompleted
                                ? "#10b981"
                                : "#3b82f6"
                          }
                          strokeWidth="2.5"
                          strokeDasharray={`${step.progress} ${100 - step.progress}`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {step.hasError ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : step.isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600">
                            {Math.round(step.progress)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${step.hasError ? "text-red-700" : step.isCompleted ? "text-gray-800" : "text-gray-600"}`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${step.hasError ? "text-red-500" : step.isCompleted ? "text-emerald-600" : "text-gray-400"}`}
                      >
                        {step.isCompleted
                          ? step.completedText
                          : step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Error State */}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 rounded-xl p-5 border border-red-200"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                  <ShieldX className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-base font-bold text-red-800 text-center mb-1">
                  Verification Failed
                </h3>
                <p className="text-red-600 text-xs text-center mb-4">
                  {errorMessage}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Return to CertiNova
                </Link>
              </motion.div>
            )}

            {/* Loading State */}
            {status === "loading" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8"
              >
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">
                  Verifying certificate...
                </span>
              </motion.div>
            )}

            {/* Success - Event Details */}
            {status === "success" && verificationData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Verified Badge */}
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800">
                        Certificate Verified ✓
                      </h3>
                      <p className="text-xs text-emerald-600">
                        Securely issued by CertiNova
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-3 h-3 text-blue-600" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Organisation
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {verificationData.organisation}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-indigo-600" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Issued By
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {verificationData.issuerName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-3 h-3 text-violet-600" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Event
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {verificationData.eventName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                        Event Date
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(verificationData.eventDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {/* Metadata Footer */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Generated:{" "}
                    {new Date(
                      verificationData.certificateGeneratedDate,
                    ).toLocaleDateString()}{" "}
                    | Verified:{" "}
                    {new Date(verificationData.verifiedAt).toLocaleString()} |
                    Powered by CertiNova — Secure Verification
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Certificate Preview */}
        <div className="w-[55%] bg-gray-50 flex flex-col overflow-hidden">
          {/* Certificate Header */}
          <div className="border-b border-gray-200 px-8 py-5 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  Sample Certificate Preview
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {status === "success"
                    ? `Issued to (Sample Name): ${SAMPLE_NAME}`
                    : "Sample certificate preview"}
                </p>
              </div>
              {status === "success" && certificateDataUrl && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </div>

          {/* Certificate Display Area - Centered with scroll only if needed */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            {status === "loading" ? (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Rendering certificate...
                </p>
              </div>
            ) : status === "error" ? (
              <div className="text-center max-w-sm">
                <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  Certificate preview unavailable
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Verification failed
                </p>
              </div>
            ) : certificateDataUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <img
                  src={certificateDataUrl}
                  alt="Certificate"
                  className="w-full max-h-[calc(100vh-140px)] object-contain rounded-xl shadow-2xl border border-gray-200"
                />
              </motion.div>
            ) : (
              <div className="text-center">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  Certificate will appear here
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Complete verification to preview
                </p>
              </div>
            )}
          </div>

          {/* Optional subtle watermark */}
          {status === "success" && certificateDataUrl && (
            <div className="pb-4 text-center">
              <p className="text-[10px] text-gray-400">
                Official document • Verification ID: {uuid}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
