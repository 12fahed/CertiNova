"use client";

import React, { createContext, useContext, useState } from 'react';
import { CertificateConfig, CertificateConfigRequest, ValidFields, ValidField, CertificateEditorFields } from '@/types/certificate';
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

      if (response.success && response.data?.cloudinaryUrl) {
        toast.success('Certificate template uploaded successfully!');
        return response.data.cloudinaryUrl; // Return Cloudinary URL instead of path
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
    // console.log('convertEditorFieldsToValidFields - input:', editorFields);
    
    const validFields: ValidFields = {};
    
    // Convert each field from editor format to API format (keeping all properties)
    Object.entries(editorFields).forEach(([key, field]) => {
      // console.log(`Processing field ${key}:`, field);
      
      // Only include fields that have valid coordinates and dimensions
      if (field && 
          typeof field.x === 'number' && 
          typeof field.y === 'number' && 
          typeof field.width === 'number' && 
          typeof field.height === 'number' &&
          !isNaN(field.x) && 
          !isNaN(field.y) &&
          !isNaN(field.width) && 
          !isNaN(field.height) &&
          field.x >= 0 && 
          field.y >= 0 &&
          field.width > 0 && 
          field.height > 0) {
        
        const fieldKey = key === 'organizationName' ? 'organisationName' : key as keyof ValidFields;
        
        // Create the complete field object with styling properties
        const validField: ValidField = {
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
        };

        // Add styling properties if they exist
        if (field.fontFamily !== undefined) {
          validField.fontFamily = field.fontFamily;
        }
        if (field.fontWeight !== undefined) {
          validField.fontWeight = field.fontWeight;
        }
        if (field.fontStyle !== undefined) {
          validField.fontStyle = field.fontStyle;
        }
        if (field.textDecoration !== undefined) {
          validField.textDecoration = field.textDecoration;
        }
        if (field.color !== undefined) {
          validField.color = field.color;
        }

        validFields[fieldKey] = validField;
        // console.log(`Added field ${fieldKey}:`, validField);
      } else {
        // console.log(`Skipping field ${key} - invalid or missing coordinates:`, field);
      }
    });

    // console.log('convertEditorFieldsToValidFields - output:', validFields);
    return validFields;
  };

  // Helper function to convert API valid fields to editor fields format
  const convertValidFieldsToEditorFields = (validFields: ValidFields): CertificateEditorFields => {
    const editorFields: CertificateEditorFields = {};
    
    // Convert each field from API format to editor format
    Object.entries(validFields).forEach(([key, field]) => {
      if (field && typeof field === 'object' && 'x' in field) {
        const fieldKey = key === 'organisationName' ? 'organizationName' : key as keyof CertificateEditorFields;
        editorFields[fieldKey] = {
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
          fontFamily: field.fontFamily,
          fontWeight: field.fontWeight,
          fontStyle: field.fontStyle,
          textDecoration: field.textDecoration,
          color: field.color,
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
