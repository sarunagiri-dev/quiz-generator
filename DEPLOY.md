# Step-by-Step Deployment Guide

## Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 2.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `quiz-generator` repository
4. Click "Deploy Now"

### 2.3 Configure Backend
1. In Railway dashboard, click your project
2. Click "Settings" tab
3. Scroll to "Root Directory" → Enter: `backend`
4. Click "Variables" tab
5. Add these 3 variables:
   ```
   OPENAI_API_KEY = ***REMOVED***kUgJfWJwveKffzyGhu5I_-U7Ya-0cgIDkhNZje1uZid7ZtyL9DPqBcP_ZE0YoARM8tRtNre3KmT3BlbkFJCrmkoMYIu5gpAV515EcxvbHeawq--AEmqvGVrSHKabaYsvzHBD9uChyCyxNBoCzx8tKOWS-jAA
   MONGODB_URI = ***REMOVED***sujatha:Jgq48rkvr44gr8av@quiz-app.njwhsvi.mongodb.net/
   FRONTEND_URL = https://quiz-generator-frontend.vercel.app
   ```
6. Railway will redeploy automatically
7. Copy your Railway URL (looks like: `https://quiz-generator-backend.railway.app`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your GitHub

### 3.2 Deploy Frontend
1. Click "New Project"
2. Find your `quiz-generator` repository → Click "Import"
3. In "Configure Project":
   - Root Directory: `frontend`
   - Framework Preset: Next.js (auto-detected)
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-railway-url-from-step-2
   ```
5. Click "Deploy"
6. Wait for deployment (2-3 minutes)
7. Copy your Vercel URL (looks like: `https://quiz-generator-frontend.vercel.app`)

## Step 4: Update Railway with Vercel URL
1. Go back to Railway dashboard
2. Click "Variables" tab
3. Update `FRONTEND_URL` with your actual Vercel URL:
   ```
   FRONTEND_URL = https://your-actual-vercel-url
   ```
4. Railway will redeploy automatically

## Step 5: Test Your Deployed App
1. Visit your Vercel URL
2. Try generating a quiz
3. Check if results are saved
4. Verify quiz history works

## ✅ Your App is Live!
- **Frontend**: Your Vercel URL
- **Backend**: Your Railway URL
- **Database**: MongoDB Atlas (already configured)

## Troubleshooting

**If quiz generation fails:**
- Check Railway logs for API key errors
- Verify OPENAI_API_KEY is set correctly

**If frontend can't connect to backend:**
- Check NEXT_PUBLIC_API_URL matches your Railway URL
- Verify CORS is allowing your Vercel domain

**If database connection fails:**
- Check Railway logs for MongoDB connection errors
- Verify MONGODB_URI is set correctly