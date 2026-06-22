# CyberShield

Security assessment lab platform — dibangun sebagai portfolio untuk menunjukkan pemahaman security dari sisi offensive (exploit) maupun defensive (mitigasi), sekaligus practice backend development.

## ⚠️ Disclaimer

Project ini **sengaja** mengandung vulnerability nyata (SQL Injection, XSS, IDOR, CSRF) untuk tujuan edukasi dan demonstrasi. **Tidak di-deploy publik** — hanya dijalankan secara lokal lewat Docker Compose. Jangan jalankan versi vulnerable di server yang terhubung ke internet.

## Tech Stack

- Laravel 13 (PHP 8.5)
- Inertia.js + React (TypeScript)
- SQLite
- Docker Compose (Laravel Sail)

## Cara Menjalankan

Prasyarat: Docker Desktop, WSL2 (Windows) dengan integrasi Docker aktif.

```bash
git clone <repo-url>
cd cybershield
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed
```

Akses di `http://localhost`.

## Modul Vulnerability

Setiap modul tersedia di tab **"Vulnerability Labs"** pada Dashboard, dengan endpoint vulnerable dan fixed yang bisa dibandingkan langsung.

| Modul | Status | Detail |
|---|---|---|
| SQL Injection | ✅ Selesai | [Lihat writeup](docs/writeups/sql-injection.md) |
| XSS | 🔜 Belum dibangun | - |
| IDOR | 🔜 Belum dibangun | - |
| CSRF | 🔜 Belum dibangun | - |

## Login Demo

Gunakan akun Breeze biasa (register dulu) untuk akses Dashboard. Akun `lab_accounts` (target exploit SQLi) sudah otomatis ter-seed: lihat `database/seeders/LabAccountSeeder.php`.
