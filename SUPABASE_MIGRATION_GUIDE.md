# 🚀 StyleSense Supabase Migration Guide

Complete guide to migrate from Flask + SQLite to Supabase (PostgreSQL + Auth)

## 📋 Table of Contents

1. [Overview](#overview)
2. [What You Need](#what-you-need)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Testing](#testing)

---

## Overview

This migration moves StyleSense from a monolithic Flask backend to a modern serverless architecture:

**Before:**
- Flask backend (Python)
- SQLite database (local)
- Session-based authentication
- Tightly coupled frontend & backend

**After:**
- Supabase PostgreSQL (cloud)
- Supabase Auth (JWT tokens)
- React frontend with Supabase JS client
- Flask backend for AI logic (optional)
- Scalable & secure architecture

### Benefits

✅ **Scalability** - PostgreSQL handles millions of requests
✅ **Security** - Supabase Auth with 2FA, SSO, OAuth
✅ **Real-time** - Supabase subscriptions for live updates
✅ **RLS** - Row Level Security for data privacy
✅ **Serverless** - No server maintenance
✅ **Backups** - Automatic daily backups
✅ **CDN** - Global edge caching

---

## What You Need

### 1. Supabase Account
- Visit [supabase.com](https://supabase.com)
- Sign up (free tier available)
- Create a new project

### 2. Required API Keys (We'll get these from Supabase)

| Key | Purpose | Where to Find |
|-----|---------|---------------|
| `VITE_SUPABASE_URL` | Frontend connection | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Frontend public key | Supabase Dashboard → Settings → API |
| `SUPABASE_URL` | Backend connection | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend admin key | Supabase Dashboard → Settings → API |
| `SUPABASE_JWT_SECRET` | JWT token secret | Supabase Dashboard → Settings → API |
| `SECRET_KEY` | Flask sessions | Generate: `python -c "import secrets; print(secrets.token_hex(32))"` |

---

## Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in / Create account
4. Click "New Project"
5. Fill in:
   - **Project name:** `stylesense`
   - **Database password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
6. Wait for project to initialize (~2-3 minutes)

### Step 2: Get API Keys

1. Go to **Settings → API** in Supabase Dashboard
2. You'll see:
   - **Project URL** → Copy to `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** → Copy to `VITE_SUPABASE_ANON_KEY`
   - **service_role secret** → Copy to `SUPABASE_SERVICE_ROLE_KEY` ⚠️ KEEP SECRET
   - **JWT Secret** → Copy to `SUPABASE_JWT_SECRET`

3. Go to **Settings → Database** for database password

### Step 3: Create .env File

Create a `.env` file in your project root with these values:

```bash
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=generate-random-hex-string
```

### Step 4: Setup Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Click "New Query"
3. Copy the entire content from: `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click **"Run"** button
6. Wait for completion (~10 seconds)

✅ Database tables are now created with RLS policies!

### Step 5: Enable Authentication

1. Go to **Authentication → Providers**
2. Ensure "Email" is enabled (should be by default)
3. Optional: Enable social providers (Google, GitHub, etc.)

### Step 6: Install Python Supabase Client

```bash
pip install supabase
```

### Step 7: Update Frontend Configuration

The frontend is already configured! It reads from environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No code changes needed - just the `.env` file.

### Step 8: Update Backend (Flask)

**Option A: Use New Supabase Backend (Recommended)**

```bash
# Rename old backend
mv app.py app_sqlite.py

# Use new Supabase backend
mv app_supabase.py app.py

# Install dependencies
pip install supabase python-dotenv

# Start backend
python app.py
```

**Option B: Keep Flask for AI Logic Only**

You can keep Flask for complex business logic:
- Outfit recommendation engine
- Style quiz analysis
- Color harmony calculations
- Image processing

Flask will connect to Supabase PostgreSQL for data storage.

### Step 9: Test the Migration

#### Frontend Test

```bash
npm run dev
# Visit http://localhost:3000
# Try: Register → Login → Create wardrobe item
```

#### Backend Test

```bash
python app.py
# Visit http://127.0.0.1:5000/login
# Try: Register → Login → View dashboard
```

---

## Environment Variables

### Frontend (.env)

```env
VITE_SUPABASE_URL=<Get from Supabase Dashboard → Settings → API>
VITE_SUPABASE_ANON_KEY=<Get from Supabase Dashboard → Settings → API>
```

### Backend (.env)

```env
# Supabase
SUPABASE_URL=<Get from Supabase Dashboard → Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<Get from Supabase Dashboard → Settings → API>
SUPABASE_JWT_SECRET=<Get from Supabase Dashboard → Settings → API>

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=<Generate: python -c "import secrets; print(secrets.token_hex(32))">
```

### How to Get Each Key

#### VITE_SUPABASE_URL & SUPABASE_URL
1. Supabase Dashboard → **Settings**
2. Click **API**
3. Copy **Project URL**
4. Format: `https://xxxxxxxxxxxx.supabase.co`

#### VITE_SUPABASE_ANON_KEY
1. Supabase Dashboard → **Settings → API**
2. Under "Project API keys"
3. Copy **"anon public"** key
4. It's safe to expose (used in frontend)

#### SUPABASE_SERVICE_ROLE_KEY
1. Supabase Dashboard → **Settings → API**
2. Under "Project API keys"
3. Copy **"service_role secret"** key
4. ⚠️ **NEVER** commit to git or expose publicly
5. Use only in backend (server-side)

#### SUPABASE_JWT_SECRET
1. Supabase Dashboard → **Settings → API**
2. Scroll down to **"JWT Secret"**
3. Copy the secret
4. Used for token verification

#### SECRET_KEY
Generate random hex string:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## Database Setup

### Tables Created

1. **users** - User profiles
2. **style_preferences** - User style settings
3. **wardrobe_items** - Clothing items
4. **saved_outfits** - Outfit combinations
5. **style_quiz_results** - Quiz answers
6. **designer_profiles** - Designer accounts
7. **digital_designs** - Designer creations
8. **moderation_reports** - Admin moderation

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can only read/write their own data
- Admin can access moderation tables
- Designers can access their designs

### Indexes

Performance indexes created for:
- `user_id` - Fast user lookups
- `category` - Quick filtering
- `status` - Moderation queries

---

## Testing

### Test Registration Flow

1. **Frontend:**
   - Navigate to http://localhost:3000/register
   - Create account with email/password
   - Check Supabase Dashboard → Authentication → Users

2. **Backend:**
   - Navigate to http://127.0.0.1:5000/register
   - Create account (creates user in Supabase)
   - Check database: `SELECT * FROM users;`

### Test Login Flow

1. **Frontend:**
   - Register account
   - Login with email/password
   - Should redirect to dashboard

2. **Backend:**
   - Same as frontend
   - Session should be created
   - Should display personalized dashboard

### Test Data Operations

1. **Create Wardrobe Item:**
   - Add item through UI
   - Check Supabase Dashboard → Data Editor → wardrobe_items

2. **Query Data:**
   - Frontend queries via `dataService`
   - Backend queries via Supabase client

### Verify RLS

Try accessing another user's data:
- Should fail (RLS blocking)
- Each user sees only their data

---

## Troubleshooting

### Problem: "Invalid API Keys"

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Verify the keys are copied correctly
3. Check `.env` file has no extra spaces
4. Restart dev server: `npm run dev`

### Problem: "Database connection failed"

**Solution:**
1. Check internet connection
2. Verify Supabase project is running (should show green status)
3. Check firewall not blocking Supabase
4. Try: `curl https://your-project.supabase.co/rest/v1/`

### Problem: "RLS policy violation"

**Solution:**
1. Check user is authenticated
2. Verify `user_id` matches session
3. Check RLS policy allows operation
4. May need to enable "Realtime" in Supabase Dashboard

### Problem: "Auth token expired"

**Solution:**
1. Clear browser cache/cookies
2. Logout and login again
3. Tokens auto-refresh in Supabase JS client

---

## Migration Checklist

- [ ] Create Supabase account and project
- [ ] Get API keys from Supabase Dashboard
- [ ] Create `.env` file with all keys
- [ ] Run SQL migrations in Supabase SQL Editor
- [ ] Enable Email authentication in Supabase
- [ ] Install Python Supabase client: `pip install supabase`
- [ ] Update Flask backend to use Supabase
- [ ] Test frontend registration/login
- [ ] Test backend registration/login
- [ ] Test data creation and queries
- [ ] Verify RLS policies working
- [ ] Delete old SQLite database (backup first!)

---

## Next Steps

### Phase 1: Core Features
- ✅ Authentication (Email/Password)
- ✅ User profiles
- ✅ Wardrobe management
- ✅ Outfit saving

### Phase 2: AI Features
- Style quiz analysis
- Outfit recommendations
- Color harmony suggestions
- Fashion trend analysis

### Phase 3: Social Features (Optional)
- User following
- Outfit sharing
- Designer marketplace
- Real-time notifications

### Phase 4: Production
- Enable OAuth (Google, GitHub)
- Set up email verification
- Configure backups
- Set up monitoring
- Enable analytics

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Supabase RLS:** https://supabase.com/docs/guides/realtime/row-level-security
- **Flutter SDK:** https://supabase.com/docs/reference/javascript

---

**Status:** ✅ Migration files created and ready!

Next: Provide API keys and we'll complete the setup.
