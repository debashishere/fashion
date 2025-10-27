import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder = 'bespoke-ai') => {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto'
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export {
  uploadToCloudinary,
  deleteFromCloudinary
};