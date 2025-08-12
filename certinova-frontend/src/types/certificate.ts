export interface CertificateConfig {
  id: string;
  eventId: string;
  imagePath: string;
  validFields: ValidFields;
  createdAt: string;
  updatedAt: string;
}

export interface ValidFields {
  recipientName?: [number, number, number, number]; // [x, y, width, height]
  organisationName?: [number, number, number, number];
  certificateLink?: [number, number, number, number];
  certificateQR?: [number, number, number, number];
  rank?: [number, number, number, number];
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
      fontSize?: number
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
      fontSize?: number
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
      fontSize?: number
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
      fontSize?: number
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
      fontSize?: number
      fontFamily?: string
      fontWeight?: string
      fontStyle?: string
      textDecoration?: string
    }
  }
}