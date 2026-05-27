"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";

export interface Certificate {
  id: string;
  name: string;
  event: string;
  date: string;
  image: string;
  fields: {
    recipientName?: { x: number; y: number; width: number; height: number };
    organizationName?: { x: number; y: number; width: number; height: number };
    certificateLink?: { x: number; y: number; width: number; height: number };
    certificateQR?: { x: number; y: number; width: number; height: number };
  };
}

interface CertificateEditorProps {
  certificate: Partial<Certificate>;
  onSave: (certificate: Certificate) => void;
  onClose: () => void;
  isEditing?: boolean;
}

export type FieldType = "recipientName" | "organizationName" | "certificateLink" | "certificateQR";

export function CertificateEditor({ certificate, onSave, onClose, isEditing = false }: CertificateEditorProps) {
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [fields, setFields] = useState<any>({});
  const [selectedFieldForToolbar, setSelectedFieldForToolbar] = useState<FieldType | null>(null);
  const [fontFamilies, setFontFamilies] = useState<string>("Helvetica");

  const updateFieldStyle = (fieldType: FieldType, styleUpdate: any) => {
    setFields((prev: any) => ({
      ...prev,
      [fieldType]: { ...prev[fieldType], ...styleUpdate }
    }));
  };

  const handleSave = () => {
    if (!uploadedImagePath && !certificate.image) {
      toast("Upload Required", {
        description: "Please upload a certificate template first."
      });
      return;
    }

    const defaultFields = {
      recipientName: { x: 150, y: 280, width: 500, height: 50 },
      organizationName: { x: 150, y: 340, width: 500, height: 40 },
      certificateLink: { x: 50, y: 520, width: 300, height: 20 },
      certificateQR: { x: 700, y: 450, width: 90, height: 90 }
    };

    const savedCertificate: Certificate = {
      id: certificate.id || Date.now().toString(),
      name: certificate.name || "New Template Layout",
      event: certificate.event || "Default Event",
      date: certificate.date || new Date().toLocaleDateString(),
      image: uploadedImagePath || certificate.image || "", 
      fields: fields && Object.keys(fields).length > 0 ? fields : defaultFields
    };

    onSave(savedCertificate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-background max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {isEditing ? "Edit Certificate Template" : "Create Certificate Template"}
            </h2>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>

          {/* Canvas Area */}
          <div className="border border-dashed rounded-lg p-12 text-center mb-6 bg-muted/40 relative min-h-[300px] flex flex-col items-center justify-center">
            {uploadedImagePath || certificate.image ? (
              <img 
                src={uploadedImagePath || certificate.image} 
                alt="Template Preview" 
                className="max-w-full h-auto rounded"
              />
            ) : (
              <div>
                <p className="text-muted-foreground mb-2">No template image uploaded yet</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedImagePath(URL.createObjectURL(file));
                    }
                  }}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Certificate" : "Save Certificate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}