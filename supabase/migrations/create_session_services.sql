-- Session Services Table
-- Stores one-off session offerings that mentors can create
-- Each mentor can have multiple session types (e.g., Intro Call, Consultation, Document Review)

-- Create the session_services table
CREATE TABLE IF NOT EXISTS session_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Session Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Pricing (MentorCruise model)
  mentor_payout INTEGER NOT NULL DEFAULT 0,  -- What mentor receives (in cents or dollars)
  display_price INTEGER NOT NULL DEFAULT 0,   -- What mentee pays (payout + platform fee)
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,  -- For ordering services on mentor profile
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups by mentor
CREATE INDEX IF NOT EXISTS idx_session_services_mentor_id ON session_services(mentor_id);

-- Create index for active sessions
CREATE INDEX IF NOT EXISTS idx_session_services_active ON session_services(mentor_id, is_active);

-- Enable Row Level Security
ALTER TABLE session_services ENABLE ROW LEVEL SECURITY;

-- Policy: Mentors can manage their own services
CREATE POLICY "Mentors can manage own services" ON session_services
  FOR ALL
  USING (auth.uid() = mentor_id)
  WITH CHECK (auth.uid() = mentor_id);

-- Policy: Anyone can view active services (for public mentor profiles)
CREATE POLICY "Anyone can view active services" ON session_services
  FOR SELECT
  USING (is_active = true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_session_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS session_services_updated_at ON session_services;
CREATE TRIGGER session_services_updated_at
  BEFORE UPDATE ON session_services
  FOR EACH ROW
  EXECUTE FUNCTION update_session_services_updated_at();

-- Add session_services to the tables constant in your code
-- In supabaseClient.ts, add: sessionServices: 'session_services'
