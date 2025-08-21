# Quiz Generator - Architecture Documentation

## 🏗️ System Architecture Overview

The Quiz Generator is built using a modern, modular architecture that separates concerns and ensures scalability, maintainability, and testability.

## 📁 Project Structure

```
quiz-generator/
├── backend/                     # Node.js/Express API Server
│   ├── config/                  # Configuration modules
│   │   └── database.js          # MongoDB connection & optimization
│   ├── controllers/             # Request handlers (MVC Pattern)
│   │   ├── quizController.js    # Quiz generation endpoints
│   │   └── resultsController.js # Results management endpoints
│   ├── models/                  # Database schemas & validation
│   │   └── QuizResult.js        # MongoDB schema for quiz results
│   ├── routes/                  # API route definitions
│   │   └── index.js             # Centralized route configuration
│   ├── services/                # Business logic & external integrations
│   │   ├── wikipediaService.js  # Wikipedia API with caching
│   │   └── quizService.js       # Quiz generation utilities
│   ├── tests/                   # Comprehensive test suite
│   │   └── server.test.js       # API & integration tests
│   ├── .env.example             # Environment template
│   ├── server.js                # Application entry point
│   └── package.json             # Dependencies & scripts
├── frontend/                    # Next.js React Application
│   ├── src/app/                 # App Router structure
│   │   ├── globals.css          # Global styles & Tailwind
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main quiz interface
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
├── .gitignore                   # Git ignore patterns
├── ARCHITECTURE.md              # This file
└── README.md                    # Project documentation
```

## 🔄 Data Flow Architecture

### 1. Quiz Generation Flow
```
User Input → Frontend Validation → Backend API → Wikipedia Context → OpenAI Generation → Response
     ↓              ↓                    ↓              ↓              ↓              ↓
Topic Entry → Client Validation → /api/quiz → Cache Check → AI Prompt → JSON Response
```

### 2. Results Persistence Flow
```
Quiz Completion → Score Calculation → Backend API → Database Storage → Confirmation
       ↓                ↓               ↓              ↓              ↓
User Submission → Frontend Logic → /api/results → MongoDB Insert → Success Response
```

### 3. History Retrieval Flow
```
User Request → Backend API → Database Query → Pagination → Response
     ↓              ↓              ↓              ↓           ↓
History Button → /api/results → MongoDB Find → Limit/Sort → JSON Array
```

## 🏛️ Architectural Patterns

### 1. Model-View-Controller (MVC)
- **Models**: Database schemas with validation (`models/`)
- **Views**: React components (`frontend/src/app/`)
- **Controllers**: Request handlers (`controllers/`)

### 2. Service Layer Pattern
- **Services**: Business logic separation (`services/`)
- **Controllers**: Thin layer for HTTP handling
- **Models**: Data access and validation only

### 3. Repository Pattern (Implicit)
- **Mongoose ODM**: Abstracts database operations
- **Model Methods**: Encapsulate data access logic
- **Query Optimization**: Indexes and aggregation pipelines

## 🔧 Component Architecture

### Backend Components

#### 1. Server Entry Point (`server.js`)
```javascript
/**
 * Responsibilities:
 * - Application bootstrapping
 * - Middleware configuration
 * - Route mounting
 * - Error handling
 * - Graceful shutdown
 */
```

#### 2. Database Configuration (`config/database.js`)
```javascript
/**
 * Features:
 * - Connection pooling (max 10 connections)
 * - Timeout configuration
 * - Error handling
 * - Graceful shutdown hooks
 */
```

#### 3. Controllers (`controllers/`)
```javascript
/**
 * Quiz Controller:
 * - Input validation
 * - Business logic orchestration
 * - Response formatting
 * - Error handling
 * 
 * Results Controller:
 * - CRUD operations
 * - Pagination logic
 * - Statistics aggregation
 * - Data validation
 */
```

#### 4. Services (`services/`)
```javascript
/**
 * Wikipedia Service:
 * - API integration
 * - Response caching (1 hour TTL)
 * - Error handling
 * - Rate limiting consideration
 * 
 * Quiz Service:
 * - Mock quiz generation
 * - Topic-specific content
 * - Fallback mechanisms
 */
```

#### 5. Models (`models/`)
```javascript
/**
 * QuizResult Schema:
 * - Data validation
 * - Index optimization
 * - Mongoose middleware
 * - Schema methods
 */
```

### Frontend Components

#### 1. Main Application (`page.tsx`)
```typescript
/**
 * State Management:
 * - Quiz data state
 * - User interaction state
 * - Loading states
 * - Error handling
 * 
 * User Interface:
 * - Topic input form
 * - Quiz question display
 * - Results visualization
 * - History modal
 */
```

## 🔄 State Management

### Frontend State Architecture
```typescript
// Application State
const [topic, setTopic] = useState<string>('');           // Current quiz topic
const [quiz, setQuiz] = useState<Question[] | null>(null); // Quiz questions
const [userAnswers, setUserAnswers] = useState<UserAnswers>({}); // User selections
const [score, setScore] = useState<number | null>(null);   // Final score
const [quizResults, setQuizResults] = useState<QuizResult[]>([]); // History

// UI State
const [loading, setLoading] = useState<boolean>(false);    // Quiz generation
const [loadingMore, setLoadingMore] = useState<boolean>(false); // Additional questions
const [error, setError] = useState<string | null>(null);   // Error messages
const [quizFinished, setQuizFinished] = useState<boolean>(false); // Results view
const [showResults, setShowResults] = useState<boolean>(false); // History modal
```

