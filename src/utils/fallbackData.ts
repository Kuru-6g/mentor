/**
 * Fallback Data Provider
 * 
 * This provides mock data when MongoDB backend is unavailable.
 * Useful for development and testing.
 */

import { UserProfile } from '../services/supabaseService';

export interface Mentor extends UserProfile {
  rating?: number;
  totalSessions?: number;
  totalMentees?: number;
}

export interface Speaker {
  name: string;
  avatar: string;
  title: string;
}

export interface Session {
  id: string; // fallback uses string IDs often
  title: string;
  description: string;
  createdBy: string;
  speakers: Speaker[];
  date: string;
  time: string;
  duration: string;
  topics: string[];
  sessionType: 'online' | 'physical';
  maxSlots: number;
  availableSlots: number;
  attendees: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  companyName?: string;
  location?: string;
}

export interface SessionRequest {
  id: string;
  sessionId: string; // fallback uses string IDs
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: string; // fallback might use this
  updatedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  category: 'certification' | 'award' | 'education' | 'experience';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  sessionId: string;
  menteeId: string;
  mentorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Check if we should use fallback data
export const useFallbackData = () => {
  // You can toggle this via environment variable or a flag
  return !process.env.MONGODB_API_URL || process.env.USE_FALLBACK_DATA === 'true';
};

// Mock Mentors
export const mockMentors: Mentor[] = [
  {
    id: 'mentor1',
    email: 'sarah.johnson@test.com',
    name: 'Sarah Johnson',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    expertise: ['React', 'Node.js', 'System Design', 'Leadership'],
    yearsExperience: 8,
    bio: 'Senior Software Engineer passionate about helping developers grow. I\'ve worked at top tech companies and love sharing my knowledge about full-stack development and career growth.',
    currentRole: 'Senior Software Engineer',
    company: 'TechCorp',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    github: 'https://github.com/sarahjohnson',
    rating: 4.8,
    totalSessions: 45,
    totalMentees: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mentor2',
    email: 'michael.chen@test.com',
    name: 'Michael Chen',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    expertise: ['System Design', 'Architecture', 'Scalability', 'Python'],
    yearsExperience: 12,
    bio: 'Tech Lead with over a decade of experience in building scalable systems. Specialized in distributed systems and cloud architecture.',
    currentRole: 'Senior Software Architect',
    company: 'CloudScale Inc',
    linkedin: 'https://linkedin.com/in/michaelchen',
    github: 'https://github.com/mchen',
    rating: 4.9,
    totalSessions: 62,
    totalMentees: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mentor3',
    email: 'david.kim@test.com',
    name: 'David Kim',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    expertise: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'AWS'],
    yearsExperience: 10,
    bio: 'DevOps Lead helping teams streamline their deployment processes. Expert in containerization and cloud infrastructure.',
    currentRole: 'DevOps Lead',
    company: 'InfraCloud',
    linkedin: 'https://linkedin.com/in/davidkim',
    rating: 4.7,
    totalSessions: 38,
    totalMentees: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: 'ach1',
    userId: 'mentor1',
    title: 'AWS Certified Solutions Architect',
    description: 'Professional level certification in cloud architecture',
    date: '2024-03-15',
    category: 'certification',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ach2',
    userId: 'mentor1',
    title: 'Best Speaker Award - DevCon 2024',
    description: 'Recognized for outstanding presentation on microservices architecture',
    date: '2024-06-20',
    category: 'award',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'session1',
    title: 'System Design Fundamentals',
    description: 'Understand the core concepts of system design and how to approach design interviews.',
    createdBy: 'mentor2',
    speakers: [
      {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        title: 'Senior Software Architect',
      },
    ],
    date: '2025-11-22',
    time: '7:00 PM EST',
    duration: '120 minutes',
    topics: ['System Design', 'Architecture', 'Scalability'],
    sessionType: 'online',
    maxSlots: 100,
    availableSlots: 33,
    attendees: 67,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'session2',
    title: 'React Best Practices & Performance Optimization',
    description: 'Deep dive into React performance optimization and best practices.',
    createdBy: 'mentor1',
    speakers: [
      {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        title: 'Senior Software Engineer',
      },
    ],
    date: '2025-11-15',
    time: '7:30 PM EST',
    duration: '120 minutes',
    topics: ['React', 'Performance', 'JavaScript', 'Web Development'],
    sessionType: 'online',
    maxSlots: 120,
    availableSlots: 38,
    attendees: 82,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-memory storage for fallback mode
class FallbackDataStore {
  private users: Map<string, UserProfile> = new Map();
  private sessions: Map<string, Session> = new Map();
  private achievements: Map<string, Achievement[]> = new Map();
  private sessionRequests: Map<string, SessionRequest[]> = new Map();
  private reviews: Map<string, Review[]> = new Map();

  constructor() {
    // Initialize with mock data
    mockMentors.forEach(mentor => {
      this.users.set(mentor.id, mentor);
    });

    mockSessions.forEach(session => {
      this.sessions.set(session.id, session);
    });

    mockAchievements.forEach(achievement => {
      const userAchievements = this.achievements.get(achievement.userId) || [];
      userAchievements.push(achievement);
      this.achievements.set(achievement.userId, userAchievements);
    });
  }

  // User methods
  getUser(userId: string): UserProfile | undefined {
    return this.users.get(userId);
  }

  createUser(user: UserProfile): UserProfile {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(userId: string, data: Partial<UserProfile>): UserProfile | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updated = { ...user, ...data, updatedAt: new Date().toISOString() };
    this.users.set(userId, updated);
    return updated;
  }

  getAllMentors(): Mentor[] {
    return Array.from(this.users.values()).filter(
      (user): user is Mentor => user.role === 'mentor'
    );
  }

  // Session methods
  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  createSession(session: Session): Session {
    this.sessions.set(session.id, session);
    return session;
  }

  updateSession(sessionId: string, data: Partial<Session>): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    const updated = { ...session, ...data, updatedAt: new Date().toISOString() };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getSessionsByMentor(mentorId: string): Session[] {
    return Array.from(this.sessions.values()).filter(
      session => session.createdBy === mentorId
    );
  }

  // Achievement methods
  getAchievementsByUser(userId: string): Achievement[] {
    return this.achievements.get(userId) || [];
  }

  createAchievement(achievement: Achievement): Achievement {
    const userAchievements = this.achievements.get(achievement.userId) || [];
    userAchievements.push(achievement);
    this.achievements.set(achievement.userId, userAchievements);
    return achievement;
  }

  deleteAchievement(userId: string, achievementId: string): boolean {
    const userAchievements = this.achievements.get(userId) || [];
    const filtered = userAchievements.filter(a => a.id !== achievementId);
    this.achievements.set(userId, filtered);
    return filtered.length < userAchievements.length;
  }

  // Session Request methods
  getSessionRequestsByMentor(mentorId: string): SessionRequest[] {
    const allRequests: SessionRequest[] = [];
    const mentorSessions = this.getSessionsByMentor(mentorId);

    mentorSessions.forEach(session => {
      const requests = this.sessionRequests.get(session.id) || [];
      allRequests.push(...requests);
    });

    return allRequests;
  }

  getSessionRequestsBySession(sessionId: string): SessionRequest[] {
    return this.sessionRequests.get(sessionId) || [];
  }

  createSessionRequest(request: SessionRequest): SessionRequest {
    const sessionRequests = this.sessionRequests.get(request.sessionId) || [];
    sessionRequests.push(request);
    this.sessionRequests.set(request.sessionId, sessionRequests);
    return request;
  }

  updateSessionRequest(requestId: string, data: Partial<SessionRequest>): SessionRequest | undefined {
    for (const [sessionId, requests] of this.sessionRequests.entries()) {
      const index = requests.findIndex(r => r.id === requestId);
      if (index !== -1) {
        requests[index] = { ...requests[index], ...data, updatedAt: new Date().toISOString() };
        this.sessionRequests.set(sessionId, requests);
        return requests[index];
      }
    }
    return undefined;
  }
}

export const fallbackStore = new FallbackDataStore();
