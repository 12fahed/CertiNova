import { 
  CertificateConfigRequest, 
  CertificateConfigResponse, 
  UploadResponse,
  GeneratedCertificateResponse,
  CertificatesListResponse
} from '@/types/certificate';
import config from '@/config/env';

const API_BASE_URL = config.API_BASE_URL;

class CertificateService {
  private baseURL = `${config.API_BASE_URL}/certificates`;

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

  // Store generated certificate data with password encryption
  async storeGeneratedCertificate(data: {
    certificateId: string;
    recipients: Array<{
      name: string;
      email?: string;
      rank?: string;
      uuid?: string;
    }>;
    generatedBy: string;
    password: string;
  }): Promise<GeneratedCertificateResponse> {
    return this.makeRequest('/certificates/storeGenerated', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<GeneratedCertificateResponse>;
  }

  // Get generated certificates (encrypted data, no password required)
  async getGeneratedCertificates(params?: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: 'all' | 'recent' | 'high-recipients' | 'with-rank' | 'without-rank';
    sortBy?: 'date' | 'recipients' | 'certificateId';
    sortOrder?: 'asc' | 'desc';
    generatedBy?: string;
  }): Promise<CertificatesListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.filter) searchParams.append('filter', params.filter);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params?.generatedBy) searchParams.append('generatedBy', params.generatedBy);

    const queryString = searchParams.toString();
    const url = queryString ? `/certificates/generated?${queryString}` : '/certificates/generated';

    return this.makeRequest(url, {
      method: 'GET',
    }) as Promise<CertificatesListResponse>;
  }

  // Decrypt and get generated certificates with password
  async getDecryptedGeneratedCertificates(params: {
    password: string;
    page?: number;
    limit?: number;
    search?: string;
    filter?: 'all' | 'recent' | 'high-recipients' | 'with-rank' | 'without-rank';
    sortBy?: 'date' | 'recipients' | 'certificateId';
    sortOrder?: 'asc' | 'desc';
    generatedBy?: string;
  }): Promise<CertificatesListResponse> {
    return this.makeRequest('/certificates/generated/decrypt', {
      method: 'POST',
      body: JSON.stringify(params),
    }) as Promise<CertificatesListResponse>;
  }

  // Verify UUID
  async verifyUUID(uuid: string): Promise<{
    success: boolean;
    verified: boolean;
    message: string;
    step: string;
    data?: {
      uuid: string;
      organisation: string;
      issuerName: string;
      eventName: string;
      eventDate: string;
      certificateGeneratedDate: string;
      certificateId: string;
      verificationId: string;
      isValid: boolean;
      verifiedAt: string;
    };
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/verify/${uuid}`, {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('UUID verification failed:', error);
      throw error;
    }
  }

  // Update recipient count immediately (before password confirmation)
  async updateRecipientCount(orgName: string, recipientCount: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await this.makeRequest('/certificates/update-recipient-count', {
        method: 'PATCH',
        body: JSON.stringify({ orgName, recipientCount }),
      });

      return response as { success: boolean; message: string };
    } catch (error) {
      console.error('Failed to update recipient count:', error);
      throw error;
    }
  }
}

export const certificateService = new CertificateService();
