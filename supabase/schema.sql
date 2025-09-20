-- Create stories table
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create likes table
create table public.likes (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(story_id, user_id)
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  story_id uuid references public.stories(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.stories enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- Stories policies
create policy "Anyone can view published stories" on public.stories
  for select using (true);

create policy "Users can create their own stories" on public.stories
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own stories" on public.stories
  for update using (auth.uid() = author_id);

create policy "Users can delete their own stories" on public.stories
  for delete using (auth.uid() = author_id);

-- Likes policies
create policy "Anyone can view likes" on public.likes
  for select using (true);

create policy "Authenticated users can like stories" on public.likes
  for insert with check (auth.uid() = user_id);

create policy "Users can remove their own likes" on public.likes
  for delete using (auth.uid() = user_id);

-- Comments policies
create policy "Anyone can view comments" on public.comments
  for select using (true);

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on public.comments
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index stories_created_at_idx on public.stories(created_at desc);
create index stories_author_id_idx on public.stories(author_id);
create index likes_story_id_idx on public.likes(story_id);
create index likes_user_id_idx on public.likes(user_id);
create index comments_story_id_idx on public.comments(story_id);
create index comments_user_id_idx on public.comments(user_id);

-- Create a function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers to automatically update updated_at
create trigger handle_updated_at_stories
  before update on public.stories
  for each row execute function public.handle_updated_at();

create trigger handle_updated_at_comments
  before update on public.comments
  for each row execute function public.handle_updated_at();