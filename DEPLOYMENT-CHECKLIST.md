# 🚀 Deployment Checklist for AjayDev Stories App

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Repository name is `ajaydevv.github.io` ✅
- [ ] Repository is public ✅
- [ ] All code is committed and pushed

### 2. GitHub Pages Configuration
- [ ] Go to: https://github.com/Ajaydevv/ajaydevv.github.io/settings/pages
- [ ] Set Source to **"GitHub Actions"**
- [ ] Save settings

### 3. Environment Variables Setup
- [ ] Go to: https://github.com/Ajaydevv/ajaydevv.github.io/settings/secrets/actions
- [ ] Add these secrets:
  - [ ] `VITE_SUPABASE_URL` = `https://aycqooqlvlfgwwngmlyy.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3Fvb3FsdmxmZ3d3bmdtbHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjY4MzcsImV4cCI6MjA3MzQ0MjgzN30.80sIc94o9sGxyHXXx7HORRiS-_k-MLIa1c9XiNkrHrg`

### 4. Database Setup (If not done already)
- [ ] Run `supabase/setup.sql` in Supabase SQL Editor
- [ ] Run `supabase/profiles-admin.sql` in Supabase SQL Editor
- [ ] Verify tables are created

## 🚀 Deployment Options

### Option A: Automatic Deployment (Recommended)
```bash
git add .
git commit -m "Deploy stories app to GitHub Pages"
git push origin main
```

### Option B: Manual Deployment
```bash
# Windows
deploy.bat

# Or using npm
npm run deploy
```

## 📋 Post-Deployment Verification

### 1. Check Deployment Status
- [ ] Go to: https://github.com/Ajaydevv/ajaydevv.github.io/actions
- [ ] Verify the latest workflow completed successfully
- [ ] Look for green checkmarks ✅

### 2. Test Your Live App
- [ ] Visit: https://ajaydevv.github.io
- [ ] Verify the homepage loads correctly
- [ ] Test user registration/login
- [ ] Verify database connection works
- [ ] Test story creation (admin only)
- [ ] Test likes and comments functionality

### 3. Admin Setup
- [ ] Sign up as the first user (becomes admin automatically)
- [ ] Or manually set admin status using `manual-admin-profiles.sql`
- [ ] Verify admin can create stories
- [ ] Verify regular users cannot create stories

## 🔧 Troubleshooting

### If deployment fails:
1. Check the Actions tab for error logs
2. Verify environment secrets are set correctly
3. Ensure database schema is properly set up
4. Check for any TypeScript errors: `npm run lint`

### If app doesn't work after deployment:
1. Check browser console for errors
2. Verify Supabase connection (network tab)
3. Test authentication flow
4. Verify database permissions (RLS policies)

## 📱 Features to Test

### Public Features (All Users):
- [ ] View stories list
- [ ] Read individual stories
- [ ] User registration
- [ ] User login/logout
- [ ] Like stories (when logged in)
- [ ] Comment on stories (when logged in)

### Admin Features:
- [ ] Create new stories
- [ ] Access to story creation form
- [ ] Admin navigation visible

### Security Features:
- [ ] Non-admin users cannot access story creation
- [ ] Database enforces admin-only story creation
- [ ] User data is properly secured

## 🎉 Success!

Once all checkboxes are complete, your AjayDev Stories App will be live at:
**https://ajaydevv.github.io**

Your community can:
- ✅ Read amazing stories
- ✅ Register and login
- ✅ Like and comment on stories
- ✅ Admins can create new stories

## 📞 Need Help?

Check the detailed `DEPLOYMENT.md` file for more information and troubleshooting steps.