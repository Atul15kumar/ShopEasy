const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer or base64 to Cloudinary
 * @param {Buffer|string} fileSource - Buffer or base64 string
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = 'shopeasy/products') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('[Cloudinary Warning] Credentials not configured in .env. Returning placeholder URL.');
      return resolve('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Error]', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
