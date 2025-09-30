# Website Point Of Salez

Solusi Point of Sale (POS) modern berbasis Laravel + Inertia + React yang membantu bisnis ritel mengelola transaksi, stok, dan laporan keuangan dalam satu platform terpadu. Aplikasi ini dilengkapi landing page berwarna oranye-hitam dengan tipografi Poppins yang memberikan kesan premium sekaligus tetap ringan digunakan oleh tim kasir.

## Fitur Utama
- **Manajemen Penjualan & Pembelian** – Catat transaksi lengkap dengan perhitungan otomatis, detail item, diskon, dan metode pembayaran.
- **Inventori Real-Time** – Pantau stok, tetapkan batas minimum, lakukan penyesuaian (stock adjustment), serta dapatkan peringatan stok menipis.
- **Shift & Cash Session** – Buka/tutup kas, lacak uang awal dan akhir shift, dan simpan log audit untuk meminimalkan selisih kasir.
- **Manajemen Partner & Supplier** – Simpan data pemasok/mitra beserta histori transaksi terkait.
- **Laporan Komprehensif** – Dashboard harian, laporan penjualan, pembelian, profit & loss, serta ringkasan inventori dalam visualisasi interaktif.
- **Kontrol Akses Berbasis Role** – Middleware khusus memastikan setiap user memiliki hak akses sesuai perannya.
- **Antarmuka Responsif** – UI berbasis Tailwind CSS dengan komponen re-usable, dark mode, dan pengalaman pengguna yang konsisten di berbagai perangkat.

## Teknologi
- **Backend:** Laravel 10, PHP 8.2, MySQL / MariaDB
- **Frontend:** Inertia.js, React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Build Tools:** Vite, Bun / npm
- **Utilities:** Eloquent ORM, Form Request Validation, Laravel Seeder & Factory

## Persiapan Awal
### Prasyarat
- PHP 8.2+
- Composer
- Node.js 18+ dan npm / Bun
- MySQL atau database lain yang kompatibel
- Git

### Instalasi
```bash
# clone project
git clone git@github.com:luthfihalimii/Website-Point-Of-Salez.git
cd Website-Point-Of-Salez

# salin konfigurasi environment
cp .env.example .env

# instal dependency backend
composer install

# instal dependency frontend
npm install       # atau bun install

# generate application key
php artisan key:generate
```

### Konfigurasi Database
1. Buka file `.env` dan sesuaikan nilai `DB_DATABASE`, `DB_USERNAME`, serta `DB_PASSWORD`.
2. Jalankan migrasi dan seeder untuk mengisi data dasar:
```bash
php artisan migrate --seed
```

## Menjalankan Aplikasi
```bash
# jalankan server Laravel
php artisan serve

# di terminal lain, jalankan dev server frontend
npm run dev
```
Aplikasi dapat diakses melalui `http://127.0.0.1:8000` dan asset frontend akan disajikan oleh Vite.

### Build Production
```bash
npm run build
php artisan optimize
```

### Menjalankan Test
```bash
php artisan test
```

## Workflow Pengembangan
- Gunakan `git fetch upstream` untuk mengambil pembaruan dari repo sumber jika diperlukan.
- Buat branch fitur baru (`git checkout -b feature/nama-fitur`) sebelum melakukan perubahan besar.
- Pastikan menjalankan lint/test sebelum membuat pull request.

## Lisensi
Project ini menggunakan lisensi [MIT](LICENSE). Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan bisnis Anda.
