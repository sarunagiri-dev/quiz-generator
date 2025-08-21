# AI Quiz Generator

A full-stack web application that generates intelligent, contextually-aware quizzes using AI. Built with modern technologies and enhanced with Wikipedia integration for factual accuracy.

## 🚀 Features

### Core Functionality
- **AI-Powered Quiz Generation**: Uses OpenAI GPT-3.5-turbo to create dynamic quizzes on any topic
- **Wikipedia Integration**: Fetches contextual information with caching for improved factual accuracy
- **Interactive User Interface**: Modern, responsive design with real-time feedback
- **Smart Fallback System**: Gracefully handles API failures with topic-specific mock quizzes

### Learning Enhancement
- **Answer Explanations**: Detailed explanations for each correct answer to enhance learning
- **Immediate Feedback**: Shows correct/incorrect answers with visual indicators
- **Progress Tracking**: Persistent quiz history with scores and timestamps
- **Results Analytics**: View performance trends and learning progress over time
- **Statistics Dashboard**: Aggregate statistics and performance metrics

### Technical Excellence
- **Modular Architecture**: Clean separation of concerns with MVC pattern
- **Type-Safe Frontend**: Built with Next.js, React, and TypeScript
- **Robust Backend**: Node.js/Express with comprehensive error handling
- **RESTful API**: Clean, documented endpoints with pagination and filtering
- **Unit Testing**: Complete test suite using Jest and Supertest
- **MongoDB Integration**: Scalable database with optimized queries and indexing
- **Caching Layer**: Wikipedia API responses cached for performance
- **Production Ready**: Connection pooling, error handling, and logging

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Quiz UI       │  │  Results View   │  │    Statistics Dashboard     │ │
│  │  - Topic Input  │  │  - History      │  │   - Performance Metrics     │ │
│  │  - Questions    │  │  - Explanations │  │   - Topic Analytics         │ │
│  │  - Feedback     │  │  - Pagination   │  │   - Progress Tracking       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │ HTTP/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express.js)                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Controllers   │  │    Services     │  │         Models              │ │
│  │  - Quiz API     │  │  - Wikipedia    │  │   - QuizResult Schema       │ │
│  │  - Results API  │  │  - Quiz Logic   │  │   - Validation Rules        │ │
│  │  - Stats API    │  │  - Caching      │  │   - Database Indexes        │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
│                                    │                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │     Routes      │  │   Middleware    │  │       Configuration         │ │
│  │  - API Routing  │  │  - CORS         │  │   - Database Connection     │ │
│  │  - Error Handling│  │  - Validation   │  │   - Environment Setup       │ │
│  │  - 404 Handler  │  │  - Logging      │  │   - Connection Pooling      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                │
                    ▼                                ▼
┌─────────────────────────────┐    ┌─────────────────────────────────────────┐
│      EXTERNAL APIS          │    │           DATABASE                      │
│  ┌─────────────────────────┐ │    │  ┌─────────────────────────────────────┐ │
│  │     OpenAI API          │ │    │  │         MongoDB Atlas               │ │
│  │  - GPT-3.5-turbo       │ │    │  │  ┌─────────────────────────────────┐ │ │
│  │  - Quiz Generation      │ │    │  │  │       Collections               │ │ │
│  │  - Context-aware        │ │    │  │  │  - quizresults                  │ │ │
│  └─────────────────────────┘ │    │  │  │    * topic (indexed)            │ │ │
│                             │    │  │  │    * score                      │ │ │
│  ┌─────────────────────────┐ │    │  │  │    * totalQuestions             │ │ │
│  │    Wikipedia API        │ │    │  │  │    * timestamp (indexed)        │ │ │
│  │  - Context Retrieval    │ │    │  │  └─────────────────────────────────┘ │ │
│  │  - Factual Accuracy     │ │    │  │                                     │ │
│  │  - Cached Responses     │ │    │  │  ┌─────────────────────────────────┐ │ │
│  └─────────────────────────┘ │    │  │  │      Optimizations              │ │ │
└─────────────────────────────┘    │  │  │  - Connection Pooling           │ │ │
                                   │  │  │  - Query Optimization           │ │ │
                                   │  │  │  - Automatic Indexing           │ │ │
                                   │  │  └─────────────────────────────────┘ │ │
                                   │  └─────────────────────────────────────┘ │
                                   └─────────────────────────────────────────┘

Data Flow:
1. User enters topic → Frontend validates input
2. Frontend → Backend (/api/quiz) with topic
3. Backend → Wikipedia API (cached context retrieval)
4. Backend → OpenAI API (context-enhanced quiz generation)
5. Generated quiz with explanations → Frontend
6. User completes quiz → Results automatically saved to MongoDB
7. Results history retrieved via /api/results with pagination
8. Statistics available via /api/results/stats for analytics
```

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (React Framework)
- TypeScript (Type Safety)
- Tailwind CSS (Styling)
- Fetch API (HTTP Client)

**Backend**
- Node.js (Runtime)
- Express.js (Web Framework)
- OpenAI SDK (AI Integration)
- MongoDB (Database)
- Mongoose (ODM)

**External Services**
- OpenAI GPT-3.5-turbo (Quiz Generation)
- Wikipedia REST API (Context Retrieval)

**Development & Testing**
- Jest (Testing Framework)
- Supertest (API Testing)
- ESLint (Code Quality)

## 📋 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB
- OpenAI API Key ([Get one here](https://platform.openai.com/account/api-keys))

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd quiz-generator

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup
Copy the example file and add your credentials:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your actual API keys
```

