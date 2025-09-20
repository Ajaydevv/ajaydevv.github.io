# Supabase Database Setup

## 🚨 IMPORTANT: You MUST run this setup before using the app!

## Quick Setup Instructions

### Step 1: Access Supabase Dashboard
1. Go to: https://app.supabase.com/project/aycqooqlvlfgwwngmlyy
2. Make sure you're logged in

### Step 2: Run Main Database Setup
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste ALL content from `setup.sql`
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Set Up User Roles System
1. Create another new query
2. Copy and paste ALL content from `user-roles.sql`
3. Click **Run** to create the user roles system

### Step 4: Set Up Your Admin Account
1. **First, sign up** for an account in your app (the first user becomes admin automatically)
2. OR manually set admin using `manual-admin-setup.sql`:
   - Run the SELECT query to find your user ID
   - Replace placeholders with your actual user ID
   - Run the INSERT query to make yourself admin

### Step 5: Verify Setup (Optional)
1. Create another new query
2. Copy and paste content from `test.sql`
3. Click **Run** to verify tables were createdd

## Important Changes

### 🔒 New Admin System
- **No more email-based admin detection**
- Proper role-based permissions (admin, user, moderator)
- Only real admins can create stories and access admin features
- First user to sign up automatically becomes admin
- Additional admins must be manually granted the role

### 🛡️ Security Features
- Users can only modify their own content
- All users can view published stories
- Authentication required for creating content
- Role-based access control

## What This Creates

- **stories** table: Stores user-created stories
- **likes** table: Tracks story likes by users  
- **comments** table: Stores comments on stories
- **user_roles** table: Manages user permissions and roles
- **Row Level Security**: Proper access controls
- **Indexes**: For better performance
- **Triggers**: Auto-update timestamps and role assignment

## Troubleshooting

If you get errors like "Could not find column":
1. The database tables haven't been created yet
2. Run the `setup.sql` script first, then `user-roles.sql`
3. Make sure all SQL commands executed successfully

## Admin Management

After setup:
- Use `manual-admin-setup.sql` to manually grant/revoke admin roles
- Check user roles with the provided queries
- Remove the auto-admin trigger after setting up your admins