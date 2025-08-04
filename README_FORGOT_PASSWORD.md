# Fitur Lupa Password - OKR Management System

## Overview

Fitur lupa password memungkinkan user untuk mereset password mereka jika lupa atau tidak bisa login ke akun. Fitur ini menggunakan Supabase Auth untuk keamanan dan email delivery.

## Fitur yang Tersedia

### 1. Halaman Lupa Password (`/forgot-password`)
- Form untuk input email
- Validasi email format
- Feedback real-time dengan toast notifications
- Loading state saat proses pengiriman

### 2. Halaman Reset Password (`/reset-password`)
- Form untuk input password baru
- Konfirmasi password
- Password strength indicator
- Validasi password requirements
- Auto-redirect ke login setelah berhasil

### 3. Integrasi dengan Login Page
- Link "Lupa Password?" di halaman login
- Seamless navigation antara halaman

## Komponen yang Dibuat

### 1. AuthContext Updates
```typescript
// Method baru yang ditambahkan
resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
```

### 2. Halaman Baru
- `src/pages/ForgotPassword.tsx` - Halaman input email
- `src/pages/ResetPassword.tsx` - Halaman reset password

### 3. Komponen UI Baru
- `src/components/ui/password-strength.tsx` - Indikator kekuatan password
- `src/components/ui/loading-spinner.tsx` - Loading spinner reusable

## Flow Penggunaan

### 1. User Lupa Password
1. User klik "Lupa Password?" di halaman login
2. User diarahkan ke `/forgot-password`
3. User input email yang terdaftar
4. Sistem kirim email reset password
5. User terima email dengan link reset

### 2. User Reset Password
1. User klik link di email
2. User diarahkan ke `/reset-password`
3. User input password baru
4. User konfirmasi password
5. Sistem update password
6. User diarahkan ke halaman login

## Security Features

### 1. Password Requirements
- Minimal 6 karakter
- Harus mengandung huruf besar (A-Z)
- Harus mengandung huruf kecil (a-z)
- Harus mengandung angka (0-9)

### 2. Token Security
- Token reset password kadaluarsa dalam 1 jam
- Token hanya bisa digunakan sekali
- Validasi token di backend

### 3. Rate Limiting
- Maksimal 5 request per email per jam
- Maksimal 10 request per IP per jam
- Implementasi otomatis oleh Supabase

## Error Handling

### 1. Email Not Found
```typescript
{
  success: false,
  message: 'Email tidak terdaftar dalam sistem.'
}
```

### 2. Invalid Password
```typescript
{
  success: false,
  message: 'Password harus minimal 6 karakter dengan huruf besar, huruf kecil, dan angka.'
}
```

### 3. Password Mismatch
```typescript
{
  success: false,
  message: 'Password dan konfirmasi password tidak cocok.'
}
```

## Toast Notifications

### 1. Success Messages
- Email berhasil dikirim
- Password berhasil diubah
- Redirect ke login

### 2. Error Messages
- Email tidak terdaftar
- Password tidak memenuhi requirement
- Password tidak cocok
- Error sistem

## Testing

### 1. Manual Testing
```bash
# Test flow lengkap
1. Buka http://localhost:5173/login
2. Klik "Lupa Password?"
3. Input email yang terdaftar
4. Cek email untuk link reset
5. Klik link reset
6. Input password baru
7. Konfirmasi password
8. Submit dan verifikasi redirect
```

### 2. Test Cases
- [ ] Email valid - berhasil kirim email
- [ ] Email invalid - error message
- [ ] Password weak - error message
- [ ] Password mismatch - error message
- [ ] Token expired - redirect ke login
- [ ] Successful reset - redirect ke login

## Setup Requirements

### 1. Supabase Configuration
- SMTP server dikonfigurasi
- Email templates diset
- Redirect URLs dikonfigurasi

### 2. Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Email Template
```html
<h2>Reset Password</h2>
<p>Klik link di bawah untuk reset password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>Link kadaluarsa dalam 1 jam.</p>
```

## Dependencies

### 1. Frontend Dependencies
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "react-router-dom": "^6.x.x",
  "lucide-react": "^0.x.x"
}
```

### 2. UI Components
- Button, Input, Label dari shadcn/ui
- Toast notifications
- Loading spinner
- Password strength indicator

## Troubleshooting

### 1. Email Tidak Terkirim
- Cek SMTP configuration di Supabase
- Cek spam folder
- Verifikasi email address

### 2. Link Reset Tidak Berfungsi
- Cek redirect URLs di Supabase
- Verifikasi domain settings
- Cek token expiration

### 3. Error "User not found"
- Pastikan email terdaftar di database
- Cek tabel auth.users
- Verifikasi email format

## Future Enhancements

### 1. Additional Security
- Two-factor authentication
- Password history validation
- Account lockout after failed attempts

### 2. UX Improvements
- Password strength meter real-time
- Remember email for retry
- Resend email functionality

### 3. Analytics
- Track reset password usage
- Monitor success/failure rates
- User behavior analytics

## Contributing

Untuk menambahkan fitur baru atau memperbaiki bug:

1. Buat branch baru
2. Implementasi perubahan
3. Test thoroughly
4. Update documentation
5. Submit pull request

## Support

Jika ada masalah dengan fitur lupa password:

1. Cek documentation ini
2. Review troubleshooting section
3. Cek Supabase logs
4. Contact development team 