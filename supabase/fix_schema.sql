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
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "availability" JSONB DEFAULT 'null';

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

-- 3. Add columns and fix constraints (Keeping TIMESTAMPTZ to avoid breaking Policies)
ALTER TABLE public.sessions ALTER COLUMN start_time DROP NOT NULL;
ALTER TABLE public.sessions ALTER COLUMN end_time DROP NOT NULL;

-- Drop restrictive status check constraint
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS "sessions_status_check";

ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "mentor_name" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "mentor_avatar" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "topics" TEXT[] DEFAULT '{}';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "session_type" TEXT CHECK (session_type IN ('online', 'physical')) DEFAULT 'online';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "max_slots" INTEGER DEFAULT 50;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "meeting_url" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "available_slots" INTEGER DEFAULT 10;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "attendees" INTEGER DEFAULT 0;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "date" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "time" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "company_name" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "duration" TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'scheduled';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "speakers" JSONB DEFAULT '[]';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS "created_by" UUID REFERENCES public.profiles(id);

-- 4. Ensure session_requests / participants columns align
ALTER TABLE public.session_requests ALTER COLUMN session_id DROP NOT NULL;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "mentor_id" UUID REFERENCES public.profiles(id);
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_name" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_email" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "user_avatar" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "occupation" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "experience_level" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "reason_to_join" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "expectations" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "preferred_date" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "preferred_time" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "mentorship_type" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "message" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "mentor_message" TEXT;
ALTER TABLE public.session_requests ADD COLUMN IF NOT EXISTS "meeting_url" TEXT;

-- 5. Add RLS policies for session_requests
ALTER TABLE public.session_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'session_requests' AND policyname = 'Users can view their own requests'
    ) THEN
        CREATE POLICY "Users can view their own requests" ON public.session_requests
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Policy: Mentors can view requests sent to them
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'session_requests' AND policyname = 'Mentors can view requests sent to them'
    ) THEN
        CREATE POLICY "Mentors can view requests sent to them" ON public.session_requests
        FOR SELECT USING (auth.uid() = mentor_id);
    END IF;
END $$;

-- Policy: Mentors can view requests for sessions they created
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'session_requests' AND policyname = 'Mentors can view session requests for their sessions'
    ) THEN
        CREATE POLICY "Mentors can view session requests for their sessions" ON public.session_requests
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.sessions s
                WHERE s.id = session_id AND s.created_by = auth.uid()
            )
        );
    END IF;
END $$;

-- Policy: Users can insert their own requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'session_requests' AND policyname = 'Users can insert their own requests'
    ) THEN
        CREATE POLICY "Users can insert their own requests" ON public.session_requests
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Policy: Mentors can update requests sent to them or for their sessions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'session_requests' AND policyname = 'Mentors can update requests'
    ) THEN
        CREATE POLICY "Mentors can update requests" ON public.session_requests
        FOR UPDATE USING (
            auth.uid() = mentor_id OR
            EXISTS (
                SELECT 1 FROM public.sessions s
                WHERE s.id = session_id AND s.created_by = auth.uid()
            )
        );
    END IF;
END $$;
