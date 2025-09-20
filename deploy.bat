@echo off
echo 🚀 Starting deployment to GitHub Pages...

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the project
echo 🔨 Building the project...
npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Deploy to GitHub Pages
echo 🚀 Deploying to GitHub Pages...
npm run deploy
if errorlevel 1 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo 🌐 Your site will be available at: https://ajaydevv.github.io
echo ⏳ It may take a few minutes for changes to appear
pause