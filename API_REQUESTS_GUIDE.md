# 🚀 API Requests Guide - MongoDB Atlas Integration

## 📋 Overview
คู่มือการใช้งาน API สำหรับเชื่อมต่อกับ MongoDB Atlas ใน Thai Meow App

---

## 🔧 Base Configuration

### Base URL
```
http://localhost:3000/api
```

### Headers (สำหรับ authenticated requests)
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

---

## 👤 User Management APIs

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
    "username": "username",
    "created_at": "2025-09-30T03:49:12.690Z"
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

### 3. Get User Profile
```bash
GET /api/users/68db4ffb42926b9c8645a416
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "68db4ffb42926b9c8645a416",
    "email": "user@example.com",
    "username": "username",
    "profile": {
      "first_name": "",
      "last_name": "",
      "avatar": "default_avatar.png",
      "bio": "",
      "country": "TH",
      "language": "th"
    },
    "stats": {
      "total_xp": 0,
      "level": 1,
      "streak": 0,
      "lessons_completed": 0,
      "games_played": 0
    }
  }
}
```

### 4. Update User Profile
```bash
PUT /api/users/68db4ffb42926b9c8645a416/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "profile": {
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Thai language learner"
  }
}
```

### 5. Update User Stats
```bash
PUT /api/users/68db4ffb42926b9c8645a416/stats
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "stats": {
    "total_xp": 150,
    "level": 2,
    "streak": 5
  }
}
```

---

## 📊 Progress Management APIs

### 1. Get User Progress
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

### 2. Update Game Progress
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

### 3. Get User Achievements
```bash
GET /api/achievements/user/68db4ffb42926b9c8645a416
```

**Response:**
```json
[
  {
    "achievement_id": "first_game",
    "achievement_name": "First Game",
    "description": "Complete your first game",
    "points": 10,
    "category": "milestone",
    "icon": "🎮",
    "color": "#4CAF50",
    "rarity": "common",
    "unlocked_at": "2025-09-30T03:49:12.690Z"
  }
]
```

### 4. Get Achievement Stats
```bash
GET /api/achievements/stats/68db4ffb42926b9c8645a416
```

**Response:**
```json
{
  "total_achievements": 15,
  "unlocked_achievements": 3,
  "completion_percentage": 20,
  "total_points": 150,
  "recent_achievements": [
    {
      "achievement_id": "first_game",
      "achievement_name": "First Game",
      "unlocked_at": "2025-09-30T03:49:12.690Z"
    }
  ]
}
```

---

## 🎮 Game Data APIs

### 1. Get Vocabulary
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

### 2. Get Vocabulary by Category
```bash
GET /api/vocabulary/category?category=greetings
```

### 3. Get Vocabulary by Lesson
```bash
GET /api/vocabulary/lesson?lessonId=68db4ffb42926b9c8645a416
```

### 4. Search Vocabulary
```bash
GET /api/vocabulary/search?q=สวัสดี
```

---

## 🎯 Game APIs

### 1. Get Games
```bash
GET /api/games
```

### 2. Get Games by Level
```bash
GET /api/games/level?level=beginner
```

### 3. Get Games by Type
```bash
GET /api/games/type?type=vocabulary
```

---

## 📚 Lesson APIs

### 1. Get Lessons
```bash
GET /api/lessons
```

### 2. Get Lessons by Level
```bash
GET /api/lessons/level?level=beginner
```

### 3. Get Lessons by Category
```bash
GET /api/lessons/category?category=greetings
```

---

## 🎵 Audio APIs

### 1. Get Audio
```bash
GET /api/audio?text=สวัสดี
```

### 2. Simple Audio
```bash
GET /api/simple-audio?text=สวัสดี
```

### 3. AI Audio
```bash
POST /api/ai-audio
Content-Type: application/json

{
  "text": "สวัสดี",
  "voice": "th-TH-Standard-A",
  "speed": 1.0
}
```

---

## 🏆 Leaderboard APIs

### 1. Get Global Leaderboard
```bash
GET /api/leaderboard?limit=50&sortBy=total_xp
```

**Response:**
```json
[
  {
    "user_id": "68db4ffb42926b9c8645a416",
    "username": "username",
    "total_xp": 1500,
    "level": 10,
    "rank": 1
  }
]
```

