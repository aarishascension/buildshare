# 🔍 Error 405 Diagnosis & Fix

## What is Error 405?

**405 Method Not Allowed** means:
- The URL exists
- But the HTTP method (GET, POST, PUT, DELETE) is not allowed for that endpoint

## Most Likely Cause

**The VITE_API_URL environment variable is NOT set in Vercel!**

This means axios is using the fallback URL `http://localhost:5000`, which doesn't work in production.

---

## ✅ IMMEDIATE FIX

### Step 1: Check Vercel Environment Variables

1. Go to https://vercel.com
2. Click on your `buildshare` project
3. Go to "Settings" tab
4. Click "Environment Variables" in the left sidebar
5. Check if you have these TWO variables:

```
VITE_API_URL
VITE_GOOGLE_ADSENSE_CLIENT
```

### Step 2: If Missing, Add VITE_API_URL

**You MUST add this variable:**

1. Click "Add New" button
2. **Key:** `VITE_API_URL`
3. **Value:** Your Railway backend URL
   - Example: `https://buildshare-production-abc123.up.railway.app`
   - Get it from Railway → Your Service → Settings → Networking
   - **IMPORTANT:** NO trailing slash!
4. **Environment:** Select all (Production, Preview, Development)
5. Click "Save"

### Step 3: Redeploy

After adding the variable:
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"
4. Wait 2-3 minutes

---

## 🔍 How to Verify the Issue

### Check 1: Look at Network Tab

1. Open your Vercel site
2. Press F12 (DevTools)
3. Go to "Network" tab
4. Try to register
5. Look at the failed request

**If you see:**
```
Request URL: https://buildshare.vercel.app/api/auth/register
Status: 405
```

**This confirms:** API call is going to Vercel instead of Railway!

**Should be:**
```
Request URL: https://your-railway-backend.railway.app/api/auth/register
Status: 201
```

### Check 2: Look at Console Logs

With the new axios config, you should see:
```
API Request: POST /api/auth/register
```

If the full URL shows your Vercel domain, the environment variable is missing!

---

## 🎯 Root Cause Explained

### What's Happening:

1. **axios config** (`client/src/config/axios.js`):
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   axios.defaults.baseURL = API_URL;
   ```

2. **If VITE_API_URL is NOT set in Vercel:**
   - `import.meta.env.VITE_API_URL` = `undefined`
   - Falls back to `'http://localhost:5000'`
   - But localhost doesn't exist in production!
   - Browser tries relative URL instead
   - Hits Vercel's domain
   - Vercel doesn't have `/api/auth/register` endpoint
   - Returns 405 Method Not Allowed

3. **If VITE_API_URL IS set correctly:**
   - `import.meta.env.VITE_API_URL` = `'https://your-railway.railway.app'`
   - axios uses this as baseURL
   - API calls go to Railway backend ✅
   - Backend responds with 201 Created ✅

---

## 📝 Correct Environment Variables

### Vercel (Frontend) - MUST HAVE:

```env
VITE_API_URL=https://buildshare-production-abc123.up.railway.app
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-4344140632373860
```

**Critical Notes:**
- Variable name MUST be exactly `VITE_API_URL` (case-sensitive!)
- Value MUST be your Railway backend URL
- NO trailing slash at the end
- NO quotes around the value
- Must be set for ALL environments (Production, Preview, Development)

### Railway (Backend) - Already Set:

```env
NODE_ENV=production
JWT_SECRET=4b1347b7a40886c23e5056afb49ffd3f2575cfe6e3a9068dee49cfbdc4b0610f
PORT=5000
MONGODB_URI=[from Railway MongoDB]
CORS_ORIGIN=https://buildshare.vercel.app
```

---

## 🔧 Step-by-Step Fix

### 1. Get Your Railway Backend URL

1. Go to https://railway.app
2. Click on your backend service
3. Click "Settings" in sidebar
4. Click "Networking" section
5. If no domain exists, click "Generate Domain"
6. Copy the URL (e.g., `https://buildshare-production-abc123.up.railway.app`)

### 2. Add to Vercel

1. Go to https://vercel.com
2. Click your `buildshare` project
3. Settings → Environment Variables
4. Click "Add New"
5. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** [paste your Railway URL]
   - **Environments:** Check all three boxes
6. Click "Save"

### 3. Also Add AdSense Variable (if missing)

1. Click "Add New" again
2. Fill in:
   - **Key:** `VITE_GOOGLE_ADSENSE_CLIENT`
   - **Value:** `ca-pub-4344140632373860`
   - **Environments:** Check all three boxes
3. Click "Save"

### 4. Redeploy

1. Go to "Deployments" tab
2. Find latest deployment
3. Click three dots (...) → "Redeploy"
4. Wait for build to complete

### 5. Test Again

1. Open your Vercel URL
2. Open DevTools (F12)
3. Go to Network tab
4. Try registration
5. Check the request URL - should go to Railway!

---

## ✅ Success Indicators

After adding VITE_API_URL and redeploying:

### In Network Tab:
```
Request URL: https://your-railway-backend.railway.app/api/auth/register
Request Method: POST
Status Code: 201 Created
```

### In Console:
```
API Request: POST /api/auth/register
API Response: 201 /api/auth/register
```

### In Browser:
- Registration succeeds
- Redirects to feed
- No errors
- User is logged in ✅

---

## 🐛 If Still Getting 405

### Double-Check These:

1. **Variable Name:** Must be exactly `VITE_API_URL` (not `VITE_API_BASE_URL` or `API_URL`)
2. **Variable Value:** Must be your Railway URL (not Vercel URL)
3. **No Trailing Slash:** `https://example.railway.app` not `https://example.railway.app/`
4. **Redeployed:** Must redeploy after adding variables
5. **Hard Refresh:** Clear cache with Ctrl+Shift+R

### Check Railway Backend:

1. Visit: `https://your-railway-url.railway.app/health`
2. Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected"
   }
   ```
3. If this fails, backend is down - check Railway logs

### Check CORS:

1. Make sure `CORS_ORIGIN` is set in Railway
2. Value should be your Vercel URL
3. Example: `https://buildshare.vercel.app`
4. No trailing slash!

---

## 📸 Screenshot Checklist

In Vercel Environment Variables, you should see:

```
✅ VITE_API_URL                    https://buildshare-production-abc123.up.railway.app
✅ VITE_GOOGLE_ADSENSE_CLIENT      ca-pub-4344140632373860
```

Both should show:
- Production ✓
- Preview ✓  
- Development ✓

---

## 💡 Why This Happens

Vite requires environment variables to:
1. Start with `VITE_` prefix
2. Be set at BUILD time (not runtime)
3. Be present in Vercel's environment variables

If you add them after deployment, you MUST redeploy for them to take effect!

---

## 🎯 Quick Test Command

After fixing, test with curl:

```bash
curl -X POST https://your-railway-url.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"developer"}'
```

Should return 201 with user data and token.

---

## 📞 Next Steps

1. ✅ Add VITE_API_URL to Vercel
2. ✅ Add VITE_GOOGLE_ADSENSE_CLIENT to Vercel
3. ✅ Redeploy in Vercel
4. ✅ Test registration
5. ✅ Verify in Network tab

---

**The fix is simple: Add VITE_API_URL environment variable in Vercel!** 🚀

After adding it and redeploying, registration will work!
