export interface CertificateConfig {
  id: string;
  eventId: string;
  imagePath: string;
  validFields: ValidFields;
  createdAt: string;
  updatedAt: string;
}

export interface ValidFields {
  recipientName?: ValidField;
  organisationName?: ValidField;
  certificateLink?: ValidField;
  certificateQR?: ValidField;
  rank?: ValidField;
}

export interface ValidField {
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
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  color?: string;
}

export interface CertificateEditorFields {
  recipientName?: CertificateEditorField;
  organizationName?: CertificateEditorField;
  certificateLink?: CertificateEditorField;
  certificateQR?: CertificateEditorField;
  rank?: CertificateEditorField;
}

// Generated certificate types
export interface GeneratedCertificateRecipient {
  name: string;
  email?: string;
  rank?: string;
}

export interface GeneratedCertificateRequest {
  certificateId: string;
  recipients: GeneratedCertificateRecipient[];
  generatedBy: string;
}

export interface GeneratedCertificateData {
  id: string;
  certificateId: string;
  noOfRecipient: number;
  rank: boolean;
  date: string;
  recipients: GeneratedCertificateRecipient[];
}

export interface GeneratedCertificateResponse {
  success: boolean;
  message: string;
  data?: GeneratedCertificateData;
}

// Types for the certificates page
export interface EventDetails {
  _id: string;
  eventName: string;
  organisation: string;
  issuerName: string;
}

export interface GeneratedByUser {
  _id: string;
  name: string;
  email: string;
  organisation: string;
}

export interface CertificateListItem {
  id: string;
  serialNumber: number;
  date: string;
  certificateId: string;
  eventDetails: EventDetails | null;
  recipients: GeneratedCertificateRecipient[];
  noOfRecipient: number;
  rank: boolean;
  generatedId: string;
  generatedBy: GeneratedByUser | null;
  createdAt: string;
  updatedAt: string;
  encrypted?: boolean; // Indicates if data is encrypted
}

export interface CertificatesListResponse {
  success: boolean;
  message: string;
  data?: {
    certificates: CertificateListItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
    };
    requiresDecryption?: boolean;
  };
}

