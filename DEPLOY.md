# Deployment Guide — ElonEdge

This app is a Next.js 14 (App Router) project that uses:
- **Neon Postgres** for the database (already cloud-hosted)
- **Prisma** as the ORM
- **JWT cookies + localStorage tokens** for auth (no NextAuth, no third-party auth provider)

The recommended host is **Vercel** — zero-config for Next.js. The steps below
also work on Netlify, Render, Fly.io, Railway, or any Node host that supports
Next.js standalone output.

---

## 1. Before you deploy

### Generate fresh secrets

```powershell
# Generate a strong SESSION_SECRET (used to sign JWTs):
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Copy the output. You'll paste it into `SESSION_SECRET` on your host.

### Pick admin credentials

Decide on the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you want for production.
Anyone with these can sign into `/admin/login` and edit assets, users, and
homepage copy. Choose a strong password.

---

## 2. Vercel deployment (recommended)

### Step 1 — Push to GitHub
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOU/elonedge.git
git push -u origin main
```

### Step 2 — Import to Vercel
1. Go to https://vercel.com/new
2. Import the GitHub repo
3. Framework Preset will auto-detect as Next.js

### Step 3 — Add environment variables
In Vercel's project settings → Environment Variables, add:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | Your Neon **pooled** URL | from `.env` |
| `DIRECT_URL` | Your Neon **direct** URL | from `.env` |
| `SESSION_SECRET` | The 48-byte base64 string you generated | keep secret |
| `ADMIN_EMAIL` | Your admin email | used for `/admin/login` |
| `ADMIN_PASSWORD` | Your strong admin password | used for `/admin/login` |
| `NEXT_PUBLIC_APP_NAME` | `ElonEdge` | shown in metadata |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | absolute URLs |

### Step 4 — Deploy
Click **Deploy**. First build takes 1–2 minutes. Once it's live, visit
`https://your-domain.vercel.app/admin/login` and sign in with the credentials
you just set.

---

## 3. Database migrations

The Prisma schema is already applied to your Neon DB. If you change the schema
later:

```powershell
# Locally — generate a new migration:
npx prisma migrate dev --name describe_your_change

# On Vercel — automatically applied at build time because package.json runs
# `prisma generate` and the migrations are checked into git.
```

For production, you can also manually apply pending migrations:
```powershell
npx prisma migrate deploy
```

---

## 4. After deployment

### Sign in as admin
`https://your-domain.com/admin/login` → enter `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Populate assets
On `/admin` → click **"Reset assets to defaults"** once to seed the 7 Musk
assets and the homepage stats into the DB. After that, edit them anytime from
`/admin/assets` and `/admin/site`.

### Manage users
Visit `/admin/users` to view all registered users, edit balances, and delete
accounts.

---

## 5. Local development

```powershell
cd "C:\Users\yrnko\Desktop\my app\fintech-app"

# First time only:
npm install
npx prisma generate

# Start dev server (localhost only):
npm run dev

# Start dev server (also accessible on LAN — for phone testing):
npm run dev:lan
# Then visit http://YOUR-COMPUTER-LAN-IP:3000 on the phone
```

---

## 6. Troubleshooting

### "Missing required error components, refreshing..."
The Prisma client is out of sync with the schema. Fix:
```powershell
Get-Process node | Stop-Process -Force
Remove-Item -Recurse -Force .next, "node_modules\.cache", "node_modules\.prisma"
npx prisma generate
npm run dev
```

### Admin login returns "Invalid admin credentials"
Your environment variables aren't loaded. Check that `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are set on your host. After changing them, redeploy.

### iOS Safari can't keep you signed in
Already handled — the app uses both cookies AND `Authorization: Bearer`
headers backed by `localStorage`, so Safari's HTTP/LAN cookie restrictions
don't block auth.
