# Setup Fitur Lupa Password

## 1. Konfigurasi Supabase Dashboard

### A. Email Settings
1. Buka Supabase Dashboard
2. Pilih project Anda
3. Pergi ke **Authentication** > **Settings**
4. Di bagian **Email Templates**, konfigurasi template untuk "Reset Password"

### B. SMTP Configuration
1. Di **Authentication** > **Settings** > **SMTP Settings**
2. Konfigurasi SMTP server Anda atau gunakan provider seperti:
   - SendGrid
   - Mailgun
   - Amazon SES
   - Gmail SMTP

### C. Redirect URLs
1. Di **Authentication** > **Settings** > **URL Configuration**
2. Tambahkan URL berikut ke **Redirect URLs**:
   ```
   http://localhost:5173/reset-password
   https://yourdomain.com/reset-password
   ```

## 2. Email Template Configuration

### A. Reset Password Email Template
```html
<h2>Reset Password</h2>
<p>Halo,</p>
<p>Anda telah meminta untuk mereset password akun Anda.</p>
<p>Klik link di bawah ini untuk melanjutkan:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>Link ini akan kadaluarsa dalam 1 jam.</p>
<p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
<p>Terima kasih,<br>Tim OKR Management</p>
```

### B. Subject Line
```
Reset Password - OKR Management System
```

## 3. Security Considerations

### A. Rate Limiting
- Supabase secara otomatis menerapkan rate limiting
- Maksimal 5 request reset password per email per jam
- Maksimal 10 request reset password per IP per jam

### B. Token Expiration
- Token reset password kadaluarsa dalam 1 jam
- User harus mengklik link dalam email untuk melanjutkan

### C. Password Requirements
- Minimal 6 karakter
- Harus mengandung huruf besar, huruf kecil, dan angka
- Validasi dilakukan di frontend dan backend

## 4. Testing

### A. Test Cases
1. **Valid Email**: Masukkan email yang terdaftar
   - Expected: Email reset password terkirim
   - Expected: Toast success message

2. **Invalid Email**: Masukkan email yang tidak terdaftar
   - Expected: Error message "Email tidak terdaftar"

3. **Valid Reset Link**: Klik link dari email
   - Expected: Redirect ke halaman reset password
   - Expected: Form untuk input password baru

4. **Invalid Password**: Masukkan password yang tidak memenuhi requirement
   - Expected: Error message dengan detail requirement

5. **Password Mismatch**: Password dan konfirmasi tidak cocok
   - Expected: Error message "Password tidak cocok"

6. **Successful Reset**: Password berhasil diubah
   - Expected: Success message
   - Expected: Redirect ke halaman login setelah 2 detik

### B. Manual Testing Steps
1. Buka halaman login
2. Klik "Lupa Password?"
3. Masukkan email yang terdaftar
4. Cek email untuk link reset
5. Klik link reset password
6. Masukkan password baru
7. Konfirmasi password
8. Submit form
9. Verifikasi redirect ke login

## 5. Troubleshooting

### A. Email Tidak Terkirim
1. Cek konfigurasi SMTP di Supabase Dashboard
2. Pastikan email template sudah dikonfigurasi
3. Cek spam folder
4. Verifikasi email address yang benar

### B. Link Reset Tidak Berfungsi
1. Pastikan redirect URL sudah dikonfigurasi
2. Cek apakah token sudah kadaluarsa
3. Verifikasi domain di Supabase settings

### C. Error "User not found"
1. Pastikan email terdaftar di database
2. Cek tabel `auth.users` di Supabase
3. Verifikasi email address yang dimasukkan

## 6. Monitoring

### A. Supabase Dashboard
- Monitor email delivery di **Authentication** > **Logs**
- Cek error rate di **Authentication** > **Settings**

### B. Application Logs
- Monitor console errors di browser
- Cek network requests di DevTools
- Track user interactions dengan analytics

## 7. Production Checklist

- [ ] SMTP server dikonfigurasi
- [ ] Email templates diset
- [ ] Redirect URLs dikonfigurasi
- [ ] Rate limiting diaktifkan
- [ ] Password requirements didefinisikan
- [ ] Error handling diimplementasi
- [ ] Toast notifications berfungsi
- [ ] Mobile responsiveness diuji
- [ ] Security testing dilakukan
- [ ] Documentation lengkap 