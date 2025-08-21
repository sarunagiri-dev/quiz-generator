# AI Quiz Generator

A full-stack web application that generates intelligent, contextually-aware quizzes using AI. Built with modern technologies and enhanced with Wikipedia integration for factual accuracy.

## 🚀 Features

### Core Functionality
- **AI-Powered Quiz Generation**: Uses OpenAI GPT-3.5-turbo to create dynamic quizzes on any topic
- **Wikipedia Integration**: Fetches contextual information to improve quiz accuracy and relevance
- **Interactive User Interface**: Modern, responsive design with real-time feedback
- **Smart Fallback System**: Gracefully handles API failures with topic-specific mock quizzes

### Learning Enhancement
- **Answer Explanations**: Detailed explanations for each correct answer to enhance learning
- **Immediate Feedback**: Shows correct/incorrect answers with visual indicators
- **Progress Tracking**: Persistent quiz history with scores and timestamps
- **Results Analytics**: View performance trends and learning progress over time

### Technical Excellence
- **Type-Safe Frontend**: Built with Next.js, React, and TypeScript
- **Robust Backend**: Node.js/Express with comprehensive error handling
- **RESTful API**: Clean, documented endpoints for all functionality
- **Unit Testing**: Complete test suite using Jest and Supertest
- **Local Storage**: File-based persistence for quiz results

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│  Frontend       │◄──►│  Backend Server  │◄──►│  External APIs  │
│  (Next.js)      │    │  (Express.js)    │    │                 │
│  Port: 3000     │    │  Port: 3001      │    │                 │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       ├─ OpenAI API
         │                       │                       │  (GPT-3.5-turbo)
         │                       │                       │
         │                       │                       └─ Wikipedia API
         │                       │                          (Context Retrieval)
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │                 │
         └──────────────┤  Local Storage  │
                        │                 │
                        │ quiz_results.json│
                        └─────────────────┘

Data Flow:
1. User enters topic → Frontend
2. Frontend → Backend (/api/quiz)
3. Backend → Wikipedia API (context)
4. Backend → OpenAI API (quiz generation)
5. Generated quiz → Frontend
6. User completes quiz → Results saved locally
7. Results history available via /api/results
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
- File System (Local Storage)

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
Create `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the Application
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
# Get quiz history
GET /api/results

# Save quiz result
POST /api/results
{
  "topic": "math",
  "score": 4,
  "totalQuestions": 5
}
```

## 🧪 Testing

```bash
cd backend
npm test
```

**Test Coverage:**
- API endpoint functionality
- Error handling scenarios
- Mock quiz generation
- Results persistence

## 🔧 Configuration

### Port Configuration
- Backend: `PORT` environment variable (default: 3001)
- Frontend: Next.js default (3000)

### OpenAI Settings
- Model: `gpt-3.5-turbo`
- Temperature: `0.7` (balanced creativity/consistency)
- Context: Wikipedia integration for factual accuracy

### Storage
- Quiz results: `backend/quiz_results.json`
- Format: JSON array with timestamps
- Automatic backup on each save

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
npm install --production
NODE_ENV=production npm start
```

### Frontend Deployment
```bash
# Build for production
npm run build
npm start
```

### Environment Variables
```env
# Production
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your_production_key

# Development
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time multiplayer quizzes
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Quiz sharing and collaboration
- [ ] Custom difficulty levels
- [ ] Image and video question support