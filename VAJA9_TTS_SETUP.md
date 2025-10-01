# 🎤 Vaja9 TTS Setup Guide

## 📋 Overview
ระบบ TTS ใหม่ที่ใช้ **Vaja9** เป็นหลัก และ **Expo Speech** เป็น fallback

## ✅ **การเปลี่ยนแปลงที่ทำ:**

### 1. **สร้าง Vaja9 TTS Service**
- ✅ `vaja9TtsService.js` - Service หลักสำหรับ Vaja9 TTS
- ✅ รองรับ emotion และ voice selection
- ✅ มี fallback ไปยัง Expo Speech
- ✅ รองรับการตั้งค่า speed, pitch, volume

### 2. **อัปเดต Frontend Screens**
- ✅ `ThaiConsonantsGame.js` - ใช้ Vaja9 TTS
- ✅ `NewLessonGame.js` - ใช้ Vaja9 TTS
- ✅ `ArrangeSentenceScreen.js` - ใช้ Vaja9 TTS
- ✅ ลบ import `elevenLabsTtsService`

### 3. **TTS Hierarchy ใหม่**
```
1. Vaja9 TTS (Primary)
   ├── API: https://api.vaja9.com
   ├── Voices: Thai Female/Male + Emotions
   ├── Features: High quality, emotion control
   └── Fallback: Expo Speech

2. Expo Speech (Fallback)
   ├── Language: th-TH
   ├── Rate: 0.8
   └── Features: Local device TTS
```

## 🎯 **Vaja9 TTS Features:**

### **Voice Options**
```javascript
const voices = [
  { id: 'thai-female', name: 'Thai Female' },
  { id: 'thai-male', name: 'Thai Male' },
  { id: 'thai-female-happy', name: 'Thai Female Happy' },
  { id: 'thai-female-sad', name: 'Thai Female Sad' },
  { id: 'thai-female-angry', name: 'Thai Female Angry' },
  { id: 'thai-female-excited', name: 'Thai Female Excited' },
  { id: 'thai-female-calm', name: 'Thai Female Calm' }
];
```

### **Emotion Support**
```javascript
// Happy emotion
await vaja9TtsService.speakWithEmotion('สวัสดี', 'happy');

// Sad emotion
await vaja9TtsService.speakWithEmotion('เสียใจ', 'sad');

// Excited emotion
await vaja9TtsService.speakWithEmotion('ยินดี!', 'excited');
```

### **Speed Control**
```javascript
// Slow speech
await vaja9TtsService.speakSlowly('สวัสดี');

// Fast speech
await vaja9TtsService.speakQuickly('สวัสดี');

// Custom speed
await vaja9TtsService.playThai('สวัสดี', { speed: 0.8 });
```

## 🔧 **การตั้งค่า API Key:**

### 1. สร้าง Vaja9 Account
```bash
# ไปที่ https://vaja9.com/
# สร้าง account และรับ API key
```

### 2. ตั้งค่า API Key
```javascript
import vaja9TtsService from '../services/vaja9TtsService';

// ตั้งค่า API key
vaja9TtsService.setApiKey('your-vaja9-api-key-here');
```

## 🎮 **การใช้งานในเกม:**

### **ThaiConsonantsGame**
```javascript
import vaja9TtsService from '../services/vaja9TtsService';

const speakText = async (text, language = 'th-TH') => {
  try {
    // ใช้ Vaja9 TTS
    await vaja9TtsService.playThai(text, {
      language: language,
      emotion: 'happy'
    });
  } catch (error) {
    // Fallback to Expo Speech
    await Speech.speak(text, { language: 'th-TH' });
  }
};
```

### **NewLessonGame**
```javascript
import vaja9TtsService from '../services/vaja9TtsService';

const speakText = async (text) => {
  try {
    await vaja9TtsService.playThai(text);
  } catch (error) {
    console.error('TTS Error:', error);
  }
};
```

### **ArrangeSentenceScreen**
```javascript
import vaja9TtsService from '../services/vaja9TtsService';

const playAudio = async (text, emotion = 'neutral') => {
  if (text) {
    try {
      await vaja9TtsService.playThai(text, {
        speed: 0.9,
        pitch: 1.0,
        emotion: emotion
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};
```

