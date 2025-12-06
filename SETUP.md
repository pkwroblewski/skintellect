# Skintellect Quick Setup Guide

## 🚀 One-Time Setup (5 minutes)

### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name:** `skintellect`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
4. Wait for project to provision (~2 min)
5. Go to **Project Settings → Database**
6. Copy the **Connection string (URI)** - looks like:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

### Step 2: Set Environment Variables

Create a file called `.env.local` in the project root:

```env
# Database
DATABASE_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 3: Initialize Database

Run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data
npm run db:seed
```

### Step 4: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000/products/cosrx-advanced-snail-92-cream

---

## 🌐 Deploy to Vercel

### Option A: CLI (Recommended)

```bash
# Link project (if not done)
vercel link

# Add environment variables
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy
vercel --prod
```

### Option B: Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables in Settings → Environment Variables
4. Deploy

---

## 📊 Analytics (Optional)

### Plausible
1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com`

### PostHog
1. Sign up at [posthog.com](https://posthog.com)
2. Get your API key
3. Set `NEXT_PUBLIC_POSTHOG_KEY=phc_xxx`

---

## 🔧 Useful Commands

```bash
# Database
npm run db:generate  # Regenerate Prisma client
npm run db:push      # Push schema changes
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio (GUI)

# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check for errors
```

---

## 📁 Project Structure

```
skintellect/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
├── src/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   │   └── product/     # Product page components
│   └── lib/
│       └── repositories/ # Database queries
└── .env.local           # Your secrets (not in git)
```

