# VaultFlow — Modern Fintech Investment & Crypto Portfolio Platform

A modern, full-stack fintech platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma and PostgreSQL. Includes a marketing site, authentication with TOTP 2FA, a polished user dashboard, a role-based admin panel, instant-execution trading, multi-chain receive wallets, transaction history with charts, and webhook endpoints for **Coinbase Commerce** and **NOWPayments**.

---

## Highlights

- **Frontend** — Tailwind CSS, polished dark/light theme, Recharts, mobile-first responsive layouts.
- **Pages** — Landing, pricing, FAQ, contact, login, register, forgot/reset password, email verify, user dashboard, wallets, transactions, invest, notifications, settings, admin home, users, payments, logs.
- **Auth** — NextAuth Credentials provider, bcrypt 12-round hashing, JWT sessions, email verification, password reset via signed tokens, TOTP 2FA (otplib + QR code).
- **Crypto** — Multi-asset wallet directory with copyable deposit addresses, instant-execution trading (`/api/invest`), Coinbase Commerce + NOWPayments webhooks with signed HMAC verification.
- **Admin** — Role-based access, user role editor, payment monitoring, immutable audit log table.
- **Backend** — Prisma 5, PostgreSQL, Zod input validation, in-memory rate limiting, JSON structured logging.
- **Security** — Strict HTTP headers, parameterised queries, CSRF-resistant flows via SameSite session cookies, OWASP-aware defaults.
- **Ops** — Multi-stage Dockerfile, docker-compose with Postgres, ready for Vercel + Railway/Neon/Supabase.

---

## Project structure

```
fintech-app/
├── prisma/
│   ├── schema.prisma          # User, Wallet, Asset, Transaction, Notification, AuditLog…
│   └── seed.ts                # Admin + sample investor + price history + sample transactions
├── src/
│   ├── app/
│   │   ├── (auth)/            # login / register / forgot / reset / verify
│   │   ├── dashboard/         # overview, wallets, transactions, invest, notifications, settings
│   │   ├── admin/             # home, users, payments, logs
│   │   ├── api/               # REST routes — auth/, invest, portfolio, prices, webhooks/, admin/
│   │   ├── pricing/  faq/  contact/
│   │   ├── layout.tsx · page.tsx · globals.css · not-found.tsx
│   │   └── middleware.ts      # auth gate for /dashboard and /admin
│   ├── components/            # ui/, layout/, dashboard/, providers
│   └── lib/                   # prisma, auth, validation, rate-limit, logger, payments, portfolio…
├── Dockerfile  docker-compose.yml  .env.example
└── tsconfig.json  next.config.mjs  tailwind.config.ts  postcss.config.mjs
```

---

## Quick start (local development)

```bash
cd fintech-app
cp .env.example .env             # then edit DATABASE_URL + NEXTAUTH_SECRET
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev                      # http://localhost:3000
```

**Seeded accounts:**

- Admin: `admin@vaultflow.local` / `ChangeMe!2026`
- Sample investor: `demo@vaultflow.local` / `Demo!2026`

`docker compose up --build` will start Postgres + the app in production mode (port 3000).

---

## Environment variables

See [.env.example](.env.example) for the full list. Required for local dev:

| Variable                | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string used by Prisma         |
| `NEXTAUTH_SECRET`       | JWT signing key (`openssl rand -base64 32`)         |
| `NEXTAUTH_URL`          | Base URL of the app (e.g. `http://localhost:3000`)  |

Optional for full feature parity:

| Variable                                            | Purpose                                |
| --------------------------------------------------- | -------------------------------------- |
| `SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS`     | Outbound email (verification + reset)  |
| `EMAIL_FROM`                                        | "From" header                          |
| `COINBASE_COMMERCE_API_KEY / _WEBHOOK_SECRET`       | Coinbase Commerce charges + webhooks   |
| `NOWPAYMENTS_API_KEY / _IPN_SECRET`                 | NOWPayments deposits + IPN signatures  |
| `ADMIN_EMAIL / ADMIN_PASSWORD`                      | Bootstrap admin during seed            |

