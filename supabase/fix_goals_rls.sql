-- =============================================
-- FIX RLS POLICIES FOR GOALS TABLE
-- =============================================
-- Run this in Supabase SQL Editor if you get 403 errors

-- First, drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

-- Make sure RLS is enabled
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Recreate RLS Policies
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- Verify policies are created
SELECT * FROM pg_policies WHERE tablename = 'goals';
