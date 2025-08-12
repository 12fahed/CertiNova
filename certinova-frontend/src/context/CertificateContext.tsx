"use client";

import React, { createContext, useContext, useState } from 'react';
import { CertificateConfig, CertificateConfigRequest, ValidFields, CertificateEditorFields } from '@/types/certificate';
import { certificateService } from '@/services/certificate';
import { toast } from 'sonner';

interface CertificateContextType {
  certificates: CertificateConfig[];
  isLoading: boolean;
  createCertificateConfig: (configData: CertificateConfigRequest) => Promise<CertificateConfig | null>;
  getCertificateConfig: (eventId: string) => Promise<CertificateConfig | null>;
  updateCertificateConfig: (configId: string, configData: Partial<CertificateConfigRequest>) => Promise<CertificateConfig | null>;
  uploadTemplate: (file: File) => Promise<string | null>;
  convertEditorFieldsToValidFields: (editorFields: CertificateEditorFields) => ValidFields;
  convertValidFieldsToEditorFields: (validFields: ValidFields) => CertificateEditorFields;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
};

interface CertificateProviderProps {
  children: React.ReactNode;
}

export const CertificateProvider: React.FC<CertificateProviderProps> = ({ children }) => {
  const [certificates] = useState<CertificateConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createCertificateConfig = async (configData: CertificateConfigRequest): Promise<CertificateConfig | null> => {
    try {
      setIsLoading(true);
      const response = await certificateService.addCertificateConfig(configData);

      if (response.success && response.data?.certificateConfig) {
        const newConfig = response.data.certificateConfig;
        toast.success('Certificate configuration saved successfully!');
        return newConfig;
      } else {
        const errorMessage = response.errors ? response.errors.join(', ') : response.message;
        toast.error(errorMessage || 'Failed to save certificate configuration');
        return null;
      }
    } catch (error: unknown) {
      console.error('Create certificate config error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save certificate configuration';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCertificateConfig = async (eventId: string): Promise<CertificateConfig | null> => {
    try {
      setIsLoading(true);
      const response = await certificateService.getCertificateConfig(eventId);

      if (response.success && response.data?.certificateConfig) {
        return response.data.certificateConfig;
      } else {
        // Don't show error toast for not found, as it's expected behavior
        if (response.message?.includes('not found')) {
          return null;
        }
        toast.error(response.message || 'Failed to load certificate configuration');
        return null;
      }
    } catch (error: unknown) {
      console.error('Get certificate config error:', error);
      // Don't show error toast for network errors when config doesn't exist
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCertificateConfig = async (configId: string, configData: Partial<CertificateConfigRequest>): Promise<CertificateConfig | null> => {
    try {
      setIsLoading(true);
      const response = await certificateService.updateCertificateConfig(configId, configData);

      if (response.success && response.data?.certificateConfig) {
        const updatedConfig = response.data.certificateConfig;
        toast.success('Certificate configuration updated successfully!');
        return updatedConfig;
      } else {
        const errorMessage = response.errors ? response.errors.join(', ') : response.message;
        toast.error(errorMessage || 'Failed to update certificate configuration');
        return null;
      }
    } catch (error: unknown) {
      console.error('Update certificate config error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update certificate configuration';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadTemplate = async (file: File): Promise<string | null> => {
    try {
      setIsLoading(true);
      const response = await certificateService.uploadTemplate(file);

      if (response.success && response.data?.path) {
        toast.success('Certificate template uploaded successfully!');
        return response.data.path;
      } else {
        toast.error(response.message || 'Failed to upload certificate template');
        return null;
      }
    } catch (error: unknown) {
      console.error('Upload template error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload certificate template';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert editor fields to API valid fields format
  const convertEditorFieldsToValidFields = (editorFields: CertificateEditorFields): ValidFields => {
    console.log('convertEditorFieldsToValidFields - input:', editorFields);
    
    const validFields: ValidFields = {};
    
    // Convert each field from {x, y, width, height} to [x, y] format
    Object.entries(editorFields).forEach(([key, field]) => {
      console.log(`Processing field ${key}:`, field);
      
      // Only include fields that have valid coordinates
      if (field && 
          typeof field.x === 'number' && 
          typeof field.y === 'number' && 
          !isNaN(field.x) && 
          !isNaN(field.y)) {
        const fieldKey = key === 'organizationName' ? 'organisationName' : key as keyof ValidFields;
        validFields[fieldKey] = [field.x, field.y];
        console.log(`Added field ${fieldKey}:`, [field.x, field.y]);
      } else {
        console.log(`Skipping field ${key} - invalid or missing coordinates:`, field);
      }
    });

    console.log('convertEditorFieldsToValidFields - output:', validFields);
    return validFields;
  };

  // Helper function to convert API valid fields to editor fields format
  const convertValidFieldsToEditorFields = (validFields: ValidFields): CertificateEditorFields => {
    const editorFields: CertificateEditorFields = {};
    
    // Convert each field from [x, y] to {x, y, width, height} format
    Object.entries(validFields).forEach(([key, coords]) => {
      if (coords) {
        const fieldKey = key === 'organisationName' ? 'organizationName' : key as keyof CertificateEditorFields;
        editorFields[fieldKey] = {
          x: coords[0],
          y: coords[1],
          width: 200, // Default width
          height: 40, // Default height
        };
      }
    });

    return editorFields;
  };

  const value: CertificateContextType = {
    certificates,
    isLoading,
    createCertificateConfig,
    getCertificateConfig,
    updateCertificateConfig,
    uploadTemplate,
    convertEditorFieldsToValidFields,
    convertValidFieldsToEditorFields,
  };

  return <CertificateContext.Provider value={value}>{children}</CertificateContext.Provider>;
};
