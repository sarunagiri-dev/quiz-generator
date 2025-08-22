# Detailed Deployment Steps

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"** (top right)
3. Select **"Login with GitHub"**
4. Click **"Authorize Railway"** to connect your GitHub account

### 1.2 Create New Project
1. Click **"New Project"** (big button on dashboard)
2. Select **"Deploy from GitHub repo"**
3. Find and click your **"quiz-generator"** repository
4. Click **"Deploy Now"**

### 1.3 Configure Root Directory
1. Wait for initial deployment (will fail - that's expected)
2. In Railway dashboard, click on your project
3. Click **"Settings"** tab (left sidebar)
4. Scroll down to **"Root Directory"**
5. Enter: `backend`
6. Click **"Update"** button

### 1.4 Add Environment Variables
1. Click **"Variables"** tab (left sidebar)
2. Click **"New Variable"** button
3. Add these 3 variables one by one:

**Variable 1:**
- Name: `OPENAI_API_KEY`
- Value: `***REMOVED***kUgJfWJwveKffzyGhu5I_-U7Ya-0cgIDkhNZje1uZid7ZtyL9DPqBcP_ZE0YoARM8tRtNre3KmT3BlbkFJCrmkoMYIu5gpAV515EcxvbHeawq--AEmqvGVrSHKabaYsvzHBD9uChyCyxNBoCzx8tKOWS-jAA`

**Variable 2:**
- Name: `MONGODB_URI`
- Value: `***REMOVED***sujatha:Jgq48rkvr44gr8av@quiz-app.njwhsvi.mongodb.net/`

**Variable 3:**
- Name: `FRONTEND_URL`
- Value: `https://quiz-generator-frontend.vercel.app` (we'll update this later)

### 1.5 Get Your Railway URL
1. Railway will automatically redeploy after adding variables
2. Wait 2-3 minutes for deployment to complete
3. Click **"Deployments"** tab to see status
4. Once deployed, copy your Railway URL from the top of the page
5. **Save this URL** - looks like: `https://quiz-generator-backend-production.railway.app`

---

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** (top right)
3. Select **"Continue with GitHub"**
4. Click **"Authorize Vercel"** to connect your GitHub account

### 2.2 Import Project
1. Click **"New Project"** (dashboard)
2. Find your **"quiz-generator"** repository
3. Click **"Import"** button next to it

### 2.3 Configure Project Settings
1. In **"Configure Project"** screen:
   - **Project Name**: `quiz-generator-frontend` (or any name you prefer)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click **"Edit"** → Enter `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

### 2.4 Add Environment Variable
1. In **"Environment Variables"** section:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-railway-url-from-step-1` (paste your actual Railway URL)
2. Click **"Add"**

### 2.5 Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build and deployment
3. Once complete, copy your Vercel URL
4. **Save this URL** - looks like: `https://quiz-generator-frontend.vercel.app`

---

## 🚀 Step 3: Update Railway with Correct Frontend URL

### 3.1 Update FRONTEND_URL Variable
1. Go back to **Railway dashboard**
2. Click on your project
3. Click **"Variables"** tab
4. Find the `FRONTEND_URL` variable
5. Click **"Edit"** (pencil icon)
6. Replace the value with your **actual Vercel URL** from Step 2.5
7. Click **"Update"**
8. Railway will automatically redeploy

---

## 🚀 Step 4: Test Your Deployed Application

### 4.1 Test Frontend
1. Visit your Vercel URL
2. You should see the QuizAI interface
3. Try entering a topic (e.g., "JavaScript")
4. Click **"Generate Quiz"**

### 4.2 Test Backend Connection
1. If quiz generation works, your backend is connected correctly
2. Try the **"Load More Questions"** feature
3. Complete a quiz and check if results are saved
4. Click **"View Results History"** to verify database connection

### 4.3 Test Backend Directly (Optional)
1. Visit your Railway URL directly
2. You should see: `{"name":"QuizAI API","version":"1.0.0","status":"operational"}`

---

## ✅ Your App is Now Live!

**Frontend URL**: Your Vercel URL  
**Backend URL**: Your Railway URL  
**Database**: MongoDB Atlas (already configured)

## 🔧 Troubleshooting

### If Quiz Generation Fails:
1. Check Railway **"Logs"** tab for errors
2. Verify `OPENAI_API_KEY` is set correctly
3. Check if API key has sufficient credits

### If Frontend Can't Connect to Backend:
1. Verify `NEXT_PUBLIC_API_URL` matches your Railway URL exactly
2. Check Railway **"Variables"** tab - ensure `FRONTEND_URL` matches your Vercel URL
3. Try redeploying both services

### If Database Connection Fails:
1. Check Railway **"Logs"** for MongoDB connection errors
2. Verify `MONGODB_URI` is set correctly
3. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

## 🎉 Success!
Your AI Quiz Generator is now live and accessible worldwide!