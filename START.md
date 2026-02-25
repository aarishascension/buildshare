# 🚀 Quick Start Guide - BuildFlow

## ⚡ Fastest Way to Start (Windows)

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Wait for: `✅ MongoDB In-Memory Server Connected`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3001/`

**Then double-click:** `OPEN_BUILDFLOW.bat` (opens browser automatically)

---

### Option 2: Using npm scripts

**Terminal 1:**
```bash
cd server && npm start
```

**Terminal 2:**
```bash
cd client && npm run dev
```

---

## 📋 First Time Setup

If you haven't installed dependencies:

```bash
# Backend
cd server
npm install

# Frontend (new terminal)
cd client
npm install
```

---

## ✅ Verify It's Working

You should see:

**Backend Terminal:**
```
✅ MongoDB In-Memory Server Connected
📝 Note: Data will be lost when server restarts
🚀 Server running on http://localhost:5000
```

**Frontend Terminal:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3001/
➜  Network: use --host to expose
```

**Browser:** Navigate to http://localhost:3001

---

## 🎯 What to Test

1. **Register** - Create developer and employer accounts
2. **Post Project** - Add a project as developer
3. **Browse Feed** - View all projects
4. **Search** - Filter by technology, location
5. **Respond** - Comment as employer
6. **Messages** - Send direct messages
7. **Analytics** - View your project stats
8. **Bookmarks** - Save projects to collections
9. **Notifications** - Check notification bell
10. **Profile** - View and edit your profile

---

## 🔧 Troubleshooting

### Port Already in Use

**Port 3001 (Frontend):**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Port 5000 (Backend):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Server Won't Start

1. Check Node.js version: `node --version` (should be 16+)
2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check for error messages in terminal

### Frontend Won't Connect to Backend

1. Verify backend is running on port 5000
2. Check CORS settings in `server/middleware/security.js`
3. Clear browser cache and reload

### Database Issues

- Using mongodb-memory-server (in-memory)
- Data resets when server restarts
- No MongoDB installation needed
- For persistent data, switch to MongoDB Atlas (see DEPLOYMENT.md)

---

## 📦 Tech Stack Running

| Component | Technology | Port |
|-----------|-----------|------|
| Frontend | React 18 + Vite | 3001 |
| Backend | Express.js | 5000 |
| Database | MongoDB (in-memory) | - |
| Auth | JWT | - |

---

## 🎓 For Interviews

When demonstrating:

1. **Start both servers** before the interview
2. **Have test accounts ready** (developer + employer)
3. **Prepare sample projects** to showcase
4. **Know the architecture** (see ARCHITECTURE.md)
5. **Review Q&A** (see INTERVIEW_GUIDE.md)

---

## 📚 Documentation

- `README.md` - Project overview
- `ARCHITECTURE.md` - System design
- `INTERVIEW_GUIDE.md` - Interview Q&A (50+ questions)
- `DEPLOYMENT.md` - Production deployment
- `PROJECT_COMPLETE.md` - Feature summary
- `PHASE1_COMPLETE.md` - Essential features
- `PHASE2_COMPLETE.md` - Advanced features
- `PHASE3_COMPLETE.md` - Production features

---

## 🚀 Production Deployment

Ready to deploy? See `DEPLOYMENT.md` for:
- Vercel + Railway (Free, 15 minutes)
- Docker deployment
- AWS, DigitalOcean options
- Environment configuration

---

## 💡 Tips

- **Data is temporary**: In-memory DB resets on server restart
- **Auto-refresh**: Notifications update every 30 seconds
- **Messages**: Auto-refresh every 3-5 seconds
- **Rate limiting**: 100 requests per 15 minutes (general), 5 per 15 minutes (auth)
- **Security**: All production security features enabled

---

## ✨ Features Implemented

✅ User authentication (JWT)
✅ Project showcase
✅ Employer responses
✅ Real-time notifications
✅ Direct messaging
✅ Analytics dashboard
✅ Bookmarks & collections
✅ Advanced search
✅ User profiles
✅ Rate limiting
✅ XSS prevention
✅ Compression
✅ Docker ready
✅ Testing suite

**Total: 25+ features across 3 phases!**

---

**Status:** ✅ Production Ready | ✅ Interview Ready | ✅ Deployment Ready

**Need help?** Check the documentation files or review the code comments!
