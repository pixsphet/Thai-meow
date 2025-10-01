# 🎤 ElevenLabs Only TTS Setup

## 📋 Overview
ระบบ TTS ใหม่ที่ใช้เฉพาะ **ElevenLabs** เป็นหลัก และ **Expo Speech** เป็น fallback เท่านั้น

## ✅ **การเปลี่ยนแปลงที่ทำ:**

### 1. **ลบ AI TTS Services อื่นๆ**
- ❌ `aiForThaiTtsService.js` - ลบแล้ว
- ❌ `aiSpeechService.js` - ลบแล้ว  
- ❌ `aiTtsService.js` (Backend) - ลบแล้ว
- ❌ `ttsService.js` (Backend) - ลบแล้ว

### 2. **อัปเดต ElevenLabs Service**
- ✅ ใช้ `ElevenLabsClient` และ `stream` API ใหม่
- ✅ ใช้ `eleven_turbo_v2_5` model (แทน v1 ที่จะถูกยกเลิก)
- ✅ ใช้ `textToSpeech.stream()` API
- ✅ ปรับปรุง voice settings สำหรับภาษาไทย

### 3. **อัปเดต Frontend Services**
- ✅ `elevenLabsTtsService.js` - ใช้เฉพาะ ElevenLabs + Expo Speech fallback
- ✅ `elevenLabsService.js` - Frontend API client สำหรับ ElevenLabs
- ✅ ลบ fallback ไปยัง AI TTS อื่นๆ

### 4. **อัปเดต Game Screens**
- ✅ `ThaiConsonantsGame.js` - ใช้เฉพาะ ElevenLabs
- ✅ `NewLessonGame.js` - ใช้เฉพาะ ElevenLabs
- ✅ ลบ import `aiForThaiTtsService`

## 🎯 **TTS Hierarchy ใหม่:**

```
1. ElevenLabs TTS (Primary)
   ├── Model: eleven_turbo_v2_5
   ├── Voice: Adam (pNInz6obpgDQGcFmaJgB)
   ├── Language: Thai (th)
   └── Features: High quality, emotion, caching

2. Expo Speech (Fallback)
   ├── Language: th-TH
   ├── Rate: 0.8
   └── Features: Local device TTS
```

## 🔧 **การตั้งค่า API Key**

### 1. สร้าง ElevenLabs Account
```bash
# ไปที่ https://elevenlabs.io/
# สร้าง account และรับ API key
```

### 2. ตั้งค่า Environment Variables
```env
# Backend/.env
ELEVENLABS_API_KEY=sk-your-actual-api-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=supersecretjwtkey
PORT=3000
```

### 3. ทดสอบ API
```bash
# ตรวจสอบสถานะ
curl -X GET "http://localhost:3000/api/elevenlabs/status"

# ทดสอบ TTS
curl -X POST "http://localhost:3000/api/elevenlabs/speak" \
  -H "Content-Type: application/json" \
  -d '{"text": "สวัสดี"}'
```

## 📊 **Voice Settings**

### ElevenLabs Configuration
```javascript
{
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
  modelId: 'eleven_turbo_v2_5',    // Latest model
  stability: 0.5,                  // Balanced
  similarityBoost: 0.8,            // Enhanced for Thai
  style: 0.2,                      // Slight emotion
  useSpeakerBoost: true,           // Enhanced clarity
  languageCode: 'th'               // Thai language
}
```

### Expo Speech Fallback
```javascript
{
  language: 'th-TH',
  pitch: 1.0,
  rate: 0.8
}
```

## 🎮 **การใช้งานใน Game Screens**

### ThaiConsonantsGame
```javascript
import elevenLabsTtsService from '../services/elevenLabsTtsService';

const speakText = async (text, language = 'th-TH') => {
  try {
    // ใช้ ElevenLabs TTS
    await elevenLabsTtsService.playThai(text, {
      language: language,
      emotion: 'happy'
    });
  } catch (error) {
    // Fallback to Expo Speech
    await Speech.speak(text, { language: 'th-TH' });
  }
};
```

### NewLessonGame
```javascript
import elevenLabsTtsService from '../services/elevenLabsTtsService';

const speakText = async (text) => {
  try {
    await elevenLabsTtsService.playThai(text);
  } catch (error) {
    console.error('TTS Error:', error);
  }
};
```

## 🚀 **การทดสอบ**

### 1. ทดสอบ Backend API
```bash
cd Backend
node server.js

# ใน terminal อื่น
curl -X GET "http://localhost:3000/api/elevenlabs/status"
```

### 2. ทดสอบ Frontend
```bash
cd Frontend/thai-meow
npm start

# เปิดแอปและทดสอบ TTS ในเกม
```

### 3. ทดสอบ Caching
```bash
# ตรวจสอบ cache
curl -X GET "http://localhost:3000/api/elevenlabs/cache"

# ล้าง cache
curl -X DELETE "http://localhost:3000/api/elevenlabs/cache"
```

## 📈 **Performance Benefits**

### ElevenLabs Advantages
- **High Quality**: AI-generated voice ที่เป็นธรรมชาติ
- **Thai Support**: รองรับภาษาไทยได้ดี
- **Emotion Control**: ควบคุมอารมณ์ในการพูด
- **Caching**: เก็บไฟล์เสียงไว้ใช้ซ้ำ
- **Streaming**: ใช้ stream API สำหรับ latency ต่ำ

### Fallback Benefits
- **Reliability**: มี fallback เมื่อ API ไม่พร้อม
- **Offline**: ใช้ได้แม้ไม่มี internet
- **Fast**: เร็วเมื่อใช้ local TTS

## 🔍 **Troubleshooting**

### Common Issues

#### 1. "Client not initialized" Error
```bash
# ตรวจสอบ API key
echo $ELEVENLABS_API_KEY

# ตรวจสอบ .env file
cat Backend/.env
```

#### 2. "TTS generation failed" Error
```bash
# ตรวจสอบ API status
curl -X GET "http://localhost:3000/api/elevenlabs/status"

# ตรวจสอบ network connection
ping api.elevenlabs.io
```

#### 3. Frontend TTS Not Working
```javascript
// ตรวจสอบ console logs
console.log('TTS Error:', error);

// ตรวจสอบ API response
console.log('API Response:', response);
```

## 📝 **Next Steps**

### 1. ตั้งค่า API Key
- สร้าง ElevenLabs account
- ใส่ API key ใน `.env`
- ทดสอบ API

### 2. ปรับแต่ง Voice Settings
- ลองใช้ voice อื่นๆ
- ปรับ stability และ similarityBoost
- ทดสอบ emotion styles

### 3. เพิ่ม Features
- Voice selection UI
- Emotion controls
- Speed controls
- Cache management

## 🎉 **สรุป**

ระบบ TTS ใหม่ใช้เฉพาะ **ElevenLabs** เป็นหลัก และ **Expo Speech** เป็น fallback เท่านั้น ทำให้:

- **คุณภาพเสียงดีขึ้น** - ใช้ AI voice ที่เป็นธรรมชาติ
- **รองรับภาษาไทยดีขึ้น** - ใช้ model ใหม่ที่รองรับภาษาไทย
- **ระบบง่ายขึ้น** - ไม่มี TTS services หลายตัว
- **Performance ดีขึ้น** - ใช้ stream API และ caching
- **Reliability ดีขึ้น** - มี fallback ที่เชื่อถือได้

---

**Happy coding! 🎤✨**
