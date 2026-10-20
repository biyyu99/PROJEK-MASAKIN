import cloudinary from '../config/cloudinary';
import { env } from '../config/env';
import { AppError } from './AppError';

export interface UploadedImage {
  url: string;
  publicId: string;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  );
}

export function uploadImage(buffer: Buffer): Promise<UploadedImage> {
  if (!isCloudinaryConfigured()) {
    throw new AppError(
      500,
      'Layanan upload gambar (Cloudinary) belum dikonfigurasi di file .env server',
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'resep-masakan',
        resource_type: 'image',
        transformation: [{ width: 1200, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Upload gambar gagal'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteImage(publicId: string | null | undefined): Promise<void> {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Gagal hapus gambar lama tidak boleh menggagalkan request utama
    console.error('Gagal menghapus gambar di Cloudinary:', err);
  }
}
