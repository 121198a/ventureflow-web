# Multi-Platform Deployment & Budget Architecture Guide

This guide details how to deploy and maintain **VentureFlow / UnBound X** across various hosting platforms (**Vercel, Netlify, Hostinger, AWS, Render, Railway, Fly.io, or any standard Linux VPS**) with **zero vendor lock-in** and a **$0 free-tier first** strategy.

---

## 1. Budget Architecture & Free-Tier Blueprint

As a student or indie developer project, cost predictability and zero-cost operation are paramount. The application is architected to run entirely on generous free tiers and scale to low-cost infrastructure ($2–$5/month) only when needed.

| Component | Free-Tier Service | Free Quota | Low-Cost Scaling Option |
| :--- | :--- | :--- | :--- |
| **Frontend & API (Serverless)** | **Vercel** or **Netlify** | 100 GB bandwidth, unlimited deployments | Vercel Pro ($20/mo) or Netlify Pro ($19/mo) |
| **Frontend & API (Container/VPS)** | **Render** or **Koyeb** | Free web service tier | Hostinger VPS / Hetzner / Lightsail ($2.50–$4/mo) |
| **Database & Auth** | **Supabase** (Free Tier) | 500 MB Postgres, 50k MAU auth, 1GB storage | Supabase Pro ($25/mo) or self-hosted Postgres |
| **Rate Limiting** | Built-in in-memory engine | Unlimited (runs inside application process) | Upstash Redis Free (10k requests/day) |
| **DNS, CDN & SSL** | **Cloudflare** (Free Plan) | Unlimited DDoS protection, global CDN, free SSL | Cloudflare Pro ($20/mo) |
| **Uptime Monitoring** | **UptimeRobot** / **BetterStack** | 50 free monitors, 5-min checks on `/api/health` | Included in free tier |
| **Total Monthly Cost** | **$0.00 / month** | Suitable for testing, portfolio & moderate traffic | **~$3.00 / month** (Hostinger or Lightsail VPS) |

---

## 2. Platform-Independent Design Features

1. **Standalone Output (`output: 'standalone'`)**:
   Next.js builds a lightweight server bundle in `.next/standalone` (~60–90MB RAM footprint). This allows running on entry-level VPS (512MB–1GB RAM) without memory crashes. Configurable via `NEXT_OUTPUT_STANDALONE`.
2. **Image Optimization Quota Control**:
   Vercel Free Tier limits image optimization to 1,000 transforms/month. Set `NEXT_PUBLIC_UNOPTIMIZED_IMAGES=true` to serve original images directly or save CPU on low-memory servers.
3. **Cross-Platform Client IP Detection**:
   `lib/rate-limit.ts` inspects `cf-connecting-ip` (Cloudflare), `x-real-ip`, and `x-forwarded-for` (Vercel, Netlify, AWS, Nginx, Hostinger), ensuring rate limiting works consistently everywhere.
4. **Graceful Service Degradation**:
   If Supabase or external APIs are temporarily unreachable or unconfigured, the application handles errors gracefully with clean status codes and user-friendly fallback messaging.
5. **Universal Health Check**:
   `/api/health` returns status, uptime, system memory, Node version, and service configuration indicators for container health checks, load balancers, and uptime bots.

---

## 3. Step-by-Step Deployment Guides

### Option A: Vercel (Recommended Free Serverless Deployment)

