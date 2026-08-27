-- META Pictures — Single admin setup
-- Project: https://oqipymvqqptjxiaeasgd.supabase.co
--
-- STEPS:
-- 1. Supabase Dashboard → Authentication → Users → Add user
--    Email: your admin email
--    Password: choose a strong password
--    (Auto Confirm User: ON)
-- 2. Copy the new user's UUID from the users list
-- 3. Run this script in SQL Editor (replace the email below)

-- Auto-create profile when a user signs up (safe to run once)
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

-- Promote YOUR account to the single SUPER_ADMIN
-- Replace the email with the one you used in Authentication → Users
UPDATE public.profiles
SET role = 'SUPER_ADMIN',
    full_name = COALESCE(NULLIF(full_name, ''), 'META Admin'),
    updated_at = NOW()
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- If no profile row exists yet (trigger not fired), insert it:
-- Replace both UUID and email with values from Authentication → Users
/*
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'PASTE-USER-UUID-HERE',
  'YOUR_ADMIN_EMAIL@example.com',
  'META Admin',
  'SUPER_ADMIN'
)
ON CONFLICT (id) DO UPDATE
SET role = 'SUPER_ADMIN',
    email = EXCLUDED.email,
    updated_at = NOW();
*/

-- Verify (should show exactly one SUPER_ADMIN if that is what you want)
SELECT id, email, full_name, role, created_at
FROM public.profiles
WHERE role IN ('SUPER_ADMIN', 'ADMIN')
ORDER BY created_at;