### 2. Get Weekly Leaderboard
```bash
GET /api/leaderboard/weekly?limit=50
```

---

## 🎯 Daily Challenges APIs

### 1. Get Daily Challenges
```bash
GET /api/daily-challenges
```

### 2. Get User Daily Challenges
```bash
GET /api/daily-challenges/user/68db4ffb42926b9c8645a416
```

### 3. Complete Daily Challenge
```bash
POST /api/daily-challenges/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "challengeId": "68db4ffb42926b9c8645a416",
  "userId": "68db4ffb42926b9c8645a416",
  "score": 85,
  "timeSpent": 120
}
```

---

## 🔧 JavaScript/React Native Examples

### 1. API Service Class
```javascript
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await AsyncStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
```

### 2. Usage Examples
```javascript
import apiService from './apiService';

// Register user
const registerUser = async (userData) => {
  try {
    const response = await apiService.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Login user
const loginUser = async (credentials) => {
  try {
    const response = await apiService.post('/auth/login', credentials);
    // Store token
    await AsyncStorage.setItem('authToken', response.token);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Get user progress
const getUserProgress = async (userId) => {
  try {
    const response = await apiService.get(`/progress/${userId}`);
    return response;
  } catch (error) {
    console.error('Failed to get progress:', error);
    throw error;
  }
};

// Update game progress
const updateGameProgress = async (gameData) => {
  try {
    const response = await apiService.post('/progress/game', gameData);
    return response;
  } catch (error) {
    console.error('Failed to update progress:', error);
    throw error;
  }
};

// Get vocabulary
const getVocabulary = async (params = {}) => {
  try {
    const response = await apiService.get('/vocabulary', params);
    return response;
  } catch (error) {
    console.error('Failed to get vocabulary:', error);
    throw error;
  }
};
```

---

## 🚨 Error Handling

### Common Error Responses
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

---

## 🔐 Authentication Flow

### 1. Register/Login
```javascript
// 1. Register or login
const authResponse = await apiService.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// 2. Store token
await AsyncStorage.setItem('authToken', authResponse.token);

// 3. Use token in subsequent requests
const userProfile = await apiService.get(`/users/${authResponse.user.id}`);
```

### 2. Token Refresh
```javascript
// Check if token is expired and refresh if needed
const refreshToken = async () => {
  try {
    const response = await apiService.post('/auth/refresh');
    await AsyncStorage.setItem('authToken', response.token);
    return response.token;
  } catch (error) {
    // Redirect to login
    await AsyncStorage.removeItem('authToken');
    navigation.navigate('Login');
  }
};
```

---

## 📱 React Native Integration

### 1. Install Dependencies
```bash
npm install @react-native-async-storage/async-storage
npm install axios
```

### 2. Environment Configuration
```javascript
// config/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
```

### 3. Context Integration
```javascript
// contexts/ApiContext.js
import React, { createContext, useContext } from 'react';
import apiService from '../services/apiService';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const value = {
    apiService,
    // Add other API-related functions
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
};
```

---

## 🎯 Best Practices

### 1. Error Handling
- Always wrap API calls in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging

### 2. Loading States
- Show loading indicators during API calls
- Disable buttons during requests
- Handle network timeouts

### 3. Caching
- Cache frequently accessed data
- Implement offline support
- Use optimistic updates

### 4. Security
- Never store sensitive data in AsyncStorage
- Validate all inputs
- Use HTTPS in production

---

## 🔧 Testing

### 1. Test API Endpoints
```bash
# Test server
curl http://localhost:3000/api/test

# Test progress
curl http://localhost:3000/api/progress/68db4ffb42926b9c8645a416

# Test achievements
curl http://localhost:3000/api/achievements
```

### 2. Test with Postman
- Import the API collection
- Set up environment variables
- Test all endpoints

---

## 📞 Support

หากมีปัญหาหรือคำถามเกี่ยวกับ API:
1. ตรวจสอบ server logs
2. ตรวจสอบ network connectivity
3. ตรวจสอบ authentication token
4. ตรวจสอบ request format

---

*Last updated: 2025-09-30*
