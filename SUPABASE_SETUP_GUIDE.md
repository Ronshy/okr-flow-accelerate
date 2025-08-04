# Panduan Setup Supabase untuk Fitur Reset Password

## 1. Konfigurasi Supabase Dashboard

### A. Buka Supabase Dashboard
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Pergi ke **Authentication** > **Settings**

### B. Konfigurasi Redirect URLs
1. Di bagian **URL Configuration**
2. Tambahkan URL berikut ke **Redirect URLs**:
   ```
   http://localhost:8080/okr/reset-password
   http://localhost:8080/reset-password
   https://yourdomain.com/okr/reset-password
   https://yourdomain.com/reset-password
   ```

### C. Konfigurasi Email Templates
1. Di bagian **Email Templates**
2. Pilih template **"Reset Password"**
3. Update template dengan konten berikut:

```html
<h2>Reset Password - OKR Management</h2>
<p>Halo,</p>
<p>Anda telah meminta untuk mereset password akun Anda.</p>
<p>Klik link di bawah ini untuk melanjutkan:</p>
<a href="{{ .ConfirmationURL }}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Reset Password</a>
<p><strong>Link ini akan kadaluarsa dalam 1 jam.</strong></p>
<p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
<p>Terima kasih,<br>Tim OKR Management</p>
```

### D. Konfigurasi SMTP (Opsional)
1. Di bagian **SMTP Settings**
2. Pilih provider email Anda:
   - **SendGrid**: Masukkan API key
   - **Mailgun**: Masukkan API key dan domain
   - **Gmail**: Masukkan email dan app password
   - **Custom SMTP**: Masukkan server details

## 2. Testing Setup

### A. Test Email Delivery
1. Buka aplikasi di `http://localhost:8080/okr/login`
2. Klik "Lupa Password?"
3. Masukkan email yang terdaftar
4. Cek email untuk link reset

### B. Test Reset Flow
1. Klik link di email
2. Pastikan redirect ke halaman reset password
3. Input password baru
4. Submit dan verifikasi redirect

## 3. Troubleshooting

### A. Email Tidak Terkirim
- Cek SMTP configuration
- Pastikan email template sudah diset
- Cek spam folder
- Verifikasi email address

### B. Link Reset Tidak Berfungsi
- Pastikan redirect URL sudah benar
- Cek apakah token sudah kadaluarsa
- Verifikasi domain di settings

### C. Error "Invalid redirect URL"
- Pastikan URL sudah ditambahkan ke redirect URLs
- Format URL harus exact match
- Tidak boleh ada trailing slash

## 4. Production Setup

### A. Update Environment Variables
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### B. Update Redirect URLs
```
https://yourdomain.com/okr/reset-password
https://yourdomain.com/reset-password
```

### C. Test Production Flow
1. Deploy aplikasi
2. Test reset password flow
3. Monitor email delivery
4. Check error logs

## 5. Security Best Practices

### A. Rate Limiting
- Supabase secara otomatis menerapkan rate limiting
- Maksimal 5 request per email per jam
- Maksimal 10 request per IP per jam

### B. Token Security
- Token kadaluarsa dalam 1 jam
- Token hanya bisa digunakan sekali
- Validasi dilakukan di backend

### C. Password Requirements
- Minimal 6 karakter
- Harus mengandung huruf besar, huruf kecil, dan angka
- Validasi dilakukan di frontend dan backend 