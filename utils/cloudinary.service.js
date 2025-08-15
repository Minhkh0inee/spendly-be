const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (buffer, options = {}) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: 'spendly-receipts',
          resource_type: 'image',
          format: 'jpg',
          quality: 'auto:good',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:good' }
          ],
          timeout: options.timeout || 30000,
          ...options
        };

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error(`Cloudinary upload error (attempt ${attempt + 1}):`, error);
              reject(error);
            } else {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                created_at: result.created_at
              });
            }
          }
        );

        uploadStream.end(buffer);

        setTimeout(() => {
          uploadStream.destroy();
          reject(new Error('Upload timeout exceeded'));
        }, uploadOptions.timeout);
      });
    } catch (error) {
      attempt++;
      console.error(`Upload attempt ${attempt} failed:`, error.message);
      
      if (attempt >= maxRetries) {
        console.error('Upload to Cloudinary failed after all retries');
        throw new Error('Failed to upload image to Cloudinary after multiple attempts');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};


module.exports = {
  uploadCloudinary,
  cloudinary
};