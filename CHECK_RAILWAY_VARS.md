# ⚠️ URGENT: Check Railway Environment Variables

## The Problem

Your backend is still trying to use in-memory MongoDB, which means:
- Either `NODE_ENV` is NOT set to `production`
- Or `MONGODB_URI` is NOT set
- Or both are missing

## ✅ Fix Now (2 minutes)

### Step 1: Check Environment Variables

1. **Go to Railway dashboard**
2. **Click on your backend service**
3. **Click "Variables" tab**
4. **Check if you have these EXACT variables:**

```
NODE_ENV
JWT_SECRET
PORT
MONGODB_URI
```

### Step 2: Add Missing Variables

If any are missing, add them now:

#### Add NODE_ENV:
- Click "New Variable"
- Variable name: `NODE_ENV`
- Value: `production` (lowercase, no quotes)
- Click "Add"

#### Add JWT_SECRET:
- Click "New Variable"
- Variable name: `JWT_SECRET`
- Value: Run this command to generate:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Paste the output
- Click "Add"

#### Add PORT:
- Click "New Variable"
- Variable name: `PORT`
- Value: `5000`
- Click "Add"

#### Add MONGODB_URI:
**First, make sure MongoDB service is added:**
1. In your project, click "New"
2. Select "Database"
3. Choose "Add MongoDB"
4. Wait for it to provision

**Then add the variable:**
- Click "New Variable"
- Variable name: `MONGODB_URI`
- Value: Copy from MongoDB service variables (usually `MONGO_URL` or `DATABASE_URL`)
- Click "Add"

### Step 3: Verify Variables

Your Variables tab should show:
```
NODE_ENV = production
JWT_SECRET = [long random string]
PORT = 5000
MONGODB_URI = mongodb://mongo:...@monorail.proxy.rlwy.net:...
```

### Step 4: Redeploy

1. Go to "Deployments" tab
2. Click "Deploy"
3. Watch the logs

---

## ✅ Expected Success

After setting variables correctly, logs should show:

```
✅ Using Nixpacks
✅ Installing dependencies
✅ Starting application
✅ MongoDB Atlas Connected  ← THIS LINE!
✅ Server running on http://localhost:5000
✅ Deployment successful
```

**NOT:**
```
❌ MongoDB In-Memory Server Connected
❌ KnownVersionIncompatibilityError
```

---

## 🔍 Common Mistakes

### ❌ Wrong:
- `NODE_ENV = prod` (should be `production`)
- `NODE_ENV = Production` (should be lowercase)
- `MONGODB_URI` is empty
- `MONGODB_URI` not added at all
- MongoDB service not created

### ✅ Correct:
- `NODE_ENV = production` (exact lowercase)
- `MONGODB_URI = mongodb://...` (from MongoDB service)
- All 4 variables present
- MongoDB service running

---

## 📸 Screenshot Checklist

In Railway Variables tab, you should see:

```
✅ NODE_ENV          production
✅ JWT_SECRET        a1b2c3d4e5f6...
✅ PORT              5000
✅ MONGODB_URI       mongodb://mongo:PASSWORD@...
```

---

## 🆘 Still Not Working?

### Double-Check:

1. **Variable names are EXACT** (case-sensitive!)
   - `NODE_ENV` not `node_env` or `Node_Env`
   - `MONGODB_URI` not `MONGO_URI` or `MongoDBURI`

2. **Values are correct:**
   - `NODE_ENV` = `production` (no quotes, lowercase)
   - `MONGODB_URI` starts with `mongodb://`

3. **MongoDB service exists:**
   - Look in your project
   - Should see a MongoDB service card
   - Status should be green/active

4. **Redeploy after adding variables:**
   - Variables don't apply until redeploy
   - Click "Deploy" button

---

## 💡 Quick Test

After setting variables and redeploying, check logs for this line:

```
✅ MongoDB Atlas Connected
```

If you see:
```
✅ MongoDB In-Memory Server Connected
```

Then variables are still not set correctly!

---

**Go to Railway → Your Service → Variables → Add all 4 variables → Redeploy!** ⚡

This will fix the deployment immediately!
