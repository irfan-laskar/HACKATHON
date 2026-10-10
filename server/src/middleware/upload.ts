import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';

const uploadDir = path.join(__dirname, '../../uploads');
const videosDir = path.join(uploadDir, 'videos');
const imagesDir = path.join(uploadDir, 'images');

// Ensure upload directories exist
[uploadDir, videosDir, imagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, videosDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for security
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

  if (allowedVideoTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed: MP4, WebM, MOV, JPG, PNG, WEBP, SVG'));
  }
};

export const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150MB limit
  },
  fileFilter,
});

// Helper to upload a local file to Cloudinary if configured, otherwise returns local static URL
export const processUploadedFile = async (
  file: Express.Multer.File,
  resourceType: 'video' | 'image' | 'auto' = 'auto'
): Promise<string> => {
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: `marketsphere/${resourceType}s`,
      });
      // Remove temporary disk file after uploading to cloud
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (err) {
      console.warn('⚠️ Cloudinary upload failed, falling back to local file storage.', err);
    }
  }

  // Fallback: return static server URL
  const subFolder = file.mimetype.startsWith('video/') ? 'videos' : 'images';
  return `/uploads/${subFolder}/${file.filename}`;
};
