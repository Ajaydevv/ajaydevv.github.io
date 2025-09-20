# 🚀 GitHub Pages Deployment Guide

## Quick Deployment

### Option 1: Automatic Deployment (Recommended)
The app automatically deploys to GitHub Pages when you push to the `main` branch using GitHub Actions.

1. **Push your changes**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Wait for deployment**: Check the Actions tab in your GitHub repository to see the deployment progress.

3. **Access your site**: Your app will be available at `https://ajaydevv.github.io`

### Option 2: Manual Deployment

#### Windows:
```bash
deploy.bat
```

#### Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Using npm:
```bash
npm run deploy
```

## First-Time Setup

### 1. Repository Settings
1. Go to your GitHub repository: `https://github.com/Ajaydevv/ajaydevv.github.io`
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**

### 2. Environment Variables (Important!)
Since your app uses Supabase, you need to set up environment variables for production:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these repository secrets:
   - `VITE_SUPABASE_URL`: `https://aycqooqlvlfgwwngmlyy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3Fvb3FsdmxmZ3d3bmdtbHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjY4MzcsImV4cCI6MjA3MzQ0MjgzN30.80sIc94o9sGxyHXXx7HORRiS-_k-MLIa1c9XiNkrHrg`

### 3. Database Setup
Make sure your Supabase database is set up with the required tables:
1. Run `supabase/setup.sql` in your Supabase SQL Editor
2. Run `supabase/profiles-admin.sql` to set up the admin system

## Deployment Process

### What happens during deployment:
1. **Build**: Vite builds your React app for production
2. **Optimize**: Code is minified and optimized
3. **Deploy**: Files are uploaded to GitHub Pages
4. **Live**: Your app becomes available at `https://ajaydevv.github.io`

### Build Output:
- `dist/` folder contains the built application
- Optimized bundles for faster loading
- Static assets are properly handled

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check for TypeScript errors: `npm run lint`
   - Ensure all dependencies are installed: `npm install`

2. **Environment Variables**:
   - Make sure Supabase credentials are correctly set in GitHub secrets
   - Verify the `.env` file locally for development

3. **404 Errors**:
   - Ensure the repository name matches your GitHub username
   - Check that GitHub Pages is enabled in repository settings

4. **Slow Loading**:
   - The first deployment may take 5-10 minutes to propagate
   - Subsequent deployments are faster

### Checking Deployment Status:
1. Go to **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Monitor the deployment progress

## Development vs Production

### Local Development:
```bash
npm run dev
# Runs on http://localhost:8080
```

### Production Build Testing:
```bash
npm run build
npm run preview
# Test production build locally
```

### Live Production:
```
https://ajaydevv.github.io
# Your live app
```

## Security Notes

- Environment variables are securely stored in GitHub Secrets
- Supabase handles authentication and database security
- Row Level Security (RLS) is enabled on all database tables
- Admin permissions are properly enforced

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your Supabase database setup
3. Ensure environment variables are correctly configured
4. Make sure you've committed and pushed all changes

---

Your AjayDev Stories App is now ready to be deployed to GitHub Pages! 🎉