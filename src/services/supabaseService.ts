import { supabase, tables } from '@/lib/supabaseClient';
import { toast } from 'sonner';

type UserRole = 'mentor' | 'mentee' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  expertise?: string[];
  role: UserRole;
  years_experience?: number;
  current_role?: string;
  company?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  interests?: string[];
  goals?: string;
  created_at: string;
  updated_at: string;
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

    return data as UserProfile;
  },

  async createProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from(tables.profiles)
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
      return null;
    }

    return data as UserProfile;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from(tables.profiles)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return null;
    }

    return data as UserProfile;
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
