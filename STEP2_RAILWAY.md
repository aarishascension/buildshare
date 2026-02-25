# 🚂 Step 2: Deploy Backend to Railway

## ✅ GitHub Push Complete!

Your code is now at: https://github.com/aarishascension/buildshare

---

## 🎯 Now: Deploy Backend to Railway (10 minutes)

### 2.1: Sign Up for Railway (2 min)

1. **Go to:** https://railway.app
2. Click **"Login"** or **"Start a New Project"**
3. **Sign in with GitHub** (recommended)
4. Authorize Railway to access your repositories

---

### 2.2: Create New Project (2 min)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"aarishascension/buildshare"**
4. Railway will start analyzing your repository

---

### 2.3: Configure Backend Service (2 min)

1. Railway will detect it's a Node.js project
2. Click on the service card
3. Go to **"Settings"** tab
4. Configure:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
   - **Watch Paths:** `server/**`

---

### 2.4: Add MongoDB Database (1 min)

1. In your project, click **"New"** button
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Railway will:
   - Create a MongoDB instance
   - Auto-generate connection string
   - Add `MONGODB_URI` to your environment variables

---

### 2.5: Add Environment Variables (2 min)

1. Click on your backend service
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add these variables:

#### Variable 1: NODE_ENV
```
NODE_ENV=production
```

#### Variable 2: JWT_SECRET
Generate a secure secret:
```bash
# Run this in your terminal to generate:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then add:
```
JWT_SECRET=your-generated-secret-here
```

#### Variable 3: PORT
```
PORT=5000
```

**Note:** `MONGODB_URI` is automatically added by Railway when you add MongoDB

---

### 2.6: Generate Domain (1 min)

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will create a public URL like:
   ```
   https://buildshare-production-xxxx.up.railway.app
   ```
5. **Copy this URL** - you'll need it for Vercel!

---

## 📋 Environment Variables Checklist

Make sure you have these in Railway:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET=[your-random-secret]`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=[auto-added-by-railway]`

**Note:** We'll add `CORS_ORIGIN` later after deploying frontend

---

## 🧪 Test Your Backend

### Check Deployment Status:
1. Go to **"Deployments"** tab
2. Wait for build to complete (2-3 minutes)
3. Look for ✅ "Success" status

### Test Health Endpoint:
Visit: `https://your-railway-url.railway.app/health`

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected"
}
```

If you see this, your backend is working! 🎉

---

## 🔧 Troubleshooting

### Build Failed?
**Check:**
- Root directory is set to `server`
- Start command is `npm start`
- All dependencies in package.json

**View Logs:**
- Go to "Deployments" tab
- Click on failed deployment
- Check build logs for errors

### Database Connection Error?
**Check:**
- MongoDB service is running
- MONGODB_URI variable exists
- Railway MongoDB is in same project

### Can't Access Health Endpoint?
**Check:**
- Deployment is successful
- Domain is generated
- Service is running (not sleeping)

---

## 💡 Pro Tips

### Viewing Logs:
1. Click on your service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Redeploying:
- Railway auto-deploys on git push
- Or click "Deploy" button manually
- Or trigger from "Deployments" tab

### Monitoring:
- Check "Metrics" tab for CPU/Memory usage
- View "Logs" for application logs
- Monitor "Deployments" for build status

---

## 📝 Save Your URLs

**GitHub Repository:**
```
https://github.com/aarishascension/buildshare
```

**Railway Backend URL:**
```
https://________________________________.railway.app
```
(Fill this in after generating domain)

**Railway Health Check:**
```
https://________________________________.railway.app/health
```

---

## ✅ Step 2 Checklist

- [ ] Signed up for Railway
- [ ] Created new project from GitHub
- [ ] Configured root directory: `server`
- [ ] Added MongoDB database
- [ ] Set NODE_ENV=production
- [ ] Set JWT_SECRET (random)
- [ ] Set PORT=5000
- [ ] Generated domain
- [ ] Deployment successful
- [ ] Health check passes
- [ ] Backend URL saved

---

## 🎯 Next: Deploy Frontend to Vercel

Once your backend is deployed and health check passes, you're ready for:

**Step 3: Deploy Frontend to Vercel**

See **STEP3_VERCEL.md** or continue with **DEPLOY_NOW.md**

---

## 🚀 Quick Commands

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Locally:
```bash
cd server
npm start
```

### View Railway Logs:
```bash
# In Railway dashboard:
Service → Deployments → Latest → View Logs
```

---

**Your backend is almost live! Complete the checklist above and move to Step 3!** 🚀
