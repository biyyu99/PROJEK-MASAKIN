import multer from 'multer';
import { AppError } from '../utils/AppError';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// File disimpan di memori sementara lalu langsung dikirim ke Cloudinary,
// jadi tidak ada file yang menumpuk di disk server.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new AppError(400, 'Format gambar harus JPG, PNG, atau WEBP'));
    }
    cb(null, true);
  },
});
