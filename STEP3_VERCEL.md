# 🚀 Step 3: Deploy Frontend to Vercel

## ✅ Backend Status: DEPLOYED ✓

Your Railway backend is running successfully!

Now let's deploy the frontend to Vercel.

---

## 📋 What You Need

Before starting, get your Railway backend URL:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Settings" → "Networking"
4. If you don't see a domain, click "Generate Domain"
5. Copy the URL (e.g., `https://buildshare-production.up.railway.app`)

---

## 🎯 Deploy to Vercel (10 minutes)

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. Click "Add New..." → "Project"
2. Find your `buildshare` repository
3. Click "Import"

### Step 3: Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:

**Framework Preset:** Vite
**Root Directory:** `client` ← IMPORTANT!
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these TWO variables:

#### Variable 1: VITE_API_URL
- **Name:** `VITE_API_URL`
- **Value:** Your Railway backend URL (from above)
- **Example:** `https://buildshare-production.up.railway.app`
- **Important:** NO trailing slash!

#### Variable 2: VITE_GOOGLE_ADSENSE_CLIENT
- **Name:** `VITE_GOOGLE_ADSENSE_CLIENT`
- **Value:** `ca-pub-4344140632373860`

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see "Congratulations!" when done
4. Click "Visit" to see your live site
5. Copy your Vercel URL (e.g., `https://buildshare.vercel.app`)

---

## ✅ Expected Result

After deployment, you should see:

```
✅ Build successful
✅ Deployment ready
✅ Domain: https://your-app.vercel.app
```

Visit your site and you should see:
- BuildShare login/register page
- Cream background with charcoal header
- Gold "BuildShare" logo
- Ad placeholders (gray boxes)

---

## 🔧 If Build Fails

### Common Issues:

**Error: "Cannot find module 'vite'"**
- Solution: Check that `client/package.json` has vite in dependencies
- Vercel should auto-install, but verify Root Directory is set to `client`

**Error: "VITE_API_URL is not defined"**
- Solution: Add environment variables in Vercel dashboard
- Go to Project Settings → Environment Variables

**Error: "Build command failed"**
- Solution: Check build logs
- Usually means missing dependencies or syntax errors

---

## 🎯 Next Step: Update CORS

After frontend is deployed, you need to update Railway backend to allow requests from your Vercel URL.

### Quick CORS Update:

1. Go back to Railway dashboard
2. Click on your backend service
3. Go to "Variables"
4. Add new variable:
   - **Name:** `CORS_ORIGIN`
   - **Value:** Your Vercel URL (e.g., `https://buildshare.vercel.app`)
   - **Important:** NO trailing slash!
5. Railway will auto-redeploy

---

## 🧪 Test Your Deployment

### 1. Visit Your Vercel URL

Open: `https://your-app.vercel.app`

### 2. Test Registration

- Click "Register"
- Create a new account
- Should redirect to feed

### 3. Test Features

- [ ] Create a project
- [ ] View feed
- [ ] Check profile
- [ ] Send a message
- [ ] View analytics
- [ ] Check bookmarks

### 4. Check Backend Connection

Open browser console (F12) and check for:
- ✅ No CORS errors
- ✅ API calls succeeding
- ✅ Data loading properly

---

## 📊 Your Live URLs

After this step, you'll have:

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.railway.app
**Health Check:** https://your-backend.railway.app/health

---

## 🎉 Almost Done!

After completing this step:
- ✅ Backend deployed on Railway
- ✅ Frontend deployed on Vercel
- ⏳ CORS needs updating (next step)
- ⏳ Final testing needed

---

## 💡 Pro Tips

### Custom Domain (Optional)
1. Buy a domain (e.g., buildshare.com)
2. Add to Vercel project settings
3. Update DNS records
4. SSL automatically configured

### Monitor Performance
- Check Vercel Analytics dashboard
- Monitor build times
- Track page views

### Redeploy Frontend
- Push changes to GitHub
- Vercel auto-deploys on push
- Or manually trigger in dashboard

---

## 🆘 Need Help?

**Vercel Docs:** https://vercel.com/docs
**Vercel Support:** https://vercel.com/support

---

**Ready? Let's deploy to Vercel!** 🚀

After deployment, come back and we'll update CORS settings.
