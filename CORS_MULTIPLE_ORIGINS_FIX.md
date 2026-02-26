# ✅ CORS Multiple Origins Fix

## What Was Wrong

The backend CORS configuration only accepted a single origin string, but you have multiple Vercel URLs:
- Production: `https://buildshare-sj5n.vercel.app`
- Preview: `https://buildshare-sj5n-at42jbfbh-aarishs-projects-068f3b64.vercel.app`

## What I Fixed

Updated `server/middleware/security.js` to:
1. Split CORS_ORIGIN by commas
2. Check if the requesting origin is in the allowed list
3. Allow multiple origins dynamically

## What You Need to Do Now

### Step 1: Update CORS_ORIGIN in Railway

1. Go to Railway dashboard
2. Click your backend service
3. Go to "Variables" tab
4. Edit `CORS_ORIGIN` variable
5. Set value to (comma-separated, no spaces):
   ```
   https://buildshare-sj5n.vercel.app,https://buildshare-sj5n-at42jbfbh-aarishs-projects-068f3b64.vercel.app
   ```
6. Save

### Step 2: Wait for Railway to Redeploy

Railway will automatically detect the GitHub push and redeploy.

Watch the deployment logs. When you see:
```
✅ MongoDB Atlas Connected
🚀 Server running on http://localhost:5000
```

It's ready!

### Step 3: Test Registration

1. Go to `https://buildshare-sj5n.vercel.app` (your production URL)
2. Try registration
3. Should work now! ✅

---

## How It Works Now

### Before (Broken):
```javascript
origin: process.env.CORS_ORIGIN || 'http://localhost:3001'
// Only accepts ONE origin
```

### After (Fixed):
```javascript
origin: function (origin, callback) {
  // Splits CORS_ORIGIN by comma
  // Checks if requesting origin is in the list
  // Allows multiple origins
}
```

---

## CORS_ORIGIN Format

**Correct:**
```
https://buildshare-sj5n.vercel.app,https://buildshare-sj5n-at42jbfbh-aarishs-projects-068f3b64.vercel.app
```

**Wrong:**
```
https://buildshare-sj5n.vercel.app, https://buildshare-sj5n-at42jbfbh-aarishs-projects-068f3b64.vercel.app
(spaces after comma - will break!)
```

**Wrong:**
```
buildshare-sj5n.vercel.app
(missing https://)
```

---

## Timeline

1. ✅ Code pushed to GitHub
2. ⏳ Railway auto-detects push (30 seconds)
3. ⏳ Railway rebuilds backend (1-2 minutes)
4. ✅ New CORS config active
5. ✅ Registration works on both URLs

**Total wait time: ~2-3 minutes**

---

## Verification

After Railway redeploys, test on both URLs:

### Production URL:
`https://buildshare-sj5n.vercel.app`
- Should work ✅

### Preview URL:
`https://buildshare-sj5n-at42jbfbh-aarishs-projects-068f3b64.vercel.app`
- Should still work ✅

---

## Pro Tip: Future Deployments

Every time Vercel creates a new preview deployment, you'll get a new URL. To avoid updating CORS_ORIGIN each time, you can:

**Option 1: Only use production URL**
```
CORS_ORIGIN=https://buildshare-sj5n.vercel.app
```
Test on production only.

**Option 2: Use wildcard (if your CORS library supports it)**
```
CORS_ORIGIN=https://buildshare-sj5n.vercel.app,https://*.vercel.app
```
Allows all Vercel domains.

**Option 3: Add preview URLs as needed**
Keep adding preview URLs to the comma-separated list when testing.

---

## Current Status

- ✅ Code fixed and pushed
- ⏳ Waiting for Railway to redeploy
- ⏳ Update CORS_ORIGIN in Railway
- ⏳ Test registration

---

**Next: Update CORS_ORIGIN in Railway with both URLs, then test!** 🚀