## 🗄️ Database Architecture

### MongoDB Schema Design
```javascript
// QuizResult Collection
{
  _id: ObjectId,                    // Auto-generated primary key
  topic: String,                    // Quiz subject (indexed)
  score: Number,                    // Correct answers count
  totalQuestions: Number,           // Total questions in quiz
  timestamp: Date                   // Creation time (indexed)
}

// Indexes for Performance
db.quizresults.createIndex({ "timestamp": -1 })  // Recent results first
db.quizresults.createIndex({ "topic": 1 })       // Topic filtering
```

### Query Optimization
```javascript
// Efficient Pagination
QuizResult.find(filter)
  .sort({ timestamp: -1 })
  .limit(50)
  .skip(offset)
  .lean()  // Return plain objects for better performance

// Statistics Aggregation
QuizResult.aggregate([
  { $group: { 
    _id: null, 
    totalQuizzes: { $sum: 1 },
    averageScore: { $avg: { $divide: ['$score', '$totalQuestions'] }}
  }}
])
```

## 🔌 API Architecture

### RESTful Endpoint Design
```
GET    /api                    # Health check
POST   /api/quiz              # Generate quiz
GET    /api/results           # Get quiz history (paginated)
POST   /api/results           # Save quiz result
GET    /api/results/stats     # Get statistics
```

### Request/Response Patterns
```typescript
// Standardized Error Response
{
  error: string,              // Human-readable error message
  details?: string | string[] // Development details (optional)
}

// Paginated Response
{
  results: T[],               // Data array
  pagination: {
    total: number,            // Total count
    limit: number,            // Page size
    offset: number,           // Current offset
    hasMore: boolean          // More data available
  }
}
```

## 🚀 Performance Optimizations

### 1. Caching Strategy
```javascript
// Wikipedia API Caching
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Cache Implementation
if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return cached.data;
}
```

### 2. Database Optimization
```javascript
// Connection Pooling
const options = {
  maxPoolSize: 10,              // Maximum connections
  serverSelectionTimeoutMS: 5000, // Connection timeout
  socketTimeoutMS: 45000,       // Socket timeout
  bufferMaxEntries: 0,          // Disable buffering
  bufferCommands: false         // Disable command buffering
};
```

### 3. Query Optimization
```javascript
// Efficient Queries
.lean()                       // Return plain objects
.select('field1 field2')      // Select specific fields
.limit(50)                    // Limit results
.sort({ timestamp: -1 })      // Use indexed sorting
```

## 🔒 Security Architecture

### 1. Input Validation
```javascript
// Server-side Validation
if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
  return res.status(400).json({ error: 'Invalid input' });
}

// Schema Validation
const QuizResultSchema = new mongoose.Schema({
  topic: { type: String, required: true, maxlength: 100 },
  score: { type: Number, required: true, min: 0 }
});
```

### 2. Environment Security
```bash
# Environment Variables
OPENAI_API_KEY=***           # Never commit to version control
MONGODB_URI=***              # Use connection strings with auth
FRONTEND_URL=***             # CORS configuration
```

### 3. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## 🧪 Testing Architecture

### Test Structure
```javascript
// Test Categories
describe('API Endpoints', () => {})     // Integration tests
describe('Services', () => {})          // Unit tests
describe('Models', () => {})            // Schema tests
describe('Error Handling', () => {})    // Error scenarios
```

### Test Database
```javascript
// Isolated Test Environment
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/quiz-generator-test');
});

beforeEach(async () => {
  await QuizResult.deleteMany({});      // Clean state
});
```

## 📈 Scalability Considerations

### 1. Horizontal Scaling
- **Stateless Design**: No server-side sessions
- **Database Sharding**: MongoDB supports horizontal partitioning
- **Load Balancing**: Multiple server instances possible

### 2. Caching Layers
- **Application Cache**: Wikipedia responses
- **Database Cache**: MongoDB query result caching
- **CDN**: Static asset delivery

### 3. Microservices Migration Path
```
Current Monolith → Service Separation
├── Quiz Service (OpenAI integration)
├── Wikipedia Service (Context retrieval)
├── Results Service (Data persistence)
└── Statistics Service (Analytics)
```

## 🔄 Deployment Architecture

### Development Environment
```
Local Development:
├── Frontend: localhost:3000
├── Backend: localhost:3001
└── Database: localhost:27017
```

### Production Environment
```
Production Deployment:
├── Frontend: Vercel (CDN + Edge Functions)
├── Backend: Railway/Render (Container deployment)
└── Database: MongoDB Atlas (Cloud database)
```

## 🔮 Future Architecture Enhancements

### 1. Microservices Architecture
- Service mesh implementation
- API gateway integration
- Independent scaling per service

### 2. Event-Driven Architecture
- Message queues for async processing
- Event sourcing for audit trails
- CQRS pattern for read/write separation

### 3. Advanced Caching
- Redis for distributed caching
- CDN integration for static content
- Database query result caching

### 4. Monitoring & Observability
- Application performance monitoring
- Distributed tracing
- Centralized logging
- Health check endpoints

This architecture provides a solid foundation for the Quiz Generator application while maintaining flexibility for future enhancements and scaling requirements.