import { ValidFields } from './certificate';

export interface CertificateConfigData {
  id: string;
  imagePath: string;
  validFields: ValidFields;
  createdAt: string;
  updatedAt: string;
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
