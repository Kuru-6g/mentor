/**
 * MongoDB Backend API Layer
 * 
 * This file contains all API calls to your MongoDB backend via Supabase Edge Functions.
 */

import { projectId, publicAnonKey, API_BASE_URL } from './supabaseConfig';

// API Endpoint for MongoDB functions
const MONGODB_API_URL = `${API_BASE_URL}/mongodb`;

// Get auth token from Supabase session
async function getAuthToken(): Promise<string | null> {
  // This will be managed by AuthContext
  const session = JSON.parse(localStorage.getItem('supabase_session') || 'null');
  return session?.access_token || publicAnonKey;
}

// Check if MongoDB backend is available
let isBackendAvailable = true;

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isBackendAvailable) {
    throw new Error('MongoDB backend is not available. Using mock data.');
  }

  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${MONGODB_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || `Request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    isBackendAvailable = false;
    throw error;
  }
}

// ==================== USER API ====================

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'mentor' | 'mentee';
  avatar?: string;
  profileCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
  // Mentor-specific
  expertise?: string[];
  yearsExperience?: number;
  bio?: string;
  currentRole?: string;
  company?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  rating?: number;
  totalSessions?: number;
  totalMentees?: number;
  // Mentee-specific
  interests?: string[];
  goals?: string;
}

export const userAPI = {
  // Create user profile after Supabase auth
  createProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async (userId: string): Promise<UserProfile> => {
    return apiRequest(`/users/${userId}`);
  },

  updateProfile: async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProfile: async (userId: string): Promise<void> => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== MENTOR API ====================

export interface Mentor extends UserProfile {
  role: 'mentor';
  expertise: string[];
  yearsExperience: number;
  bio: string;
  rating?: number;
  totalSessions?: number;
  totalMentees?: number;
}

export const mentorAPI = {
  getAll: async (filters?: { expertise?: string; search?: string }): Promise<Mentor[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.expertise) queryParams.append('expertise', filters.expertise);
    if (filters?.search) queryParams.append('search', filters.search);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/mentors${query}`);
  },

  getById: async (mentorId: string): Promise<Mentor> => {
    return apiRequest(`/mentors/${mentorId}`);
  },

  update: async (mentorId: string, data: Partial<Mentor>): Promise<Mentor> => {
    return apiRequest(`/mentors/${mentorId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== ACHIEVEMENT API ====================

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  category: 'award' | 'certification' | 'publication' | 'project' | 'speaking';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const achievementAPI = {
  getByMentor: async (mentorId: string): Promise<Achievement[]> => {
    return apiRequest(`/mentors/${mentorId}/achievements`);
  },

  create: async (data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement> => {
    return apiRequest('/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (achievementId: string, data: Partial<Achievement>): Promise<Achievement> => {
    return apiRequest(`/achievements/${achievementId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (achievementId: string): Promise<void> => {
    return apiRequest(`/achievements/${achievementId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== SESSION API ====================

export interface Speaker {
  name: string;
  avatar: string;
  title?: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  createdBy: string; // mentor user ID
  speakers: Speaker[];
  date: string;
  time: string;
  duration: string;
  topics: string[];
  sessionType: 'online' | 'physical';
  location?: string;
  maxSlots: number;
  availableSlots: number;
  attendees: number;
  companyName?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const sessionAPI = {
  getAll: async (filters?: { 
    status?: string; 
    topic?: string; 
    sessionType?: string;
    createdBy?: string;
  }): Promise<Session[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.topic) queryParams.append('topic', filters.topic);
    if (filters?.sessionType) queryParams.append('sessionType', filters.sessionType);
    if (filters?.createdBy) queryParams.append('createdBy', filters.createdBy);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/sessions${query}`);
  },

  getById: async (sessionId: string): Promise<Session> => {
    return apiRequest(`/sessions/${sessionId}`);
  },

  create: async (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'attendees' | 'availableSlots'>): Promise<Session> => {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (sessionId: string, data: Partial<Session>): Promise<Session> => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (sessionId: string): Promise<void> => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Get sessions created by a specific mentor
  getByMentor: async (mentorId: string): Promise<Session[]> => {
    return apiRequest(`/mentors/${mentorId}/sessions`);
  },
};

// ==================== SESSION REQUEST API ====================

export interface SessionRequest {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
  updatedAt: string;
  // Additional form data
  phone?: string;
  occupation?: string;
  experienceLevel?: string;
  reasonToJoin?: string;
  expectations?: string;
}

export const sessionRequestAPI = {
  // Get all requests for sessions created by a mentor
  getByMentor: async (mentorId: string): Promise<SessionRequest[]> => {
    return apiRequest(`/mentors/${mentorId}/session-requests`);
  },

  // Get all requests for a specific session
  getBySession: async (sessionId: string): Promise<SessionRequest[]> => {
    return apiRequest(`/sessions/${sessionId}/requests`);
  },

  // Get all requests made by a user (mentee)
  getByUser: async (userId: string): Promise<SessionRequest[]> => {
    return apiRequest(`/users/${userId}/session-requests`);
  },

  // Create a new session request
  create: async (data: {
    sessionId: string;
    phone?: string;
    occupation?: string;
    experienceLevel?: string;
    reasonToJoin?: string;
    expectations?: string;
  }): Promise<SessionRequest> => {
    return apiRequest('/session-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Respond to a session request (accept/reject)
  respond: async (requestId: string, action: 'accept' | 'reject'): Promise<SessionRequest> => {
    return apiRequest(`/session-requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },

  // Cancel a pending request (by the requestor)
  cancel: async (requestId: string): Promise<void> => {
    return apiRequest(`/session-requests/${requestId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== REVIEW API ====================

export interface Review {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  sessionId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewAPI = {
  getByMentor: async (mentorId: string): Promise<Review[]> => {
    return apiRequest(`/mentors/${mentorId}/reviews`);
  },

  create: async (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (reviewId: string, data: Partial<Review>): Promise<Review> => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (reviewId: string): Promise<void> => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== NOTIFICATION API ====================

export interface Notification {
  id: string;
  userId: string;
  type: 'session_request' | 'session_accepted' | 'session_rejected' | 'session_reminder' | 'new_review';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export const notificationAPI = {
  getByUser: async (userId: string): Promise<Notification[]> => {
    return apiRequest(`/users/${userId}/notifications`);
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    return apiRequest(`/users/${userId}/notifications/read-all`, {
      method: 'POST',
    });
  },

  delete: async (notificationId: string): Promise<void> => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== MENTORSHIP REQUEST API ====================

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  menteeEmail: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
  updatedAt: string;
}

export const mentorshipRequestAPI = {
  getByMentor: async (mentorId: string): Promise<MentorshipRequest[]> => {
    return apiRequest(`/mentors/${mentorId}/mentorship-requests`);
  },

  getByMentee: async (menteeId: string): Promise<MentorshipRequest[]> => {
    return apiRequest(`/mentees/${menteeId}/mentorship-requests`);
  },

  create: async (data: {
    mentorId: string;
    message: string;
  }): Promise<MentorshipRequest> => {
    return apiRequest('/mentorship-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  respond: async (requestId: string, action: 'accept' | 'reject'): Promise<MentorshipRequest> => {
    return apiRequest(`/mentorship-requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  },
};

// ==================== BLOG API ====================

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  category: string;
  tags: string[];
  image?: string;
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export const blogAPI = {
  getAll: async (filters?: { 
    category?: string; 
    tag?: string; 
    authorId?: string;
  }): Promise<BlogPost[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.tag) queryParams.append('tag', filters.tag);
    if (filters?.authorId) queryParams.append('authorId', filters.authorId);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiRequest(`/blog${query}`);
  },

  getById: async (postId: string): Promise<BlogPost> => {
    return apiRequest(`/blog/${postId}`);
  },

  create: async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    return apiRequest('/blog', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (postId: string, data: Partial<BlogPost>): Promise<BlogPost> => {
    return apiRequest(`/blog/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (postId: string): Promise<void> => {
    return apiRequest(`/blog/${postId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== ANALYTICS API ====================

export interface DashboardStats {
  totalMentors: number;
  totalMentees: number;
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  pendingRequests: number;
}

export const analyticsAPI = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiRequest('/analytics/dashboard');
  },

  getMentorStats: async (mentorId: string): Promise<any> => {
    return apiRequest(`/analytics/mentor/${mentorId}`);
  },
};