# 🤖 Telegram Bot Setup Guide

Panduan setup Telegram Bot untuk mengirim notifikasi instant ke admin.

---

## 🎯 Mengapa Telegram Bot?

✅ **100% Gratis** - Tidak ada biaya sama sekali  
✅ **Official API** - Tidak akan kena ban seperti WhatsApp unofficial  
✅ **Instant** - Notifikasi real-time  
✅ **Reliable** - Uptime sangat tinggi  
✅ **Easy Setup** - Hanya perlu 5 menit  

---

## 📋 Prerequisites

- Akun Telegram (download: https://telegram.org/)
- Smartphone atau desktop dengan Telegram installed

---

## 🔧 Setup Steps

### Step 1: Create Telegram Bot

1. **Buka Telegram** di HP atau desktop Anda

2. **Search @BotFather:**
   - Open search di Telegram
   - Ketik: `@BotFather`
   - Pilih yang verified (ada centang biru)

3. **Start conversation:**
   - Klik **START** atau ketik `/start`

4. **Create new bot:**
   - Ketik: `/newbot`
   - BotFather akan bertanya nama bot

5. **Beri nama bot:**
   ```
   BotFather: Alright, a new bot. How are we going to call it? 
              Please choose a name for your bot.
   
   You: Workshop Booking System Admin
   ```

6. **Beri username bot:**
   ```
   BotFather: Good. Now let's choose a username for your bot. 
              It must end in `bot`.
   
   You: workshopbooking_admin_bot
   ```
   
   **Note:** Username harus:
   - Unique (belum dipakai orang lain)
   - Berakhiran `bot`
   - Tanpa spasi
   - Bisa pakai underscore `_`

7. **Get Bot Token:**
   ```
   BotFather: Done! Congratulations on your new bot.
              You will find it at t.me/workshopbooking_admin_bot
              
              Use this token to access the HTTP API:
              
              1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
              
              Keep your token secure and store it safely...
   ```

8. **COPY TOKEN** dan simpan di tempat aman
   - Token format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890`
   - Ini adalah **API key** bot Anda

---

### Step 2: Get Your Chat ID

Chat ID adalah identifier unik untuk akun Telegram Anda. Bot akan mengirim pesan ke Chat ID ini.

#### Method 1: Menggunakan @userinfobot (Termudah)

1. **Search @userinfobot** di Telegram
2. Klik **START** atau kirim pesan apapun
3. Bot akan reply dengan info Anda:
   ```
   Id: 123456789
   First name: Your Name
   ...
   ```
4. **Copy angka ID** (contoh: `123456789`)

#### Method 2: Menggunakan @RawDataBot

1. **Search @RawDataBot** di Telegram
2. Klik **START** atau kirim pesan apapun  
3. Bot akan reply dengan JSON data
4. Cari field `"id"`:
   ```json
   {
     "message": {
       "from": {
         "id": 123456789,
         ...
       }
     }
   }
   ```
5. **Copy angka ID**

#### Method 3: Menggunakan API Telegram Manual

1. **Start bot Anda:**
   - Search bot Anda: `@workshopbooking_admin_bot`
   - Klik **START**
   - Kirim pesan: "Hello"

2. **Buka browser**, paste URL ini (ganti `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
   
   Contoh:
   ```
   https://api.telegram.org/bot1234567890:ABCdefGHI/getUpdates
   ```

3. **Lihat response JSON:**
   ```json
   {
     "ok": true,
     "result": [
       {
         "message": {
           "from": {
             "id": 123456789,
             "first_name": "Your Name"
           }
         }
       }
     ]
   }
   ```

4. **Copy Chat ID** dari `"id": 123456789`

---

### Step 3: Configure Environment Variables

Buka file `server/.env` dan tambahkan:

```env
# ===== TELEGRAM BOT NOTIFICATION =====
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz1234567890
TELEGRAM_ADMIN_CHAT_ID=123456789
```

**Penjelasan:**
- `TELEGRAM_BOT_TOKEN`: Token yang didapat dari @BotFather
- `TELEGRAM_ADMIN_CHAT_ID`: Chat ID Anda (dari @userinfobot)

**Contoh `.env` yang benar:**
```env
TELEGRAM_BOT_TOKEN=987654321:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
TELEGRAM_ADMIN_CHAT_ID=123456789
```

---

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
# Start ulang
npm run dev
```

---

## ✅ Testing

### Test Manual dengan Script

Buat file `server/utils/testTelegram.js`:

```javascript
import { sendTelegramMessage } from "./telegramService.js";
import dotenv from "dotenv";

dotenv.config();

const testTelegram = async () => {
  console.log("Testing Telegram bot...");
  
  const result = await sendTelegramMessage(
    "🤖 *Test Message*\n\nHello from Workshop Booking System!\n\n✅ Telegram bot is working!"
  );
  
  console.log("Result:", result);
};

testTelegram();
```

Run:
```bash
node server/utils/testTelegram.js
```

**Expected:** Anda akan menerima pesan Telegram dari bot Anda.

---

### Test End-to-End Flow

1. **Create a booking** di aplikasi
2. **Complete payment** via Midtrans  
3. **Check Telegram** - Admin harus menerima 2 notifikasi:
   - 🔔 Booking baru
   - 💰 Payment received
4. **Update status booking** di admin panel
5. **Check Telegram** - Admin harus menerima update status

---

## 📫 Notification Types

Bot akan mengirim 3 jenis notifikasi ke admin:

### 1. **Booking Notification** 🔔
Saat ada booking baru + payment berhasil:
- Detail customer
- Data kendaraan
- Jadwal service
- Info pembayaran

### 2. **Payment Notification** 💰
Saat payment diterima:
- Booking ID
- Customer name
- Amount paid
- Payment status

### 3. **Status Update Notification** 📋
Saat status booking berubah:
- Status baru
- Teknisi yang ditugaskan (jika ada)
- Booking details

---

## 🎨 Customization

### Edit Message Format

Messages ada di: `server/utils/telegramService.js`

Anda bisa customize:
- **Emoji** - Ubah emoji sesuai brand
- **Format** - Markdown format (`*bold*`, `_italic_`)
- **Content** - Tambah/kurangi informasi
- **Language** - Ganti ke bahasa lain

### Markdown Format Guide

```
*bold text*
_italic text_
`inline code`
[link text](https://example.com)
```

---

## 🔍 Troubleshooting

### Bot tidak mengirim pesan

**Problem:** Console log "Telegram not configured"

**Solution:**
1. Check `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_ADMIN_CHAT_ID` di `.env`
2. Pastikan tidak ada spasi extra
3. Restart server setelah update `.env`

---

### Error: "Chat not found"

**Problem:** Chat ID salah atau belum start bot

**Solution:**
1. **Start bot terlebih dahulu:**
   - Search bot Anda di Telegram
   - Klik **START**
   - Kirim "Hello"
2. Get ulang Chat ID menggunakan @userinfobot
3. Update `.env` dengan Chat ID yang benar

---

### Error: "Unauthorized"

**Problem:** Bot token salah atau expired

**Solution:**
1. Check bot token di `.env`
2. Pastikan copy paste dengan benar
3. Jika masih error, revoke token dan generate ulang:
   - Chat @BotFather
   - Ketik `/mybots`
   - Pilih bot Anda
   - API Token → Revoke current token → Generate new token

---

### Pesan terkirim tapi format rusak

**Problem:** Markdown error

**Solution:**
1. Escape special characters dengan backslash `\`
2. Check matching brackets/parentheses
3. Test message format di https://core.telegram.org/bots/api#markdown-style

---

## 🔔 Advanced: Group Notifications

Untuk mengirim ke **Telegram Group** bukan personal chat:

1. **Create Telegram Group**
2. **Add bot ke group:**
   - Group Settings → Add Members
   - Search bot Anda
   - Add to group
3. **Make bot admin** (optional tapi recommended)
4. **Get Group Chat ID:**
   - Send message di group
   - Get updates: `https://api.telegram.org/botTOKEN/getUpdates`
   - Group Chat ID biasanya **negative** (contoh: `-987654321`)
5. **Update `.env`:**
   ```env
   TELEGRAM_ADMIN_CHAT_ID=-987654321
   ```

---

## 📊 Bot Commands (Optional)

Anda bisa tambahkan commands ke bot:

Chat @BotFather → `/mybots` → pilih bot → Edit Commands:

```
stats - Lihat statistik booking
today - Booking hari ini
pending - Booking pending
help - Bantuan
```

Implement di `telegramService.js` dengan webhook listener.

---

## 🔒 Security Best Practices

1. ✅ **Jangan share bot token**
2. ✅ **Jangan commit `.env` ke Git**
3. ✅ **Restrict bot** - Hanya admin yang bisa chat bot
4. ✅ **Monitor usage** - Check bot analytics
5. ✅ **Rotate token** jika tercurigai leak

---

## 📈 Monitoring

### Check Bot Info

Chat @BotFather → `/mybots` → pilih bot → Bot Settings

Anda bisa:
- ✅ Edit name
- ✅ Edit description
- ✅ Edit profile picture
- ✅ View bot analytics
- ✅ Revoke/regenerate token

### Bot Analytics

@BotFather provides basic analytics:
- Messages sent/received
- Active users
- Commands usage

---

## 💡 Tips & Tricks

### 1. **Rich Formatting**
```javascript
const message = `
🎉 *SELAMAT!*

Booking baru diterima:
• Customer: ${name}
• Total: Rp${amount}

_Powered by Workshop System_
`;
```

### 2. **Inline Buttons** (Advanced)
```javascript
bot.sendMessage(chatId, "Booking baru!", {
  reply_markup: {
    inline_keyboard: [[
      { text: "Lihat Detail", url: "https://yoursite.com/booking/123" }
    ]]
  }
});
```

### 3. **Multiple Admins**
Buat array Chat IDs:
```javascript
const ADMIN_CHAT_IDS = [
  process.env.ADMIN_1_CHAT_ID,
  process.env.ADMIN_2_CHAT_ID,
];

ADMIN_CHAT_IDS.forEach(chatId => {
  bot.sendMessage(chatId, message);
});
```

---

## 📚 Resources

- **Telegram Bot API Docs:** https://core.telegram.org/bots/api
- **BotFather:** https://t.me/botfather
- **Get Chat ID bots:**
  - @userinfobot
  - @RawDataBot
  - @getidsbot

---

## 🆘 Need Help?

1. **Check bot token** di @BotFather
2. **Verify Chat ID** dengan @userinfobot
3. **Test connection** dengan test script
4. **Check console logs** untuk error details

---

**🎉 Setup Complete!** Telegram bot untuk admin notifications sudah siap digunakan!
