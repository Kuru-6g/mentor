import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

export const tables = {
  profiles: 'profiles',
  sessions: 'sessions',
  session_requests: 'session_requests',
  session_services: 'session_services',
  reviews: 'reviews',
  notifications: 'notifications',
  mentorship_requests: 'mentorship_requests',
  blog_posts: 'blog_posts',
  achievements: 'achievements',
} as const;
