# Topvoice.lk - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              React Application (Frontend)                  │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │   Pages &    │  │  Components  │  │    Contexts     │ │ │
│  │  │   Routes     │  │              │  │  - AuthContext  │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘ │ │
│  │         │                 │                    │          │ │
│  │         └─────────────────┴────────────────────┘          │ │
│  │                           │                                │ │
│  │         ┌─────────────────┴─────────────────┐             │ │
│  │         │                                   │             │ │
│  │    ┌────▼────────────┐           ┌──────────▼──────────┐ │ │
│  │    │ supabaseClient  │           │    mongoApi         │ │ │
│  │    │                 │           │                     │ │ │
│  │    │ • signUp()      │           │ • userAPI           │ │ │
│  │    │ • signIn()      │           │ • sessionAPI        │ │ │
│  │    │ • signOut()     │           │ • mentorAPI         │ │ │
│  │    │ • getUser()     │           │ • achievementAPI    │ │ │
│  │    └────┬────────────┘           └──────────┬──────────┘ │ │
│  │         │                                   │             │ │
│  └─────────┼───────────────────────────────────┼─────────────┘ │
│            │                                   │               │
└────────────┼───────────────────────────────────┼───────────────┘
             │                                   │
             │ HTTPS/REST                        │ HTTPS/REST
             │                                   │
    ┌────────▼──────────┐              ┌─────────▼──────────────┐
    │                   │              │                        │
    │  SUPABASE AUTH    │              │   MONGODB BACKEND      │
    │                   │              │      (Node.js)         │
    │  • User Storage   │              │                        │
    │  • JWT Tokens     │              │  ┌──────────────────┐ │
    │  • Auth Sessions  │              │  │  Express Server  │ │
    │  • Password Hash  │              │  │                  │ │
    │                   │              │  │ • Auth Middleware│ │
    │                   │              │  │ • Routes         │ │
    └───────────────────┘              │  │ • Validation     │ │
                                       │  └────────┬─────────┘ │
                                       │           │           │
                                       │  ┌────────▼─────────┐ │
                                       │  │  MongoDB Atlas   │ │
                                       │  │                  │ │
                                       │  │ Collections:     │ │
                                       │  │ • users          │ │
                                       │  │ • sessions       │ │
                                       │  │ • requests       │ │
                                       │  │ • achievements   │ │
                                       │  │ • reviews        │ │
                                       │  │ • notifications  │ │
                                       │  └──────────────────┘ │
                                       └────────────────────────┘
```

## Authentication Flow

```
┌─────────┐                                                    ┌──────────┐
│ Browser │                                                    │ Supabase │
└────┬────┘                                                    └────┬─────┘
     │                                                              │
     │ 1. User submits signup form                                 │
     │────────────────────────────────────────────────────────────▶│
     │                                                              │
     │                2. Create auth user + Generate JWT           │
     │◀────────────────────────────────────────────────────────────│
     │                                                              │
     │                                                         ┌────┴────┐
     │ 3. Call POST /api/users with JWT token                 │ Backend │
     │────────────────────────────────────────────────────────▶│         │
     │                                                         │ MongoDB │
     │           4. Verify JWT with Supabase                   │         │
     │                          │                              │         │
     │                          ├─────────────────────────────▶│         │
     │                          │         Valid?               │         │
     │                          │◀─────────────────────────────│         │
     │                          │          Yes                 │         │
     │                                                         │         │
     │           5. Create user profile in MongoDB             │         │
     │                          │                              │         │
     │                          │────────────────────┐         │         │
     │                          │  users.insertOne() │         │         │
     │                          │◀───────────────────┘         │         │
     │                                                         │         │
     │             6. Return user profile                      │         │
     │◀────────────────────────────────────────────────────────│         │
     │                                                         └─────────┘
     │ 7. Store session in AuthContext
     │
     └──▶ User is logged in!
```

## Data Flow - Creating a Session

```
┌──────────┐         ┌─────────────┐         ┌─────────────┐         ┌──────────┐
│  Mentor  │         │  Frontend   │         │   Backend   │         │ MongoDB  │
│Dashboard │         │ (sessionAPI)│         │   Server    │         │          │
└────┬─────┘         └──────┬──────┘         └──────┬──────┘         └────┬─────┘
     │                      │                       │                      │
     │ Click "Create        │                       │                      │
     │ Session"             │                       │                      │
     │──────────────────────▶│                       │                      │
     │                      │                       │                      │
     │                      │ POST /api/sessions    │                      │
     │                      │ + JWT Token           │                      │
     │                      │──────────────────────▶│                      │
     │                      │                       │                      │
     │                      │                       │ Verify JWT           │
     │                      │                       │────────┐             │
     │                      │                       │        │             │
     │                      │                       │◀───────┘             │
     │                      │                       │                      │
     │                      │                       │ sessions.insertOne() │
     │                      │                       │─────────────────────▶│
     │                      │                       │                      │
     │                      │                       │      Session saved   │
     │                      │                       │◀─────────────────────│
     │                      │                       │                      │
     │                      │   Return session      │                      │
     │                      │◀──────────────────────│                      │
     │                      │                       │                      │
     │  Update UI           │                       │                      │
     │◀──────────────────────│                       │                      │
     │                      │                       │                      │
     │ Session appears!     │                       │                      │
     │                      │                       │                      │
