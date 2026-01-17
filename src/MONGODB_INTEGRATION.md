# MongoDB Backend Integration Guide

## Overview

Topvoice.lk has been architected to use:
- **Supabase** - Authentication only (login/signup)
- **MongoDB** - All application data (mentors, sessions, achievements, etc.)

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───────┐
│Supa- │  │ MongoDB  │
│base  │  │ Backend  │
│Auth  │  │ API      │
└──────┘  └──────────┘
```

## File Structure

### Core Files

1. **`/utils/supabaseClient.ts`**
   - Supabase client initialization
   - Auth helper functions (signUp, signIn, signOut, etc.)
   - Only handles authentication

2. **`/utils/mongoApi.ts`**
   - Complete MongoDB API layer
   - All CRUD operations for application data
   - Includes interfaces/types for all data models

3. **`/contexts/AuthContext.tsx`**
   - React context for authentication state
   - Manages Supabase auth + MongoDB user profiles
   - Provides hooks for components to access auth state

4. **`/utils/fallbackData.ts`**
   - Mock data provider for development
   - In-memory storage when MongoDB is unavailable
   - Useful for testing without backend

## MongoDB Backend Requirements

Your MongoDB backend should implement the following API endpoints:

### Authentication Flow
1. User signs up via Supabase → Frontend receives Supabase user ID
2. Frontend creates user profile in MongoDB with Supabase user ID
3. All subsequent requests use Supabase JWT for authentication
4. MongoDB backend verifies JWT and matches with user profile

### Required Collections

#### 1. **users**
```typescript
{
  _id: ObjectId,
  id: string,              // Supabase user ID
  email: string,
  name: string,
  role: 'mentor' | 'mentee',
  avatar: string,
  createdAt: Date,
  updatedAt: Date,
  // Mentor-specific fields
  expertise: string[],
  yearsExperience: number,
  bio: string,
  currentRole: string,
  company: string,
  linkedin: string,
  github: string,
  website: string,
  // Mentee-specific fields
  interests: string[],
  goals: string
}
```

#### 2. **sessions**
```typescript
{
  _id: ObjectId,
  id: string,
  title: string,
  description: string,
  createdBy: string,        // User ID (mentor)
  speakers: [{
    name: string,
    avatar: string,
    title: string
  }],
  date: string,
  time: string,
  duration: string,
  topics: string[],
  sessionType: 'online' | 'physical',
  location: string,
  maxSlots: number,
  availableSlots: number,
  attendees: number,
  companyName: string,
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **achievements**
```typescript
{
  _id: ObjectId,
  id: string,
  userId: string,           // Mentor user ID
  title: string,
  description: string,
  date: string,
  category: 'award' | 'certification' | 'publication' | 'project' | 'speaking',
  image: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **session_requests**
```typescript
{
  _id: ObjectId,
  id: string,
  sessionId: string,
  userId: string,           // Mentee user ID
  userName: string,
  userEmail: string,
  userAvatar: string,
  status: 'pending' | 'accepted' | 'rejected',
  phone: string,
  occupation: string,
  experienceLevel: string,
  reasonToJoin: string,
  expectations: string,
  requestedAt: Date,
  updatedAt: Date
}
```

#### 5. **reviews**
```typescript
{
  _id: ObjectId,
  id: string,
  mentorId: string,
  menteeId: string,
  menteeName: string,
  menteeAvatar: string,
  sessionId: string,
  rating: number,
  comment: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **notifications**
```typescript
{
  _id: ObjectId,
  id: string,
  userId: string,
  type: 'session_request' | 'session_accepted' | 'session_rejected' | 'session_reminder' | 'new_review',
  title: string,
  message: string,
  read: boolean,
  data: object,
  createdAt: Date
}
```

#### 7. **mentorship_requests**
```typescript
{
  _id: ObjectId,
  id: string,
  mentorId: string,
  menteeId: string,
  menteeName: string,
  menteeAvatar: string,
  menteeEmail: string,
  message: string,
  status: 'pending' | 'accepted' | 'rejected',
  requestedAt: Date,
  updatedAt: Date
}
```

#### 8. **blog_posts**
```typescript
{
  _id: ObjectId,
  id: string,
  title: string,
  excerpt: string,
  content: string,
  authorId: string,
  authorName: string,
  authorAvatar: string,
  authorRole: string,
  category: string,
  tags: string[],
  image: string,
  readTime: string,
  published: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Required API Endpoints

See `/utils/mongoApi.ts` for complete list. Key endpoints include:

#### Users
- `POST /api/users` - Create user profile
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user profile

#### Mentors
- `GET /api/mentors` - List all mentors (with filters)
- `GET /api/mentors/:mentorId` - Get mentor details
- `PUT /api/mentors/:mentorId` - Update mentor profile
- `GET /api/mentors/:mentorId/achievements` - Get mentor's achievements
- `GET /api/mentors/:mentorId/sessions` - Get mentor's sessions

#### Sessions
- `GET /api/sessions` - List all sessions (with filters)
- `GET /api/sessions/:sessionId` - Get session details
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:sessionId` - Update session
- `DELETE /api/sessions/:sessionId` - Delete session
- `GET /api/sessions/:sessionId/requests` - Get session requests

#### Session Requests
- `POST /api/session-requests` - Create request
- `GET /api/mentors/:mentorId/session-requests` - Get mentor's requests
- `GET /api/users/:userId/session-requests` - Get user's requests
- `POST /api/session-requests/:requestId/respond` - Accept/reject request
- `DELETE /api/session-requests/:requestId` - Cancel request

#### Achievements
- `POST /api/achievements` - Create achievement
- `PUT /api/achievements/:achievementId` - Update achievement
- `DELETE /api/achievements/:achievementId` - Delete achievement

#### Reviews
- `GET /api/mentors/:mentorId/reviews` - Get mentor reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

#### Notifications
- `GET /api/users/:userId/notifications` - Get user notifications
- `POST /api/notifications/:notificationId/read` - Mark as read
- `POST /api/users/:userId/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

#### Blog
- `GET /api/blog` - List blog posts (with filters)
- `GET /api/blog/:postId` - Get blog post
- `POST /api/blog` - Create blog post
- `PUT /api/blog/:postId` - Update blog post
- `DELETE /api/blog/:postId` - Delete blog post

## Authentication Flow

### Sign Up
```typescript
// 1. User submits signup form
const { user, session } = await supabase.auth.signUp({
  email, 
  password,
  options: { data: { name, role } }
});

// 2. Create MongoDB profile
const profile = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  },
  body: JSON.stringify({
    id: user.id,  // Supabase user ID
    email,
    name,
    role,
    // ... other fields
  })
});
```

### Sign In
```typescript
// 1. Authenticate with Supabase
const { user, session } = await supabase.auth.signInWithPassword({
  email,
  password
});

