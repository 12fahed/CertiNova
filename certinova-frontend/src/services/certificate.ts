import { CertificateConfigRequest, CertificateConfigResponse, UploadResponse } from '@/types/certificate';

const API_BASE_URL = 'http://localhost:5000/api';

class CertificateService {
  private baseURL = 'http://localhost:5000/api/certificates';

  private async makeRequest(endpoint: string, options: RequestInit): Promise<unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Upload certificate template
  async uploadTemplate(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await fetch(`${this.baseURL}/upload-template`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload certificate template failed:', error);
      throw error;
    }
  }

  // Add certificate configuration
  async addCertificateConfig(configData: CertificateConfigRequest): Promise<CertificateConfigResponse> {
    console.log('API Request - addCertificateConfig data:', JSON.stringify(configData, null, 2));
    return this.makeRequest('/certificates/addCertificateConfig', {
      method: 'POST',
      body: JSON.stringify(configData),
    }) as Promise<CertificateConfigResponse>;
  }

  async getCertificateConfig(eventId: string): Promise<CertificateConfigResponse> {
    return this.makeRequest(`/certificates/config/${eventId}`, {
      method: 'GET',
    }) as Promise<CertificateConfigResponse>;
  }

  async updateCertificateConfig(configId: string, configData: Partial<CertificateConfigRequest>): Promise<CertificateConfigResponse> {
    return this.makeRequest(`/certificates/config/${configId}`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    }) as Promise<CertificateConfigResponse>;
  }
}

export const certificateService = new CertificateService();
