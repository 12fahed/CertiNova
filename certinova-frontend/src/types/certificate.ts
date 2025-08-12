export interface CertificateConfig {
  id: string;
  eventId: string;
  imagePath: string;
  validFields: ValidFields;
  createdAt: string;
  updatedAt: string;
}

export interface ValidFields {
  recipientName?: [number, number];
  organisationName?: [number, number];
  certificateLink?: [number, number];
  certificateQR?: [number, number];
  rank?: [number, number];
}

export interface CertificateConfigRequest {
  eventId: string;
  imagePath: string;
  validFields: ValidFields;
}

export interface CertificateConfigResponse {
  success: boolean;
  message: string;
  data?: {
    certificateConfig: CertificateConfig & {
      eventId: {
        id: string;
        eventName: string;
        organisation: string;
        issuerName: string;
      };
    };
  };
  errors?: string[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    originalName: string;
    path: string;
    fullUrl: string;
    size: number;
    mimetype: string;
  };
}

// For the frontend editor compatibility
export interface CertificateEditorField {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CertificateEditorFields {
  recipientName?: CertificateEditorField;
  organizationName?: CertificateEditorField;
  certificateLink?: CertificateEditorField;
  certificateQR?: CertificateEditorField;
  rank?: CertificateEditorField;
}

export interface Certificate {
  id?: string;
  name: string;
  event: string;
  date: string;
  image?: string;
  eventId?: string;
  fields: CertificateEditorFields;
}
