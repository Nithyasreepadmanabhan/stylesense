# 🔑 StyleSense Supabase - API Keys & Environment Variables Needed

## Quick Summary

You need **4 API keys** from your Supabase project:

1. ✅ **VITE_SUPABASE_URL** - Project URL
2. ✅ **VITE_SUPABASE_ANON_KEY** - Frontend public key
3. ✅ **SUPABASE_SERVICE_ROLE_KEY** - Backend secret key
4. ✅ **SUPABASE_JWT_SECRET** - JWT signing secret

Plus **1 additional key** to generate:
5. ✅ **SECRET_KEY** - Flask session secret

---

## 📍 Where to Get Each Key

### 1. VITE_SUPABASE_URL (Project URL)

**What:** Your Supabase project's base URL

**Where to find:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create one at [supabase.com](https://supabase.com))
3. Click **Settings** → **API**
4. Look for "Project URL"
5. Copy the URL (format: `https://xxxxxxxxxxxxx.supabase.co`)

**Example:**
```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
```

---

### 2. VITE_SUPABASE_ANON_KEY (Frontend Public Key)

**What:** Public API key for frontend (safe to expose)

**Where to find:**
1. Same location: **Settings → API**
2. Under "Project API keys" section
3. Look for "anon public"
4. Copy the key

**Example:**
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNjQ4OTAwMCwiZXhwIjoxOTcyNjI0ODAwfQ.abcdefghijklmnopqrstuvwxyz123456
```

**Security Note:** ✅ Safe to use in frontend (publicly visible in browser)

---

### 3. SUPABASE_SERVICE_ROLE_KEY (Backend Secret Key)

**What:** Secret key for backend server operations (DO NOT EXPOSE)

**Where to find:**
1. Same location: **Settings → API**
2. Under "Project API keys" section
3. Look for "service_role secret"
4. Copy the key

**Example:**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNzA2NDg5MDAwLCJleHAiOjE5NzI2MjQ4MDB9.abcdefghijklmnopqrstuvwxyz123456
```

**Security Note:** ⚠️ **KEEP SECRET!**
- Never commit to Git
- Never share publicly
- Only use in backend (.env file)
- Regenerate if accidentally exposed

---

### 4. SUPABASE_JWT_SECRET (JWT Signing Secret)

**What:** Secret used to sign JWT tokens

**Where to find:**
1. Go to **Settings → API**
2. Scroll down to "JWT Secret"
3. Copy the secret

**Example:**
```
SUPABASE_JWT_SECRET=your-super-secret-jwt-key-12345678
```

**Security Note:** ⚠️ Keep secret, needed for token verification

---

### 5. SECRET_KEY (Generate This)

**What:** Secret key for Flask session management

**How to generate:**
Open terminal and run:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Output example:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

**Set in .env:**
```
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
```

---

## 📝 Complete .env Template

Copy and paste this template, then fill in your values:

```bash
# ============================================
# FRONTEND ENVIRONMENT VARIABLES
# ============================================

# Supabase Frontend Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# BACKEND ENVIRONMENT VARIABLES
# ============================================

# Supabase Backend Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-super-secret-jwt-key

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=generate-random-hex-string
```

---

## ✅ Verification Checklist

Before starting the app, verify:

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created a new Supabase project
- [ ] Copied all 4 API keys from Supabase Dashboard
- [ ] Created `.env` file in project root
- [ ] Pasted all keys into `.env` file
- [ ] Generated `SECRET_KEY` using Python command
- [ ] Ran SQL migrations in Supabase SQL Editor
- [ ] `.env` file is in `.gitignore` (never commit!)
- [ ] Installed dependencies: `pip install -r requirements_supabase.txt`

---

## 🚀 Quick Start Command

After gathering all keys:

```bash
# 1. Create .env file
cat > .env << 'EOF'
VITE_SUPABASE_URL=<paste your URL>
VITE_SUPABASE_ANON_KEY=<paste your anon key>
SUPABASE_URL=<paste your URL>
SUPABASE_SERVICE_ROLE_KEY=<paste your secret key>
SUPABASE_JWT_SECRET=<paste your JWT secret>
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=<generate random hex string>
EOF

# 2. Install dependencies
pip install -r requirements_supabase.txt

# 3. Start frontend (in one terminal)
npm run dev

# 4. Start backend (in another terminal)
python app.py
```

---

## 📍 API Keys Location in Supabase Dashboard

### Main Navigation
```
Supabase Dashboard
├── Project Selection
├── Settings (gear icon)
│   ├── API ⬅️ YOU ARE HERE
│   │   ├── Project URL ← VITE_SUPABASE_URL
│   │   ├── Project API Keys
│   │   │   ├── anon public ← VITE_SUPABASE_ANON_KEY
│   │   │   └── service_role secret ← SUPABASE_SERVICE_ROLE_KEY
│   │   └── JWT Secret ← SUPABASE_JWT_SECRET
│   └── Database (for password verification)
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Store `SUPABASE_SERVICE_ROLE_KEY` in backend only
- Use environment variables, not hardcoded values
- Add `.env` to `.gitignore`
- Rotate keys regularly (can regenerate in Supabase)
- Use HTTPS in production
- Enable 2FA on Supabase account

### ❌ DON'T:
- Commit `.env` to Git
- Share `SUPABASE_SERVICE_ROLE_KEY` with anyone
- Expose keys in client-side code
- Put keys in HTML/JavaScript
- Share keys in Slack/Email
- Push keys to GitHub (Supabase will scan and invalidate them)

---

## 🆘 Troubleshooting

### "Invalid API keys"
- Verify you copied the complete key (no extra spaces)
- Check `.env` file has no extra spaces around `=`
- Restart dev server after editing `.env`
- Keys should start with `https://` (URL) or `eyJ` (JWT)

### "Cannot read properties of undefined"
- Check if `.env` variables are loaded
- Verify Supabase project is running (green status in dashboard)
- Check if all required environment variables are set

### "Unauthorized" or "403 Forbidden"
- Check you're using correct key (frontend vs backend)
- Verify `SUPABASE_SERVICE_ROLE_KEY` in backend
- Check RLS policies in Supabase Database section

### "Project not found"
- Verify Supabase URL is correct (no typos)
- Check project is still active (hasn't been deleted)
- Try: `curl https://your-url.supabase.co/rest/v1/`

---

## 📞 Need Help?

1. **Supabase Documentation:** https://supabase.com/docs
2. **API Reference:** https://supabase.com/docs/reference
3. **Supabase Community:** https://github.com/supabase/supabase/discussions

---

## Summary

**When you're ready, provide:**
1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. `SUPABASE_JWT_SECRET`

And let me know! I'll:
1. Create your `.env` file
2. Run the database migrations
3. Start the backend
4. Test the entire setup

✅ **Status:** Ready to collect API keys!