```

## Data Flow - Joining a Session

```
┌──────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────┐
│  Mentee  │    │  Frontend   │    │   Backend   │    │ MongoDB  │    │  Mentor  │
│ Browser  │    │             │    │             │    │          │    │Dashboard │
└────┬─────┘    └──────┬──────┘    └──────┬──────┘    └────┬─────┘    └────┬─────┘
     │                 │                   │                │               │
     │ Click "Request  │                   │                │               │
     │ to Join"        │                   │                │               │
     │─────────────────▶│                   │                │               │
     │                 │                   │                │               │
     │                 │ POST              │                │               │
     │                 │ /session-requests │                │               │
     │                 │──────────────────▶│                │               │
     │                 │                   │                │               │
     │                 │                   │ Insert request │               │
     │                 │                   │───────────────▶│               │
     │                 │                   │                │               │
     │                 │                   │                │ Create        │
     │                 │                   │                │ notification  │
     │                 │                   │                │──────────────▶│
     │                 │                   │                │               │
     │                 │   Request created │                │               │
     │                 │◀──────────────────│                │               │
     │                 │                   │                │               │
     │ "Request sent!" │                   │                │               │
     │◀─────────────────│                   │                │               │
     │                 │                   │                │               │
     │                 │                   │                │   Mentor sees │
     │                 │                   │                │   request     │
     │                 │                   │                │◀──────────────│
     │                 │                   │                │               │
     │                 │                   │                │   Accept      │
     │                 │                   │                │               │
     │                 │                   │  Update request│               │
     │                 │                   │  status        │               │
     │                 │                   │◀───────────────│               │
     │                 │                   │                │               │
     │                 │                   │  Update session│               │
     │                 │                   │  attendees     │               │
     │                 │                   │───────────────▶│               │
     │                 │                   │                │               │
     │ Get             │                   │                │               │
     │ notification    │                   │                │               │
     │◀────────────────┼───────────────────┼────────────────│               │
     │                 │                   │                │               │
```

## MongoDB Collections Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB Database                           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐           │
│  │   users     │  │  sessions   │  │ achievements │           │
│  ├─────────────┤  ├─────────────┤  ├──────────────┤           │
│  │ id (PK)     │  │ id (PK)     │  │ id (PK)      │           │
│  │ email       │  │ title       │  │ userId (FK)  │           │
│  │ name        │  │ description │  │ title        │           │
│  │ role        │  │ createdBy   │  │ description  │           │
│  │ expertise   │  │ speakers[]  │  │ date         │           │
│  │ bio         │  │ date        │  │ category     │           │
│  │ ...         │  │ topics[]    │  │ ...          │           │
│  └─────────────┘  │ maxSlots    │  └──────────────┘           │
│                   │ ...         │                             │
│                   └─────────────┘                             │
│                                                                │
│  ┌──────────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │ session_requests │  │  reviews   │  │notifications │      │
│  ├──────────────────┤  ├────────────┤  ├──────────────┤      │
│  │ id (PK)          │  │ id (PK)    │  │ id (PK)      │      │
│  │ sessionId (FK)   │  │ mentorId   │  │ userId (FK)  │      │
│  │ userId (FK)      │  │ menteeId   │  │ type         │      │
│  │ status           │  │ rating     │  │ message      │      │
│  │ phone            │  │ comment    │  │ read         │      │
│  │ reasonToJoin     │  │ ...        │  │ ...          │      │
│  │ ...              │  └────────────┘  └──────────────┘      │
│  └──────────────────┘                                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App (AuthProvider)
│
├── Header
│   ├── Navigation
│   └── UserMenu
│
├── Main Content (Router)
│   │
│   ├── LandingPage
│   │   ├── HeroSection
│   │   ├── FeaturedSessions
│   │   └── CTASection
│   │
│   ├── MentorDirectory
│   │   ├── SearchBar
│   │   ├── Filters
│   │   └── MentorCard[]
│   │
│   ├── MentorProfile
│   │   ├── ProfileHeader
│   │   ├── AboutSection
│   │   ├── Achievements[]
│   │   └── ActionButtons
│   │
│   ├── SessionsPage
│   │   ├── SessionFilters
│   │   └── SessionCard[]
│   │       └── JoinSessionDialog
│   │
│   ├── MentorDashboard
│   │   ├── DashboardTabs
│   │   │   ├── ProfileManagement
│   │   │   ├── SessionManagement
│   │   │   ├── AchievementManager
│   │   │   ├── SessionRequests
│   │   │   └── SessionParticipants
│   │   └── Stats
│   │
���   ├── AuthForm
│   │   ├── LoginTab
│   │   └── SignupTab
│   │       ├── RoleSelector
│   │       ├── CommonFields
│   │       └── RoleSpecificFields
│   │
│   └── StaticPages
│       ├── AboutPage
│       ├── ContactPage
│       ├── BlogPage
│       └── ...
│
└── Footer
    ├── Links
    └── SocialMedia
```