```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
FRONTEND_URL=http://localhost:3000
```

**⚠️ SECURITY: Never commit `.env` files to version control!**

### 3. Database Setup
- **MongoDB Atlas** (Recommended): Create cluster at https://cloud.mongodb.com
- **Local MongoDB**: Install and start `mongod`

### 4. Start the Application
```bash
# Terminal 1: Start Backend
cd backend
npm start
# Server runs on http://localhost:3001

# Terminal 2: Start Frontend
cd frontend
npm run dev
# App available at http://localhost:3000
```

## 📚 API Documentation

### Quiz Generation
```http
POST /api/quiz
Content-Type: application/json

{
  "topic": "photosynthesis"
}
```

**Response:**
```json
[
  {
    "question": "What is the primary purpose of photosynthesis?",
    "options": ["Energy storage", "Oxygen production", "Water absorption", "Root growth"],
    "correctOptionIndex": 0,
    "explanation": "Photosynthesis converts light energy into chemical energy (glucose) for storage."
  }
]
```

### Results Management
```http
# Get quiz history with pagination
GET /api/results?limit=20&offset=0&topic=math&sortBy=timestamp&sortOrder=desc

# Save quiz result
POST /api/results
{
  "topic": "math",
  "score": 4,
  "totalQuestions": 5
}

# Get statistics
GET /api/results/stats
```

**Statistics Response:**
```json
{
  "totalQuizzes": 150,
  "averageScore": 78.5,
  "uniqueTopics": 25
}
```

## 🏗️ Project Structure

```
quiz-generator/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/
│   │   ├── quizController.js    # Quiz generation logic
│   │   └── resultsController.js # Results management logic
│   ├── models/
│   │   └── QuizResult.js        # MongoDB schema definitions
│   ├── routes/
│   │   └── index.js             # API route definitions
│   ├── services/
│   │   ├── wikipediaService.js  # Wikipedia API integration
│   │   └── quizService.js       # Quiz generation utilities
│   ├── tests/
│   │   └── server.test.js       # Comprehensive test suite
│   ├── .env.example             # Environment template
│   ├── server.js                # Application entry point
│   └── package.json             # Dependencies and scripts
├── frontend/
│   ├── src/app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # App layout component
│   │   └── page.tsx             # Main quiz interface
│   ├── public/                  # Static assets
│   ├── next.config.ts           # Next.js configuration
│   └── package.json             # Frontend dependencies
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## 🧪 Testing

```bash
cd backend
npm test
```

**Test Coverage:**
- API endpoint functionality
- Database operations
- Error handling scenarios
- Mock quiz generation
- Wikipedia integration
- Results persistence and retrieval

## 🔧 Configuration

### Backend Configuration
- **Port**: `PORT` environment variable (default: 3001)
- **Database**: MongoDB connection with pooling
- **CORS**: Configurable frontend URL
- **Caching**: Wikipedia responses cached for 1 hour

### Frontend Configuration
- **API URL**: `NEXT_PUBLIC_API_URL` environment variable
- **Port**: Next.js default (3000)

### OpenAI Settings
- **Model**: `gpt-3.5-turbo`
- **Temperature**: `0.7` (balanced creativity/consistency)
- **Context**: Wikipedia integration for factual accuracy
- **Fallback**: Topic-specific mock quizzes

### Database Optimization
- **Connection Pooling**: Max 10 connections
- **Indexes**: Optimized queries on timestamp and topic
- **Validation**: Schema-level data validation
- **Aggregation**: Statistics pipeline for analytics

## 🚀 Deployment

### Production Environment Variables
```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your_production_key
MONGODB_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=https://your-frontend-domain.com
```

### Recommended Deployment Platforms
- **Frontend**: Vercel (Free tier available)
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas (Free tier: 512MB)

### Deployment Steps
1. **Backend**: Deploy to Railway/Render with environment variables
2. **Frontend**: Deploy to Vercel with `NEXT_PUBLIC_API_URL` set to backend URL
3. **Database**: Use MongoDB Atlas connection string

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the modular architecture patterns
4. Add comprehensive tests for new features
5. Update documentation as needed
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [x] Database integration (MongoDB)
- [x] Modular architecture implementation
- [x] Comprehensive error handling
- [x] API documentation and testing
- [ ] Real-time multiplayer quizzes
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Quiz sharing and collaboration
- [ ] Custom difficulty levels
- [ ] Image and video question support
- [ ] Quiz categories and tagging
- [ ] Performance analytics and insights
- [ ] Rate limiting and API throttling
- [ ] Redis caching layer
- [ ] Microservices architecture