1. Push your code to GitHub / GitLab / Bitbucket.
2. Sign in to [Vercel](https://vercel.com) with GitHub.
3. Click **"Add New Project"** and import `ventureflow`.
4. Framework Preset will auto-detect as **Next.js**.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-project.vercel.app` (or your custom domain)
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: `your-anon-key`
   - `NEXT_PUBLIC_UBVERSE_API_URL`: `https://development.unboundxinc.us/api`
   - `NEXT_PUBLIC_UNOPTIMIZED_IMAGES`: `true` (optional: prevents exceeding free 1,000 image transform limit)
6. Click **Deploy**. Vercel will build and assign a free SSL-enabled `.vercel.app` domain.

---

### Option B: Netlify (Free Serverless Deployment)

1. Sign in to [Netlify](https://www.netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"**.
3. Select your repository.
4. Netlify will detect `netlify.toml` from the root:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Plugin: `@netlify/plugin-nextjs`
5. Add the environment variables from `.env.example` under **Site configuration > Environment variables**.
6. Click **Deploy site**.

---

### Option C: Hostinger (Low-Cost Student VPS or Node.js Hosting)

Hostinger is popular among students for affordable shared hosting and VPS plans ($2–$4/month).

#### Method 1: Hostinger VPS with PM2 (Recommended)
1. In your VPS SSH terminal, install Node.js 20 and PM2:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
2. Clone your repository and configure environment variables:
   ```bash
   git clone https://github.com/your-username/ventureflow.git
   cd ventureflow
   cp .env.example .env.local
   nano .env.local # Fill in your domain and keys
   ```
3. Install dependencies and build:
   ```bash
   npm ci
   npm run build
   ```
4. Start the application using the included PM2 configuration:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```
   *Note: `ecosystem.config.cjs` includes `max_memory_restart: '350M'` to prevent memory exhaustion on 512MB/1GB RAM VPS.*

5. Setup Nginx reverse proxy with free Let's Encrypt SSL:
   ```nginx
   server {
       server_name yourdomain.com www.yourdomain.com;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Run `sudo certbot --nginx -d yourdomain.com` for free SSL.

#### Method 2: Hostinger VPS with Docker Compose
1. Ensure Docker is installed on your VPS:
   ```bash
   docker compose up -d --build
   ```
2. View health and logs:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

---

### Option D: AWS (Free Tier & Low-Cost Options)

#### AWS Amplify (Serverless & Free Tier)
1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
2. Choose **"Deploy an app"** and connect your Git provider.
3. Amplify auto-detects Next.js SSR/App Router.
4. Add environment variables under **App settings > Environment variables**.
5. Deploy. AWS handles SSL, CloudFront CDN distribution, and routing automatically.

#### AWS Lightsail ($3.50/month VPS)
- Launch an Ubuntu instance on Amazon Lightsail.
- Follow the **Hostinger VPS with PM2** instructions above.
- Lightsail includes 1 TB free transfer and static IP at minimal cost.

---

### Option E: Free Cloud Containers (Render / Railway / Koyeb)

1. Connect your repository to **Render** or **Koyeb**.
2. Select **Docker** deployment (Render will use the included multi-stage `Dockerfile`).
3. Set environment variables.
4. The container builds with Node 20 Alpine, running as a secure non-root `nextjs` user with automated health checks on `/api/health`.

---

## 4. Environment Variables Checklist

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | `https://yourdomain.com` | Base URL for sitemap, metadata, OG cards |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional* | `https://xyz.supabase.co` | Free-tier Supabase database/storage (*Required for resumes) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional* | `eyJhbGciOi...` | Supabase public anon key |
| `NEXT_PUBLIC_UBVERSE_API_URL` | Optional | `https://development.unboundxinc.us/api` | Backend API integration |
| `NEXT_PUBLIC_CMS_API_URL` | Optional | `.../user/cms-pages` | Legal CMS endpoints |
| `NEXT_PUBLIC_UNOPTIMIZED_IMAGES` | Optional | `false` (set `true` on free tiers) | Saves image transform quotas/CPU |
| `NEXT_OUTPUT_STANDALONE` | Optional | `true` | Minimizes memory & container image size |
| `PORT` | Optional | `3000` | Port for standalone / Docker / PM2 |

---

## 5. Verifying Deployment Health

Once deployed, visit your health endpoint:
```text
GET https://your-deployed-domain.com/api/health
```

Example JSON response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-17T12:00:00.000Z",
  "uptimeSeconds": 1420,
  "environment": "production",
  "services": {
    "supabase": { "configured": true },
    "ubverseApi": { "configured": true, "baseUrl": "https://development.unboundxinc.us/api" },
    "cmsApi": { "configured": true },
    "siteUrl": "https://yourdomain.com"
  },
  "system": {
    "nodeVersion": "v20.14.0",
    "platform": "linux",
    "memoryUsageMb": 64
  }
}
```

Point a free monitoring service like [UptimeRobot](https://uptimerobot.com) to `https://your-deployed-domain.com/api/health` to receive email notifications if your site goes down.
