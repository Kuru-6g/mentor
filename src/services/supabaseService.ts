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
  monthlyPricing?: number; // was monthly_pricing
  sessionPricing?: number; // was session_pricing
  interests?: string[];
  goals?: string;
  achievements?: any[];
  profileCompleted?: boolean;
  availability?: any;
  experiences?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Speaker {
  name: string;
  avatar: string;
  title?: string;
}

export interface Session {
  id: number | string;
  title: string;
  description: string;
  speakers: Speaker[];
  mentorName?: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  duration: string;
  topics: string[];
  attendees: number;
  sessionType: "online" | "physical";
  location?: string;
  maxSlots?: number;
  availableSlots?: number;
  companyName?: string;
  meetingUrl?: string;
  createdBy?: string;
  status: string;
}

export interface SessionRequest {
  id: string;
  sessionId: number | string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
  updatedAt: string;
  phone?: string;
  occupation?: string;
  experienceLevel?: string;
  reasonToJoin?: string;
  expectations?: string;
  mentorId?: string;
  preferredDate?: string;
  preferredTime?: string;
  mentorshipType?: string;
  message?: string;
  mentorMessage?: string;
  meetingUrl?: string;
}

export interface SessionService {
  id: string;
  mentorId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  mentorPayout: number;   // What mentor earns
  displayPrice: number;    // What mentee pays (payout + platform fee)
  isActive: boolean;
  sortOrder: number;
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
      twitter: data.twitter_url,
      website: data.website_url,
      monthlyPricing: data.monthly_pricing,
      sessionPricing: data.session_pricing,
      interests: data.interests,
      goals: data.goals,
      achievements: data.achievements,
      profileCompleted: data.profile_completed,
      availability: data.availability,
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
      monthlyPricing: m.monthly_pricing,
      sessionPricing: m.session_pricing,
      interests: m.interests,
      goals: m.goals,
      achievements: m.achievements,
      profileCompleted: m.profile_completed,
      availability: m.availability,
      experiences: m.experiences || [],
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
      monthly_pricing: profile.monthlyPricing,
      session_pricing: profile.sessionPricing,
      interests: profile.interests,
      goals: profile.goals,
      achievements: profile.achievements,
      profile_completed: profile.profileCompleted,
      experiences: profile.experiences,
      updated_at: new Date().toISOString(),
      // If created_at is not auto-managed by DB, uncomment next line
      // created_at: new Date().toISOString(), 
    };

    // Remove undefined values
    Object.keys(dbProfile).forEach(key => (dbProfile as any)[key] === undefined && delete (dbProfile as any)[key]);

    const { error } = await supabase
      .from(tables.profiles)
      .upsert(dbProfile); // Use upsert to handle cases where profile record already exists

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    // Since we aren't selecting, we assume success and return the input data structure
    // This is a temporary fix to bypass potential RLS select issues causing AbortError
    return {
      id: profile.id!,
      email: profile.email!,
      name: profile.name!,
      avatar: profile.avatar,
      bio: profile.bio,
      expertise: profile.expertise,
      role: profile.role!,
      yearsExperience: profile.yearsExperience,
      currentRole: profile.currentRole,
      company: profile.company,
      linkedin: profile.linkedin,
      github: profile.github,
      website: profile.website,
      location: profile.location,
      interests: profile.interests,
      goals: profile.goals,
      achievements: profile.achievements,
      profileCompleted: true, // We successfully completed it
      availability: profile.availability,
      experiences: profile.experiences || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserProfile;
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
      monthly_pricing: updates.monthlyPricing,
      session_pricing: updates.sessionPricing,
      interests: updates.interests,
      goals: updates.goals,
      achievements: updates.achievements,
      profile_completed: updates.profileCompleted,
      availability: updates.availability,
      experiences: updates.experiences,
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
      twitter: data.twitter_url,
      website: data.website_url,
      monthlyPricing: data.monthly_pricing,
      sessionPricing: data.session_pricing,
      location: data.location,
      interests: data.interests,
      goals: data.goals,
      achievements: data.achievements,
      profileCompleted: data.profile_completed,
      availability: data.availability,
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
      meetingUrl: s.meeting_url,
      createdBy: s.created_by,
      status: s.status,
    }));
  },

  async createSession(session: any) {
    // Map application camelCase to database snake_case
    const dbSession = {
      title: session.title,
      description: session.description,
      speakers: session.speakers,
      mentor_name: session.mentorName,
      mentor_avatar: session.mentorAvatar,
      date: session.date,
      time: session.time,
      // Ensure we send a VALID timestamp format for TIMESTAMPTZ: YYYY-MM-DDTHH:MM:SSZ
      start_time: session.date && session.time && session.time.includes(':')
        ? `${session.date}T${session.time.split(' ')[0].length === 5 ? session.time.split(' ')[0] : '00:00'}:00Z`
        : null,
      end_time: null,
      duration: session.duration,
      topics: session.topics,
      attendees: session.attendees || 0,
      session_type: session.sessionType,
      location: session.location,
      max_slots: session.maxSlots,
      meeting_url: session.meetingUrl,
      available_slots: session.availableSlots,
      company_name: session.companyName,
      created_by: session.createdBy,
      status: session.status || 'scheduled',
    };

    // Remove undefined
    Object.keys(dbSession).forEach(key => (dbSession as any)[key] === undefined && delete (dbSession as any)[key]);

    const { data, error } = await supabase
      .from(tables.sessions)
      .insert(dbSession)
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      toast.error(`Failed to create session: ${error.message}`);
      return null;
    }

    // Map back for local state
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      speakers: data.speakers || [],
      mentorName: data.mentor_name,
      mentorAvatar: data.mentor_avatar,
      date: data.date,
      time: data.time,
      duration: data.duration,
      topics: data.topics || [],
      attendees: data.attendees || 0,
      sessionType: data.session_type,
      location: data.location,
      maxSlots: data.max_slots,
      availableSlots: data.available_slots,
      companyName: data.company_name,
      meetingUrl: data.meeting_url,
      createdBy: data.created_by,
      status: data.status,
    };
  },

  async updateSession(sessionId: string | number, updates: any) {
    // Map updates to snake_case
    const dbUpdates: any = {
      title: updates.title,
      description: updates.description,
      speakers: updates.speakers,
      date: updates.date,
      time: updates.time,
      duration: updates.duration,
      topics: updates.topics,
      attendees: updates.attendees,
      session_type: updates.sessionType,
      location: updates.location,
      max_slots: updates.maxSlots,
      available_slots: updates.availableSlots,
      company_name: updates.companyName,
      meeting_url: updates.meetingUrl,
      status: updates.status,
    };

    // Remove undefined values
    Object.keys(dbUpdates).forEach(key => dbUpdates[key] === undefined && delete dbUpdates[key]);

    const { data, error } = await supabase
      .from(tables.sessions)
      .update(dbUpdates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session');
      return null;
    }

    // Map back
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      speakers: data.speakers || [],
      mentorName: data.mentor_name,
      mentorAvatar: data.mentor_avatar,
      date: data.date,
      time: data.time,
      duration: data.duration,
      topics: data.topics || [],
      attendees: data.attendees || 0,
      sessionType: data.session_type,
      location: data.location,
      maxSlots: data.max_slots,
      availableSlots: data.available_slots,
      companyName: data.company_name,
      meetingUrl: data.meeting_url,
      createdBy: data.created_by,
      status: data.status,
    };
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
      preferredDate: r.preferred_date,
      preferredTime: r.preferred_time,
      mentorshipType: r.mentorship_type,
      mentorId: r.mentor_id,
      message: r.message,
      mentorMessage: r.mentor_message,
      meetingUrl: r.meeting_url,
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

  async updateSessionRequest(requestId: string, status: string, mentorMessage?: string, meetingUrl?: string) {
    const { data, error } = await supabase
      .from(tables.session_requests)
      .update({
        status,
        mentor_message: mentorMessage,
        meeting_url: meetingUrl
      })
      .eq('id', requestId)
      .select();

    if (error) {
      console.error('Error updating session request:', error);
      toast.error('Failed to update request status');
      return null;
    }

    return data && data.length > 0 ? {
      id: data[0].id,
      sessionId: data[0].session_id,
      userId: data[0].user_id,
      userName: data[0].user_name,
      userEmail: data[0].user_email,
      userAvatar: data[0].user_avatar,
      status: data[0].status,
      requestedAt: data[0].created_at,
      updatedAt: data[0].updated_at,
      phone: data[0].phone,
      occupation: data[0].occupation,
      experienceLevel: data[0].experience_level,
      reasonToJoin: data[0].reason_to_join,
      expectations: data[0].expectations,
      preferredDate: data[0].preferred_date,
      preferredTime: data[0].preferred_time,
      mentorshipType: data[0].mentorship_type,
      mentorId: data[0].mentor_id,
      message: data[0].message,
      mentorMessage: data[0].mentor_message,
      meetingUrl: data[0].meeting_url,
    } : null;
  },

  async getBookedSlots(mentorId: string, date: string): Promise<string[]> {
    const { data, error } = await supabase
      .from(tables.session_requests)
      .select('preferred_time')
      .eq('mentor_id', mentorId)
      .eq('preferred_date', date)
      .in('status', ['pending', 'accepted'])
      .is('session_id', null);

    if (error) {
      console.error('Error fetching booked slots:', error);
      return [];
    }

    return data.map(item => item.preferred_time);
  },

  // Payment Operations
  async createStripeConnectAccount(): Promise<{ url: string } | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/server/make-server-2b2cab0b/payments/create-connect-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Connect account');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating Stripe account:', error);
      toast.error(error.message);
      return null;
    }
  },

  async createPaymentIntent(params: { mentorId: string; sessionId?: string; amount: number; currency?: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/server/make-server-2b2cab0b/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Payment Intent');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast.error(error.message);
      return null;
    }
  },

  // ==========================================
  // Session Services (One-Off Sessions) CRUD
  // ==========================================

  async getSessionServices(mentorId: string): Promise<SessionService[]> {
    const { data, error } = await supabase
      .from(tables.session_services)
      .select('*')
      .eq('mentor_id', mentorId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching session services:', error);
      return [];
    }

    return (data || []).map((s: any) => ({
      id: s.id,
      mentorId: s.mentor_id,
      title: s.title,
      description: s.description,
      durationMinutes: s.duration_minutes,
      mentorPayout: s.mentor_payout,
      displayPrice: s.display_price,
      isActive: s.is_active,
      sortOrder: s.sort_order,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  },

  async getActiveSessionServices(mentorId: string): Promise<SessionService[]> {
    const { data, error } = await supabase
      .from(tables.session_services)
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching active session services:', error);
      return [];
    }

    return (data || []).map((s: any) => ({
      id: s.id,
      mentorId: s.mentor_id,
      title: s.title,
      description: s.description,
      durationMinutes: s.duration_minutes,
      mentorPayout: s.mentor_payout,
      displayPrice: s.display_price,
      isActive: s.is_active,
      sortOrder: s.sort_order,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));
  },

  async createSessionService(service: Partial<SessionService>): Promise<SessionService | null> {
    const dbService = {
      mentor_id: service.mentorId,
      title: service.title,
      description: service.description,
      duration_minutes: service.durationMinutes || 60,
      mentor_payout: service.mentorPayout || 0,
      display_price: service.displayPrice || 0,
      is_active: service.isActive ?? true,
      sort_order: service.sortOrder || 0,
    };

    const { data, error } = await supabase
      .from(tables.session_services)
      .insert(dbService)
      .select()
      .single();

    if (error) {
      console.error('Error creating session service:', error);
      toast.error('Failed to create session service');
      return null;
    }

    toast.success('Session service created!');
    return {
      id: data.id,
      mentorId: data.mentor_id,
      title: data.title,
      description: data.description,
      durationMinutes: data.duration_minutes,
      mentorPayout: data.mentor_payout,
      displayPrice: data.display_price,
      isActive: data.is_active,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateSessionService(serviceId: string, updates: Partial<SessionService>): Promise<boolean> {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.durationMinutes !== undefined) dbUpdates.duration_minutes = updates.durationMinutes;
    if (updates.mentorPayout !== undefined) dbUpdates.mentor_payout = updates.mentorPayout;
    if (updates.displayPrice !== undefined) dbUpdates.display_price = updates.displayPrice;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

    const { error } = await supabase
      .from(tables.session_services)
      .update(dbUpdates)
      .eq('id', serviceId);

    if (error) {
      console.error('Error updating session service:', error);
      toast.error('Failed to update session service');
      return false;
    }

    toast.success('Session service updated!');
    return true;
  },

  async deleteSessionService(serviceId: string): Promise<boolean> {
    const { error } = await supabase
      .from(tables.session_services)
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting session service:', error);
      toast.error('Failed to delete session service');
      return false;
    }

    toast.success('Session service deleted!');
    return true;
  },
};

export default supabaseService;
