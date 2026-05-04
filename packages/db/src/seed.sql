-- ============================================
-- PXLS Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  credits INTEGER NOT NULL DEFAULT 0 CHECK (credits >= 0),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  referrer_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 2. Packages (Star packs)
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars > 0),
  credits INTEGER NOT NULL CHECK (credits > 0),
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('purchase', 'spend', 'bonus', 'refund', 'referral')),
  stars_amount INTEGER,
  credits_amount INTEGER NOT NULL,
  package_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- 4. Generations
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  model_id TEXT NOT NULL,
  model_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  image_url TEXT,
  result_urls JSONB DEFAULT '[]',
  credits_spent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  error TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created ON generations(created_at);

-- 5. Model pricing
CREATE TABLE IF NOT EXISTS model_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id TEXT NOT NULL UNIQUE,
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  type TEXT NOT NULL,
  credits_cost NUMERIC(10, 2) NOT NULL CHECK (credits_cost > 0),
  size TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  referred_username TEXT,
  bonus_credits INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);

-- 7. Daily stats (aggregated)
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  new_users INTEGER NOT NULL DEFAULT 0,
  total_generations INTEGER NOT NULL DEFAULT 0,
  successful_generations INTEGER NOT NULL DEFAULT 0,
  failed_generations INTEGER NOT NULL DEFAULT 0,
  revenue_stars INTEGER NOT NULL DEFAULT 0,
  credits_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_last_active
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_pricing ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own profile
CREATE POLICY users_self ON users
  FOR ALL USING (telegram_id = (current_setting('app.telegram_id', true))::BIGINT);

-- Generations: own only
CREATE POLICY generations_self ON generations
  FOR ALL USING (user_id IN (
    SELECT id FROM users WHERE telegram_id = (current_setting('app.telegram_id', true))::BIGINT
  ));

-- Transactions: own only
CREATE POLICY transactions_self ON transactions
  FOR ALL USING (user_id IN (
    SELECT id FROM users WHERE telegram_id = (current_setting('app.telegram_id', true))::BIGINT
  ));

-- Referrals: own only
CREATE POLICY referrals_self ON referrals
  FOR ALL USING (referrer_id IN (
    SELECT id FROM users WHERE telegram_id = (current_setting('app.telegram_id', true))::BIGINT
  ));

-- Public: packages + models read-only
CREATE POLICY packages_read ON packages FOR SELECT USING (true);
CREATE POLICY models_read ON model_pricing FOR SELECT USING (is_active = true);

-- ============================================
-- Seed data
-- ============================================

INSERT INTO packages (name, stars, credits, is_popular) VALUES
  ('🥉 Start', 50, 300, false),
  ('🥈 Standard', 200, 1200, true),
  ('🥇 Pro', 500, 3000, false),
  ('💎 Ultra', 1000, 6000, false)
ON CONFLICT DO NOTHING;
