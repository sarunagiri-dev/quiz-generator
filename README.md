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
- **Results History**: View past quiz attempts with scores and dates
- **Load More Questions**: Dynamically add more questions to extend quiz length
- **Statistics API**: Backend endpoint for aggregate statistics and performance metrics

### Technical Excellence
- **Modular Architecture**: Clean separation of concerns with MVC pattern
- **Type-Safe Frontend**: Built with Next.js, React, and TypeScript
- **Robust Backend**: Node.js/Express with comprehensive error handling
- **RESTful API**: Clean, documented endpoints with pagination and filtering
- **Unit Testing**: Essential test coverage using Jest and Supertest
- **MongoDB Integration**: Scalable database with optimized queries and indexing
- **Caching Layer**: Wikipedia API responses cached for 1 hour
- **Rate Limiting**: 10 requests per 10 minutes per IP for cost control
- **Production Ready**: Connection pooling, error handling, and logging

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js)                               │
│  ┌─────────────────┐  ┌─────────────────────────────────────────────────┐ │
│  │   Quiz UI       │  │              Results View                       │ │
│  │  - Topic Input  │  │            - Quiz History                       │ │
│  │  - Questions    │  │            - Score Display                      │ │
│  │  - Feedback     │  │            - Answer Explanations                │ │
│  │  - Scoring      │  │            - Pagination                         │ │
│  └─────────────────┘  └─────────────────────────────────────────────────┘ │
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
8. Statistics available via /api/results/stats API endpoint (backend only)
9. User can load additional questions dynamically during quiz
10. Quiz results automatically saved to database after completion
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

### Interactive API Docs
Swagger documentation available at: `backend/swagger.json`

### Quick Reference

| Endpoint | Method | Description |
|----------|--------|--------------|
| `/api` | GET | Health check |
| `/api/quiz` | POST | Generate quiz (max 50 char topic) |
| `/api/results` | GET | Get quiz history (paginated) |
| `/api/results` | POST | Save quiz result |
| `/api/results/stats` | GET | Get statistics |

### Example Usage
```bash
# Generate quiz
curl -X POST http://localhost:3001/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"topic":"math"}'

# Save result
curl -X POST http://localhost:3001/api/results \
  -H "Content-Type: application/json" \
  -d '{"topic":"math","score":4,"totalQuestions":5}'
```

## 🏗️ Project Structure

```
quiz-generator/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection with pooling
│   ├── controllers/
│   │   ├── quizController.js    # Quiz generation with AI integration
│   │   └── resultsController.js # Results CRUD with pagination
│   ├── models/
│   │   └── QuizResult.js        # MongoDB schema with validation
│   ├── routes/
│   │   └── index.js             # Centralized API routes
│   ├── services/
│   │   ├── wikipediaService.js  # Wikipedia API with caching
│   │   └── quizService.js       # Mock quiz generation
│   ├── tests/
│   │   └── server.test.js       # Complete test coverage
│   ├── .env.example             # Environment variables template
│   ├── server.js                # Express app with security
│   ├── swagger.json             # API documentation
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
- API endpoint functionality (health check, quiz generation, results, statistics)
- Input validation (topic requirements, empty topics, missing data)
- Error handling scenarios (404 routes, invalid requests)
- Mock external dependencies (OpenAI, Wikipedia, MongoDB with QuizResult model)
- Database operations (results retrieval, saving, statistics aggregation)
- Essential functionality verification with proper mocking
- Fast test execution without external service dependencies

## 🔒 Security

### Built-in Protection
- **Rate Limiting**: 10 requests per 10 minutes per IP
- **Input Validation**: Topic length limited to 50 characters
- **CORS Protection**: Configurable allowed origins
- **Environment Variables**: Sensitive data in `.env` files

### Security Best Practices
- Never commit API keys to version control
- Use HTTPS in production
- Keep dependencies updated
- Monitor API usage and costs

## 🔧 Configuration

### Backend Configuration
- **Port**: `PORT` environment variable (default: 3001)
- **Database**: MongoDB connection with pooling
- **CORS**: Configurable frontend URL
- **Caching**: Wikipedia responses cached for 1 hour
- **Rate Limiting**: 10 requests per 10-minute window

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

### Completed Features ✅
- [x] Database integration (MongoDB)
- [x] Modular architecture implementation  
- [x] Comprehensive error handling
- [x] API documentation (Swagger) and testing
- [x] Security (rate limiting, input validation)
- [x] Caching (Wikipedia responses)
- [x] Load more questions functionality
- [x] Automatic result persistence
- [x] Quiz history with pagination

### Planned Features 🚀
- [ ] User authentication and profiles
- [ ] Statistics dashboard UI (API exists, needs frontend component)
- [ ] Advanced analytics and reporting
- [ ] Question difficulty levels and adaptive quizzes
- [ ] Real-time multiplayer quizzes
- [ ] Mobile app (React Native)
- [ ] Quiz sharing and collaboration
- [ ] Image and video question support
- [ ] Quiz categories and tagging
- [ ] Redis caching layer
- [ ] Microservices architecture