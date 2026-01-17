import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as routes from "./routes.tsx";

const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

// Service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Middleware to verify auth token
async function verifyAuth(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  
  const token = authHeader.split(" ")[1];
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user;
}

// Auth middleware for protected routes
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");
  const user = await verifyAuth(authHeader);
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  c.set("userId", user.id);
  await next();
}

// ==================== AUTHENTICATION ====================

// Sign up endpoint - Only creates Supabase auth user
app.post("/make-server-2b2cab0b/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    // Create user with Supabase Auth only
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error("Auth signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      userId: data.user.id,
      email: data.user.email,
      message: "Account created. Please complete your profile.",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error during signup: " + error.message }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-2b2cab0b/auth/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return c.json({ error: error.message }, 401);
    }

    // Try to get user profile from MongoDB
    try {
      const { getUser } = await import("./routes.tsx");
      const mockContext: any = {
        req: { param: () => data.user.id },
        json: (data: any) => ({ data }),
      };
      const profileResult = await getUser(mockContext);
      
      return c.json({
        userId: data.user.id,
        email: data.user.email,
        session: data.session,
        access_token: data.session.access_token,
        profile: profileResult.data || null,
      });
    } catch (err) {
      // Profile doesn't exist yet
      return c.json({
        userId: data.user.id,
        email: data.user.email,
        session: data.session,
        access_token: data.session.access_token,
        profile: null,
      });
    }
  } catch (error: any) {
    console.error("Sign in error:", error);
    return c.json({ error: "Internal server error during sign in: " + error.message }, 500);
  }
});

// Sign out endpoint
app.post("/make-server-2b2cab0b/auth/signout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const user = await verifyAuth(authHeader);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    await supabaseClient.auth.signOut();

    return c.json({ message: "Signed out successfully" });
  } catch (error: any) {
    console.error("Sign out error:", error);
    return c.json({ error: "Internal server error during sign out: " + error.message }, 500);
  }
});

// Get current user
app.get("/make-server-2b2cab0b/auth/me", authMiddleware, routes.getUser);

// ==================== USER PROFILES ====================

// Create/Complete user profile
app.post("/make-server-2b2cab0b/users", authMiddleware, routes.createUser);

// Get user profile
app.get("/make-server-2b2cab0b/users/:userId", routes.getUser);

// Update user profile
app.put("/make-server-2b2cab0b/users/:userId", authMiddleware, routes.updateUser);

// ==================== MENTOR PROFILES ====================

// Get all mentors
app.get("/make-server-2b2cab0b/mentors", routes.getAllMentors);

// Get mentor profile
app.get("/make-server-2b2cab0b/mentors/:mentorId", routes.getMentor);

// ==================== SESSIONS ====================

// Get all sessions
app.get("/make-server-2b2cab0b/sessions", routes.getAllSessions);

// Get session by ID
app.get("/make-server-2b2cab0b/sessions/:sessionId", routes.getSession);

// Create session (mentor only)
app.post("/make-server-2b2cab0b/sessions", authMiddleware, routes.createSession);

// Update session
app.put("/make-server-2b2cab0b/sessions/:sessionId", authMiddleware, routes.updateSession);

// Delete session
app.delete("/make-server-2b2cab0b/sessions/:sessionId", authMiddleware, routes.deleteSession);

// Request to join session
app.post("/make-server-2b2cab0b/sessions/:sessionId/request", authMiddleware, routes.createSessionRequest);

// Get all requests for a session (mentor only)
app.get("/make-server-2b2cab0b/sessions/:sessionId/requests", authMiddleware, routes.getSessionRequests);

// Accept/Reject session request (mentor only)
app.post("/make-server-2b2cab0b/requests/:requestId/respond", authMiddleware, routes.respondToRequest);

// Get all requests for all mentor's sessions
app.get("/make-server-2b2cab0b/mentor/requests", authMiddleware, routes.getMentorRequests);

// ==================== ACHIEVEMENTS ====================

// Get achievements for mentor
app.get("/make-server-2b2cab0b/mentors/:mentorId/achievements", routes.getMentorAchievements);

// Create achievement
app.post("/make-server-2b2cab0b/achievements", authMiddleware, routes.createAchievement);

// Delete achievement
app.delete("/make-server-2b2cab0b/achievements/:achievementId", authMiddleware, routes.deleteAchievement);

// Health check endpoint
app.get("/make-server-2b2cab0b/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);