# Resep Backend

API aplikasi resep masakan. Stack: Express + TypeScript, MySQL (mysql2), JWT, Zod, Multer, Cloudinary.

## Cara menjalankan

1. Pastikan Node.js 18+ dan MySQL (misalnya XAMPP) sudah berjalan.
2. Buat database dan tabel: jalankan isi `database/schema.sql` di phpMyAdmin (tab SQL) atau MySQL Workbench.
3. Salin `.env.example` menjadi `.env`, lalu isi nilainya (DB, JWT_SECRET, Cloudinary).
4. Install dan jalankan:

```bash
npm install
npm run dev
```

Server berjalan di `http://localhost:3000`. Cek dengan `GET /api/health`.

Perintah lain: `npm run typecheck` (cek tipe), `npm run build` lalu `npm start` (versi produksi).

## Struktur folder

```
resep-backend/
├── database/schema.sql
├── src/
│   ├── config/        env, koneksi MySQL, Cloudinary
│   ├── controllers/   logika tiap endpoint
│   ├── middleware/    auth JWT, upload gambar, error handler
│   ├── routes/        daftar URL
│   ├── services/      query resep yang dipakai bersama
│   ├── types/         tambahan tipe Express (req.user)
│   ├── utils/         AppError, asyncHandler, jwt, upload Cloudinary
│   ├── validators/    skema Zod
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## Endpoint

| Method | URL | Login | Keterangan |
|---|---|---|---|
| POST | /api/auth/register | tidak | body JSON: name, email, password |
| POST | /api/auth/login | tidak | body JSON: email, password |
| GET | /api/users/me | ya | profil + jumlah resep |
| PUT | /api/users/me | ya | ubah nama |
| GET | /api/users/me/recipes | ya | resep milik sendiri (mendukung query yang sama dengan daftar resep) |
| GET | /api/categories | tidak | daftar kategori |
| GET | /api/recipes | tidak | daftar resep, pagination, cari, filter |
| GET | /api/recipes/:id | tidak | detail resep + bahan + langkah |
| POST | /api/recipes | ya | buat resep (multipart/form-data) |
| PUT | /api/recipes/:id | ya, pemilik | ubah resep (kirim field yang diubah saja) |
| DELETE | /api/recipes/:id | ya, pemilik | hapus resep + gambarnya |

Header untuk endpoint yang butuh login: `Authorization: Bearer <token>`.

### Query daftar resep

`page` (default 1), `limit` (default 10, maks 50), `search` (judul, deskripsi, atau nama bahan), `category_id`, `difficulty` (mudah/sedang/sulit), `max_time` (menit), `sort` (newest/oldest/fastest).

Contoh: `/api/recipes?search=ayam&category_id=2&difficulty=mudah&max_time=45&page=1&limit=10`

### Body buat resep (POST /api/recipes)

Kirim sebagai `multipart/form-data`:

| Field | Contoh |
|---|---|
| title | Nasi Goreng Kampung |
| description | Nasi goreng sederhana (opsional) |
| cook_time_minutes | 20 |
| servings | 2 |
| difficulty | mudah |
| category_id | 2 (opsional) |
| ingredients | `[{"name":"Nasi putih","quantity":"2 piring"},{"name":"Bawang putih","quantity":"3 siung"}]` |
| steps | `["Haluskan bumbu","Tumis bumbu hingga harum","Masukkan nasi, aduk rata"]` |
| image | file JPG/PNG/WEBP maks 2 MB (opsional) |

`ingredients` dan `steps` dikirim sebagai teks JSON. Di Thunder Client: tab Body → Form → isi field satu per satu, field `image` bertipe File.

### Format respons

- Sukses: `{ "message": "...", "data": ... }`. Daftar resep: `{ "data": [...], "pagination": { page, limit, total, total_pages } }`
- Error: `{ "message": "..." }`. Error validasi: `{ "message": "Validasi gagal", "errors": [{ "field", "message" }] }`
- Kode status: 400 validasi, 401 belum login/token salah, 403 bukan pemilik, 404 tidak ditemukan, 409 email sudah ada.
