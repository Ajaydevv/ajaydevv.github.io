-- Manual Admin Setup for Profiles Table
-- Use this to manually set admin status for specific users

-- First, find your user ID and current admin status:
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.is_admin,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at;

-- To make a user admin, replace 'USER_ID_HERE' with actual user ID:
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = 'USER_ID_HERE';

-- To remove admin status from a user:
-- UPDATE public.profiles 
-- SET is_admin = false 
-- WHERE id = 'USER_ID_HERE';

-- To make multiple users admin at once:
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id IN ('user-id-1', 'user-id-2', 'user-id-3');

-- To check current admin users:
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.is_admin,
  p.created_at
FROM public.profiles p
WHERE p.is_admin = true
ORDER BY p.created_at;

-- To check if a specific user is admin:
-- SELECT is_admin FROM public.profiles WHERE id = 'USER_ID_HERE';

-- Example usage:
-- 1. Find your user ID from the first query
-- 2. Copy your user ID 
-- 3. Run: UPDATE public.profiles SET is_admin = true WHERE id = 'your-copied-user-id';

-- Note: Only the first user to sign up gets admin automatically.
-- All other admin assignments must be done manually using these queries.