const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storageMode = process.env.STORAGE_MODE || 'local';

let upload;

if (storageMode === 's3') {
  // AWS S3 Configuration (only load if using S3)
  let AWS, multerS3;
  try {
    AWS = require('aws-sdk');
    multerS3 = require('multer-s3');
  } catch (err) {
    console.error('[UPLOAD] ERROR: aws-sdk and multer-s3 not installed');
    console.error('[UPLOAD] Run: npm install aws-sdk multer-s3');
    throw err;
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });

  const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        timeUploaded: new Date().toISOString()
      });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `gallery/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safeName);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      const err = new Error('Only image files are allowed');
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  };

  upload = multer({
    storage: s3Storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB for S3
  });

  console.log('[UPLOAD] Configured for AWS S3 storage');
} else {
  // Local Disk Storage (Development)
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'gallery');
  fs.mkdirSync(uploadDir, { recursive: true });

  const localStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, safeName);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      const err = new Error('Only image files are allowed');
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  };

  upload = multer({
    storage: localStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB for local
  });

  console.log('[UPLOAD] Configured for local disk storage (development mode)');
}

module.exports = upload;
module.exports.storageMode = storageMode;

