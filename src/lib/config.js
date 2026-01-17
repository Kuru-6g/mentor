import { createClient } from '@supabase/supabase-js';

// Fallback values in case environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lvvqscckpqdpyndtwkmo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dnFzY2NrcHFkcHluZHR3a21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTc1MzQsImV4cCI6MjA3ODM3MzUzNH0.d8I5bK_6YL49wqoid_geGcSAOsGIVdYX8tdmQ5gGcWo';

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : null
  }
});
