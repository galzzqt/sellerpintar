# SellerPintar - Aplikasi Blog Full-Stack

Aplikasi blog modern yang dibangun dengan NextJS, Tailwind CSS, dan komponen Shadcn/ui, terintegrasi dengan API SellerPintar.

## Fitur

### Autentikasi
- **Halaman Login**: Login aman dengan username dan password
- **Halaman Registrasi**: Registrasi pengguna dengan pemilihan role
- **Autentikasi JWT**: Autentikasi berbasis token dengan manajemen token otomatis
- **Rute Terlindungi**: Pengalihan otomatis untuk pengguna yang tidak terautentikasi
- **Profil Pengguna**: Profil pengguna yang dapat diedit dengan pembaruan real-time

### Sistem Artikel
- **Daftar Artikel**: Daftar artikel dengan paginasi, pencarian, dan filter
- **Detail Artikel**: Tampilan artikel lengkap dengan artikel terkait
- **Pencarian & Filter**: Pencarian real-time dan filter kategori
- **Desain Responsif**: Desain yang ramah mobile dan bekerja di semua perangkat

### Antarmuka Pengguna
- **UI Modern**: Dibangun dengan komponen Shadcn/ui dan Tailwind CSS
- **Menu Dropdown**: Dropdown profil pengguna dengan fungsi logout
- **Status Loading**: Feedback visual selama panggilan API
- **Penanganan Error**: Penanganan error komprehensif dan feedback pengguna
- **Validasi Form**: Validasi sisi klien dengan pesan error

## Tech Stack

- **NextJS 15.5.3** - Framework React dengan App Router
- **TypeScript** - Pengembangan type-safe
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Library komponen UI modern
- **Lucide React** - Icon yang indah
- **Radix UI** - Primitif komponen yang dapat diakses
- **API SellerPintar** - Integrasi API backend

## Integrasi API

Aplikasi terintegrasi penuh dengan API SellerPintar:

- **Base URL**: `https://test-fe.mysellerpintar.com/api`
- **Autentikasi**: Autentikasi berbasis token JWT
- **Endpoints**:
  - `POST /auth/login` - Login pengguna
  - `POST /auth/register` - Registrasi pengguna
  - `POST /auth/logout` - Logout pengguna
  - `GET /articles` - Ambil artikel dengan paginasi dan filter
  - `GET /articles/:id` - Ambil artikel tunggal
  - `GET /user/profile` - Ambil profil pengguna
  - `PUT /user/profile` - Update profil pengguna

## Memulai

### Prasyarat

- Node.js 18+ 
- npm atau yarn

### Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd sellerpintar
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Proyek

```
sellerpintar/
├── app/
│   ├── globals.css          # Style global
│   ├── layout.tsx           # Layout root
│   ├── page.tsx             # Halaman beranda
│   ├── login/
│   │   └── page.tsx         # Halaman login
│   └── register/
│       └── page.tsx         # Halaman registrasi
├── components/
│   └── ui/                  # Komponen Shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── select.tsx
├── lib/
│   └── utils.ts             # Fungsi utility
└── package.json
```

## Halaman

### Halaman Beranda (`/`)
- Halaman landing dengan navigasi ke login dan registrasi
- Antarmuka selamat datang yang bersih

### Halaman Login (`/login`)
- Field username dan password
- Toggle visibilitas password
- Validasi form
- Link ke halaman registrasi

### Halaman Registrasi (`/register`)
- Username, password, dan pemilihan role
- Toggle visibilitas password
- Validasi form
- Link ke halaman login

## Validasi Form

Kedua form mencakup validasi sisi klien:

- **Username**: Wajib, minimal 3 karakter
- **Password**: Wajib, minimal 6 karakter
- **Role**: Wajib untuk registrasi (Admin, Seller, Buyer, Manager)

## Kustomisasi

### Styling
- Modifikasi `tailwind.config.js` untuk kustomisasi tema
- Update `app/globals.css` untuk style global
- Style komponen dapat dikustomisasi di file komponen individual

### Penanganan Form
- Update fungsi `handleSubmit` di halaman login dan registrasi
- Tambahkan integrasi API untuk autentikasi
- Implementasikan penanganan error dan status sukses yang tepat

## Script yang Tersedia

- `npm run dev` - Mulai development server
- `npm run build` - Build untuk produksi
- `npm run start` - Mulai production server
- `npm run lint` - Jalankan ESLint

## Lisensi

Proyek ini open source dan tersedia di bawah [MIT License](LICENSE).
