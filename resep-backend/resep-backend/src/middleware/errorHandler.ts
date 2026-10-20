import { ErrorRequestHandler, RequestHandler } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} tidak ditemukan`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran gambar maksimal 2 MB'
        : `Upload gagal: ${err.message}`;
    return res.status(400).json({ message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Error MySQL: data duplikat (misalnya email)
  if (err && typeof err === 'object' && 'code' in err && err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Data sudah ada' });
  }

  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
};
