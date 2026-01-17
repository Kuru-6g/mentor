/**
 * API Routes for MongoDB backend
 */

import { Context } from "npm:hono";
import { ObjectId } from "npm:mongodb@6";
import {
  getUsersCollection,
  getMentorsCollection,
  getSessionsCollection,
  getSessionRequestsCollection,
  getAchievementsCollection,
  getMentorshipRequestsCollection,
} from "./mongodb.tsx";

// ==================== USER ROUTES ====================

export async function createUser(c: Context) {
  try {
    const body = await c.req.json();
    const { id, email, name, role, avatar, expertise, yearsExperience, bio, 
            linkedin, github, website, interests, currentRole, goals, profileCompleted } = body;

    if (!id || !email || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const users = await getUsersCollection();
    
    // Check if user already exists
    const existing = await users.findOne({ id });
    if (existing) {
      return c.json({ error: "User already exists" }, 400);
    }

    const userData: any = {
      id,
      email,
      name,
      role,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FFD700&color=000000`,
      profileCompleted: profileCompleted || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add role-specific fields
    if (role === "mentor") {
      userData.expertise = expertise || [];
      userData.yearsExperience = yearsExperience || 0;
      userData.bio = bio || "";
      userData.linkedin = linkedin || "";
      userData.github = github || "";
      userData.website = website || "";
      userData.rating = 0;
      userData.totalSessions = 0;
      userData.totalMentees = 0;
    } else if (role === "mentee") {
      userData.interests = interests || [];
      userData.currentRole = currentRole || "";
      userData.goals = goals || "";
    }

    await users.insertOne(userData);

    return c.json(userData);
  } catch (error: any) {
    console.error("Create user error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function getUser(c: Context) {
  try {
    const userId = c.req.param("userId");
    const users = await getUsersCollection();
    
    const user = await users.findOne({ id: userId });
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error: any) {
    console.error("Get user error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function updateUser(c: Context) {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    
    const users = await getUsersCollection();
    
    const result = await users.findOneAndUpdate(
      { id: userId },
      { 
        $set: { 
          ...body,
          id: userId, // Prevent ID change
          updatedAt: new Date().toISOString() 
        } 
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(result);
  } catch (error: any) {
    console.error("Update user error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

// ==================== MENTOR ROUTES ====================

export async function getAllMentors(c: Context) {
  try {
    const users = await getUsersCollection();
    const mentors = await users.find({ role: "mentor" }).toArray();
    
    return c.json(mentors);
  } catch (error: any) {
    console.error("Get mentors error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function getMentor(c: Context) {
  try {
    const mentorId = c.req.param("mentorId");
    const users = await getUsersCollection();
    
    const mentor = await users.findOne({ id: mentorId, role: "mentor" });
    
    if (!mentor) {
      return c.json({ error: "Mentor not found" }, 404);
    }

    return c.json(mentor);
  } catch (error: any) {
    console.error("Get mentor error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

// ==================== SESSION ROUTES ====================

export async function getAllSessions(c: Context) {
  try {
    const sessions = await getSessionsCollection();
    const allSessions = await sessions.find({}).sort({ createdAt: -1 }).toArray();
    
    return c.json(allSessions);
  } catch (error: any) {
    console.error("Get sessions error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function getSession(c: Context) {
  try {
    const sessionId = c.req.param("sessionId");
    const sessions = await getSessionsCollection();
    
    const session = await sessions.findOne({ id: sessionId });
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(session);
  } catch (error: any) {
    console.error("Get session error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function createSession(c: Context) {
  try {
    const body = await c.req.json();
    const userId = c.get("userId"); // From auth middleware
    
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const sessions = await getSessionsCollection();
    
    const sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const session = {
      id: sessionId,
      ...body,
      createdBy: userId,
      attendees: 0,
      availableSlots: body.maxSlots || 0,
      status: body.status || "upcoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sessions.insertOne(session);

    return c.json(session);
  } catch (error: any) {
    console.error("Create session error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function updateSession(c: Context) {
  try {
    const sessionId = c.req.param("sessionId");
    const body = await c.req.json();
    const userId = c.get("userId");

    const sessions = await getSessionsCollection();
    
    const session = await sessions.findOne({ id: sessionId });
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    if (session.createdBy !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const result = await sessions.findOneAndUpdate(
      { id: sessionId },
      { 
        $set: { 
          ...body,
          id: sessionId,
          createdBy: session.createdBy,
          updatedAt: new Date().toISOString() 
        } 
      },
      { returnDocument: "after" }
    );

    return c.json(result);
  } catch (error: any) {
    console.error("Update session error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function deleteSession(c: Context) {
  try {
    const sessionId = c.req.param("sessionId");
    const userId = c.get("userId");

    const sessions = await getSessionsCollection();
    
    const session = await sessions.findOne({ id: sessionId });
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    if (session.createdBy !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await sessions.deleteOne({ id: sessionId });

    return c.json({ message: "Session deleted successfully" });
  } catch (error: any) {
    console.error("Delete session error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

// ==================== SESSION REQUEST ROUTES ====================

export async function createSessionRequest(c: Context) {
  try {
    const sessionId = c.req.param("sessionId");
    const body = await c.req.json();
    const userId = c.get("userId");
    
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const sessions = await getSessionsCollection();
    const session = await sessions.findOne({ id: sessionId });
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const requests = await getSessionRequestsCollection();
    
    // Check if already requested
    const existing = await requests.findOne({ sessionId, userId });
    if (existing) {
      return c.json({ error: "Request already exists" }, 400);
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ id: userId });

    const requestId = `${sessionId}-${userId}-${Date.now()}`;
    
    const request = {
      id: requestId,
      sessionId,
      userId,
      userName: user?.name || "Unknown",
      userEmail: user?.email || "",
      userAvatar: user?.avatar || "",
      status: "pending",
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    };

    await requests.insertOne(request);

    return c.json(request);
  } catch (error: any) {
    console.error("Create session request error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function getSessionRequests(c: Context) {
  try {
    const sessionId = c.req.param("sessionId");
    const userId = c.get("userId");
    
    const sessions = await getSessionsCollection();
    const session = await sessions.findOne({ id: sessionId });
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    if (session.createdBy !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const requests = await getSessionRequestsCollection();
    const allRequests = await requests.find({ sessionId }).toArray();

    return c.json(allRequests);
  } catch (error: any) {
    console.error("Get session requests error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function respondToRequest(c: Context) {
  try {
    const requestId = c.req.param("requestId");
    const body = await c.req.json();
    const { action } = body;
    const userId = c.get("userId");

    if (!action || !["accept", "reject"].includes(action)) {
      return c.json({ error: "Invalid action" }, 400);
    }

    const requests = await getSessionRequestsCollection();
    const request = await requests.findOne({ id: requestId });

    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    const sessions = await getSessionsCollection();
    const session = await sessions.findOne({ id: request.sessionId });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    if (session.createdBy !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    if (action === "accept") {
      if (session.availableSlots <= 0) {
        return c.json({ error: "Session is full" }, 400);
      }

      await sessions.updateOne(
        { id: request.sessionId },
        { 
          $inc: { attendees: 1, availableSlots: -1 },
          $set: { updatedAt: new Date().toISOString() }
        }
      );
    }

    const updatedRequest = await requests.findOneAndUpdate(
      { id: requestId },
      { 
        $set: { 
          status: action === "accept" ? "accepted" : "rejected",
          updatedAt: new Date().toISOString()
        } 
      },
      { returnDocument: "after" }
    );

    return c.json(updatedRequest);
  } catch (error: any) {
    console.error("Respond to request error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function getMentorRequests(c: Context) {
  try {
    const userId = c.get("userId");
    
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const sessions = await getSessionsCollection();
    const mentorSessions = await sessions.find({ createdBy: userId }).toArray();
    
    const sessionIds = mentorSessions.map((s: any) => s.id);
    
    const requests = await getSessionRequestsCollection();
    const allRequests = await requests.find({ 
      sessionId: { $in: sessionIds } 
    }).toArray();

    return c.json(allRequests);
  } catch (error: any) {
    console.error("Get mentor requests error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

// ==================== ACHIEVEMENT ROUTES ====================

export async function getMentorAchievements(c: Context) {
  try {
    const mentorId = c.req.param("mentorId");
    const achievements = await getAchievementsCollection();
    
    const mentorAchievements = await achievements.find({ userId: mentorId }).toArray();

    return c.json(mentorAchievements);
  } catch (error: any) {
    console.error("Get achievements error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function createAchievement(c: Context) {
  try {
    const body = await c.req.json();
    const userId = c.get("userId");
    
    if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const achievements = await getAchievementsCollection();
    
    const achievementId = `${userId}-${Date.now()}`;
    
    const achievement = {
      id: achievementId,
      userId,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await achievements.insertOne(achievement);

    return c.json(achievement);
  } catch (error: any) {
    console.error("Create achievement error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}

export async function deleteAchievement(c: Context) {
  try {
    const achievementId = c.req.param("achievementId");
    const userId = c.get("userId");

    const achievements = await getAchievementsCollection();
    
    const achievement = await achievements.findOne({ id: achievementId });
    
    if (!achievement) {
      return c.json({ error: "Achievement not found" }, 404);
    }

    if (achievement.userId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await achievements.deleteOne({ id: achievementId });

    return c.json({ message: "Achievement deleted successfully" });
  } catch (error: any) {
    console.error("Delete achievement error:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
}
