import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const tables = {
  profiles: 'profiles',
  sessions: 'sessions',
  session_requests: 'session_requests',
  reviews: 'reviews',
  notifications: 'notifications',
  mentorship_requests: 'mentorship_requests',
  blog_posts: 'blog_posts',
  achievements: 'achievements',
} as const;