// 2. Fetch MongoDB profile
const profile = await fetch(`/api/users/${user.id}`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
});
```

### Protected Requests
```typescript
// All MongoDB requests include Supabase JWT
const response = await fetch('/api/sessions', {
  headers: {
    'Authorization': `Bearer ${supabaseSession.access_token}`,
    'Content-Type': 'application/json'
  }
});
```

## Backend Implementation

### Express.js Example

```javascript
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { MongoClient } = require('mongodb');

const app = express();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const mongoClient = new MongoClient(MONGODB_URI);

// Middleware to verify Supabase JWT
async function verifyAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = user;
  next();
}

// Create user profile
app.post('/api/users', verifyAuth, async (req, res) => {
  const db = mongoClient.db('topvoice');
  const users = db.collection('users');
  
  // Ensure user can only create their own profile
  if (req.body.id !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const profile = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await users.insertOne(profile);
  res.json(profile);
});

// Get user profile
app.get('/api/users/:userId', verifyAuth, async (req, res) => {
  const db = mongoClient.db('topvoice');
  const users = db.collection('users');
  
  const profile = await users.findOne({ id: req.params.userId });
  
  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(profile);
});

// Create session
app.post('/api/sessions', verifyAuth, async (req, res) => {
  const db = mongoClient.db('topvoice');
  const sessions = db.collection('sessions');
  
  const session = {
    id: generateId(),
    ...req.body,
    createdBy: req.user.id,
    attendees: 0,
    availableSlots: req.body.maxSlots,
    status: 'upcoming',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await sessions.insertOne(session);
  res.json(session);
});

// ... more endpoints
```

## Environment Variables

Create a `.env` file in your backend:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/topvoice
# or MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/topvoice

# Supabase (for JWT verification)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Server
PORT=5000
NODE_ENV=development
```

## Frontend Configuration

Update `/utils/mongoApi.ts`:

```typescript
const MONGODB_API_BASE_URL = process.env.MONGODB_API_URL || 'http://localhost:5000/api';
```

Or set in your deployment:
```bash
MONGODB_API_URL=https://your-backend.com/api
```

## Development Mode (Fallback Data)

When MongoDB backend is not available, the app uses fallback data from `/utils/fallbackData.ts`.

To enable fallback mode:
```typescript
// In mongoApi.ts
const MONGODB_API_BASE_URL = process.env.MONGODB_API_URL || 'http://localhost:5000/api';

// If no URL is set, API calls will fail and app should handle gracefully
```

## Migration Checklist

- [ ] Set up MongoDB database
- [ ] Create all required collections with indexes
- [ ] Implement backend API endpoints
- [ ] Configure Supabase project
- [ ] Update environment variables
- [ ] Test authentication flow
- [ ] Test all CRUD operations
- [ ] Migrate existing localStorage data (if needed)
- [ ] Deploy backend
- [ ] Update frontend MONGODB_API_URL
- [ ] Test production deployment

## Security Considerations

1. **Never expose MongoDB credentials in frontend**
2. **Always verify Supabase JWT on backend**
3. **Implement proper authorization checks**
4. **Sanitize user inputs**
5. **Use HTTPS in production**
6. **Enable CORS properly**
7. **Rate limit API endpoints**
8. **Validate all request data**

## Testing

### Test Authentication
```bash
# Sign up
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"user-id","email":"test@example.com","name":"Test","role":"mentee"}'

# Get profile
curl http://localhost:5000/api/users/user-id \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

### Test Sessions
```bash
# Create session
curl -X POST http://localhost:5000/api/sessions \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Session","description":"Test",...}'

# List sessions
curl http://localhost:5000/api/sessions \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

## Support

For issues or questions about the MongoDB integration:
1. Check this documentation
2. Review `/utils/mongoApi.ts` for API structure
3. Check `/contexts/AuthContext.tsx` for auth flow
4. Review backend logs
5. Check Supabase dashboard for auth issues

## Next Steps

1. **Set up your MongoDB database**
2. **Implement the backend API** (or use the example above)
3. **Configure environment variables**
4. **Test the integration**
5. **Deploy to production**

The frontend is already fully prepared to work with your MongoDB backend!
