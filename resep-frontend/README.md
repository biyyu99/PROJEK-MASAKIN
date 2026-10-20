# Masakin - Frontend Aplikasi Resep Masakan

Frontend modern untuk platform berbagi resep masakan Nusantara dan Internasional, dibangun dengan **Next.js (App Router)**, **TypeScript**, dan **Vanilla CSS**.

---

## 🌟 Fitur Utama

1. **Jelajah & Filter Resep**:
   - Pencarian instan berdasarkan judul resep, deskripsi, atau bahan makanan.
   - Filter kategori (Sarapan, Makan Siang, Makan Malam, Nusantara, Dessert, dll).
   - Filter tingkat kesulitan (Mudah, Sedang, Sulit) dan waktu memasak.
   - Pengurutan: Terbaru, Terlama, Tercepat.
2. **Detail Resep Interaktif**:
   - Checklist bahan interaktif (dapat dicentang saat menyiapkan bumbu).
   - Panduan tahapan memasak bernomor yang dapat ditandai selesai satu per satu.
   - Informasi nutrisi/porsi dan waktu memasak.
3. **Pembatasan Hak Akses Edit & Hapus (Strict Authorization)**:
   - **Hanya pemilik akun pembuat resep yang dapat melihat dan menggunakan tombol Edit & Hapus.**
   - User lain atau tamu hanya dapat membaca resep.
   - Jika pengguna lain mencoba mengakses URL `/recipe/[id]/edit`, sistem akan menolak akses dengan layar **403 Forbidden** dan backend akan menolaknya dengan error otorisasi.
4. **Tulis Resep Baru**:
   - Form dinamis untuk menambah/menghapus baris bahan makanan dan langkah memasak.
   - Pratinjau foto masakan sebelum diunggah.
5. **Dapur Pribadi (Resep Saya)**:
   - Dashboard untuk memantau semua resep yang pernah diterbitkan oleh akun pengguna.
6. **Desain Modern & Responsif**:
   - Skema warna kuliner premium (*culinary amber/warm orange & fresh emerald*).
   - Glassmorphic navbar.
   - Dukungan tema Gelap (Dark Mode) dan Terang (Light Mode).
   - Modal autentikasi instan (Login & Register).

---

## 🚀 Cara Menjalankan

### 1. Jalankan Backend (Port 3000)
Pastikan MySQL/XAMPP sudah aktif, lalu di terminal backend:
```bash
cd d:\PROJEK-masakin\resep-backend\resep-backend
npm run dev
```

### 2. Jalankan Frontend (Port 3001)
Buka terminal baru di folder frontend:
```bash
cd d:\PROJEK-masakin\resep-frontend
npm run dev
```

Buka browser di: **[http://localhost:3001](http://localhost:3001)**
