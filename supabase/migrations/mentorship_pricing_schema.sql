-- =====================================================
-- MENTORSHIP PRICING DATABASE SCHEMA
-- Supports: Monthly Plans + One-Off Session Services
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE (existing - add pricing columns)
-- =====================================================
-- Add these columns to your existing profiles table:

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS monthly_pricing INTEGER DEFAULT 0,           -- Mentor's monthly payout
ADD COLUMN IF NOT EXISTS monthly_display_price INTEGER DEFAULT 0,     -- What mentee pays (auto-calculated)
ADD COLUMN IF NOT EXISTS session_pricing INTEGER DEFAULT 0,           -- Base hourly rate (mentor payout)
ADD COLUMN IF NOT EXISTS is_accepting_mentees BOOLEAN DEFAULT true,   -- Toggle availability
ADD COLUMN IF NOT EXISTS plan_features JSONB DEFAULT '["Calls per month", "Unlimited chat", "Resource sharing", "Priority support"]';

-- =====================================================
-- 2. SESSION_SERVICES TABLE (one-off sessions)
-- =====================================================
-- Already created - but here's the enhanced version:

DROP TABLE IF EXISTS session_services;

CREATE TABLE session_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Session Details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  
  -- Pricing (MentorCruise model)
  mentor_payout INTEGER NOT NULL DEFAULT 0,   -- What mentor receives
  display_price INTEGER NOT NULL DEFAULT 0,   -- What mentee pays (payout + 20% fee)
  
  -- Status & Ordering
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_session_services_mentor ON session_services(mentor_id);
CREATE INDEX idx_session_services_active ON session_services(mentor_id, is_active);

-- =====================================================
-- 3. MENTORSHIP_SUBSCRIPTIONS TABLE (monthly plans)
-- =====================================================
-- Tracks active monthly mentorship subscriptions

CREATE TABLE IF NOT EXISTS mentorship_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Parties
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Pricing at time of subscription
  mentor_payout INTEGER NOT NULL,              -- Monthly amount mentor receives
  display_price INTEGER NOT NULL,              -- Monthly amount mentee pays
  
  -- Stripe Integration
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'active',         -- active, paused, cancelled, expired
  
  -- Plan Features (copied at subscription time)
  plan_features JSONB,
  
  -- Dates
  start_date TIMESTAMPTZ DEFAULT NOW(),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate active subscriptions
  UNIQUE(mentor_id, mentee_id, status)
);

-- Indexes
CREATE INDEX idx_subscriptions_mentor ON mentorship_subscriptions(mentor_id);
CREATE INDEX idx_subscriptions_mentee ON mentorship_subscriptions(mentee_id);
CREATE INDEX idx_subscriptions_status ON mentorship_subscriptions(status);

-- =====================================================
-- 4. SESSION_BOOKINGS TABLE (one-off session purchases)
-- =====================================================
-- Tracks purchased one-off sessions

CREATE TABLE IF NOT EXISTS session_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to session service
  session_service_id UUID REFERENCES session_services(id) ON DELETE SET NULL,
  
  -- Parties
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Session Details (snapshot at booking time)
  title VARCHAR(255) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  mentor_payout INTEGER NOT NULL,
  display_price INTEGER NOT NULL,
  
  -- Scheduling
  scheduled_date DATE,
  start_time TIME,
  end_time TIME,
  timezone VARCHAR(50),
  
  -- Meeting
  meeting_url TEXT,
  meeting_notes TEXT,
  
  -- Payment
  stripe_payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'pending',  -- pending, paid, refunded, failed
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',          -- pending, confirmed, completed, cancelled, no_show
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_mentor ON session_bookings(mentor_id);
CREATE INDEX idx_bookings_mentee ON session_bookings(mentee_id);
CREATE INDEX idx_bookings_date ON session_bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON session_bookings(status);

-- =====================================================
-- 5. PAYMENTS TABLE (all payments tracking)
-- =====================================================
-- Unified payment tracking for both subscriptions and one-off

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Type
  payment_type VARCHAR(50) NOT NULL,  -- 'subscription', 'session', 'tip'
  
  -- Parties
  mentor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Reference
  subscription_id UUID REFERENCES mentorship_subscriptions(id),
  booking_id UUID REFERENCES session_bookings(id),
  
  -- Amounts (in cents for precision)
  amount_paid INTEGER NOT NULL,           -- Total paid by mentee
  platform_fee INTEGER NOT NULL,          -- Platform's cut
  mentor_payout INTEGER NOT NULL,         -- Amount to mentor
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_transfer_id VARCHAR(255),        -- For Connect payouts
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',   -- pending, succeeded, failed, refunded
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_mentor ON payments(mentor_id);
CREATE INDEX idx_payments_mentee ON payments(mentee_id);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_status ON payments(status);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Session Services
ALTER TABLE session_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors manage own services" ON session_services
  FOR ALL USING (auth.uid() = mentor_id);

CREATE POLICY "Public view active services" ON session_services
  FOR SELECT USING (is_active = true);

-- Subscriptions
ALTER TABLE mentorship_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own subscriptions" ON mentorship_subscriptions
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Create subscriptions" ON mentorship_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = mentee_id);

-- Bookings
ALTER TABLE session_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own bookings" ON session_bookings
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Create bookings" ON session_bookings
  FOR INSERT WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Update own bookings" ON session_bookings
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own payments" ON payments
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Auto-calculate display price based on mentor payout
CREATE OR REPLACE FUNCTION calculate_display_price(payout INTEGER, is_monthly BOOLEAN DEFAULT false)
RETURNS INTEGER AS $$
BEGIN
  -- Monthly plans under $100 get flat $20 fee
  IF is_monthly AND payout < 100 THEN
    RETURN payout + 20;
  END IF;
  -- Otherwise 20% markup
  RETURN ROUND(payout * 1.2);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update display_price in session_services
CREATE OR REPLACE FUNCTION update_session_display_price()
RETURNS TRIGGER AS $$
BEGIN
  NEW.display_price = calculate_display_price(NEW.mentor_payout, false);
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER session_services_auto_price
  BEFORE INSERT OR UPDATE ON session_services
  FOR EACH ROW
  EXECUTE FUNCTION update_session_display_price();
