import { supabase, tables } from '../lib/supabaseClient';
import { toast } from 'sonner';

type UserRole = 'mentor' | 'mentee' | 'admin';

// Unified UserProfile (camelCase) to match Application Layer expectations
export interface UserProfile {
  id: string;
  email: string;
  name: string; // was full_name in Supabase, name in mongoApi
  avatar?: string; // was avatar_url in Supabase, avatar in mongoApi
  bio?: string;
  expertise?: string[];
  role: UserRole;
  yearsExperience?: number; // was years_experience
  currentRole?: string; // was current_role
  company?: string;
  location?: string;
  linkedin?: string; // was linkedin_url
  github?: string; // was github_url
  website?: string; // was website_url
  interests?: string[];
  goals?: string;
  achievements?: any[];
  profileCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const supabaseService = {
  // User Profile Operations
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from(tables.profiles)
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Map snake_case DB to camelCase Domain Object
    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      avatar: data.avatar_url,
      bio: data.bio,
      expertise: data.expertise,
      role: data.role,
      yearsExperience: data.years_experience,
      currentRole: data.current_role,
      company: data.company,
      location: data.location,
      linkedin: data.linkedin_url,
      github: data.github_url,
      website: data.website_url,
      interests: data.interests,
      goals: data.goals,
      achievements: data.achievements,
      profileCompleted: data.profile_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as UserProfile;
  },

  async getAllMentors(): Promise<UserProfile[]> {
    // Fetch profiles where role is 'mentor' (case-insensitive) and optionally profile_completed is true
    const { data, error } = await supabase
      .from(tables.profiles)
      .select('*')
      .ilike('role', 'mentor');

    if (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No mentors found in database with role "mentor"');
      return [];
    }

    return data.map((m: any) => ({
      id: m.id,
      email: m.email,
      name: m.full_name,
      avatar: m.avatar_url,
      bio: m.bio,
      expertise: m.expertise,
      role: m.role,
      yearsExperience: m.years_experience,
      currentRole: m.current_role,
      company: m.company,
      location: m.location,
      linkedin: m.linkedin_url,
      github: m.github_url,
      website: m.website_url,
      interests: m.interests,
      goals: m.goals,
      achievements: m.achievements,
      profileCompleted: m.profile_completed,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    })) as UserProfile[];
  },

  async createProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    // Map camelCase Domain Object to snake_case DB
    const dbProfile = {
      id: profile.id,
      email: profile.email,
      full_name: profile.name,
      avatar_url: profile.avatar,
      bio: profile.bio,
      expertise: profile.expertise,
      role: profile.role,
      years_experience: profile.yearsExperience,
      current_role: profile.currentRole,
      company: profile.company,
      location: profile.location,
      linkedin_url: profile.linkedin,
      github_url: profile.github,
      website_url: profile.website,
      interests: profile.interests,
      goals: profile.goals,
      achievements: profile.achievements,
      profile_completed: profile.profileCompleted,
      updated_at: new Date().toISOString(),
      // If created_at is not auto-managed by DB, uncomment next line
      // created_at: new Date().toISOString(), 
    };

    // Remove undefined values
    Object.keys(dbProfile).forEach(key => (dbProfile as any)[key] === undefined && delete (dbProfile as any)[key]);