## State Management

```
┌────────────────────────────────────────────────────────────┐
│                     State Management                        │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              AuthContext (Global)                    │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ • user: UserProfile | null                     │  │ │
│  │  │ • session: Session | null                      │  │ │
│  │  │ • loading: boolean                             │  │ │
│  │  │ • signUp()                                     │  │ │
│  │  │ • signIn()                                     │  │ │
│  │  │ • signOut()                                    │  │ │
│  │  │ • updateProfile()                              │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Component Local State (useState)             │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ • Form inputs                                  │  │ │
│  │  │ • UI state (modals, tabs)                      │  │ │
│  │  │ • Temporary data                               │  │ │
│  │  │ • Loading states                               │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │       Server State (Fetched via API)                 │ │
│  │  ┌────────────────────────────────────────────────┐  │ │
│  │  │ • Sessions                                     │  │ │
│  │  │ • Mentors                                      │  │ │
│  │  │ • Achievements                                 │  │ │
│  │  │ • Session Requests                             │  │ │
│  │  │ • Notifications                                │  │ │
│  │  └────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
│                                                            │
│  1. Frontend Protection                                    │
│     ┌────────────────────────────────────────────────┐    │
│     │ • Route protection (useAuth hook)              │    │
│     │ • JWT storage in memory/secure storage         │    │
│     │ • HTTPS only in production                     │    │
│     │ • No sensitive data in localStorage            │    │
│     └────────────────────────────────────────────────┘    │
│                                                            │
│  2. API Layer Protection                                   │
│     ┌────────────────────────────────────────────────┐    │
│     │ • All requests include JWT token               │    │
│     │ • Authorization header validation              │    │
│     │ • CORS restrictions                            │    │
│     └────────────────────────────────────────────────┘    │
│                                                            │
│  3. Backend Protection                                     │
│     ┌────────────────────────────────────────────────┐    │
│     │ • JWT verification on every request            │    │
│     │ • User authorization checks                    │    │
│     │ • Input validation & sanitization              │    │
│     │ • Rate limiting                                │    │
│     │ • Helmet.js security headers                   │    │
│     └────────────────────────────────────────────────┘    │
│                                                            │
│  4. Database Protection                                    │
│     ┌────────────────────────────────────────────────┐    │
│     │ • No direct database access from frontend      │    │
│     │ • Connection string in env variables           │    │
│     │ • MongoDB user with limited permissions        │    │
│     │ • IP whitelist (MongoDB Atlas)                 │    │
│     └────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Production Setup                        │
│                                                            │
│  ┌──────────────────┐         ┌───────────────────────┐   │
│  │   Vercel/Netlify │         │   Render/Railway      │   │
│  │                  │         │                       │   │
│  │  ┌────────────┐  │         │  ┌─────────────────┐ │   │
│  │  │  Frontend  │  │◀───────▶│  │  Backend API    │ │   │
│  │  │   (React)  │  │  HTTPS  │  │  (Express.js)   │ │   │
│  │  └────────────┘  │         │  └────────┬────────┘ │   │
│  │                  │         │           │          │   │
│  │  Environment:    │         │           │          │   │
│  │  - VITE_MONGODB  │         │  Environment:        │   │
│  │    _API_URL      │         │  - MONGODB_URI       │   │
│  └──────────────────┘         │  - SUPABASE_URL      │   │
│                               │  - SUPABASE_KEY      │   │
│                               └───────────┬───────────┘   │
│                                           │               │
│  ┌──────────────────┐         ┌───────────▼───────────┐   │
│  │  Supabase Auth   │         │   MongoDB Atlas       │   │
│  │                  │         │                       │   │
│  │  - User Auth     │         │  - Database Storage   │   │
│  │  - JWT Tokens    │         │  - Automated Backups  │   │
│  │  - Session Mgmt  │         │  - Monitoring         │   │
│  └──────────────────┘         └───────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## API Request Flow with Caching

```
Component
    │
    │ 1. Request data
    ▼
useQuery/useSWR (optional)
    │
    │ 2. Check cache
    ├─── Cache Hit ──────▶ Return cached data
    │
    │ 3. Cache Miss
    ▼
mongoApi function
    │
    │ 4. Add JWT header
    ▼
fetch() to Backend
    │
    │ 5. Network request
    ▼
Backend API
    │
    │ 6. Verify JWT
    ▼
MongoDB
    │
    │ 7. Query database
    ▼
Return data
    │
    │ 8. Send response
    ▼
Update cache
    │
    │ 9. Return to component
    ▼
Render UI
```

This architecture provides a scalable, secure, and maintainable foundation for Topvoice.lk!
