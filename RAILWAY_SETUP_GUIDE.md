# 🚂 Railway Setup - Correct Configuration

## The Issue

Railway is looking at the root directory, but our backend code is in the `server` folder.

## ✅ Solution: Configure Root Directory in Railway

### Step-by-Step Fix:

1. **Go to your Railway project**
   - Open https://railway.app
   - Click on your project

2. **Click on your service** (the one that's failing)

3. **Go to "Settings" tab**

4. **Scroll to "Service Settings" section**

5. **Set Root Directory:**
   - Find "Root Directory" field
   - Enter: `server`
   - Click "Save" or it auto-saves

6. **Set Start Command (if not set):**
   - Find "Start Command" field
   - Enter: `npm start`
   - Click "Save"

7. **Trigger Redeploy:**
   - Go to "Deployments" tab
   - Click "Deploy" button
   - Or wait for auto-deploy

---

## ✅ Correct Configuration

### Service Settings:
```
Root Directory: server
Start Command: npm start
Builder: Nixpacks (automatic)
```

### Environment Variables:
```
NODE_ENV=production
JWT_SECRET=[your-random-32-char-secret]
PORT=5000
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Add MongoDB Database

1. **In your Railway project, click "New"**
2. **Select "Database"**
3. **Choose "Add MongoDB"**
4. **Wait for provisioning** (1-2 minutes)
5. **Verify `MONGODB_URI` is added** to environment variables

---

## 🌐 Generate Domain

1. **Go to "Settings" tab**
2. **Scroll to "Networking" section**
3. **Click "Generate Domain"**
4. **Copy your URL:** `https://buildshare-production-xxxx.up.railway.app`

---

## 🧪 Expected Build Output

After setting Root Directory to `server`, you should see:

```
✅ Using Nixpacks
✅ Detected Node.js in /server
✅ Found package.json
✅ Installing dependencies with npm ci
✅ Starting with npm start
✅ Deployment successful
```

---

## 🔍 Test Your Deployment

### Health Check:
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

### API Info:
Visit: `https://your-railway-url.railway.app/api`

**Expected Response:**
```json
{
  "name": "BuildShare API",
  "version": "1.0.0",
  "description": "MERN stack job finding platform"
}
```

---

## ⚠️ Common Mistakes

### ❌ Wrong:
- Root Directory: (empty)
- Root Directory: `/`
- Root Directory: `./server`

### ✅ Correct:
- Root Directory: `server`

---

## 📋 Complete Checklist

### Railway Configuration:
- [ ] Root Directory set to `server`
- [ ] Start Command set to `npm start`
- [ ] NODE_ENV=production added
- [ ] JWT_SECRET added (random 32+ chars)
- [ ] PORT=5000 added
- [ ] MongoDB database added
- [ ] MONGODB_URI auto-added
- [ ] Domain generated
- [ ] Deployment successful
- [ ] Health check passes

---

## 🚀 After Successful Deployment

### Save Your URLs:
**Backend URL:** https://__________________.railway.app

**Health Check:** https://__________________.railway.app/health

**API Info:** https://__________________.railway.app/api

### Next Steps:
1. ✅ Test health endpoint
2. ✅ Test API endpoint
3. ✅ Copy backend URL
4. ✅ Move to Step 3: Deploy Frontend to Vercel

---

## 💡 Pro Tips

### Viewing Logs:
- Click on your service
- Go to "Deployments" tab
- Click on latest deployment
- View real-time logs

### Redeploying:
- Railway auto-deploys on git push
- Or click "Deploy" button manually
- Or use Railway CLI

### Monitoring:
- Check "Metrics" tab for usage
- View "Logs" for application logs
- Monitor "Deployments" for status

---

## 🆘 Still Having Issues?

### Check These:

1. **Root Directory is set to `server`** (not empty, not `/`)
2. **package.json exists in server folder**
3. **package-lock.json exists in server folder**
4. **All environment variables are set**
5. **MongoDB service is running**

### View Build Logs:
- Go to Deployments
- Click failed deployment
- Read error messages carefully

---

**Set Root Directory to `server` in Railway Settings and redeploy!** 🚂✅