If SMTP is not configured, verification/reset links are printed to the server logs.

---

## API reference (REST)

| Method | Path                                     | Auth     | Description                              |
| ------ | ---------------------------------------- | -------- | ---------------------------------------- |
| POST   | `/api/auth/register`                     | public   | Create account, send verification email  |
| POST   | `/api/auth/forgot`                       | public   | Send password-reset link                 |
| POST   | `/api/auth/reset`                        | public   | Apply password reset                     |
| POST   | `/api/auth/verify-email`                 | user     | Re-send email verification               |
| POST   | `/api/auth/2fa/setup`                    | user     | Generate TOTP secret + QR                |
| POST   | `/api/auth/2fa/enable`                   | user     | Confirm TOTP and enable 2FA              |
| POST   | `/api/auth/2fa/disable`                  | user     | Disable 2FA                              |
| GET    | `/api/portfolio`                         | user     | Summary + 30-day value history           |
| GET    | `/api/wallets`                           | user     | Wallet addresses for the user            |
| GET    | `/api/transactions`                      | user     | Paginated transaction list               |
| POST   | `/api/invest`                            | user     | Instant-execution BUY / SELL             |
| GET    | `/api/prices`                            | public   | Cached asset prices                      |
| POST   | `/api/prices`                            | admin    | Trigger CoinGecko refresh                |
| POST   | `/api/notifications/read-all`            | user     | Mark all notifications as read           |
| POST   | `/api/contact`                           | public   | Contact form (rate-limited)              |
| POST   | `/api/webhooks/coinbase`                 | webhook  | Verified Coinbase Commerce events        |
| POST   | `/api/webhooks/nowpayments`              | webhook  | Verified NOWPayments IPN events          |
| PATCH  | `/api/admin/users/:id/role`              | admin    | Update a user's role                     |
| GET    | `/api/health`                            | public   | DB-aware health probe                    |

NextAuth itself lives at `/api/auth/[...nextauth]` (sign-in/out, session).

---

## Deployment

### Vercel

1. Push the repo to GitHub.
2. Provision a managed Postgres (Vercel Postgres / Neon / Supabase / Railway).
3. Import the project in Vercel, set the env vars from `.env.example`.
4. Vercel runs `npm run build`, which executes `prisma generate`. On first deploy add a one-off `npx prisma migrate deploy` (Vercel → "Build & Development Settings" → custom build command, or run from your machine against the production URL).
5. Set `NEXTAUTH_URL` to the production domain.

### Railway

1. Create a new project → "Deploy from GitHub". Railway auto-detects the Next.js app.
2. Add a Postgres plugin and copy `DATABASE_URL` into the service env.
3. Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
4. Override the start command (Railway → Service → Settings → Deploy → Start Command):
   ```
   npx prisma migrate deploy && node .next/standalone/server.js
   ```
5. Expose port `3000`. Railway will issue an HTTPS domain — done.

### Docker (self-host)

```bash
docker compose up --build
# app on http://localhost:3000, Postgres on :5432
```

---

## Security checklist

- [x] bcrypt password hashing (12 rounds)
- [x] JWT sessions over secure cookies (NextAuth defaults)
- [x] TOTP 2FA via `otplib`
- [x] Per-IP rate limiting on register / forgot / reset / invest / contact
- [x] HMAC-verified webhook endpoints
- [x] Zod-validated request bodies
- [x] Parameterised queries through Prisma (no string-built SQL)
- [x] Strict security headers (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- [x] Audit log table

Recommended for production at scale:

- Swap the in-memory rate limiter for Redis / Upstash
- Wire up an email provider (Resend, SES, Postmark)
- Add monitoring (Sentry, Datadog)
- Add WAF and DDoS protection in front of the deployment

---

## License

Proprietary. All rights reserved.
