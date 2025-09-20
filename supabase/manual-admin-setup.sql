-- Manual Admin Setup
-- Use this to manually set admin roles for specific users

-- First, find your user ID by running this query:
SELECT id, email, created_at FROM auth.users ORDER BY created_at;

-- Then, replace 'YOUR_USER_ID_HERE' with your actual user ID and run:
-- INSERT INTO public.user_roles (user_id, role, granted_by) 
-- VALUES ('YOUR_USER_ID_HERE', 'admin', 'YOUR_USER_ID_HERE');

-- Example for multiple users:
-- INSERT INTO public.user_roles (user_id, role, granted_by) VALUES 
-- ('user-id-1', 'admin', 'user-id-1'),
-- ('user-id-2', 'user', 'user-id-1');

-- To check current user roles:
SELECT 
  ur.role,
  au.email,
  ur.granted_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
ORDER BY ur.granted_at;

-- To remove admin role from a user:
-- DELETE FROM public.user_roles 
-- WHERE user_id = 'USER_ID_HERE' AND role = 'admin';

-- To make someone admin:
-- INSERT INTO public.user_roles (user_id, role, granted_by) 
-- VALUES ('USER_ID_HERE', 'admin', 'GRANTING_ADMIN_USER_ID');

-- To change user role (remove old, add new):
-- DELETE FROM public.user_roles WHERE user_id = 'USER_ID' AND role = 'user';
-- INSERT INTO public.user_roles (user_id, role, granted_by) VALUES ('USER_ID', 'admin', 'ADMIN_USER_ID');