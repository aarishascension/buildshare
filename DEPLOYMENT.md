# 🚀 Deployment Guide

Complete guide to deploy BuildFlow to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database backup strategy in place
- [ ] SSL certificates obtained
- [ ] Domain name configured
- [ ] Monitoring tools set up
- [ ] Error tracking configured

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) ⭐ Recommended

**Best for:** Quick deployment, automatic scaling, free tier available

#### Frontend (Vercel)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/buildflow.git
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `client`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```
   - Click "Deploy"

3. **Configure Domain:**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records

#### Backend (Railway)

1. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `server`

2. **Add MongoDB:**
   - Click "New" → "Database" → "MongoDB"
   - Copy connection string

3. **Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-strong-secret>
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=5000
```

4. **Deploy:**
   - Railway will auto-deploy
   - Copy your backend URL
   - Update frontend env variable

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend (Netlify)

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `client/dist`

2. **Environment Variables:**
```env
VITE_API_URL=https://your-backend.onrender.com
```

3. **Deploy:**
```bash
npm install -g netlify-cli
cd client
netlify deploy --prod
```

#### Backend (Render)

1. **Create Web Service:**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository
   - Root directory: `server`

2. **Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   - Add all production env vars
   - Add MongoDB Atlas connection string

---

### Option 3: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean
   - Apps → Create App
   - Connect GitHub

2. **Configure Components:**
   - **Frontend:** Static Site
     - Build: `npm run build`
     - Output: `client/dist`
   - **Backend:** Web Service
     - Build: `npm install`
     - Run: `npm start`

3. **Add Database:**
   - Add MongoDB managed database
   - Configure connection string

---

### Option 4: AWS (Advanced)

#### Using AWS Amplify + EC2

1. **Frontend (Amplify):**
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

2. **Backend (EC2):**
   - Launch EC2 instance
   - Install Node.js and MongoDB
   - Clone repository
   - Configure nginx
   - Set up PM2 for process management

3. **Database (DocumentDB):**
   - Create DocumentDB cluster
   - Configure security groups
   - Update connection string

---

### Option 5: Docker + Any Cloud Provider

1. **Build Docker Image:**
```bash
docker build -t buildflow:latest .
```

2. **Push to Registry:**
```bash
docker tag buildflow:latest your-registry/buildflow:latest
docker push your-registry/buildflow:latest
```

3. **Deploy:**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean Container Registry

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Choose region closest to your backend

2. **Configure Access:**
   - Database Access → Add User
   - Network Access → Add IP (0.0.0.0/0 for all)

3. **Get Connection String:**
   - Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password

4. **Update Environment:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buildflow?retryWrites=true&w=majority
```

---

## 🔒 Security Configuration

### 1. Environment Variables

**Never commit these to Git!**

```env
# Generate strong secrets
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

### 2. CORS Configuration

Update `server/server.js`:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

### 3. Rate Limiting

Already configured in `middleware/security.js`

### 4. SSL/HTTPS

- **Vercel/Netlify:** Automatic
- **Custom domain:** Use Let's Encrypt
- **Load balancer:** Configure SSL termination

---

## 📊 Monitoring & Logging

### Error Tracking (Sentry)

1. **Install:**
```bash
npm install @sentry/node
```

2. **Configure:**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

1. **New Relic:**
```bash
npm install newrelic
```

2. **Datadog:**
```bash
npm install dd-trace
```

### Logging

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd server
          npm install
          npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check

```bash
curl https://your-backend.com/health
```

### 2. API Testing

```bash
# Register
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","userType":"developer"}'

# Login
curl -X POST https://your-backend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Load Testing

```bash
npm install -g artillery
artillery quick --count 10 --num 100 https://your-backend.com/api/projects
```

---

## 📈 Performance Optimization

### 1. Enable Caching

```javascript
// Cache static assets
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));
```

### 2. Database Indexing

```javascript
// Add indexes
projectSchema.index({ user: 1, createdAt: -1 });
projectSchema.index({ technologies: 1 });
```

### 3. CDN Configuration

- Use Cloudflare for static assets
- Enable image optimization
- Configure caching rules

---

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors:**
- Check CORS_ORIGIN environment variable
- Verify frontend URL matches

**2. Database Connection:**
- Check MongoDB connection string
- Verify IP whitelist in MongoDB Atlas
- Test connection locally

**3. Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies installed
- Review build logs

**4. 502 Bad Gateway:**
- Check backend is running
- Verify port configuration
- Check firewall rules

---

## 📝 Maintenance

### Regular Tasks

- [ ] Monitor error logs daily
- [ ] Check performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Backup database regularly
- [ ] Test disaster recovery

### Backup Strategy

```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## 🎉 Success Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend API responding
- [ ] Database connected
- [ ] Authentication working
- [ ] All features functional
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Performance optimized
- [ ] Documentation updated

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Review environment variables
3. Test API endpoints
4. Check database connection
5. Review security settings

---

**Your BuildFlow application is now production-ready!** 🚀
