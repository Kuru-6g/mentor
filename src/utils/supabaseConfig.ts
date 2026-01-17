// Supabase configuration for MongoDB API access
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || '';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate required environment variables
if (!projectId || !publicAnonKey) {
  console.error('Missing required Supabase configuration. Please check your environment variables.');
}

export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1`;
