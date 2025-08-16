// Cloudinary configuration for frontend
export const CLOUDINARY_CONFIG = {
  cloudName: 'your_cloudinary_cloud_name', // Replace with your Cloudinary cloud name
  uploadPreset: 'certinova_templates', // You'll need to create this preset in Cloudinary
};

// Helper function to generate Cloudinary URLs with transformations
export const getCloudinaryUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) => {
  if (!publicId) return '';
  
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  
  const transformations = [];
  
  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  
  const transformationString = transformations.length > 0 ? `${transformations.join(',')}/` : '';
  
  return `${baseUrl}/${transformationString}${publicId}`;
};

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  if (!url) return '';
  
  // Extract public ID from Cloudinary URL
  const match = url.match(/\/v\d+\/(.+?)(\.|$)/);
  if (match) {
    return match[1];
  }
  
  // Fallback for URLs without version
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('.')[0];
};
