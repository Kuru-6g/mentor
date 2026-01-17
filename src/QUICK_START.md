# Quick Start Guide - MongoDB Backend Integration

## 🚀 5-Minute Setup

Your frontend is **already complete** and ready to use. Follow these steps to connect it to a MongoDB backend.

## Step 1: Review the Documentation (2 min)

1. Open `/MIGRATION_SUMMARY.md` - Understand what was built
2. Scan `/MONGODB_INTEGRATION.md` - See the database schema
3. Check `/BACKEND_EXAMPLE.md` - See the backend code

## Step 2: Set Up MongoDB (5 min)

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/topvoice
   ```

### Option B: Local MongoDB

```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
# or
sudo apt install mongodb        # Linux

# Start MongoDB
mongod --dbpath ~/data/db
```

## Step 3: Create Backend (10 min)

### Quick Setup

```bash
# Create backend directory
mkdir topvoice-backend
cd topvoice-backend

# Initialize project
npm init -y

# Install dependencies
npm install express mongodb @supabase/supabase-js cors dotenv helmet express-rate-limit uuid

# Install dev dependencies
npm install --save-dev nodemon
```

### Copy Backend Code

1. Create `src/` directory
2. Copy ALL code from `/BACKEND_EXAMPLE.md` into respective files
3. Create `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
SUPABASE_URL=https://ozalnwkljelnoxyegfdo.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
```

### Get Supabase Service Key

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project (ozalnwkljelnoxyegfdo)
3. Settings → API
4. Copy "service_role" key (NOT the anon key)
5. Paste into `.env` as `SUPABASE_SERVICE_KEY`

### Run Backend

```bash
# Add to package.json scripts:
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}

# Start server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
✅ Database indexes created
🚀 Server running on port 5000
```

## Step 4: Connect Frontend (2 min)

Update `/utils/mongoApi.ts`:

```typescript
// Change this line:
const MONGODB_API_BASE_URL = process.env.MONGODB_API_URL || 'http://localhost:5000/api';

// To point to your backend:
const MONGODB_API_BASE_URL = 'http://localhost:5000/api';
```

## Step 5: Test (3 min)

### Test Backend Health

```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test Frontend

1. Start your frontend dev server
2. Go to Login/Signup page
3. Create a new account:
   - Fill in the form
   - Click "Create Account"
   - Should create user in Supabase AND MongoDB

4. Check MongoDB:
```bash
# In MongoDB shell or Compass
use topvoice
db.users.find()
# Should see your user!
```

## 🎉 Done!

Your app is now fully integrated with MongoDB!

## Testing the Full Flow

### 1. Sign Up as Mentor

1. Go to app → Click "Login / Sign Up"
2. Choose "I am a Mentor"
3. Fill in all fields
4. Click "Create Mentor Account"
5. ✅ Should redirect to Dashboard

### 2. Create a Session

1. In Dashboard → "My Sessions" tab
2. Click "+ Add New Session"
3. Fill in session details
4. Click "Create Session"
5. ✅ Session appears in list

### 3. Sign Up as Mentee (Different Browser/Incognito)

1. Open app in incognito window
2. Sign up as Mentee
3. Go to "Sessions" page
4. ✅ Should see the session you created

### 4. Request to Join

1. As mentee, click on a session
2. Click "Request to Join"
3. Fill in the form
4. ✅ Request sent

### 5. Accept Request

1. Switch back to mentor account
2. Go to Dashboard → "Session Requests" tab
3. ✅ Should see the request
4. Click "Accept"
5. ✅ Request accepted, mentee can join!

## Common Issues

### ❌ "Cannot connect to MongoDB"

**Fix:**
```bash
# Check MongoDB is running
mongosh  # Should connect without errors

# Check connection string in .env
echo $MONGODB_URI
```

### ❌ "Invalid token"

**Fix:**
1. Check `SUPABASE_SERVICE_KEY` in backend `.env`
2. Make sure it's the `service_role` key, not `anon` key
3. Restart backend server

### ❌ CORS errors

**Fix:**
Update backend `src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));
```

### ❌ "User not found" after signup

**Fix:**
1. Check backend logs for errors
2. Verify MongoDB connection
3. Check user was created in Supabase
4. Check MongoDB has `users` collection

## What's Next?

### Deploy Backend

#### Render.com (Free)
1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

#### Railway.app (Free)
1. Go to railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy!

#### Heroku
```bash
heroku create topvoice-api
heroku config:set MONGODB_URI=your_uri
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_KEY=your_key
git push heroku main
```

### Update Frontend for Production

After deploying backend:

```typescript
// In mongoApi.ts
const MONGODB_API_BASE_URL = 'https://your-backend.render.com/api';
```

## Environment Variables Reference

### Frontend (`.env` or Vite config)
```env
VITE_MONGODB_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topvoice
SUPABASE_URL=https://ozalnwkljelnoxyegfdo.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=http://localhost:5173
```

## File Checklist

Make sure you have these files:

### Frontend
- ✅ `/utils/supabaseClient.ts` - Supabase auth client
- ✅ `/utils/mongoApi.ts` - MongoDB API layer
- ✅ `/contexts/AuthContext.tsx` - Auth context
- ✅ `/utils/fallbackData.ts` - Mock data
- ✅ `/App.tsx` - Updated with AuthProvider

### Backend
- ✅ `src/server.js` - Main server file
- ✅ `src/config/database.js` - MongoDB connection
- ✅ `src/config/supabase.js` - Supabase client
- ✅ `src/middleware/auth.js` - Auth middleware
- ✅ `src/routes/users.js` - User routes
- ✅ `src/routes/sessions.js` - Session routes
- ✅ `.env` - Environment variables

## Need Help?

1. **Check Documentation**
   - `/MONGODB_INTEGRATION.md` - Complete integration guide
   - `/BACKEND_EXAMPLE.md` - Full backend implementation
   - `/MIGRATION_SUMMARY.md` - Architecture overview

2. **Check Logs**
   ```bash
   # Backend logs
   npm run dev  # Watch console output
   
   # Frontend logs
   # Open browser DevTools → Console
   ```

3. **Test Individual Parts**
   ```bash
   # Test Supabase auth
   curl -X POST https://ozalnwkljelnoxyegfdo.supabase.co/auth/v1/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password123"}'
   
   # Test MongoDB connection
   mongosh YOUR_MONGODB_URI
   
   # Test backend endpoint
   curl http://localhost:5000/api/health
   ```

## Success Criteria

You're ready when:

- ✅ Backend starts without errors
- ✅ MongoDB connection successful
- ✅ Can signup new user
- ✅ User appears in MongoDB
- ✅ Can login with user
- ✅ Can create a session
- ✅ Session appears in MongoDB
- ✅ Can request to join session
- ✅ Can accept/reject requests

## Timeline

- **5 min** - Read documentation
- **5 min** - Set up MongoDB
- **10 min** - Create backend
- **2 min** - Connect frontend
- **3 min** - Test integration
- **Total: ~25 minutes** to full working system!

---

## Ready to Start?

1. ✅ MongoDB ready
2. ✅ Backend running
3. ✅ Frontend connected
4. ✅ Tests passing

**You're all set! Start building your mentorship platform!** 🚀

---

*For detailed information, see `/MONGODB_INTEGRATION.md`*
