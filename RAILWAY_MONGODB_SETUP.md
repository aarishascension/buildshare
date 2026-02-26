# 🗄️ Railway MongoDB Setup - CRITICAL

## ⚠️ Current Issue

Your backend is trying to use in-memory MongoDB in production because `MONGODB_URI` is not set.

**Error:** MongoDB memory server can't run on Debian 12 in Railway.

**Solution:** Add Railway's MongoDB database service.

---

## ✅ Add MongoDB to Railway (2 minutes)

### Step 1: Add MongoDB Service

1. **Go to your Railway project dashboard**
2. **Click "New"** button (top right or in project)
3. **Select "Database"**
4. **Choose "Add MongoDB"**
5. **Wait 1-2 minutes** for MongoDB to provision

### Step 2: Verify MONGODB_URI

1. **Click on your backend service** (not the MongoDB service)
2. **Go to "Variables" tab**
3. **Look for `MONGODB_URI`** variable
4. **It should be automatically added** by Railway

If you don't see `MONGODB_URI`:
1. Click on the **MongoDB service**
2. Go to **"Variables" tab**
3. Copy the **`MONGO_URL`** or **`DATABASE_URL`** value
4. Go back to your **backend service**
5. Add new variable: **`MONGODB_URI`** = (paste the MongoDB URL)

### Step 3: Verify Environment Variables

Make sure your backend service has ALL these variables:

```
NODE_ENV=production
JWT_SECRET=[your-random-secret]
PORT=5000
MONGODB_URI=mongodb://[automatically-added-by-railway]
```

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Deploy"** button
3. Or wait for auto-redeploy

---

## ✅ Expected Success Output

After adding MongoDB, you should see:

```
✅ Using Nixpacks
✅ Detected Node.js
✅ Installing dependencies
✅ Starting application
✅ MongoDB Atlas Connected  ← This line is key!
✅ Server running on http://localhost:5000
✅ WebSocket server ready
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
  "database": "connected"  ← Must say "connected"!
}
```

---

## 📋 Complete Checklist

### Railway Configuration:
- [ ] Root Directory: `server`
- [ ] Start Command: `npm start`

### Environment Variables:
- [ ] NODE_ENV=production
- [ ] JWT_SECRET=[random-32-chars]
- [ ] PORT=5000
- [ ] MONGODB_URI=[from-mongodb-service]

### MongoDB Service:
- [ ] MongoDB service added to project
- [ ] MongoDB status shows "Active" (green)
- [ ] MONGODB_URI appears in backend variables
- [ ] MONGODB_URI starts with `mongodb://`

### Deployment:
- [ ] Build successful
- [ ] Logs show "MongoDB Atlas Connected"
- [ ] Service running
- [ ] Health check shows "database": "connected"

---

## 🔍 Troubleshooting

### MongoDB Service Not Showing?

**Add it manually:**
1. In project dashboard, click "New"
2. Select "Database"
3. Choose "Add MongoDB"
4. Wait for provisioning

### MONGODB_URI Not Auto-Added?

**Add it manually:**
1. Click MongoDB service
2. Copy the connection string from Variables
3. Go to backend service → Variables
4. Add: `MONGODB_URI` = (paste connection string)

### Still Getting Memory Server Error?

**Check:**
- NODE_ENV is set to `production` (not `prod` or `Production`)
- MONGODB_URI exists and is not empty
- MONGODB_URI starts with `mongodb://` or `mongodb+srv://`

### Database Connection Failed?

**Check:**
- MongoDB service is running (green status)
- MONGODB_URI is correct
- No typos in variable name (case-sensitive!)

---

## 💡 Understanding the Code

Your `server.js` has this logic:

```javascript
if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
  // Use Railway MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
} else {
  // Use in-memory MongoDB (development only)
  mongoServer = await MongoMemoryServer.create();
}
```

**For production to work:**
- `NODE_ENV` must equal `production`
- `MONGODB_URI` must exist and be valid

---

## 🎯 Quick Fix Steps

1. ✅ Add MongoDB service to Railway project
2. ✅ Verify MONGODB_URI in backend variables
3. ✅ Verify NODE_ENV=production
4. ✅ Redeploy
5. ✅ Check logs for "MongoDB Atlas Connected"
6. ✅ Test /health endpoint

---

## 📝 Your MongoDB URL

Once MongoDB is added, your MONGODB_URI will look like:

```
mongodb://mongo:PASSWORD@monorail.proxy.rlwy.net:12345
```

Or:

```
mongodb+srv://mongo:PASSWORD@cluster.mongodb.net/database
```

**Save this URL:** ________________________________

---

**Add MongoDB service to Railway now and redeploy!** 🗄️✅

The deployment will succeed once MongoDB is properly configured!
