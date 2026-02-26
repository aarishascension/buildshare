# Messages System Troubleshooting

## Changes Made
1. Fixed axios import in Messages.jsx to use configured instance
2. Fixed WebSocket CORS to support multiple origins (for production)

## How to Test

### Local Testing
1. Start backend: `cd server && npm start`
2. Start frontend: `cd client && npm run dev`
3. Open http://localhost:3001
4. Login with two different accounts (use two browsers or incognito)
5. Try sending messages between accounts

### Production Testing
After pushing changes to GitHub:
1. Railway will auto-deploy the backend
2. Vercel will auto-deploy the frontend
3. Test at https://buildshare-sj5n.vercel.app

## Common Issues

### Issue 1: "No conversations yet"
**Cause:** You need to initiate a conversation first
**Solution:** 
- Go to someone's profile
- Click "Message" button (if implemented)
- OR: Messages feature requires a way to start conversations

### Issue 2: WebSocket not connecting
**Symptoms:** Console shows connection errors
**Check:**
- Open browser console (F12)
- Look for "Connected to WebSocket" message
- If missing, check CORS_ORIGIN in Railway environment variables

### Issue 3: Messages not sending
**Symptoms:** Message input works but nothing happens
**Check:**
- Browser console for errors
- Network tab for failed API calls
- Make sure you're logged in

## Missing Feature: Start Conversation
Currently, there's no UI button to start a new conversation. You need to add a "Message" button to:
- User profiles
- Project post author info
- Response author info

Would you like me to add this feature?

## Railway Environment Variables
Make sure these are set:
- `CORS_ORIGIN`: Should include all Vercel domains (comma-separated)
- `JWT_SECRET`: Your secret key
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: production

## Next Steps
1. Push changes to GitHub
2. Wait for auto-deployment
3. Test on production
4. Let me know specific error messages if it still doesn't work
