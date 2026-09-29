# 🖥️ Render Backend Deployment Guide - StyleSense Flask API

Complete step-by-step guide to deploy Flask backend on Render

## ✨ What is Render?

Render is a cloud platform for deploying web services with:
- ⚡ Free tier available
- 🔄 Auto-deploy from GitHub
- 🗄️ PostgreSQL ready
- 🆓 No credit card needed (free tier)
- 🌍 Global servers

---

## 📋 Prerequisites

1. **GitHub Repository** - Pushed ✅
2. **Render Account** - Free at [render.com](https://render.com)
3. **Supabase Keys** - Already configured ✅
4. **Flask app** - `app_supabase.py` ready ✅

---

## 🔧 Step 1: Create Render Account

1. Visit [render.com](https://render.com)
2. Click **"Sign Up"**
3. Choose: **"GitHub"**
4. Authorize Render to access GitHub
5. Complete signup

---

## 🚀 Step 2: Deploy Flask Backend

### Create New Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect a Repository"**
3. Search for: `stylesense`
4. Select: `Nithyasreepadmanabhan/stylesense`
5. Click **"Connect"**

### Configure Service

Fill in the deployment form:

| Field | Value |
|-------|-------|
| **Name** | `stylesense-backend` |
| **Environment** | `Python 3` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Build Command** | `pip install -r requirements_supabase.txt` |
| **Start Command** | `python app_supabase.py` |

### Select Plan

- Choose **"Free"** plan (sufficient for testing)
- Click **"Create Web Service"**

---

## ⚙️ Step 3: Add Environment Variables

After creating service:

1. Click **"Environment"** (left sidebar)
2. Click **"Add Environment Variable"**
3. Add these variables:

```
SUPABASE_URL
https://stmgefpcsrygxpuzncnw.supabase.co

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bWdlZnBjc3J5Z3hwdXpuY253Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDY4MTc0MywiZXhwIjoyMTA2MjU3NzQzfQ.XFax-ddDwt-EyCg1LTFrwlb7cY-sjXvIcxk_BNZfmko

SUPABASE_JWT_SECRET
FEIL3VrXy3uxjDKcK9qd8b4Rn+SAxVrs45U+noEDcLywegdMavjiKixyM75kI0RmWVB/i7twsWGEesAm90pJIA==

FLASK_ENV
production

SECRET_KEY
a7f3c9e2b1d4f6a8c0e5b7d9f1a3c5e7g9i1k3m5o7q9s1u3w5y7z9b1d3f5h7
```

4. Click **"Save"** for each variable

---

## ⏳ Step 4: Wait for Deployment

Render will:
1. Clone your GitHub repository
2. Install Python dependencies
3. Build the Flask app
4. Deploy to the cloud
5. Generate a URL

**Deployment takes 3-5 minutes**

Monitor progress in the **"Logs"** tab

---

## ✅ Step 5: Verify Deployment

When deployment completes:

### Check Status

1. Look for **"Live"** status (green)
2. You'll see a URL like:
   ```
   https://stylesense-backend-xxxxx.onrender.com
   ```

### Test Backend API

Open in browser:
```
https://stylesense-backend-xxxxx.onrender.com/login
```

Should see Flask login page! ✅

### Test API Endpoint

```bash
curl -X GET https://stylesense-backend-xxxxx.onrender.com/
```

Should return response (or redirect to login)

---

## 📝 Important Notes

### Free Tier Limitation

⚠️ Free tier apps sleep after 15 minutes of inactivity
- First request wakes it up (takes 30 seconds)
- Perfect for testing/development
- Upgrade to paid ($7/month) for production

### Keep Alive Solution

To prevent sleeping, add this to your cron:

```
Every 10 minutes: GET https://your-backend-url/
```

Or upgrade to paid plan for always-on service.

---

## 🔄 Auto-Deployments

After first deployment:

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Render automatically redeploys** (within 2-5 minutes)

3. **Monitor in Render Dashboard** → **Deployments** tab

---

## 🖇️ Connect Frontend to Backend

### Get Backend URL

From Render Dashboard, copy your backend URL:
```
https://stylesense-backend-xxxxx.onrender.com
```

### Update Frontend

When deploying frontend on Vercel, you can optionally add backend URL as environment variable:

```
VITE_BACKEND_URL=https://stylesense-backend-xxxxx.onrender.com
```

This allows frontend to make API calls to your backend.

---

## 🐛 Troubleshooting

### Build Fails - "No module named..."

**Solution:**
```bash
# Ensure all dependencies are in requirements_supabase.txt
pip freeze > requirements_supabase.txt
git add requirements_supabase.txt
git commit -m "Update dependencies"
git push origin main
# Render will auto-redeploy
```

### Service Won't Start - "python: command not found"

**Solution:**
1. Go to **Settings** → **Environment**
2. Make sure **Python version** is set to `3.11` or higher
3. Check **Start Command**: `python app_supabase.py`
4. Click **"Manual Deploy"** → **"Latest Deployment"**

### Getting 502 Bad Gateway

**Solution:**
1. Check app logs in Render Dashboard
2. Look for error messages
3. Common causes:
   - Missing environment variables
   - Supabase connection failed
   - Port not configured correctly

Flask runs on **port 5000** by default (Render handles this)

### App Goes to Sleep

**Solution (Free Tier):**
- First request wakes it (normal, takes 30 seconds)
- To avoid, upgrade to paid plan
- Or set up monitoring to ping it every 10 minutes

---

## 📊 Monitoring Backend

### View Logs

1. Render Dashboard → **Logs** tab
2. See real-time server logs
3. Useful for debugging

### View Deployments

1. **Deployments** tab
2. See all deployment history
3. Rollback if needed: click old deployment → **Redeploy**

### Monitor Performance

1. **Metrics** tab
2. View:
   - CPU usage
   - Memory usage
   - Request count
   - Error rate

---

## 🔗 Useful Links

- **Render Dashboard:** https://dashboard.render.com
- **Web Service Settings:** https://dashboard.render.com/services
- **Render Docs:** https://render.com/docs
- **Python Guide:** https://render.com/docs/deploy-python

---

## 📝 Quick Reference

| Task | Steps |
|------|-------|
| **View Live App** | Copy URL from Dashboard |
| **Deploy Changes** | Push to GitHub → Auto-deploys |
| **View Logs** | Dashboard → Logs tab |
| **Update Env Vars** | Environment tab → Update → Save |
| **Restart Service** | Settings → Manual Deploy |
| **Upgrade Plan** | Settings → Change plan |

---

## ✨ Production Backend URL

After deployment, your backend will be live at:

```
https://stylesense-backend-xxxxx.onrender.com
```

**Use this URL when deploying frontend on Vercel!** 🎉

---

## 🎯 Next Steps

1. ✅ Create Render account
2. ✅ Deploy Flask backend
3. ✅ Verify it's running
4. 📝 Note the backend URL
5. ➡️ Deploy frontend on Vercel (using backend URL)
6. ✅ Connect them together

---

## 🚀 Summary

| Component | Status | URL |
|-----------|--------|-----|
| **GitHub Repo** | ✅ Live | https://github.com/Nithyasreepadmanabhan/stylesense |
| **Backend** | ⏳ Deploying | https://stylesense-backend-xxxxx.onrender.com |
| **Frontend** | 📋 Next | Will be on Vercel |
| **Database** | ✅ Ready | Supabase Cloud |

---

**Your backend is now deployed!** 🎉

Next: Deploy frontend on Vercel and connect them together.

---

*Last Updated: 2026-09-29*
