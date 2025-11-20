(The file `f:\WEB-KP\Readme.md` exists, but contains only whitespace)
# WEB-KP — StayZa (Bengkel Edition)

Ringkasan singkat: proyek web full-stack (React + Node/Express + MongoDB) untuk pemesanan layanan bengkel (sebelumnya: "hotel"). Sebagian besar konteks string, route, dan beberapa model telah dialihkan dari "hotel" → "bengkel" di branch `feat/replace-hotel-with-bengkel`.

**Perubahan Utama**
- **API route**: server sekarang mem-mount router pada `/api/bengkel` (lihat `server/server.js`).
- **Model Mongoose**: model di `server/models/hotel.models.js` dibuat dengan nama model `"bengkel"` (perhatikan implikasi nama koleksi MongoDB).
- **Refs**: field yang merefer ke hotel pada `booking`/`room` schema diperbarui ke `ref: "bengkel"`.
- **Client routes & UI**: route dan teks UI telah diperbarui (mis. `/bengkel`, tombol `Pesan Sekarang`, hero counters, dsb.).
- **Compatibilitas**: beberapa alias ditambahkan di klien (`BengkelCard`, `BengkelRegister`, dan alias state `showBengkelReg`) untuk mengurangi dampak perubahan.

**Status Saat Ini**
- Semua perubahan sumber (server + `client/src`) telah diterapkan pada branch `feat/replace-hotel-with-bengkel`.
- Build output (`client/dist`) masih berisi teks/manifest lama bertuliskan "Hotel" — perlu rebuild frontend.
- Perubahan nama model Mongoose dapat menyebabkan aplikasi membaca koleksi baru. Lihat bagian DB Migration di bawah.

**Cara Menjalankan (Windows PowerShell)**
Prasyarat: Node.js & npm terinstal, MongoDB tersedia (lokal atau remote), environment variables sesuai di `server/.env`.

1) Jalankan server (backend)
```powershell
cd server
npm install
npm run dev   # atau `node server.js` tergantung skrip package.json
```

2) Jalankan client (development)
```powershell
cd client
npm install
npm run dev   # Vite dev server
```

3) Bangun (build) client untuk produksi (mengupdate `client/dist`)
```powershell
cd client
npm install
npm run build
```

Setelah `npm run build`, file di `client/dist` akan digenerasi ulang dan manifest seharusnya tidak lagi menyebut "Hotel".

**Pilihan DB / Migrasi (penting)**
Mengganti nama model Mongoose (mis. `mongoose.model('bengkel', schema)`) akan mempengaruhi nama koleksi default yang digunakan Mongoose. Ada dua pendekatan:

- Opsi A (Tidak perlu migrasi, disarankan untuk rollout cepat): tetapkan nama koleksi eksplisit saat mendefinisikan model agar kode baru tetap memakai koleksi lama:
	```js
	// contoh di server/models/hotel.models.js
	export default mongoose.model('bengkel', hotelSchema, 'hotels');
	```
	Ini menjaga data ada di koleksi `hotels` saat aplikasi memakai model `bengkel`.

- Opsi B (Migrasi koleksi, bila ingin nama koleksi konsisten): jalankan perintah renameCollection di MongoDB (pastikan cadangan terlebih dahulu):
	```js
	// dengan mongosh
	use your_database_name
	db.hotels.renameCollection('bengkels')
	```
	Pastikan tidak ada koneksi yang menulis ke koleksi selama migrasi. Setelah migrasi, model `mongoose.model('bengkel', schema)` akan menggunakan koleksi `bengkels`.

Rekomendasi: jika ingin meminimalkan downtime/resiko, gunakan Opsi A (tetapkan nama koleksi eksplisit) lalu lakukan migrasi terencana di lain waktu.

**Testing / Smoke-check**
- Setelah rebuild frontend dan menyalakan server, coba:
	- Buka `http://localhost:3000` (atau port Vite) lalu navigasi ke `/bengkel`.
	- Lakukan login dan lihat apakah daftar bengkel/room tampil.
	- Cek endpoint backend: `GET /api/bengkel` harus mengembalikan daftar (atau `GET /api/bengkel/:id`).

**Commit & Push**
- Perubahan dibuat di branch `feat/replace-hotel-with-bengkel`. Setelah verifikasi lokal, commit & push branch:
```powershell
git add .
git commit -m "Replace hotel context with bengkel (routes, models, client strings)"
git push origin feat/replace-hotel-with-bengkel
```

**Catatan Kecil dan Next Steps**
- Saya sudah memperbarui banyak file sumber (lihat diff pada branch). Tindakan yang tersisa:
	1. Rebuild `client/dist` (saya bisa jalankan jika Anda izinkan environment build di sini).
	2. Terapkan Opsi A untuk model Mongoose bila ingin menghindari migrasi langsung.
	3. Jalankan smoke tests dan perbaiki runtime error jika muncul.

Jika Anda ingin, saya bisa: (A) menjalankan build client sekarang di workspace, (B) mengubah model untuk menggunakan koleksi lama (safeguard), dan/atau (C) membuat skrip migrasi MongoDB. Beri tahu pilihan Anda dan saya akan lanjutkan.

---
File ini dibuat/diupdate otomatis untuk mencatat perubahan refactor "hotel" → "bengkel".

