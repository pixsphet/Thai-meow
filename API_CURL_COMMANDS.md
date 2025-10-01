# 🚀 API cURL Commands - MongoDB Atlas Integration

## 📋 Base Configuration

```bash
# Base URL
BASE_URL="http://localhost:3000/api"

# User ID (replace with actual user ID)
USER_ID="68db4ffb42926b9c8645a416"

# Auth Token (get from login response)
AUTH_TOKEN="your_jwt_token_here"
```

---

## 🔧 Test & Health

### Test API Connection
```bash
curl -X GET "$BASE_URL/test"
```

**Expected Response:**
```json
{
  "message": "API is working!",
  "timestamp": "2025-09-30T03:49:12.690Z"
}
```

---

## 👤 User Management

### 1. Register User
```bash
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "username": "newuser",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thai-meow.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "68db4ffb42926b9c8645a416",
    "email": "admin@thai-meow.com",
    "username": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get User Profile
```bash
curl -X GET "$BASE_URL/users/$USER_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

### 4. Update User Profile
```bash
curl -X PUT "$BASE_URL/users/$USER_ID/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "profile": {
      "first_name": "John",
      "last_name": "Doe",
      "bio": "Thai language learner",
      "country": "TH",
      "language": "th"
    }
  }'
```

### 5. Update User Stats
```bash
curl -X PUT "$BASE_URL/users/$USER_ID/stats" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "stats": {
      "total_xp": 150,
      "level": 2,
      "streak": 5,
      "lessons_completed": 3,
      "games_played": 5
    }
  }'
```

---

## 📊 Progress Management

### 1. Get User Progress
```bash
curl -X GET "$BASE_URL/progress/$USER_ID"
```

**Expected Response:**
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
curl -X POST "$BASE_URL/progress/game" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "userId": "'$USER_ID'",
    "gameType": "vocabulary",
    "gameName": "Basic Words",
    "levelName": "Beginner",
    "stageName": "Stage 1",
    "score": 85,
    "maxScore": 100,
    "timeSpent": 120,
    "correctAnswers": 17,
    "totalQuestions": 20
  }'
```

### 3. Get User Achievements
```bash
curl -X GET "$BASE_URL/achievements/user/$USER_ID"
```

### 4. Get Achievement Stats
```bash
curl -X GET "$BASE_URL/achievements/stats/$USER_ID"
```

### 5. Get All Achievements
```bash
curl -X GET "$BASE_URL/achievements"
```

### 6. Check Achievements
```bash
curl -X POST "$BASE_URL/achievements/check/$USER_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

---

## 🎮 Game Data

### 1. Get Vocabulary
```bash
curl -X GET "$BASE_URL/vocabulary"
```

### 2. Get Vocabulary by Category
```bash
curl -X GET "$BASE_URL/vocabulary/category?category=greetings"
```

### 3. Get Vocabulary by Lesson
```bash
curl -X GET "$BASE_URL/vocabulary/lesson?lessonId=$USER_ID"
```

### 4. Search Vocabulary
```bash
curl -X GET "$BASE_URL/vocabulary/search?q=สวัสดี"
```

### 5. Get Games
```bash
curl -X GET "$BASE_URL/games"
```

### 6. Get Games by Level
```bash
curl -X GET "$BASE_URL/games/level?level=beginner"
```

### 7. Get Games by Type
```bash
curl -X GET "$BASE_URL/games/type?type=vocabulary"
```

---

## 📚 Lessons

### 1. Get Lessons
```bash
curl -X GET "$BASE_URL/lessons"
```

### 2. Get Lessons by Level
```bash
curl -X GET "$BASE_URL/lessons/level?level=beginner"
```

### 3. Get Lessons by Category
```bash
curl -X GET "$BASE_URL/lessons/category?category=greetings"
```

---

## 🎵 Audio

### 1. Get Audio
```bash
curl -X GET "$BASE_URL/audio?text=สวัสดี"
```

### 2. Get Simple Audio
```bash
curl -X GET "$BASE_URL/simple-audio?text=สวัสดี"
```

### 3. Get AI Audio
```bash
curl -X POST "$BASE_URL/ai-audio" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "สวัสดี",
    "voice": "th-TH-Standard-A",
    "speed": 1.0,
    "pitch": 1.0,
    "volume": 1.0
  }'
```

---

## 🏆 Leaderboard

### 1. Get Global Leaderboard
```bash
curl -X GET "$BASE_URL/leaderboard?limit=50&sortBy=total_xp"
```

### 2. Get Weekly Leaderboard
```bash
curl -X GET "$BASE_URL/leaderboard/weekly?limit=50"
```

---

## 🎯 Daily Challenges

### 1. Get Daily Challenges
```bash
curl -X GET "$BASE_URL/daily-challenges"
```

### 2. Get User Daily Challenges
```bash
curl -X GET "$BASE_URL/daily-challenges/user/$USER_ID"
```

### 3. Complete Daily Challenge
```bash
curl -X POST "$BASE_URL/daily-challenges/complete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "challengeId": "'$USER_ID'",
    "userId": "'$USER_ID'",
    "score": 85,
    "timeSpent": 120
  }'
```

