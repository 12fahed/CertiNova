import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Don't configure Cloudinary during import, wait for first use
let isConfigured = false;

const ensureConfigured = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
    console.log('Cloudinary configured with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
  }
};

// Create storage that configures Cloudinary on first use
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Ensure configuration happens before upload
    ensureConfigured();
    
    return {
      folder: 'certinova/certificate-templates',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
      public_id: (() => {
        const timestamp = Date.now();
        const originalName = file.originalname.split('.')[0];
        return `template-${timestamp}-${originalName}`;
      })(),
    };
  },
});

// Create multer upload middleware
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Ensure Cloudinary is configured
    ensureConfigured();
    
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default cloudinary;
