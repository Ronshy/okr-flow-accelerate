# Dashboard Setup dengan Data Real-time

Dashboard ini sekarang menggunakan data real dari database Supabase dan menampilkan informasi OKR yang aktual.

## Fitur Dashboard

### 1. Metrics Cards
- **Active OKRs**: Jumlah OKR yang masih aktif (belum selesai dan belum lewat deadline)
- **Team Performance**: Rata-rata progress dari semua OKR
- **Tasks Completed**: Jumlah key results yang sudah 100% selesai
- **Engagement Score**: Skor engagement berdasarkan aktivitas OKR

### 2. Charts
- **Quarterly OKR Progress**: Progress OKR per kuartal tahun berjalan
- **OKR Status Distribution**: Distribusi status key results (on-track, at-risk, off-track)
- **OKR Level Comparison**: Perbandingan progress antara OKR individual, team, dan company

### 3. Recent OKRs
- Menampilkan 5 OKR terbaru dengan detail key results
- Progress bar untuk setiap OKR dan key result
- Status indicator untuk setiap key result

### 4. Upcoming Deadlines
- OKR dengan deadline dalam 30 hari ke depan
- Priority indicator berdasarkan urgency (high, medium, low)

## Setup Database

### 1. Pastikan Tabel Sudah Ada
Database harus memiliki struktur sesuai dengan migration file:
- `profiles` - data user
- `departments` - data departemen
- `okrs` - data OKR
- `key_results` - data key results

### 2. Insert Sample Data
Untuk testing, gunakan tombol "Insert Sample Data" di dashboard:
- Akan membuat 5 sample OKR dengan berbagai level dan status
- Setiap OKR memiliki 2-3 key results
- Data mencakup berbagai skenario (on-track, at-risk, off-track)

### 3. Clear Sample Data
Untuk menghapus semua sample data, gunakan tombol "Clear Data"

## Cara Kerja

### 1. Data Fetching
- Dashboard otomatis fetch data saat user login
- Data diambil dari tabel `okrs` dengan join ke `key_results`, `profiles`, dan `departments`
- Menggunakan RLS (Row Level Security) untuk keamanan data

### 2. Real-time Updates
- Data di-refresh setiap kali komponen di-mount
- Hook `useDashboardData` mengelola state dan data fetching
- Error handling untuk kasus gagal fetch data

### 3. Calculations
- **Active OKRs**: Filter OKR yang deadline > today dan progress < 100%
- **Team Performance**: Average dari semua progress OKR
- **Tasks Completed**: Count key results dengan progress = 100%
- **Engagement Score**: Formula berdasarkan active OKRs dan total OKRs

## Troubleshooting

### 1. Dashboard Loading Terus
- Cek koneksi ke Supabase
- Pastikan tabel database sudah ada
- Cek console browser untuk error messages

### 2. Data Tidak Muncul
- Pastikan ada data di tabel `okrs` dan `key_results`
- Gunakan tombol "Insert Sample Data" untuk testing
- Cek RLS policies di Supabase

### 3. Error Fetching Data
- Cek network tab di browser developer tools
- Pastikan user sudah login dan authenticated
- Cek Supabase logs untuk error details

## Customization

### 1. Menambah Metrics Baru
Edit file `src/hooks/useDashboardData.ts`:
```typescript
// Tambah field baru di interface DashboardMetrics
export interface DashboardMetrics {
  // ... existing fields
  newMetric: number;
}

// Tambah calculation logic di fetchDashboardData
const newMetric = calculateNewMetric(okrs);
setMetrics({
  // ... existing fields
  newMetric
});
```

### 2. Menambah Chart Baru
- Buat komponen chart baru di `src/components/Dashboard/`
- Import dan gunakan di `Dashboard.tsx`
- Fetch data yang diperlukan dari database

### 3. Mengubah Styling
- Gunakan Tailwind CSS classes
- Edit komponen individual untuk styling yang spesifik
- Gunakan CSS variables untuk theming

## Performance Considerations

### 1. Data Pagination
- Untuk data yang banyak, implement pagination
- Gunakan `limit` dan `offset` di Supabase queries

### 2. Caching
- Implement React Query untuk caching
- Gunakan localStorage untuk data yang jarang berubah

### 3. Lazy Loading
- Load chart components secara lazy
- Implement skeleton loading untuk UX yang lebih baik

## Security

### 1. Row Level Security (RLS)
- Semua tabel menggunakan RLS
- User hanya bisa akses data yang sesuai dengan role dan department

### 2. Authentication
- Dashboard hanya bisa diakses user yang sudah login
- Menggunakan `ProtectedRoute` component

### 3. Data Validation
- Validasi input di frontend dan backend
- Sanitasi data sebelum insert ke database
