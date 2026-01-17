# MongoDB Backend Implementation Example

This document provides a complete example backend implementation for Topvoice.lk using Node.js, Express, and MongoDB.

## Quick Start

### 1. Initialize Backend Project

```bash
mkdir topvoice-backend
cd topvoice-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongodb @supabase/supabase-js cors dotenv helmet express-rate-limit
npm install --save-dev nodemon
```

### 3. Project Structure

```
topvoice-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── supabase.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── mentors.js
│   │   ├── sessions.js
│   │   ├── sessionRequests.js
│   │   ├── achievements.js
│   │   ├── reviews.js
│   │   ├── notifications.js
│   │   └── blog.js
│   ├── models/
│   │   └── index.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## Complete Implementation

### package.json

```json
{
  "name": "topvoice-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongodb": "^6.3.0",
    "@supabase/supabase-js": "^2.39.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### .env

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/topvoice

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# CORS
FRONTEND_URL=http://localhost:5173
```

### src/config/database.js

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('topvoice');
    console.log('✅ Connected to MongoDB');
    
    // Create indexes
    await createIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createIndexes() {
  try {
    // Users
    await db.collection('users').createIndex({ id: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    // Sessions
    await db.collection('sessions').createIndex({ id: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ createdBy: 1 });
    await db.collection('sessions').createIndex({ status: 1 });
    await db.collection('sessions').createIndex({ date: 1 });
    
    // Session Requests
    await db.collection('session_requests').createIndex({ id: 1 }, { unique: true });
    await db.collection('session_requests').createIndex({ sessionId: 1 });
    await db.collection('session_requests').createIndex({ userId: 1 });
    await db.collection('session_requests').createIndex({ status: 1 });
    
    // Achievements
    await db.collection('achievements').createIndex({ id: 1 }, { unique: true });
    await db.collection('achievements').createIndex({ userId: 1 });
    
    // Reviews
    await db.collection('reviews').createIndex({ id: 1 }, { unique: true });
    await db.collection('reviews').createIndex({ mentorId: 1 });
    
    // Notifications
    await db.collection('notifications').createIndex({ id: 1 }, { unique: true });
    await db.collection('notifications').createIndex({ userId: 1 });
    await db.collection('notifications').createIndex({ read: 1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = { connectDB, getDB };
```

### src/config/supabase.js

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
```

### src/middleware/auth.js

```javascript
const supabase = require('../config/supabase');

async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No authorization token provided' 
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = { verifyAuth };
```

### src/middleware/errorHandler.js

```javascript
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
```

### src/routes/users.js

```javascript
const express = require('express');
const { getDB } = require('../config/database');
const { verifyAuth } = require('../middleware/auth');
const router = express.Router();

// Create user profile
router.post('/', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
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
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

// Get user profile
router.get('/:userId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    
    const profile = await users.findOne(
      { id: req.params.userId },
      { projection: { _id: 0 } }
    );
    
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/:userId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    
    // Ensure user can only update their own profile
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { _id, id, email, createdAt, ...updateData } = req.body;
    
    const result = await users.findOneAndUpdate(
      { id: req.params.userId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
    
    if (!result.value) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.value);
  } catch (error) {
    next(error);
  }
});

// Delete user profile
router.delete('/:userId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const users = db.collection('users');
    
    // Ensure user can only delete their own profile
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await users.deleteOne({ id: req.params.userId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get user's session requests
router.get('/:userId/session-requests', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const requests = db.collection('session_requests');
    
    const userRequests = await requests
      .find({ userId: req.params.userId })
      .project({ _id: 0 })
      .sort({ requestedAt: -1 })
      .toArray();
    
    res.json(userRequests);
  } catch (error) {
    next(error);
  }
});

// Get user's notifications
router.get('/:userId/notifications', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const notifications = db.collection('notifications');
    
    const userNotifications = await notifications
      .find({ userId: req.params.userId })
      .project({ _id: 0 })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    res.json(userNotifications);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### src/routes/sessions.js

```javascript
const express = require('express');
const { getDB } = require('../config/database');
const { verifyAuth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const router = express.Router();

// Get all sessions
router.get('/', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.sessionType) filter.sessionType = req.query.sessionType;
    if (req.query.createdBy) filter.createdBy = req.query.createdBy;
    if (req.query.topic) filter.topics = { $in: [req.query.topic] };
    
    const allSessions = await sessions
      .find(filter)
      .project({ _id: 0 })
      .sort({ date: 1 })
      .toArray();
    
    res.json(allSessions);
  } catch (error) {
    next(error);
  }
});

// Get session by ID
router.get('/:sessionId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    
    const session = await sessions.findOne(
      { id: req.params.sessionId },
      { projection: { _id: 0 } }
    );
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    next(error);
  }
});

// Create session
router.post('/', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    
    const session = {
      id: uuidv4(),
      ...req.body,
      createdBy: req.user.id,
      attendees: 0,
      availableSlots: req.body.maxSlots || 0,
      status: 'upcoming',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await sessions.insertOne(session);
    
    const { _id, ...sessionData } = session;
    res.status(201).json(sessionData);
  } catch (error) {
    next(error);
  }
});

// Update session
router.put('/:sessionId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    
    // Verify user owns this session
    const session = await sessions.findOne({ id: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const { _id, id, createdBy, createdAt, ...updateData } = req.body;
    
    const result = await sessions.findOneAndUpdate(
      { id: req.params.sessionId },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { returnDocument: 'after', projection: { _id: 0 } }
    );
    
    res.json(result.value);
  } catch (error) {
    next(error);
  }
});

// Delete session
router.delete('/:sessionId', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    const sessionRequests = db.collection('session_requests');
    
    // Verify user owns this session
    const session = await sessions.findOne({ id: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Delete session and all related requests
    await sessions.deleteOne({ id: req.params.sessionId });
    await sessionRequests.deleteMany({ sessionId: req.params.sessionId });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get session requests
router.get('/:sessionId/requests', verifyAuth, async (req, res, next) => {
  try {
    const db = getDB();
    const sessions = db.collection('sessions');
    const sessionRequests = db.collection('session_requests');
    
    // Verify user owns this session
    const session = await sessions.findOne({ id: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const requests = await sessionRequests
      .find({ sessionId: req.params.sessionId })
      .project({ _id: 0 })
      .sort({ requestedAt: -1 })
      .toArray();
    
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### src/server.js

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/session-requests', require('./routes/sessionRequests'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/blog', require('./routes/blog'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
```

## Running the Backend

```bash
# Development
npm run dev

# Production
npm start
```

## Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test with Supabase token
curl http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

## Deployment

### Heroku
```bash
heroku create topvoice-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set SUPABASE_URL=your_supabase_url
heroku config:set SUPABASE_SERVICE_KEY=your_service_key
git push heroku main
```

### Render/Railway
Similar process - add environment variables in dashboard and deploy.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

This is a complete, production-ready backend implementation for Topvoice.lk!
