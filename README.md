# 🚀 Tsync — Collaborative Task Management Platform

Tsync adalah aplikasi web **Task Management** modern yang dirancang untuk sinkronisasi sprint, manajemen tugas tim, visualisasi Kanban, dan pelacakan beban kerja proyek secara kolaboratif.

![Tsync Logo](./client/public/logo.png)

---

## 🛠️ Tech Stack

- **Frontend**: 
  - **React.js** (Vite)
  - **Tailwind CSS v3** (Modern typography, dark/light mode, custom glassmorphism, responsive)
  - **Lucide Icons**
- **Backend**:
  - **Node.js (Express.js)**
  - REST API Architecture
  - CORS, dotenv, JSON payload parser
- **Database**:
  - **PostgreSQL** (Lokal via port `5432` / connection string `.env`)
  - **Resilient Prototype Engine**: Otomatis fallback ke penyimpanan prototipe in-memory jika PostgreSQL belum aktif, sehingga aplikasi dapat langsung dicoba tanpa downtime.
- **Version Control**:
  - Git & GitHub ready

---

## ✨ Fitur Utama

1. **Dashboard Overview**:
   - Ringkasan metrik: *Total Tasks*, *In Progress*, *Completion Rate (%)*, *Urgent Tasks*.
   - Visual progress meter alur kerja sprint.
   - Activity Stream real-time (riwayat perpindahan task dan aktivitas tim).
2. **Kanban Board**:
   - Kolom: `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`.
   - Native Drag and Drop antar kolom dengan pembaruan status instan.
   - Indikator prioritas (*Urgent*, *High*, *Medium*, *Low*) dengan animasi status.
   - Progress bar subtasks (misal 2/3 selesai).
   - Quick Add task per kolom.
3. **List View**:
   - Tabel ringkas tugas dengan filter *Status* dan *Priority*.
   - Sorting berdasarkan judul atau tenggat waktu (*Due Date*).
   - Checkbox selesai cepat (Done toggle).
4. **Calendar View**:
   - Kalender bulanan untuk melihat deadline sprint.
   - Klik tanggal untuk langsung membuat tugas pada tanggal tersebut.
5. **Team Workload Management**:
   - Daftar anggota tim, role/jabatan, email, dan jumlah tugas aktif vs selesai.
   - Fitur undang kolaborator (*Invite Member*).
6. **Task & Project Workspace**:
   - Modal detail tugas: Judul, deskripsi, checklist subtasks dinamis, tag/label kustom, penugasan (*assignee*), dan tanggal jatuh tempo.
   - Multi-workspace: Buat dan ganti antar proyek kerja (*Workspaces*).
7. **Dark Mode & Light Mode**:
   - Toggle tema dengan penyimpanan preferensi otomatis di browser.
8. **Live Search**:
   - Pencarian instan berdasarkan judul, deskripsi, atau hashtag label, dengan shortcut keyboard `Ctrl + K`.

---

## 📁 Struktur Folder

```
d:/CAPSTONE/PROTOTYPE/
├── client/                     # Frontend (React + Tailwind CSS v3)
│   ├── public/                 # Logo & static assets
│   ├── src/
│   │   ├── components/         # Komponen UI (Navbar, Sidebar, Kanban, List, Calendar, dll.)
│   │   ├── api.js              # REST API Client
│   │   ├── App.jsx             # Aplikasi utama & routing view
│   │   ├── index.css           # Tailwind & styling custom
│   │   └── main.jsx
│   ├── tailwind.config.js      # Konfigurasi Tailwind CSS v3
│   └── vite.config.js
├── server/                     # Backend REST API (Express.js)
│   ├── src/
│   │   ├── routes/             # Endpoints (tasks, projects, members, analytics)
│   │   ├── db.js               # Koneksi PostgreSQL & local prototype engine
│   │   ├── mockData.js         # Initial seed data
│   │   └── index.js            # Server entrypoint
│   ├── schema.sql              # Skema tabel PostgreSQL
│   └── .env                    # Konfigurasi environment
└── package.json                # Skrip runner root
```

---

## ⚡ Cara Menjalankan Aplikasi

### 1. Install Dependencies
Jalankan perintah ini di terminal root:
```bash
# Install dependencies server dan client sekaligus
npm run install:all
```
*(Atau install manual: `cd server && npm install`, lalu `cd ../client && npm install`)*

### 2. Konfigurasi Database PostgreSQL (Opsional)
Jika Anda memiliki PostgreSQL yang sudah terinstall di komputer lokal:
1. Buat database baru bernama `tsync_db`:
   ```bash
   createdb tsync_db
   ```
2. Sesuaikan kredensial di file [server/.env](file:///d:/CAPSTONE/PROTOTYPE/server/.env):
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tsync_db
   ```
3. Saat server dinyalakan, tabel dari `schema.sql` akan otomatis diinisialisasi beserta data awal!

> **Catatan**: Jika PostgreSQL belum dinyalakan di komputer Anda, server Tsync **tetap akan berjalan normal** dalam mode prototipe lokal mandiri (*zero-configuration*), sehingga Anda bisa langsung mendemokan UI/UX tanpa terhalang error koneksi database.

### 3. Menjalankan Backend Server
Buka terminal dan jalankan:
```bash
npm run server
```
Server Express akan aktif di: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)

### 4. Menjalankan Frontend Client
Buka terminal lain dan jalankan:
```bash
npm run client
```
Aplikasi React Vite akan aktif di: `http://localhost:3000`

---

## 🔌 Dokumentasi REST API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/tasks` | Mengambil seluruh tugas (query `?projectId=...`) |
| `POST` | `/api/tasks` | Membuat tugas baru |
| `PUT` | `/api/tasks/:id` | Memperbarui data tugas |
| `PATCH` | `/api/tasks/:id/status` | Update cepat status tugas (Kanban drag-and-drop) |
| `DELETE` | `/api/tasks/:id` | Menghapus tugas |
| `GET` | `/api/projects` | Mengambil daftar proyek |
| `POST` | `/api/projects` | Membuat proyek baru |
| `GET` | `/api/members` | Mengambil daftar anggota tim dan beban tugas |
| `POST` | `/api/members` | Menambahkan anggota tim baru |
| `GET` | `/api/analytics` | Ringkasan statistik & metrik dashboard |
| `GET` | `/api/analytics/activities` | Riwayat aktivitas terbaru |
| `GET` | `/api/health` | Status server dan deteksi mode database |

---

## 🌿 Git & Version Control

Untuk mengunggah prototipe ini ke GitHub:
```bash
git init
git add .
git commit -m "feat: initial prototype of Tsync task management platform"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```
