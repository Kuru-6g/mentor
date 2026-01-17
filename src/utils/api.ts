/**
 * DEPRECATED: This file is being replaced by mongoApi.ts and supabaseClient.ts
 * 
 * For authentication: Use supabaseClient.ts
 * For MongoDB operations: Use mongoApi.ts
 * 
 * Keeping this file for backwards compatibility during migration
 */

import { projectId, publicAnonKey } from "./supabase/info";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2b2cab0b`;

// Get auth token from localStorage
function getAuthToken(): string | null {
  // Try to get Supabase session first
  try {
    const session = JSON.parse(localStorage.getItem("supabase_session") || "null");
    if (session?.access_token) {
      return session.access_token;
    }
  } catch (e) {
    // Fallback to old method
  }
  return localStorage.getItem("auth_token");
}

// Set auth token in localStorage
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: "mentor" | "mentee";
  expertise?: string[];
  interests?: string[];
  currentRole?: string;
  goals?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  session?: any;
  access_token?: string;
}

export const authAPI = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (response.access_token) {
      setAuthToken(response.access_token);
    }
    
    return response;
  },

  signOut: async (): Promise<void> => {
    await apiRequest("/auth/signout", { method: "POST" });
    setAuthToken(null);
  },

  getCurrentUser: async (): Promise<any> => {
    return apiRequest("/auth/me");
  },
};

// ==================== USER API ====================

export const userAPI = {
  getUser: async (userId: string): Promise<any> => {
    return apiRequest(`/users/${userId}`);
  },

  updateUser: async (userId: string, data: any): Promise<any> => {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ==================== MENTOR API ====================

export const mentorAPI = {
  getAll: async (): Promise<any[]> => {
    return apiRequest("/mentors");
  },

  getById: async (mentorId: string): Promise<any> => {
    return apiRequest(`/mentors/${mentorId}`);
  },

  update: async (mentorId: string, data: any): Promise<any> => {
    return apiRequest(`/mentors/${mentorId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  getAchievements: async (mentorId: string): Promise<any[]> => {
    return apiRequest(`/mentors/${mentorId}/achievements`);
  },
};

// ==================== SESSION API ====================

export interface CreateSessionData {
  title: string;
  description: string;
  speakers: Array<{
    name: string;
    avatar: string;
    title?: string;
  }>;
  date: string;
  time: string;
  duration: string;
  topics: string[];
  sessionType: "online" | "physical";
  location?: string;
  maxSlots?: number;
  companyName?: string;
}

export const sessionAPI = {
  getAll: async (): Promise<any[]> => {
    return apiRequest("/sessions");
  },

  getById: async (sessionId: string): Promise<any> => {
    return apiRequest(`/sessions/${sessionId}`);
  },

  create: async (data: CreateSessionData): Promise<any> => {
    return apiRequest("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (sessionId: string, data: Partial<CreateSessionData>): Promise<any> => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (sessionId: string): Promise<void> => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: "DELETE",
    });
  },

  requestToJoin: async (sessionId: string): Promise<any> => {
    return apiRequest(`/sessions/${sessionId}/request`, {
      method: "POST",
    });
  },

  getRequests: async (sessionId: string): Promise<any[]> => {
    return apiRequest(`/sessions/${sessionId}/requests`);
  },
};

// ==================== REQUEST API ====================

export const requestAPI = {
  respond: async (requestId: string, action: "accept" | "reject"): Promise<any> => {
    return apiRequest(`/requests/${requestId}/respond`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
  },

  getMyRequests: async (): Promise<any[]> => {
    return apiRequest("/my-requests");
  },

  getMentorRequests: async (): Promise<any[]> => {
    return apiRequest("/mentor/requests");
  },
};

// ==================== ACHIEVEMENT API ====================

export interface CreateAchievementData {
  title: string;
  description: string;
  date: string;
  type: "award" | "certification" | "publication" | "project";
}

export const achievementAPI = {
  create: async (data: CreateAchievementData): Promise<any> => {
    return apiRequest("/achievements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: async (achievementId: string): Promise<void> => {
    return apiRequest(`/achievements/${achievementId}`, {
      method: "DELETE",
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async (): Promise<any> => {
  return apiRequest("/health");
};
