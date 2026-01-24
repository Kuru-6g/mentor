-- SQL Migration to add missing columns to the profiles table
-- Run this in your Supabase SQL Editor

-- 1. Add missing columns to public.profiles one by one for better compatibility
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "years_experience" INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "current_role" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "linkedin_url" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "github_url" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "website_url" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "interests" TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "goals" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "achievements" JSONB DEFAULT '[]';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "profile_completed" BOOLEAN DEFAULT FALSE;

-- 2. Ensure RLS policies include INSERT if needed (though handle_new_user should have created the row)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- 3. Add column to sessions table if not present
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "mentor_name" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "mentor_avatar" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "topics" TEXT[] DEFAULT '{}';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "session_type" TEXT CHECK (session_type IN ('online', 'physical')) DEFAULT 'online';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "max_slots" INTEGER DEFAULT 10;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "available_slots" INTEGER DEFAULT 10;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "company_name" TEXT;

-- 4. Ensure session_requests / participants columns align
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_name" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_email" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_avatar" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "occupation" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "experience_level" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "reason_to_join" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "expectations" TEXT;
