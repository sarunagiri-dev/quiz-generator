# Quiz Generator - Deployment Strategy & Secrets Management

## 🚀 Recommended Deployment Architecture

### **Frontend: Vercel (Recommended)**
- **Why Vercel**: Built for Next.js, automatic deployments, global CDN
- **Cost**: Free tier sufficient for MVP
- **Features**: Automatic HTTPS, custom domains, preview deployments

### **Backend: Railway (Recommended)**
- **Why Railway**: Simple Node.js deployment, built-in PostgreSQL/MongoDB
- **Cost**: $5/month for hobby plan
- **Alternative**: Render (free tier available)

### **Database: MongoDB Atlas**
- **Why Atlas**: Already configured, free tier (512MB)
- **Cost**: Free for MVP, scales as needed

## 🔐 Secrets Management Strategy

### **GitHub Secrets (Repository Level)**

**Setup GitHub Secrets:**
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:

```
OPENAI_API_KEY=***REMOVED***your-actual-key-here
MONGODB_URI=***REMOVED***username:password@cluster.mongodb.net/
FRONTEND_URL_PROD=https://your-app.vercel.app
```

### **Environment-Specific Configuration**

**Development (.env - Local Only):**
```env
NODE_ENV=development
OPENAI_API_KEY=***REMOVED***dev-key
MONGODB_URI=***REMOVED***dev-cluster
FRONTEND_URL=http://localhost:3000
PORT=3001
```

**Production (Platform Environment Variables):**
```env
NODE_ENV=production
OPENAI_API_KEY=${OPENAI_API_KEY}
MONGODB_URI=${MONGODB_URI}
FRONTEND_URL=${FRONTEND_URL_PROD}
PORT=${PORT}
```

## 📋 Step-by-Step Deployment Guide

### **1. Prepare Repository**

**Update .gitignore:**
```gitignore
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
.next/

# Logs
*.log
```

**Create deployment configs:**

**backend/package.json (add scripts):**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "echo 'Backend build complete'"
  }
}
```

### **2. Deploy Backend to Railway**

**Steps:**
1. **Connect GitHub**: Link your repository to Railway
2. **Select backend folder**: Set root directory to `/backend`
3. **Add Environment Variables**:
   ```
   OPENAI_API_KEY=your-production-key
   MONGODB_URI=your-mongodb-atlas-uri
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```
4. **Deploy**: Railway auto-deploys on git push

**Railway Configuration:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api"
  }
}
```

### **3. Deploy Frontend to Vercel**

**Steps:**
1. **Connect GitHub**: Import your repository to Vercel
2. **Configure Build Settings**:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

4. **Deploy**: Vercel auto-deploys on git push

### **4. GitHub Actions CI/CD (Optional)**

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy Quiz Generator

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          MONGODB_URI: ${{ secrets.MONGODB_URI }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: echo "Backend deployed via Railway GitHub integration"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: echo "Frontend deployed via Vercel GitHub integration"
```

## 🔒 Security Best Practices

### **Secrets Management Rules**

**✅ DO:**
- Use platform environment variables for production secrets
- Store secrets in GitHub Secrets for CI/CD
- Use different API keys for development/production
- Rotate secrets regularly
- Use least-privilege access for database users

**❌ DON'T:**
- Commit `.env` files to git
- Share secrets in chat/email
- Use production secrets in development
- Hard-code secrets in source code
- Use weak database passwords

### **Production Security Checklist**

**Backend Security:**
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip compression
  app.set('trust proxy', 1); // Trust Railway proxy
}
```

**Environment Validation:**
```javascript
// Add to server.js
const requiredEnvVars = ['OPENAI_API_KEY', 'MONGODB_URI'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});
```

## 📊 Deployment Monitoring

### **Health Checks**

**Backend Health Endpoint:**
```javascript
// Already implemented in your app
app.get('/api', (req, res) => {
  res.json({
    message: 'Quiz Generator API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});
```

**Monitoring Setup:**
- **Railway**: Built-in metrics and logs
- **Vercel**: Analytics and performance monitoring
- **MongoDB Atlas**: Database monitoring dashboard

### **Deployment Verification**

**Post-Deployment Checklist:**
1. ✅ Health check endpoint responds
2. ✅ Quiz generation works with real OpenAI API
3. ✅ Database connections successful
4. ✅ Frontend can communicate with backend
5. ✅ CORS configured correctly
6. ✅ Rate limiting active
7. ✅ Error handling working

## 💰 Cost Estimation

### **Monthly Costs (MVP)**
- **Vercel**: $0 (Free tier)
- **Railway**: $5 (Hobby plan)
- **MongoDB Atlas**: $0 (Free tier - 512MB)
- **OpenAI API**: ~$10-20 (depending on usage)
- **Total**: ~$15-25/month

### **Scaling Costs**
- **High Traffic**: Vercel Pro ($20/month)
- **Database Growth**: MongoDB Atlas M10 ($57/month)
- **Backend Scaling**: Railway Pro ($20/month)

## 🔄 Alternative Deployment Options

### **Budget Option (Free Tier)**
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free tier - sleeps after 15min)
- **Database**: MongoDB Atlas (Free)
- **Cost**: $0 + OpenAI usage

### **Enterprise Option**
- **Frontend**: AWS CloudFront + S3
- **Backend**: AWS ECS/Fargate
- **Database**: AWS DocumentDB
- **Secrets**: AWS Secrets Manager

## 🚀 Quick Deploy Commands

**One-time setup:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect Railway to GitHub repo (backend folder)
# 3. Connect Vercel to GitHub repo (frontend folder)
# 4. Add environment variables to both platforms
# 5. Deploy automatically triggers
```

**Your app will be live at:**
- Frontend: `https://quiz-generator-frontend.vercel.app`
- Backend: `https://quiz-generator-backend.railway.app`

This deployment strategy provides production-ready hosting with proper secrets management and automatic deployments.