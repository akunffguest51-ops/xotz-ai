# My AI Web

Web chat AI sederhana, siap di-upload ke GitHub dan di-deploy ke hosting static.

## 1. Edit API

Buka `config.js`:

```js
const AI_CONFIG = {
  API_KEY: "API_KEY_KAMU",
  API_URL: "https://work.freemodel.dev/v1/chat/completions",
  MODEL: "modelsatu",
  SYSTEM_PROMPT: "Kamu adalah asisten AI..."
};
```

Kalau endpoint/model dari provider kamu berbeda, ganti `API_URL` dan `MODEL`.

## 2. Jalankan lokal

Bisa pakai VS Code + Live Server, atau langsung deploy ke Netlify/Vercel.

## 3. GitHub

Upload semua file:
- `index.html`
- `style.css`
- `app.js`
- `config.js`
- `README.md`

### Penting
Jangan taruh API key asli di repository GitHub public. Frontend seperti ini membuat API key terlihat oleh browser. Untuk project public/serius, gunakan backend/serverless function agar key tetap rahasia.
