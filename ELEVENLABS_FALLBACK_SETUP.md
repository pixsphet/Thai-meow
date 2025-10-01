# 🔧 ElevenLabs Fallback Setup Guide

## 🚨 **ปัญหาปัจจุบัน:**
- ElevenLabs API key ไม่ได้ตั้งค่า
- ระบบจะใช้ Expo Speech เป็น fallback
- TTS ยังทำงานได้แต่คุณภาพต่ำกว่า

## 🔑 **การตั้งค่า ElevenLabs API Key:**

### 1. สร้าง ElevenLabs Account
```bash
# ไปที่ https://elevenlabs.io/
# สร้าง account และรับ API key
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `Backend/.env`:
```env
# ElevenLabs API Configuration
ELEVENLABS_API_KEY=sk-your-actual-api-key-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=supersecretjwtkey

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Restart Server
```bash
cd Backend
node server.js
```

## 🎯 **TTS System ปัจจุบัน:**

### **Fallback Mode (ไม่มี API Key)**
```
1. ElevenLabs TTS (ไม่พร้อมใช้งาน)
   ├── Status: ❌ Not initialized
   ├── Reason: No API key
   └── Response: 503 Service Unavailable

2. Expo Speech (Fallback)
   ├── Language: th-TH
   ├── Rate: 0.8
   └── Status: ✅ Working
```

### **Full Mode (มี API Key)**
```
1. ElevenLabs TTS (Primary)
   ├── Model: eleven_turbo_v2_5
   ├── Voice: Adam (pNInz6obpgDQGcFmaJgB)
   ├── Language: Thai (th)
   └── Status: ✅ Working

2. Expo Speech (Fallback)
   ├── Language: th-TH
   ├── Rate: 0.8
   └── Status: ✅ Working
```

## 🔍 **การทดสอบ:**

### 1. ทดสอบ Fallback Mode
```bash
# ตรวจสอบสถานะ
curl -X GET "http://localhost:3000/api/elevenlabs/status"
# Expected: {"status":"error","message":"Client not initialized - Please check API key","fallback":true}

# ทดสอบ TTS
curl -X POST "http://localhost:3000/api/elevenlabs/speak" \
  -H "Content-Type: application/json" \
  -d '{"text": "สวัสดี"}'
# Expected: {"success":false,"message":"ElevenLabs not available, please use fallback TTS","fallback":true}
```

### 2. ทดสอบ Full Mode (หลังตั้งค่า API Key)
```bash
# ตรวจสอบสถานะ
curl -X GET "http://localhost:3000/api/elevenlabs/status"
# Expected: {"status":"success","message":"API working. Found X voices","voices":X}

# ทดสอบ TTS
curl -X POST "http://localhost:3000/api/elevenlabs/speak" \
  -H "Content-Type: application/json" \
  -d '{"text": "สวัสดี"}'
# Expected: {"success":true,"message":"Speech generated successfully","audioPath":"/path/to/audio.mp3"}
```

## 📱 **การทำงานในแอป:**

### **Fallback Mode**
- ✅ TTS ทำงานได้ด้วย Expo Speech
- ⚠️ คุณภาพเสียงต่ำกว่า ElevenLabs
- ✅ ไม่ต้องตั้งค่า API key
- ✅ ทำงานได้ทันที

### **Full Mode**
- ✅ TTS ทำงานได้ด้วย ElevenLabs
- ✅ คุณภาพเสียงสูง
- ✅ รองรับ emotion และ style
- ✅ มี caching
- ⚠️ ต้องตั้งค่า API key

## 🎮 **การใช้งานในเกม:**

### **ThaiConsonantsGame**
```javascript
// ระบบจะลอง ElevenLabs ก่อน
await elevenLabsTtsService.playThai('ก ไก่');

// ถ้า ElevenLabs ไม่พร้อม จะใช้ Expo Speech
// ไม่ต้องแก้ไขโค้ดเพิ่มเติม
```

### **NewLessonGame**
```javascript
// ระบบจะลอง ElevenLabs ก่อน
await elevenLabsTtsService.playThai('สวัสดี');

// ถ้า ElevenLabs ไม่พร้อม จะใช้ Expo Speech
// ไม่ต้องแก้ไขโค้ดเพิ่มเติม
```

## 🔧 **Troubleshooting:**

### 1. "Client not initialized" Error
```bash
# ตรวจสอบ API key
echo $ELEVENLABS_API_KEY

# ตรวจสอบ .env file
cat Backend/.env
```

### 2. "TTS generation failed" Error
```bash
# ตรวจสอบ API status
curl -X GET "http://localhost:3000/api/elevenlabs/status"

# ตรวจสอบ network
ping api.elevenlabs.io
```

### 3. Frontend TTS Not Working
```javascript
// ตรวจสอบ console logs
console.log('TTS Error:', error);

// ตรวจสอบ API response
console.log('API Response:', response);
```

## 📊 **Performance Comparison:**

### **ElevenLabs TTS**
- **Quality**: ⭐⭐⭐⭐⭐ (Excellent)
- **Speed**: ⭐⭐⭐⭐ (Fast with caching)
- **Thai Support**: ⭐⭐⭐⭐⭐ (Excellent)
- **Emotion**: ⭐⭐⭐⭐⭐ (Full control)
- **Cost**: 💰 (Requires API key)

### **Expo Speech**
- **Quality**: ⭐⭐⭐ (Good)
- **Speed**: ⭐⭐⭐⭐⭐ (Very fast)
- **Thai Support**: ⭐⭐⭐ (Basic)
- **Emotion**: ⭐ (Limited)
- **Cost**: 🆓 (Free)

## 🎉 **สรุป:**

### **สำหรับ Development:**
- ใช้ Expo Speech fallback ได้เลย
- ไม่ต้องตั้งค่า API key
- TTS ทำงานได้ทันที

### **สำหรับ Production:**
- ตั้งค่า ElevenLabs API key
- ได้คุณภาพเสียงที่ดีกว่า
- รองรับ emotion และ style

---

**Happy coding! 🎤✨**
