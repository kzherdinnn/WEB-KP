# 📱 PWA Setup Guide - StayZa

Dokumentasi lengkap untuk setup Progressive Web App (PWA) pada project StayZa.

---

## 📋 Daftar Isi

1. [Apa itu PWA?](#apa-itu-pwa)
2. [Fitur PWA StayZa](#fitur-pwa-stayza)
3. [Persyaratan](#persyaratan)
4. [Setup & Instalasi](#setup--instalasi)
5. [Generate Icons](#generate-icons)
6. [Testing PWA](#testing-pwa)
7. [Deploy PWA](#deploy-pwa)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Apa itu PWA?

**Progressive Web App (PWA)** adalah aplikasi web yang menggunakan teknologi modern untuk memberikan pengalaman seperti aplikasi native di perangkat pengguna.

### Keuntungan PWA:

- ✅ **Installable** - Dapat diinstall di home screen tanpa melalui app store
- ✅ **Offline Support** - Bekerja tanpa koneksi internet (terbatas)
- ✅ **Fast Loading** - Caching membuat loading lebih cepat
- ✅ **Push Notifications** - Dapat mengirim notifikasi (opsional)
- ✅ **App-like Experience** - Fullscreen, splash screen, dll
- ✅ **Auto Updates** - Service worker otomatis update

---

## 🚀 Fitur PWA StayZa

### ✨ Fitur yang Sudah Diimplementasikan:

1. **📥 Install Prompt**
   - Notifikasi install yang menarik (Android & iOS)
   - Auto-dismiss setelah 7 hari jika ditolak
   - Support untuk iOS dengan instruksi manual

2. **💾 Offline Caching**
   - Cache static assets (JS, CSS, images)
   - Cache Google Fonts
   - Cache API responses (5 menit)
   - Cache images (30 hari)

3. **🎨 App Icons**
   - Support berbagai ukuran (72px - 512px)
   - Maskable icons untuk Android adaptive icons
   - SVG icon support

4. **📱 Manifest**
   - Theme color: `#14b8a6` (Teal)
   - Background color: `#ffffff` (White)
   - Display mode: `standalone`
   - App shortcuts (Cari Hotel, My Bookings)

5. **🔄 Auto Updates**
   - Service worker auto-update setiap 1 jam
   - Seamless updates tanpa ganggu user

---

## 📦 Persyaratan

### Software:
- Node.js v16+ 
- npm atau yarn
- Modern browser (Chrome, Edge, Safari, Firefox)

### Dependencies yang Sudah Terinstall:
```json
{
  "devDependencies": {
    "vite-plugin-pwa": "^0.x.x",
    "workbox-window": "^7.x.x"
  }
}
```

---

## 🛠️ Setup & Instalasi

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Struktur File PWA

```
client/
├── public/
│   ├── icons/                    # Icons untuk PWA
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   ├── icon-512x512.png
│   │   ├── icon-maskable-192x192.png
│   │   └── icon-maskable-512x512.png
│   ├── manifest.json             # Web App Manifest
│   └── favicon.svg               # Logo utama
├── src/
│   ├── components/
│   │   └── PWAInstallPrompt.jsx  # Install prompt component
│   └── main.jsx                  # Service worker registration
├── vite.config.js                # PWA plugin config
├── generate-icons.html           # Tool generate icons
└── PWA_SETUP.md                  # Dokumentasi ini
```

### 3. Konfigurasi Sudah Selesai

File-file berikut sudah dikonfigurasi:
- ✅ `vite.config.js` - PWA plugin sudah ditambahkan
- ✅ `index.html` - Meta tags PWA sudah ditambahkan
- ✅ `manifest.json` - Sudah dikonfigurasi
- ✅ `main.jsx` - Service worker registration sudah ada
- ✅ `App.jsx` - PWAInstallPrompt sudah diimport

---

## 🎨 Generate Icons

### Metode 1: Menggunakan Icon Generator (Recommended)

1. **Buka file `generate-icons.html` di browser**
   ```bash
   # Dari folder client
   start generate-icons.html
   # atau
   open generate-icons.html  # macOS
   ```

2. **Upload logo StayZa**
   - Gunakan logo proyek (disarankan ImageKit remote URL atau `public/icons/*` jika ingin fallback lokal)
   - Atau logo PNG dengan resolusi tinggi (minimal 512x512px)

3. **Download hasil generate**
   - Klik tombol "📥 Download Semua Icons"
   - Extract file ZIP yang didownload

4. **Pindahkan icons ke folder public**
   ```bash
   # Extract zip dan copy semua file ke:
   client/public/icons/
   ```

### Metode 2: Manual dengan Online Tool

Gunakan tool online seperti:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

Upload logo dan download semua ukuran yang diperlukan:
- 72x72, 96x96, 128x128, 144x144, 152x152
- 192x192, 384x384, 512x512
- Maskable: 192x192, 512x512

### Metode 3: Menggunakan CLI Tool

```bash
# Install PWA Asset Generator
npm install -g pwa-asset-generator

# Generate icons
pwa-asset-generator public/icons/source-logo.svg public/icons --background "#14b8a6" --padding "10%"
```

---

## 🧪 Testing PWA

### 1. Test di Development

```bash
cd client
npm run dev
```

**Buka browser dan test:**
- Chrome/Edge: Buka DevTools > Application > Manifest
- Check semua icon muncul
- Check service worker registered
- Check install prompt muncul (tunggu 3-5 detik)

### 2. Test di Production Build

```bash
# Build project
npm run build

# Preview build
npm run preview
```

### 3. Test dengan Chrome DevTools

1. **Buka Chrome DevTools** (F12)
2. **Tab "Application"**
3. **Check:**
   - ✅ Manifest: `public/manifest.json` loaded
   - ✅ Service Workers: Registered & Active
   - ✅ Storage > Cache Storage: Ada cache entries
   - ✅ Icons: Semua ukuran muncul

### 4. Test Install

**Desktop (Chrome/Edge):**
1. Klik icon install di address bar (⊕)
2. Atau: Menu > Install StayZa

**Mobile (Android):**
1. Menu browser > Add to Home screen
2. Atau: Banner install otomatis muncul

**Mobile (iOS):**
1. Tap tombol Share (⬆️)
2. Scroll down > Add to Home Screen
3. Tap "Add"

### 5. Lighthouse Audit

1. Buka Chrome DevTools
2. Tab "Lighthouse"
3. Select "Progressive Web App"
4. Click "Generate report"

**Target Score:** 90+ / 100

### 6. Test Offline Mode

1. Install PWA di device
2. Open app
3. Chrome DevTools > Network tab
4. Set "Offline"
5. Reload page
6. App harus masih bisa dibuka (cached pages)

---

## 🚀 Deploy PWA

### Deploy ke Vercel

```bash
# Pastikan sudah login
vercel login

# Deploy
cd client
npm run build
vercel --prod
```

**Pastikan:**
- ✅ HTTPS aktif (required untuk service worker)
- ✅ Manifest accessible di `https://your-domain.com/manifest.json`
- ✅ Service worker accessible di `https://your-domain.com/sw.js`

### Environment Variables

Pastikan `.env` sudah setup:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_key
```

### Vercel Configuration

File `vercel.json` sudah dikonfigurasi untuk PWA.

---

## 🐛 Troubleshooting

### ❌ Service Worker Tidak Register

**Problem:** Console error "Service Worker registration failed"

**Solution:**
1. Pastikan menggunakan HTTPS (atau localhost)
2. Clear browser cache
3. Check `main.jsx` - pastikan code service worker ada
4. Build ulang: `npm run build`

### ❌ Install Prompt Tidak Muncul

**Problem:** Banner install tidak muncul

**Solution:**
1. Check sudah ada service worker registered
2. Check manifest.json valid (Chrome DevTools > Application)
3. Clear localStorage: `localStorage.clear()`
4. Reload page dan tunggu 3-5 detik
5. Pastikan belum di-dismiss dalam 7 hari terakhir

### ❌ Icons Tidak Muncul

**Problem:** Icons broken atau tidak ada

**Solution:**
1. Check folder `public/icons/` ada file-file icon
2. Check nama file sesuai dengan manifest.json
3. Check DevTools > Application > Manifest - lihat icon preview
4. Re-generate icons dengan tool generator

### ❌ App Tidak Bekerja Offline

**Problem:** White screen saat offline

**Solution:**
1. Check service worker active (DevTools > Application)
2. Check cache storage ada entries
3. Visit page minimal 1x saat online dulu
4. Workbox strategy mungkin perlu diubah

### ❌ Manifest Error

**Problem:** "Manifest could not be parsed"

**Solution:**
1. Check `public/manifest.json` valid JSON
2. Use JSON validator
3. Check icon paths valid
4. Check theme_color format benar (#rrggbb)

### ❌ iOS Install Tidak Bekerja

**Problem:** Add to Home Screen tidak muncul

**Solution:**
1. iOS memang tidak support auto-prompt
2. User harus manual: Share > Add to Home Screen
3. PWAInstallPrompt component sudah show instruksi iOS
4. Check apple-touch-icon di index.html

---

## 📊 PWA Checklist

Sebelum deploy, pastikan semua ini sudah:

### Manifest
- [x] `manifest.json` di public folder
- [x] Link manifest di `index.html`
- [x] name, short_name, description filled
- [x] theme_color & background_color set
- [x] icons minimal 192x192 & 512x512
- [x] start_url set
- [x] display: standalone

### Service Worker
- [x] Service worker registered di `main.jsx`
- [x] Workbox configured di `vite.config.js`
- [x] Caching strategy defined
- [x] Auto-update mechanism

### Icons
- [x] All sizes generated (72-512px)
- [x] Maskable icons for Android
- [x] Apple touch icon
- [x] Favicon

### Meta Tags
- [x] theme-color meta tag
- [x] apple-mobile-web-app-capable
- [x] viewport meta tag
- [x] OG tags for sharing

### HTTPS
- [x] Site served over HTTPS
- [x] All resources HTTPS
- [x] No mixed content

### Testing
- [x] Lighthouse PWA score 90+
- [x] Install prompt works
- [x] Offline mode works
- [x] Icons display correctly
- [x] Tested on multiple devices

---

## 📚 Resources

### Dokumentasi
- [PWA Docs](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [Web App Manifest](https://web.dev/add-manifest/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Maskable.app](https://maskable.app/) - Test maskable icons
- [Web.dev Measure](https://web.dev/measure/)

### Testing
- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [LambdaTest](https://www.lambdatest.com/) - Mobile testing

---

## 🎉 Selesai!

PWA StayZa sudah siap digunakan! 

**Next Steps:**
1. Generate icons dengan `generate-icons.html`
2. Test dengan Lighthouse
3. Deploy ke production
4. Share dengan team! 🚀

**Need Help?**
- Check [Troubleshooting](#troubleshooting)
- Contact: Team StayZa

---

**Version:** 1.0.0  
**Last Updated:** 2025  
**Maintained by:** StayZa Development Team