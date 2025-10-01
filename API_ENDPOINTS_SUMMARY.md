# 📋 API Endpoints Summary - Thai Meow App

## 🚀 Base URL
```
http://localhost:3000/api
```

---

## 📊 API Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/test` | ❌ | Test API connection |
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/users/:id` | ✅ | Get user profile |
| PUT | `/users/:id/profile` | ✅ | Update user profile |
| PUT | `/users/:id/stats` | ✅ | Update user stats |
| POST | `/users/:id/achievements` | ✅ | Add user achievement |
| POST | `/users/:id/badges` | ✅ | Add user badge |
| GET | `/progress/:userId` | ❌ | Get user progress |
| POST | `/progress/game` | ✅ | Update game progress |
| GET | `/achievements` | ❌ | Get all achievements |
| GET | `/achievements/user/:userId` | ❌ | Get user achievements |
| GET | `/achievements/stats/:userId` | ❌ | Get achievement stats |
| POST | `/achievements/check/:userId` | ✅ | Check achievements |
| GET | `/vocabulary` | ❌ | Get vocabulary |
| GET | `/vocabulary/category` | ❌ | Get vocabulary by category |
| GET | `/vocabulary/lesson` | ❌ | Get vocabulary by lesson |
| GET | `/vocabulary/search` | ❌ | Search vocabulary |
| GET | `/games` | ❌ | Get games |
| GET | `/games/level` | ❌ | Get games by level |
| GET | `/games/type` | ❌ | Get games by type |
| GET | `/lessons` | ❌ | Get lessons |
| GET | `/lessons/level` | ❌ | Get lessons by level |
| GET | `/lessons/category` | ❌ | Get lessons by category |
| GET | `/audio` | ❌ | Get audio |
| GET | `/simple-audio` | ❌ | Get simple audio |
| POST | `/ai-audio` | ❌ | Get AI audio |
| GET | `/leaderboard` | ❌ | Get global leaderboard |
| GET | `/leaderboard/weekly` | ❌ | Get weekly leaderboard |
| GET | `/daily-challenges` | ❌ | Get daily challenges |
| GET | `/daily-challenges/user/:userId` | ❌ | Get user daily challenges |
| POST | `/daily-challenges/complete` | ✅ | Complete daily challenge |

---

## 🔐 Authentication

### Headers Required
```javascript
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

### Token Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGRiNGZmYjQyOTI2YjljODY0NWE0MTYiLCJpYXQiOjE3MzU1NjQ5MTIsImV4cCI6MTczNTY1MTMxMn0.xxxxx
```

---

## 📝 Request/Response Examples

### 1. User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "68db4ffb42926b9c8645a416",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "68db4ffb42926b9c8645a416",
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get User Progress
```bash
GET /api/progress/68db4ffb42926b9c8645a416
```

**Response:**
```json
{
  "user_id": "68db4ffb42926b9c8645a416",
  "total_xp": 0,
  "level": 1,
  "streak": 0,
  "levels": [],
  "games_played": [],
  "categories": [],
  "statistics": {
    "total_play_time": 0,
    "total_games_played": 0,
    "average_score": 0,
    "best_streak": 0,
    "perfect_scores": 0,
    "total_correct_answers": 0,
    "total_questions_answered": 0
  },
  "achievements": [],
  "daily_progress": []
}
```

### 4. Update Game Progress
```bash
POST /api/progress/game
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "68db4ffb42926b9c8645a416",
  "gameType": "vocabulary",
  "gameName": "Basic Words",
  "levelName": "Beginner",
  "stageName": "Stage 1",
  "score": 85,
  "maxScore": 100,
  "timeSpent": 120,
  "correctAnswers": 17,
  "totalQuestions": 20
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game progress updated successfully",
  "progress": {
    "user_id": "68db4ffb42926b9c8645a416",
    "total_xp": 85,
    "level": 1,
    "streak": 1,
    "games_played": [
      {
        "gameType": "vocabulary",
        "gameName": "Basic Words",
        "levelName": "Beginner",
        "stageName": "Stage 1",
        "score": 85,
        "maxScore": 100,
        "timeSpent": 120,
        "correctAnswers": 17,
        "totalQuestions": 20,
        "played_at": "2025-09-30T03:49:12.690Z"
      }
    ]
  }
}
```

### 5. Get Vocabulary
```bash
GET /api/vocabulary
```

**Response:**
```json
[
  {
    "id": "68db4ffb42926b9c8645a416",
    "thai_word": "สวัสดี",
    "english_meaning": "Hello",
    "romanization": "sa-wat-dee",
    "category": "greetings",
    "level": "beginner",
    "audio_url": "https://example.com/audio/sawasdee.mp3"
  }
]
```

### 6. Get Achievements
```bash
GET /api/achievements
```

**Response:**
```json
[
  {
    "id": "68db4ffb42926b9c8645a416",
    "achievement_id": "first_game",
    "name": "First Game",
    "description": "Complete your first game",
    "points": 10,
    "category": "milestone",
    "icon": "🎮",
    "color": "#4CAF50",
    "rarity": "common",
    "is_active": true
  }
]
```

---

## 🚨 Error Responses

### Common Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Examples

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Email is required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error",
  "error": "Database connection failed"
}
```

