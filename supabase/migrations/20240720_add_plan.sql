-- Add plan column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
  CHECK (plan IN ('free', 'pro'));

-- To manually upgrade a user to PRO (run in Supabase SQL Editor):
-- UPDATE public.profiles SET plan = 'pro' WHERE username = 'your_username';
