export interface CertificateConfigData {
  id: string;
  imagePath: string;
  validFields: {
    recipientName?: [number, number, number, number];
    organisationName?: [number, number, number, number];
    certificateLink?: [number, number, number, number];
    certificateQR?: [number, number, number, number];
    rank?: [number, number, number, number];
  };
}

export interface Event {
  id: string;
  organisation: string;
  organisationID: string;
  date: string;
  eventName: string;
  issuerName: string;
  createdAt: string;
  updatedAt: string;
  certificateConfig?: CertificateConfigData | null;
}

export interface EventRequest {
  organisation: string;
  organisationID: string;
  date?: string;
  eventName: string;
  issuerName: string;
}

export interface EventResponse {
  success: boolean;
  message: string;
  data?: {
    event: Event;
  };
  errors?: string[];
}

export interface EventsListResponse {
  success: boolean;
  message: string;
  data?: {
    events: Event[];
    count: number;
  };
  errors?: string[];
}
