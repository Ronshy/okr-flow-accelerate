# Troubleshooting Reset Password

## Masalah: Halaman Reset Password Tidak Muncul

### Penyebab Utama:
1. **URL Redirect tidak sesuai** - Aplikasi berjalan di port 8080, bukan 5173
2. **Token validation logic** - Perlu perbaikan untuk menangani reset password flow
3. **Supabase configuration** - Redirect URL perlu disesuaikan

### Solusi yang Sudah Diterapkan:

#### 1. Perbaikan AuthContext
```typescript
// Sebelum
redirectTo: `${window.location.origin}/reset-password`

// Sesudah  
redirectTo: `${window.location.origin}/okr/reset-password`
```

#### 2. Perbaikan Routing
```typescript
// Ditambahkan route baru
<Route path="/okr/reset-password" element={<ResetPassword />} />
```

#### 3. Perbaikan Token Validation
```typescript
// Menangani URL parameters dengan benar
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const refreshToken = urlParams.get('refresh_token');

if (accessToken && refreshToken) {
  // Set session manually
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
}
```

#### 4. Debug Component
- Ditambahkan `DebugURL` component untuk melihat parameter URL
- Console logging untuk tracking flow

### Langkah-langkah Testing:

#### 1. Setup Supabase
1. Buka Supabase Dashboard
2. Pergi ke **Authentication** > **Settings**
3. Tambahkan redirect URLs:
   ```
   http://localhost:8080/okr/reset-password
   http://localhost:8080/reset-password
   ```

#### 2. Test Flow
1. Buka `http://localhost:8080/okr/login`
2. Klik "Lupa Password?"
3. Input email yang terdaftar
4. Cek email untuk link reset
5. Klik link reset
6. Perhatikan debug info di pojok kanan atas
7. Input password baru
8. Submit dan verifikasi redirect

### Debug Information:

#### A. Console Logs
- Cek browser console untuk melihat:
  - URL Parameters
  - Session status
  - Error messages

#### B. Debug Component
- Komponen kuning di pojok kanan atas menampilkan:
  - Type parameter
  - Access token status
  - Refresh token status
  - Full URL

#### C. Network Tab
- Cek network requests di DevTools
- Pastikan tidak ada CORS errors
- Verifikasi API calls ke Supabase

### Common Issues:

#### 1. "Invalid redirect URL"
- **Penyebab**: URL tidak terdaftar di Supabase
- **Solusi**: Tambahkan URL ke redirect URLs di Supabase Dashboard

#### 2. "Token expired"
- **Penyebab**: Token sudah kadaluarsa (1 jam)
- **Solusi**: Request link baru

#### 3. "No session found"
- **Penyebab**: Token tidak valid atau format salah
- **Solusi**: Cek URL parameters di debug component

#### 4. "Email not sent"
- **Penyebab**: SMTP tidak dikonfigurasi
- **Solusi**: Setup SMTP di Supabase atau gunakan default

### Production Checklist:

- [ ] Redirect URLs dikonfigurasi di Supabase
- [ ] Email templates diset
- [ ] SMTP dikonfigurasi (opsional)
- [ ] Testing flow lengkap
- [ ] Error handling diimplementasi
- [ ] Debug component dihapus untuk production

### Next Steps:

1. **Test dengan email yang terdaftar**
2. **Cek debug component untuk parameter URL**
3. **Verifikasi redirect URLs di Supabase**
4. **Monitor console logs untuk error**
5. **Test flow lengkap dari login sampai reset**

### Jika Masih Bermasalah:

1. **Cek Supabase Logs**
   - Buka Supabase Dashboard
   - Pergi ke **Authentication** > **Logs**
   - Cari error terkait reset password

2. **Cek Email Delivery**
   - Pastikan email terkirim
   - Cek spam folder
   - Verifikasi email template

3. **Cek Network Requests**
   - Buka DevTools > Network
   - Cari requests ke Supabase
   - Cek response status

4. **Contact Support**
   - Jika masalah masih berlanjut
   - Sertakan debug information
   - Jelaskan steps yang sudah dilakukan 