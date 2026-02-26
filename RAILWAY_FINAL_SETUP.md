# 🚂 Railway - Final Setup Instructions

## ✅ Files Fixed

- ✅ Removed invalid railway.json
- ✅ Removed Docker files
- ✅ Added package-lock.json files
- ✅ Pushed to GitHub

**Railway will now auto-redeploy with the latest changes.**

---

## 🎯 Configure Railway Dashboard (5 minutes)

### Step 1: Set Root Directory

1. Go to your Railway project
2. Click on your service
3. Click **"Settings"** tab
4. Find **"Root Directory"** field
5. Enter: `server`
6. It will auto-save

### Step 2: Set Start Command

1. Still in **"Settings"** tab
2. Find **"Start Command"** field
3. Enter: `npm start`
4. It will auto-save

### Step 3: Add Environment Variables

1. Click **"Variables"** tab
2. Add these variables:

**NODE_ENV:**
```
production
```

**JWT_SECRET:** (generate a random secret)
```bash
# Run this in your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Then paste the output as JWT_SECRET value
```

**PORT:**
```
5000
```

### Step 4: Add MongoDB Database

1. In your project (not service), click **"New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Wait 1-2 minutes for provisioning
5. Verify **MONGODB_URI** appears in your service variables

### Step 5: Generate Domain

1. Go back to your service
2. Click **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Copy your URL (e.g., `https://buildshare-production-xxxx.up.railway.app`)

### Step 6: Deploy

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Or wait for auto-deploy (should start automatically)

---

## ✅ Expected Build Output

You should see:

```
✅ Using Nixpacks
✅ Detected Node.js
✅ Found package.json in /server
✅ Installing dependencies with npm ci
✅ Starting application with npm start
✅ Deployment successful
```

---

## 🧪 Test Your Backend

### Health Check:
```
https://your-railway-url.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-25T...",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected"
}
```

### API Info:
```
https://your-railway-url.railway.app/api
```

**Expected Response:**
```json
{
  "name": "BuildShare API",
  "version": "1.0.0",
  "description": "MERN stack job finding platform"
}
```

---

## 📋 Configuration Checklist

### Service Settings:
- [ ] Root Directory: `server`
- [ ] Start Command: `npm start`

### Environment Variables:
- [ ] NODE_ENV=production
- [ ] JWT_SECRET=[random-32-char-string]
- [ ] PORT=5000
- [ ] MONGODB_URI=[auto-added-by-mongodb]

### Database:
- [ ] MongoDB service added
- [ ] MongoDB is running
- [ ] MONGODB_URI in variables

### Networking:
- [ ] Domain generated
- [ ] URL copied

### Deployment:
- [ ] Build successful
- [ ] Service running
- [ ] Health check passes

---

## 🔍 Troubleshooting

### Build Still Failing?

**Check Root Directory:**
- Must be exactly: `server` (no slashes, no spaces)
- Not: `/server`, `./server`, or empty

**Check Files Exist:**
- `server/package.json` ✅
- `server/package-lock.json` ✅
- `server/server.js` ✅

**Check Environment Variables:**
- All 4 variables set (NODE_ENV, JWT_SECRET, PORT, MONGODB_URI)
- No typos in variable names
- JWT_SECRET is at least 32 characters

### Database Connection Error?

**Check:**
- MongoDB service is running (green status)
- MONGODB_URI exists in variables
- MONGODB_URI starts with `mongodb://`

### Can't Access Health Endpoint?

**Check:**
- Deployment shows "Success"
- Service status is "Active" (not sleeping)
- Domain is generated
- Using HTTPS (not HTTP)

---

## 💡 Pro Tips

### View Logs:
1. Click your service
2. Go to "Deployments"
3. Click latest deployment
4. Scroll down to see logs

### Force Redeploy:
1. Go to "Deployments"
2. Click "Deploy" button
3. Select "Redeploy"

### Check Service Status:
- Green = Running
- Yellow = Building
- Red = Failed
- Gray = Sleeping

---

## 🎯 After Successful Deployment

### Save These URLs:

**Backend URL:**
```
https://________________________________.railway.app
```

**Health Check:**
```
https://________________________________.railway.app/health
```

**API Info:**
```
https://________________________________.railway.app/api
```

### Next Steps:

1. ✅ Test health endpoint
2. ✅ Test API endpoint  
3. ✅ Copy backend URL
4. ✅ Move to Step 3: Deploy Frontend to Vercel

---

## 🚀 Ready for Vercel

Once Railway shows:
- ✅ Deployment successful
- ✅ Health check returns JSON
- ✅ Backend URL copied

You're ready to deploy the frontend to Vercel!

---

**Configure Railway dashboard now and watch it deploy successfully!** 🚂✅
