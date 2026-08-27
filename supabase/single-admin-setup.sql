-- META Pictures — Single admin setup
-- Admin email: Metapictures23@gmail.com
-- Project: https://oqipymvqqptjxiaeasgd.supabase.co
--
-- BEFORE RUNNING:
-- 1. Supabase → Authentication → Users → Add user
--    Email: Metapictures23@gmail.com
--    Password: (choose a strong password)
--    Auto Confirm User: ON
-- 2. Then run this entire script in SQL Editor

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'CLIENT'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Promote Metapictures23@gmail.com to SUPER_ADMIN
-- Works if the user already exists in auth.users
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'META Admin'),
  'SUPER_ADMIN'::user_role
FROM auth.users
WHERE lower(email) = lower('Metapictures23@gmail.com')
ON CONFLICT (id) DO UPDATE
SET
  role = 'SUPER_ADMIN',
  email = EXCLUDED.email,
  full_name = COALESCE(NULLIF(profiles.full_name, ''), EXCLUDED.full_name),
  updated_at = NOW();

-- Verify
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE lower(email) = lower('Metapictures23@gmail.com');