    try {
      const { data, error } = await supabase
        .from(tables.profiles)
        .upsert(dbProfile)
        .select();

      if (error) {
        console.error('Error creating profile:', error);
        toast.error(`Failed to create profile: ${error.message}`);
        return null;
      }

      if (!data || data.length === 0) {
        toast.error('Profile created but no data returned');
        return null;
      }

      // Map back to camelCase
      const d = data[0];
      return {
        id: d.id,
        email: d.email,
        name: d.full_name,
        avatar: d.avatar_url,
        bio: d.bio,
        expertise: d.expertise,
        role: d.role,
        yearsExperience: d.years_experience,
        currentRole: d.current_role,
        company: d.company,
        linkedin: d.linkedin_url,
        github: d.github_url,
        website: d.website_url,
        location: d.location,
        interests: d.interests,
        goals: d.goals,
        achievements: d.achievements,
        profileCompleted: d.profile_completed,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      } as UserProfile;
    } catch (err: any) {
      console.error('Exception in createProfile:', err);
      if (err.name === 'AbortError') {
        toast.error('The request was interrupted. Please try clicking "Complete Setup" again.');
      } else {
        toast.error(`Unexpected error: ${err.message || 'Unknown error'}`);
      }
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    // Map camelCase Domain Object to snake_case DB
    const dbUpdates: any = {
      full_name: updates.name,
      avatar_url: updates.avatar,
      bio: updates.bio,
      expertise: updates.expertise,
      role: updates.role,
      years_experience: updates.yearsExperience,
      current_role: updates.currentRole,
      company: updates.company,
      location: updates.location,
      linkedin_url: updates.linkedin,
      github_url: updates.github,
      website_url: updates.website,
      interests: updates.interests,
      goals: updates.goals,
      achievements: updates.achievements,
      profile_completed: updates.profileCompleted,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values to avoid overwriting with NULL or sending undefined
    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    const { data, error } = await supabase
      .from(tables.profiles)
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
      return null;
    }

    // Map back
    return {
      id: data.id,
      email: data.email,
      name: data.full_name,
      avatar: data.avatar_url,
      bio: data.bio,
      expertise: data.expertise,
      role: data.role,
      yearsExperience: data.years_experience,
      currentRole: data.current_role,
      company: data.company,
      linkedin: data.linkedin_url,
      github: data.github_url,
      website: data.website_url,
      location: data.location,
      interests: data.interests,
      goals: data.goals,
      achievements: data.achievements,
      profileCompleted: data.profile_completed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as UserProfile;
  },

  // Session Operations
  async getSessions(filters: {
    status?: string;
    topic?: string;
    session_type?: string;
    created_by?: string;
  } = {}) {
    let query = supabase.from(tables.sessions).select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.topic) {
      query = query.contains('topics', [filters.topic]);
    }
    if (filters.session_type) {
      query = query.eq('session_type', filters.session_type);
    }
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return data.map((s: any) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      speakers: s.speakers || [],
      mentorName: s.mentor_name,
      mentorAvatar: s.mentor_avatar,
      date: s.date,
      time: s.time,
      duration: s.duration,
      topics: s.topics || [],
      attendees: s.attendees || 0,
      sessionType: s.session_type,
      location: s.location,
      maxSlots: s.max_slots,
      availableSlots: s.available_slots,
      companyName: s.company_name,
      createdBy: s.created_by,
      status: s.status,
    }));
  },

  async createSession(session: any) {
    const { data, error } = await supabase
      .from(tables.sessions)
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
      return null;
    }

    return data;
  },

  async updateSession(sessionId: string | number, updates: any) {
    const { data, error } = await supabase
      .from(tables.sessions)
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
      return null;
    }

    return data;
  },

  async deleteSession(sessionId: string | number) {
    const { error } = await supabase
      .from(tables.sessions)
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
      return false;
    }

    return true;
  },

  // Session Request Operations
  async getSessionRequests(filters: {
    userId?: string;
    sessionId?: string | number;
    status?: string;
  } = {}) {
    let query = supabase.from(tables.session_requests).select('*');

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.sessionId) {
      query = query.eq('session_id', filters.sessionId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching session requests:', error);
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      sessionId: r.session_id,
      userId: r.user_id,
      userName: r.user_name,
      userEmail: r.user_email,
      userAvatar: r.user_avatar,
      status: r.status,
      requestedAt: r.created_at,
      updatedAt: r.updated_at,
      phone: r.phone,
      occupation: r.occupation,
      experienceLevel: r.experience_level,
      reasonToJoin: r.reason_to_join,
      expectations: r.expectations,
    }));
  },

  async createSessionRequest(request: any) {
    const { data, error } = await supabase
      .from(tables.session_requests)
      .insert(request)
      .select()
      .single();

    if (error) {
      console.error('Error creating session request:', error);
      toast.error('Failed to send request');
      return null;
    }

    return data;
  },

  async updateSessionRequest(requestId: string, status: string) {
    const { data, error } = await supabase
      .from(tables.session_requests)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session request:', error);
      toast.error('Failed to update request status');
      return null;
    }

    return data;
  },

  // Add more methods for other operations as needed
  // - Session Requests
  // - Reviews
  // - Notifications
  // - Mentorship Requests
  // - Blog Posts
  // - Achievements
};

export default supabaseService;
