# 🔧 Step 4: Update CORS Settings

## Why This Step?

After deploying frontend to Vercel, your backend needs to allow requests from your Vercel domain. Without this, you'll get CORS errors and the frontend won't be able to communicate with the backend.

---

## ⚡ Quick Update (2 minutes)

### What You Need:
- Your Vercel URL (from Step 3)
- Example: `https://buildshare.vercel.app`

### Steps:

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Click on your backend service

2. **Open Variables Tab**
   - Click "Variables" in the sidebar

3. **Add CORS_ORIGIN Variable**
   - Click "New Variable"
   - **Name:** `CORS_ORIGIN`
   - **Value:** Your Vercel URL (e.g., `https://buildshare.vercel.app`)
   - **Important:** NO trailing slash!
   - Click "Add"

4. **Wait for Redeploy**
   - Railway will automatically redeploy
   - Takes about 1-2 minutes
   - Watch the deployment logs

---

## ✅ Expected Result

After adding CORS_ORIGIN and redeployment:

```
✅ Variable added
✅ Redeployment triggered
✅ Server restarted
✅ CORS configured for your Vercel domain
```

---

## 🧪 Test CORS Configuration

### Method 1: Visit Your Site
1. Open your Vercel URL
2. Open browser console (F12)
3. Try to login or register
4. Check console for errors

**Success:** No CORS errors, API calls work
**Failure:** See "CORS policy" errors in console

### Method 2: Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try to login
4. Check API requests

**Success:** Requests return 200 status
**Failure:** Requests return CORS errors

---

## 🔍 Common Issues

### Issue 1: Still Getting CORS Errors

**Possible causes:**
- CORS_ORIGIN has trailing slash (remove it!)
- CORS_ORIGIN doesn't match Vercel URL exactly
- Backend hasn't redeployed yet

**Solution:**
1. Check CORS_ORIGIN value in Railway
2. Ensure it matches Vercel URL exactly
3. No trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
4. Wait for redeploy to complete

### Issue 2: Multiple Domains

If you have multiple frontend URLs (e.g., custom domain + Vercel domain):

**Option 1: Use comma-separated list**
```
CORS_ORIGIN=https://buildshare.vercel.app,https://buildshare.com
```

**Option 2: Use wildcard (less secure)**
```
CORS_ORIGIN=*
```

---

## 📝 CORS Configuration Details

Your backend (`server/server.js`) uses this CORS configuration:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));
```

This means:
- In production: Uses CORS_ORIGIN from environment variable
- In development: Allows localhost:3001
- Credentials: Allows cookies and authentication headers

---

## ✅ Verification Checklist

After updating CORS:

- [ ] CORS_ORIGIN variable added in Railway
- [ ] Value matches Vercel URL exactly
- [ ] No trailing slash in URL
- [ ] Railway redeployment completed
- [ ] Frontend can make API calls
- [ ] No CORS errors in console
- [ ] Login/register works
- [ ] Data loads properly

---

## 🎯 Final Environment Variables

Your Railway backend should now have:

```
NODE_ENV=production
JWT_SECRET=4b1347b7a40886c23e5056afb49ffd3f2575cfe6e3a9068dee49cfbdc4b0610f
PORT=5000
MONGODB_URI=[from Railway MongoDB]
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🚀 Next Step: Final Testing

After CORS is configured, proceed to Step 5:
- Test all features
- Verify everything works
- Share your live site!

---

## 💡 Pro Tips

### Development vs Production
- Development: CORS allows localhost:3001
- Production: CORS allows your Vercel domain
- Both can coexist safely

### Custom Domain
If you add a custom domain later:
1. Update CORS_ORIGIN to include new domain
2. Use comma-separated list for multiple domains
3. Railway will auto-redeploy

### Security
- Never use `CORS_ORIGIN=*` in production
- Always specify exact domains
- Keep credentials: true for authentication

---

## 🆘 Still Having Issues?

### Check Backend Logs
1. Go to Railway dashboard
2. Click on your service
3. View deployment logs
4. Look for CORS-related messages

### Check Frontend Console
1. Open your Vercel site
2. Press F12 for DevTools
3. Check Console tab for errors
4. Check Network tab for failed requests

### Verify URLs Match
- Railway CORS_ORIGIN: `https://buildshare.vercel.app`
- Vercel domain: `https://buildshare.vercel.app`
- Must match EXACTLY (case-sensitive!)

---

**After updating CORS, your app should be fully functional!** 🎉

Proceed to final testing in Step 5!
