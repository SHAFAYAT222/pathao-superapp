# 🚀 Pathao Super-App (Production Ready)

A unified on-demand super-app platform for Dhaka & Bangladesh, encompassing **Pathao Rides** (Bike & Car), **Pathao Food** (hyper-local restaurants, cart & checkout), **Pathao Parcel** (secure deliveries with 4-digit verification OTPs), and **Pathao Pay** (digital wallet and MFS integrations).

---

## 🛠️ Architecture & Features

### 1. Frontend Client
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS + Custom Bangladeshi brand design tokens (Dhaka Metro, bKash pink, Pathao crimson)
- **Sound Effects**: Custom Web Audio synthesized haptics (tap, engine roar, cash, radar ping)
- **API Services**: Centralized HTTP client in `src/services/` with environment validation via `src/config/env.js`.

### 2. Backend Micro-Services (`server/`)
- **Node.js + Express 5** REST API
- **Rides Service**: `POST /api/rides/request`, `GET /api/rides/:id/status`, asynchronous driver dispatch worker
- **Food & Restaurant Service**: `GET /api/restaurants`, `GET /api/restaurants/:id/menu`, `POST /api/orders/food` (computes 5% VAT, delivery fees, discounts)
- **Parcel Service**: `POST /api/parcels/create` (generates cryptographically secure 4-digit pickup and delivery OTPs)
- **Wallet Service**: `GET /api/wallet/balance`, `POST /api/wallet/topup`, `POST /api/wallet/deduct`, `GET /api/wallet/transactions`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of Pathao REST API | `http://localhost:5000` |
| `VITE_SUPABASE_URL` | Supabase Realtime & Auth URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Anonymous Key | `eyJhbG...` |
| `VITE_MAPBOX_TOKEN` | Mapbox GL API Token | `pk.eyJ1...` |
| `PORT` | Backend Express server port | `5000` |
| `NODE_ENV` | Runtime environment | `development` / `production` |

---

## 🏃 Scripts & Local Development

```bash
# Install dependencies
npm install

# Start Express Backend Server (Port 5000)
npm run server

# Start Vite Frontend Dev Server (Port 5173, proxies /api -> 5000)
npm run dev

# Run Automated Test Suite
npm test

# Run Oxlint Code Quality Check
npm run lint

# Build Production Bundle (Vite)
npm run build

# Preview Production Build Locally
npm run preview

# Start Unified Production Server (serves API & built SPA together)
npm start
```

---

## 🐳 Docker Deployment

Build and run the multi-stage, unprivileged Node 20 Alpine container:

```bash
# Build Docker image
docker build -t pathao-superapp:latest .

# Run container
docker run -p 5000:5000 --env-file .env pathao-superapp:latest
```

The container automatically runs automated tests and linter during build stage and serves both backend API and static frontend assets securely with healthcheck monitoring at `/api/health`.

---

## ☁️ Cloud SPA Hosting (Vercel & Netlify)

Pre-configured routing configurations are included:
- **Vercel**: [`vercel.json`](./vercel.json) with SPA catch-all rewrites, cache control, and security headers.
- **Netlify**: [`netlify.toml`](./netlify.toml) with 200 rewrite rule from `/*` to `/index.html`.