---

## 🔧 Batch Testing Scripts

### Test All APIs (Bash Script)
```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api"
USER_ID="68db4ffb42926b9c8645a416"

echo "🚀 Testing Thai Meow API..."

# Test connection
echo "1. Testing API connection..."
curl -s "$BASE_URL/test" | jq '.'

# Test progress
echo "2. Testing progress API..."
curl -s "$BASE_URL/progress/$USER_ID" | jq '.'

# Test achievements
echo "3. Testing achievements API..."
curl -s "$BASE_URL/achievements" | jq '.'

# Test vocabulary
echo "4. Testing vocabulary API..."
curl -s "$BASE_URL/vocabulary" | jq '.'

# Test games
echo "5. Testing games API..."
curl -s "$BASE_URL/games" | jq '.'

# Test lessons
echo "6. Testing lessons API..."
curl -s "$BASE_URL/lessons" | jq '.'

echo "✅ All tests completed!"
```

### Test with Authentication (Bash Script)
```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3000/api"
USER_ID="68db4ffb42926b9c8645a416"

echo "🔐 Testing with authentication..."

# Login and get token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@thai-meow.com",
    "password": "admin123"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token
AUTH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "Auth token: $AUTH_TOKEN"

if [ "$AUTH_TOKEN" != "null" ] && [ "$AUTH_TOKEN" != "" ]; then
  # Test authenticated endpoints
  echo "2. Testing authenticated endpoints..."
  
  # Get user profile
  echo "Getting user profile..."
  curl -s -X GET "$BASE_URL/users/$USER_ID" \
    -H "Authorization: Bearer $AUTH_TOKEN" | jq '.'
  
  # Update user stats
  echo "Updating user stats..."
  curl -s -X PUT "$BASE_URL/users/$USER_ID/stats" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "stats": {
        "total_xp": 200,
        "level": 3,
        "streak": 7
      }
    }' | jq '.'
  
  # Update game progress
  echo "Updating game progress..."
  curl -s -X POST "$BASE_URL/progress/game" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d '{
      "userId": "'$USER_ID'",
      "gameType": "vocabulary",
      "gameName": "Test Game",
      "levelName": "Test Level",
      "stageName": "Test Stage",
      "score": 90,
      "maxScore": 100,
      "timeSpent": 100,
      "correctAnswers": 18,
      "totalQuestions": 20
    }' | jq '.'
  
  echo "✅ Authenticated tests completed!"
else
  echo "❌ Failed to get authentication token"
fi
```

---

## 🐛 Error Testing

### Test Invalid Endpoints
```bash
# Test 404
curl -X GET "$BASE_URL/invalid-endpoint"

# Test 401 (without token)
curl -X GET "$BASE_URL/users/$USER_ID"

# Test 400 (invalid data)
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "username": "",
    "password": "123"
  }'
```

### Test Rate Limiting
```bash
# Test multiple rapid requests
for i in {1..10}; do
  echo "Request $i"
  curl -s "$BASE_URL/test" > /dev/null
done
```

---

## 📊 Performance Testing

### Load Test (using Apache Bench)
```bash
# Test 100 requests with 10 concurrent users
ab -n 100 -c 10 "$BASE_URL/test"

# Test progress endpoint
ab -n 50 -c 5 "$BASE_URL/progress/$USER_ID"
```

### Memory Usage Test
```bash
# Monitor memory usage while testing
while true; do
  curl -s "$BASE_URL/progress/$USER_ID" > /dev/null
  sleep 1
done &
PID=$!

# Monitor the process
top -p $PID

# Kill the process
kill $PID
```

---

## 🔍 Debugging

### Verbose cURL
```bash
# Show headers and response
curl -v -X GET "$BASE_URL/test"

# Show only headers
curl -I -X GET "$BASE_URL/test"

# Follow redirects
curl -L -X GET "$BASE_URL/test"
```

### Save Response to File
```bash
# Save response to file
curl -X GET "$BASE_URL/progress/$USER_ID" -o progress_response.json

# Pretty print JSON
curl -X GET "$BASE_URL/progress/$USER_ID" | jq '.' > progress_response.json
```

### Test with Different User Agents
```bash
# Test with different user agents
curl -X GET "$BASE_URL/test" -H "User-Agent: ThaiMeowApp/1.0"
curl -X GET "$BASE_URL/test" -H "User-Agent: PostmanRuntime/7.28.4"
```

---

## 📝 Notes

1. **Replace Variables**: Make sure to replace `$USER_ID` and `$AUTH_TOKEN` with actual values
2. **Server Running**: Ensure the backend server is running on `http://localhost:3000`
3. **MongoDB Connected**: Verify MongoDB Atlas connection is working
4. **jq Installation**: Install `jq` for pretty JSON formatting: `brew install jq` (macOS) or `apt-get install jq` (Ubuntu)
5. **Error Handling**: Check HTTP status codes and error messages
6. **Rate Limiting**: Be mindful of API rate limits in production

---

*Last updated: 2025-09-30*
