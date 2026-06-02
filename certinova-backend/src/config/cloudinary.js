import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

let isConfigured = false;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  try {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    isConfigured = true;
    console.log('Cloudinary configured with cloud:', cloudName);
  } catch (error) {
    console.warn('Failed to initialize Cloudinary:', error.message);
    console.warn('Cloudinary-dependent features will be disabled.');
  }
} else {
  console.warn(
    'Cloudinary configuration is missing or incomplete. ' +
    'Cloudinary-dependent features (image upload, template deletion) will be disabled.'
  );
}

let upload;
if (isConfigured) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'certinova/certificate-templates',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
        public_id: `template-${Date.now()}-${file.originalname.split('.')[0]}`,
      };
    },
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });
} else {
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });
}

export { upload };

export const ensureConfigured = () => {
  if (!isConfigured) {
    console.warn('Cloudinary is not available. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
    return false;
  }
  return true;
};

export default cloudinary;