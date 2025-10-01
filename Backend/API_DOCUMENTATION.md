# Thai Meow Vocabulary Game API Documentation

## 🆕 New Lesson-Based Vocabulary API

### 1. Get Lesson Vocabulary
```
GET /api/vocabulary/lesson/:lesson_id?include_audio=true
```

**Query Parameters:**
- `include_audio` (optional): Include AI-generated audio (default: false)

**Response:**
```json
{
  "lesson_id": 1,
  "total_vocab": 44,
  "vocabularies": [
    {
      "_id": "68d11285ff5d72f618c353e6",
      "word": "ก",
      "thai_word": "ก",
      "romanization": "gor",
      "meaning": "chicken",
      "example": "ก ไก่",
      "category": "basic_letters",
      "difficulty": "beginner",
      "lesson_id": 1,
      "audio_url": "/api/audio/41d4bd614b919c4acaeedcbd77ddd60f.mp3",
      "tags": ["consonant", "basic", "thai-alphabet"],
      "audio": {
        "thai_audio": {
          "success": true,
          "audioUrl": "/api/audio/41d4bd614b919c4acaeedcbd77ddd60f.mp3",
          "cached": true
        },
        "english_audio": {
          "success": true,
          "audioUrl": "/api/audio/4096310482565e0db2a582ba3ab8eed6.mp3",
          "cached": false
        },
        "sentence_audio": {
          "success": true,
          "audioUrl": "/api/audio/9296bffdd927bed8c07e3fc6c6f41de7.mp3",
          "cached": true
        }
      }
    }
  ]
}
```

### 2. Get Arrange Sentence Game Data
```
GET /api/vocabulary/game/arrange-sentence/:lesson_id?count=5
```

**Query Parameters:**
- `count` (optional): Number of questions (default: 5)

**Response:**
```json
{
  "lesson_id": 1,
  "game_type": "arrange_sentence",
  "total_questions": 3,
  "questions": [
    {
      "id": "68d11285ff5d72f618c353f5",
      "word": "ฃ",
      "romanization": "kho",
      "meaning": "bottle (เก่า ไม่ใช้แล้ว)",
      "example": "ฃ ขวด (ไม่ใช้แล้ว)",
      "audio_url": "/api/audio/4c2f2e13579fee2759bc98f71c0afcc2.mp3",
      "difficulty": "beginner"
    }
  ]
}
```

### 3. Thai Consonant Lesson Data
The system now includes a complete Thai consonant lesson (Lesson ID: 1) with 44 consonants:
- **Lesson Title:** พยัญชนะพื้นฐาน (Basic Consonants)
- **Level:** Beginner
- **Total Vocabulary:** 44 consonants
- **Features:** 
  - AI TTS audio generation for each consonant
  - Example words for each consonant
  - Romanization and English meanings
  - Game-ready data structure

**Example Consonants:**
- ก (gor) - chicken - ก ไก่
- ข (khor) - egg - ข ไข่
- ค (kho) - buffalo - ค ควาย
- ง (ngor) - snake - ง งู
- And 40 more...

## 🎮 Arrange Sentence Game API

## 🎮 Arrange Sentence Game API

### 1. สร้างเกม Arrange Sentence สำหรับ Beginner
```
GET /api/arrange-sentence/beginner?count=5
```

**Response:**
```json
{
  "game_type": "arrange-sentence",
  "difficulty": "beginner",
  "total_questions": 5,
  "questions": [
    {
      "id": "question_1",
      "vocabulary_id": "68d0321bf6243f22a9880d2c",
      "thai_sentence": "สวัสดี เหมียว",
      "english_sentence": "Hello Meow",
      "romanization": "sà-wàt-dii mǐaw",
      "correct_thai_words": ["สวัสดี", "เหมียว"],
      "correct_english_words": ["Hello", "Meow"],
      "options": [
        {
          "text": "สวัสดี",
          "type": "thai",
          "correct": true,
          "audio_url": "/api/audio/abc123.mp3",
          "audio_available": true
        },
        {
          "text": "หมา",
          "type": "thai",
          "correct": false,
          "audio_url": "/api/audio/def456.mp3",
          "audio_available": true
        }
      ],
      "category": "greetings",
      "difficulty": "beginner",
      "lesson_id": 3,
      "audio": {
        "thai_sentence": "/api/audio/sentence123.mp3",
        "english_sentence": "/api/audio/sentence456.mp3",
        "romanization": "/api/audio/roman789.mp3"
      },
      "image_url": ""
    }
  ],
  "instructions": {
    "thai": "เรียงประโยคให้ถูกต้อง",
    "english": "Arrange the sentence correctly"
  }
}
```

### 2. บันทึกผลการเล่นเกม
```
POST /api/arrange-sentence/submit
```

**Request Body:**
```json
{
  "user_id": "1",
  "questions_answered": [
    {
      "vocabulary_id": "68d0321bf6243f22a9880d2c",
      "correct": true,
      "time_spent": 15
    }
  ],
  "time_taken": 120,
  "total_questions": 5,
  "score": 4
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game result saved successfully",
  "result": {
    "score": 4,
    "total_questions": 5,
    "percentage": 80,
    "time_taken": 120,
    "diamonds_earned": 8,
    "time_bonus": 2,
    "perfect_bonus": 0,
    "correct_words_count": 4,
    "incorrect_words_count": 1
  },
  "user_stats": {
    "total_games": 1,
    "total_diamonds": 8,
    "best_streak": 4,
    "average_percentage": 80
  },
  "game_result_id": "68d0321bf6243f22a9880d2c"
}
```