---

## 🔧 Query Parameters

### Vocabulary Endpoints
- `category` - Filter by category (e.g., "greetings", "numbers")
- `level` - Filter by level (e.g., "beginner", "intermediate", "advanced")
- `limit` - Limit number of results (default: 50)
- `offset` - Skip number of results (default: 0)

### Game Endpoints
- `level` - Filter by level
- `type` - Filter by game type (e.g., "vocabulary", "grammar")
- `limit` - Limit number of results
- `offset` - Skip number of results

### Lesson Endpoints
- `level` - Filter by level
- `category` - Filter by category
- `limit` - Limit number of results
- `offset` - Skip number of results

### Leaderboard Endpoints
- `limit` - Number of results (default: 50)
- `sortBy` - Sort field (e.g., "total_xp", "level", "streak")
- `order` - Sort order ("asc" or "desc", default: "desc")

### Search Endpoints
- `q` - Search query
- `limit` - Limit number of results
- `offset` - Skip number of results

---

## 📱 Frontend Integration

### JavaScript/React Native
```javascript
import apiClient from './services/apiClient';

// Get user progress
const userProgress = await apiClient.getUserProgress(userId);

// Update game progress
const gameData = {
  userId: userId,
  gameType: 'vocabulary',
  gameName: 'Basic Words',
  score: 85,
  maxScore: 100
};
await apiClient.updateGameProgress(gameData);

// Get vocabulary
const vocabulary = await apiClient.getVocabulary({ category: 'greetings' });
```

### Error Handling
```javascript
try {
  const response = await apiClient.getUserProgress(userId);
  console.log('Success:', response);
} catch (error) {
  console.error('Error:', error.message);
  // Handle error (show user message, retry, etc.)
}
```

---

## 🧪 Testing

### Test All Endpoints
```bash
# Test connection
curl http://localhost:3000/api/test

# Test progress
curl http://localhost:3000/api/progress/68db4ffb42926b9c8645a416

# Test achievements
curl http://localhost:3000/api/achievements
```

### Postman Collection
Import the `Thai_Meow_API_Collection.postman_collection.json` file into Postman for easy testing.

---

## 📊 Rate Limiting

- **Unauthenticated requests**: 100 requests per minute
- **Authenticated requests**: 1000 requests per minute
- **Burst limit**: 10 requests per second

---

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- CORS enabled for localhost:3000
- Input validation on all endpoints
- SQL injection protection (MongoDB)

---

## 📈 Performance

- **Average response time**: < 200ms
- **Database queries**: Optimized with indexes
- **Caching**: Redis for frequently accessed data
- **Compression**: Gzip enabled

---

*Last updated: 2025-09-30*