## 📊 **Performance Benefits:**

### **Vaja9 TTS Advantages**
- **High Quality**: AI-generated voice ที่เป็นธรรมชาติ
- **Thai Support**: รองรับภาษาไทยได้ดี
- **Emotion Control**: ควบคุมอารมณ์ในการพูด
- **Multiple Voices**: มีเสียงผู้ชาย/ผู้หญิง
- **Speed Control**: ควบคุมความเร็วในการพูด

### **Fallback Benefits**
- **Reliability**: มี fallback เมื่อ API ไม่พร้อม
- **Offline**: ใช้ได้แม้ไม่มี internet
- **Fast**: เร็วเมื่อใช้ local TTS

## 🔍 **การทดสอบ:**

### 1. ทดสอบ Vaja9 TTS
```javascript
// ทดสอบการพูด
await vaja9TtsService.playThai('สวัสดี');

// ทดสอบ emotion
await vaja9TtsService.speakWithEmotion('ยินดี!', 'happy');

// ทดสอบ speed
await vaja9TtsService.speakSlowly('สวัสดี');
```

### 2. ทดสอบ API Status
```javascript
// ตรวจสอบสถานะ API
const status = await vaja9TtsService.checkStatus();
console.log('Vaja9 Status:', status);
```

### 3. ทดสอบ Voices
```javascript
// ดู voices ที่มี
const voices = vaja9TtsService.getVaja9Voices();
console.log('Available voices:', voices);
```

## 🚀 **การใช้งาน:**

### **Basic Usage**
```javascript
import vaja9TtsService from '../services/vaja9TtsService';

// พูดข้อความธรรมดา
await vaja9TtsService.playThai('สวัสดี');

// พูดด้วย emotion
await vaja9TtsService.speakWithEmotion('ดีมาก!', 'happy');

// พูดช้า
await vaja9TtsService.speakSlowly('ก ไก่');
```

### **Advanced Usage**
```javascript
// ตั้งค่า custom
await vaja9TtsService.playThai('สวัสดี', {
  voice: 'thai-female-happy',
  speed: 0.8,
  pitch: 1.1,
  volume: 1.0
});
```

## 🔧 **Troubleshooting:**

### Common Issues

#### 1. "API error" Error
```javascript
// ตรวจสอบ API key
console.log('API Key:', vaja9TtsService.apiKey);

// ตั้งค่า API key
vaja9TtsService.setApiKey('your-api-key');
```

#### 2. "Network error" Error
```javascript
// ตรวจสอบ network connection
fetch('https://api.vaja9.com/status')
  .then(response => console.log('Network OK'))
  .catch(error => console.log('Network Error:', error));
```

#### 3. "TTS failed" Error
```javascript
// ตรวจสอบ fallback
try {
  await vaja9TtsService.playThai('สวัสดี');
} catch (error) {
  console.log('Vaja9 failed, using fallback');
  // Fallback จะทำงานอัตโนมัติ
}
```

## 📝 **Next Steps:**

### 1. ตั้งค่า API Key
- สร้าง Vaja9 account
- ใส่ API key ในแอป
- ทดสอบ TTS

### 2. ปรับแต่ง Voices
- ลองใช้ voice อื่นๆ
- ปรับ emotion styles
- ทดสอบ speed controls

### 3. เพิ่ม Features
- Voice selection UI
- Emotion controls
- Speed controls
- Volume controls

## 🎉 **สรุป:**

ระบบ TTS ใหม่ใช้ **Vaja9** เป็นหลัก และ **Expo Speech** เป็น fallback ทำให้:

- **คุณภาพเสียงดีขึ้น** - ใช้ AI voice ที่เป็นธรรมชาติ
- **รองรับภาษาไทยดีขึ้น** - ใช้ service ที่รองรับภาษาไทย
- **มี emotion control** - ควบคุมอารมณ์ในการพูด
- **มี multiple voices** - เสียงผู้ชาย/ผู้หญิง
- **มี speed control** - ควบคุมความเร็วในการพูด
- **มี fallback** - ใช้ Expo Speech เมื่อจำเป็น

---

**Happy coding! 🎤✨**
