# Cezaevinden.com — Kurulum Rehberi

## 1. Bağımlılıkları Yükle
```bash
npm install
```

## 2. Veritabanı Tablolarını Oluştur
```bash
npx prisma db push
```

## 3. Örnek Verileri Yükle (Opsiyonel)
```bash
npx prisma db seed
```

Seed sonrası hesaplar:
- **Admin:** admin@cezaevinden.com / admin123!
- **Avukat:** av.mehmet@cezaevinden.com / avukat123!
- **Aile:** fatma@example.com / aile123!

## 4. Geliştirme Sunucusu
```bash
npm run dev
```
→ http://localhost:3000

## 5. Prodüksiyon Build
```bash
npm run build
npm start
```

---

## Ortam Değişkenleri (.env)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="güçlü-bir-secret"
NEXTAUTH_URL="https://cezaevinden.com"
GOOGLE_CLIENT_ID="..."       # Google OAuth (opsiyonel)
GOOGLE_CLIENT_SECRET="..."   # Google OAuth (opsiyonel)
```

---

## Vercel Deployment

1. GitHub'a push edin
2. Vercel'de "Import Project" seçin
3. Ortam değişkenlerini ekleyin
4. Deploy edin — `vercel.json` build komutunu otomatik çalıştırır

---

## Özellikler

- 🔐 Kimlik doğrulama (e-posta + Google OAuth)
- 👤 5 kullanıcı rolü (Mahkum, Aile, Tahliye, Avukat, Admin)
- 🕵️ Anonim mod
- ⚖️ Hukuki yardım sistemi (avukat onay akışı dahil)
- 💬 Forum & sosyal feed
- 📬 Özel mesajlaşma
- 🔔 Bildirim sistemi
- 📰 Haber yönetimi
- 🏘️ Destek ağı
- 🏆 Avukat lider tablosu
- 🔍 Gelişmiş arama
- 📊 Admin paneli
- 📱 PWA desteği
- 🗺️ Sitemap & robots.txt