## 🔊 Audio API

### 1. สร้างเสียงจากข้อความ
```
POST /api/audio/generate
```

**Request Body:**
```json
{
  "text": "สวัสดี",
  "voice": "th-TH-PremwadeeNeural",
  "rate": "1.0",
  "pitch": "1.0"
}
```

**Response:**
```json
{
  "success": true,
  "audio_url": "/api/audio/abc123.mp3",
  "cached": false
}
```

### 2. สร้างเสียงสำหรับคำศัพท์
```
POST /api/audio/vocabulary/:id
```

**Response:**
```json
{
  "success": true,
  "vocabulary_id": "68d0321bf6243f22a9880d2c",
  "thai_word": "สวัสดี",
  "meaning": "hello",
  "audio": {
    "thai_audio": {
      "success": true,
      "audio_url": "/api/audio/thai123.mp3",
      "cached": false
    },
    "english_audio": {
      "success": true,
      "audio_url": "/api/audio/eng456.mp3",
      "cached": false
    },
    "sentence_audio": {
      "success": true,
      "audio_url": "/api/audio/sent789.mp3",
      "cached": false
    }
  }
}
```

### 3. สร้างเสียงสำหรับตัวเลือกในเกม
```
POST /api/audio/game-options
```

**Request Body:**
```json
{
  "options": [
    {
      "text": "สวัสดี",
      "type": "thai",
      "correct": true
    },
    {
      "text": "หมา",
      "type": "thai",
      "correct": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "options": [
    {
      "text": "สวัสดี",
      "type": "thai",
      "correct": true,
      "audio_url": "/api/audio/option123.mp3",
      "audio_index": 0
    },
    {
      "text": "หมา",
      "type": "thai",
      "correct": false,
      "audio_url": "/api/audio/option456.mp3",
      "audio_index": 1
    }
  ]
}
```

### 4. สร้างเสียงสำหรับผลลัพธ์เกม
```
POST /api/audio/feedback
```

**Request Body:**
```json
{
  "correct": true,
  "score": 4,
  "total": 5
}
```

**Response:**
```json
{
  "success": true,
  "feedback": {
    "text": "ดีมาก! คุณทำได้เกือบสมบูรณ์แล้ว!",
    "audio_url": "/api/audio/feedback123.mp3",
    "percentage": 80
  }
}
```

## 📚 Vocabulary API

### 1. ดึงคำศัพท์ตามหมวดหมู่
```
GET /api/vocabulary?category=greetings&difficulty=beginner&limit=10
```

### 2. ค้นหาคำศัพท์
```
GET /api/vocabulary/search/สวัสดี
```

### 3. ดึงสถิติคำศัพท์
```
GET /api/vocabulary/stats/overview
```

## 🎯 Game Features

### Arrange Sentence Game Features:
1. **Audio Integration**: ทุกคำและประโยคมีเสียงอ่าน
2. **Interactive Options**: กดฟังเสียงได้ทุกตัวเลือก
3. **Progress Tracking**: บันทึกความคืบหน้าผู้เล่น
4. **Diamond System**: ระบบแต้มและรางวัล
5. **Difficulty Levels**: ระดับความยากที่แตกต่างกัน
6. **Category Filtering**: กรองตามหมวดหมู่คำศัพท์

### Audio Features:
1. **Text-to-Speech**: แปลงข้อความเป็นเสียง
2. **Caching System**: เก็บไฟล์เสียงเพื่อความเร็ว
3. **Multiple Voices**: รองรับเสียงหลายแบบ
4. **Rate Control**: ควบคุมความเร็วในการอ่าน
5. **Game Integration**: เชื่อมต่อกับเกมทุกประเภท

## 🚀 Usage Example

### Frontend Integration:
```javascript
// 1. ดึงข้อมูลเกม
const gameResponse = await fetch('/api/arrange-sentence/beginner?count=5');
const gameData = await gameResponse.json();

// 2. เล่นเสียงประโยค
const playSentence = (audioUrl) => {
  const audio = new Audio(audioUrl);
  audio.play();
};

// 3. เล่นเสียงตัวเลือก
const playOption = (option) => {
  if (option.audio_available) {
    const audio = new Audio(option.audio_url);
    audio.play();
  }
};

// 4. บันทึกผลการเล่น
const submitGame = async (answers) => {
  const response = await fetch('/api/arrange-sentence/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: '1',
      questions_answered: answers,
      time_taken: 120,
      total_questions: 5,
      score: 4
    })
  });
  return await response.json();
};
```

## 📊 Database Models

### Vocabulary Model:
- `word`: คำศัพท์
- `thai_word`: คำไทย
- `romanization`: การอ่าน
- `meaning`: ความหมาย
- `category`: หมวดหมู่
- `difficulty`: ระดับความยาก
- `usage_examples`: ตัวอย่างการใช้
- `audio_url`: ลิงก์เสียง
- `frequency`: ความถี่การใช้งาน

### GameResult Model:
- `user_id`: ID ผู้เล่น
- `game_type`: ประเภทเกม
- `score`: คะแนน
- `diamonds_earned`: เพชรที่ได้
- `time_taken`: เวลาที่ใช้
- `correct_words`: คำที่ตอบถูก
- `incorrect_words`: คำที่ตอบผิด
