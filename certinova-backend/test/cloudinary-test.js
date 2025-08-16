import cloudinary from '../src/config/cloudinary.js';

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  console.log('=== Cloudinary Configuration Test ===');
  
  // Check environment variables directly
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  console.log('Environment Variables:');
  console.log('Cloud Name:', cloudName ? `✓ Set (${cloudName})` : '✗ Missing');
  console.log('API Key:', apiKey ? '✓ Set' : '✗ Missing');
  console.log('API Secret:', apiSecret ? '✓ Set' : '✗ Missing');
  
  if (!cloudName || !apiKey || !apiSecret) {
    console.log('\n⚠️  WARNING: Please update your .env file with Cloudinary credentials');
    console.log('Required environment variables:');
    console.log('- CLOUDINARY_CLOUD_NAME');
    console.log('- CLOUDINARY_API_KEY');
    console.log('- CLOUDINARY_API_SECRET');
  } else {
    console.log('\n✅ Cloudinary environment variables are set correctly!');
  }
  
  console.log('==========================================\n');
};

export default testCloudinaryConfig;
