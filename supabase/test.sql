-- Simple test queries to verify tables exist

-- Check if stories table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'stories'
) as stories_exists;

-- Check if likes table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'likes'
) as likes_exists;

-- Check if comments table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'comments'
) as comments_exists;

-- Check columns in stories table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'stories'
ORDER BY ordinal_position;