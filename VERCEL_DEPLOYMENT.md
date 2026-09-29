# 🚀 Vercel Deployment Guide - StyleSense Frontend

Complete step-by-step guide to deploy StyleSense frontend on Vercel

## ✨ What is Vercel?

Vercel is a cloud platform optimized for React & Next.js apps with:
- ⚡ Global CDN (fast worldwide)
- 🔄 Automatic deployments from Git
- 🔐 HTTPS by default
- 📊 Built-in analytics
- 🆓 Free tier available

---

## 📋 Prerequisites

1. **GitHub Account** - Repository pushed ✅
2. **Vercel Account** - Free at [vercel.com](https://vercel.com)
3. **Supabase Keys** - Already configured ✅

---

## 🔧 Step 1: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose: **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. Complete signup

---

## 🚀 Step 2: Deploy from GitHub

### Method 1: Import Project (Recommended)

1. In Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for: `stylesense`
4. Select: `Nithyasreepadmanabhan/stylesense`
5. Click **"Import"**

---

## ⚙️ Step 3: Configure Environment Variables

1. After importing, you'll see **"Configure Project"** page
2. Under **"Environment Variables"**, add:

```
VITE_SUPABASE_URL = https://stmgefpcsrygxpuzncnw.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bWdlZnBjc3J5Z3hwdXpuY253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODE3NDMsImV4cCI6MjEwNjI1Nzc0M30.f9AgYIxdGX1vvZ8t9xOvII_JrN8cidTCa7KHuSw-ENk
```

3. Click **"Deploy"**

---

## ⏳ Step 4: Wait for Deployment

Vercel will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build the project (`npm run build`)
4. Deploy to global CDN
5. Generate URL

**Deployment typically takes 2-5 minutes**

---

## ✅ Step 5: Verify Deployment

When complete, you'll see:
- ✅ Deployment status: **"Ready"**
- 🌐 Preview URL: `https://stylesense-xxxxx.vercel.app`
- 📊 Deployment logs

Click the preview URL to test the app!

---

## 🎯 After Deployment

### Update Production Environment

In Vercel Dashboard:

1. Go to **Project Settings** → **Environment Variables**
2. Verify both Supabase variables are set
3. Make sure they're available for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records (Vercel will provide instructions)
4. Wait for DNS propagation (~24 hours)

---

## 🔄 Automatic Deployments

After first deployment, Vercel will **automatically redeploy** when you:
- Push to `main` branch
- Create pull requests (preview URLs)
- Update environment variables

### Push a Change to Test

```bash
cd stylesense
echo "// Test update" >> src/App.tsx
git add src/App.tsx
git commit -m "Test Vercel auto-deployment"
git push origin main
```

Vercel will automatically redeploy within minutes!

---

## 📊 Monitoring Deployment

### View Deployment Status

1. Vercel Dashboard → **Deployments** tab
2. See all deployments with:
   - ✅ Status (Ready, Building, Failed)
   - 📅 Date & time
   - 👤 Who triggered it
   - 📝 Git commit hash

### View Logs

1. Click on any deployment
2. See build logs and errors
3. Preview URL for testing

### Rollback (If Needed)

1. Click a previous **"Ready"** deployment
2. Click **"Redeploy"**
3. Wait for rollback to complete

---

## 🔐 Security Best Practices

✅ **DO:**
- ✅ Keep Supabase keys in environment variables (never in code)
- ✅ Use different keys for dev/prod if possible
- ✅ Regenerate tokens if accidentally exposed
- ✅ Enable Vercel's security settings

❌ **DON'T:**
- ❌ Commit `.env` file to Git
- ❌ Share API keys in chat or emails
- ❌ Use production keys in development
- ❌ Expose service role key in frontend

---

## 🚨 Troubleshooting

### Build Fails with "Module not found"

**Solution:**
```bash
npm install
npm run build
# If it works locally, push to GitHub
git add package-lock.json
git commit -m "Update package-lock"
git push origin main
```

### Environment Variables Not Working

**Solution:**
1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Verify variables are added
3. Redeploy: **Deployments** → **Click latest** → **Redeploy**

### Supabase Not Connecting

**Solution:**
1. Check environment variable values are correct
2. Verify Supabase project is active
3. Test in local dev first: `npm run dev`
4. Check browser console for errors

### Domain Not Working

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Check DNS records in domain registrar
3. Verify in Vercel's domain settings
4. Use `nslookup` or `dig` to check DNS

---

## 📈 After Deployment

### Monitor Performance

1. Vercel Dashboard → **Analytics** tab
2. View:
   - 📊 Page views & requests
   - ⚡ Performance metrics
   - 🌍 Geographic distribution
   - 📈 Trends over time

### Set Up Alerts (Pro)

1. **Settings** → **Notifications**
2. Enable alerts for:
   - Build failures
   - High error rates
   - Performance degradation

### Increase Scaling (Pro)

1. **Settings** → **Functions** → **Memory**
2. Increase for better performance (if needed)
3. Auto-scales based on traffic

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/stylesense-xxxxx/settings
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Integration:** https://vercel.com/docs/git/github

---

## 📝 Quick Reference

| Task | Steps |
|------|-------|
| **View Live App** | Click Preview URL in Dashboard |
| **Deploy Changes** | Push to GitHub → Auto-deploys |
| **Add Domain** | Settings → Domains → Add custom domain |
| **View Logs** | Deployments → Click deploy → View logs |
| **Rollback** | Deployments → Click old deploy → Redeploy |
| **Update Env Vars** | Settings → Environment Variables → Update |

---

## ✨ Production URL

After deployment, your app will be live at:

```
https://stylesense-xxxxx.vercel.app
```

Replace `xxxxx` with your Vercel project name.

Share this URL with anyone to access your app! 🎉

---

## 🎯 Next Steps

1. ✅ Create Vercel account
2. ✅ Import GitHub repository
3. ✅ Set environment variables
4. ✅ Deploy
5. ✅ Test live app
6. ✅ Share with friends!

---

**Deployment Guide Complete!**

Your frontend is now live on Vercel with automatic deployments from GitHub. 🚀

---

*Last Updated: 2026-09-29*
