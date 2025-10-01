# AI For Thai API Setup Guide

## 1. ลงทะเบียน AI For Thai

1. ไปที่ [AI For Thai](https://www.aiforthai.in.th)
2. สมัครสมาชิกหรือเข้าสู่ระบบ
3. ไปที่หน้า "API Keys" หรือ "Developer"
4. สร้าง API Key ใหม่

## 2. รับ API Key

1. **Login** เข้าสู่ระบบ AI For Thai
2. ไปที่ **"API Keys"** หรือ **"Developer Console"**
3. คลิก **"Create New API Key"**
4. ตั้งชื่อ API Key: `thai-meow-app`
5. เลือก permissions:
   - ✅ **VAJA TTS**: Text-to-Speech
   - ✅ **NLP**: Natural Language Processing
   - ✅ **Translation**: Machine Translation
6. คัดลอก API Key ที่ได้

## 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `Frontend/thai-meow`:

```env
# AI For Thai API Configuration
EXPO_PUBLIC_AI_FOR_THAI_API_KEY=your-actual-api-key-here
EXPO_PUBLIC_AI_FOR_THAI_BASE_URL=https://api.aiforthai.in.th

# Backend API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# App Configuration
EXPO_PUBLIC_APP_NAME=Thai Meow
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 4. ตรวจสอบ API Endpoints

### VAJA TTS API
```
POST https://api.aiforthai.in.th/vaja/tts
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY
  apikey: YOUR_API_KEY

Body:
{
  "text": "สวัสดี",
  "voice": "th-TH-Standard-A",
  "speed": 1.0,
  "pitch": 1.0,
  "volume": 1.0,
  "format": "wav"
}
```

### NLP API
```
POST https://api.aiforthai.in.th/nlp/word-segmentation
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY
  apikey: YOUR_API_KEY

Body:
{
  "text": "สวัสดีครับ"
}
```

## 5. ทดสอบการเชื่อมต่อ

```bash
cd Frontend/thai-meow
npm run test-ai-for-thai
```

## 6. ฟีเจอร์ที่รองรับ

### Text-to-Speech (VAJA)
- ✅ **เสียงภาษาไทย**: คุณภาพสูง
- ✅ **เสียงภาษาอังกฤษ**: รองรับ
- ✅ **การปรับแต่ง**: Speed, Pitch, Volume
- ✅ **Emotion**: Happy, Sad, Excited, Calm
- ✅ **Format**: WAV, MP3

### Natural Language Processing
- ✅ **Word Segmentation**: ตัดคำภาษาไทย
- ✅ **POS Tagging**: ระบุชนิดคำ
- ✅ **Named Entity Recognition**: ระบุชื่อเฉพาะ
- ✅ **Sentiment Analysis**: วิเคราะห์ความรู้สึก

### Machine Translation
- ✅ **ไทย-อังกฤษ**: แปลสองทาง
- ✅ **ภาษาอื่นๆ**: รองรับหลายภาษา
- ✅ **Batch Translation**: แปลหลายประโยค

## 7. การใช้งานในโค้ด

### Basic TTS
```javascript
import aiForThaiTtsService from '../services/aiForThaiTtsService';

// พูดข้อความธรรมดา
await aiForThaiTtsService.playThai('สวัสดี');

// พูดพยัญชนะ
await aiForThaiTtsService.playThai('ก ไก่');

// พูดด้วยอารมณ์
await aiForThaiTtsService.playThai('สวัสดี');
```

### Advanced TTS
```javascript
// พูดช้าๆ สำหรับการเรียนรู้
await aiForThaiTtsService.playThai('กอ ไก่');

// พูดเร็ว
await aiForThaiTtsService.playThai('สวัสดี');

// พูดด้วยการตั้งค่าแบบกำหนดเอง
await aiForThaiTtsService.playThai('สวัสดี', {
  voice: 'th-TH-Standard-A',
  speed: 0.8,
  pitch: 1.2,
  volume: 1.0
});
```

## 8. Error Handling

```javascript
try {
  await aiForThaiTtsService.playThai('สวัสดี');
} catch (error) {
  console.error('TTS Error:', error);
  // Fallback to local TTS
  await Speech.speak('สวัสดี', { language: 'th-TH' });
}
```

## 9. Rate Limits

- **Free Tier**: 100 requests/day
- **Paid Tier**: 1000+ requests/day
- **Rate Limit**: 10 requests/minute

## 10. Troubleshooting

### ปัญหาที่พบบ่อย:

1. **API Key ไม่ถูกต้อง**
   - ตรวจสอบ API Key ใน .env
   - ตรวจสอบการตั้งค่า permissions

2. **Network Error**
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
   - ตรวจสอบ firewall settings

3. **Rate Limit Exceeded**
   - รอสักครู่แล้วลองใหม่
   - อัปเกรด plan

4. **Audio Playback Error**
   - ตรวจสอบ expo-speech
   - ตรวจสอบ device permissions

### การแก้ไข:

1. **ตรวจสอบ API Key**:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://api.aiforthai.in.th/health
   ```

2. **ตรวจสอบ Network**:
   ```bash
   ping api.aiforthai.in.th
   ```

3. **ตรวจสอบ Logs**:
   ```bash
   npx expo start --clear
   ```

## 11. Best Practices

1. **Cache API Responses**: เก็บผลลัพธ์ไว้ใช้ซ้ำ
2. **Error Handling**: จัดการ error อย่างเหมาะสม
3. **Rate Limiting**: จำกัดจำนวน requests
4. **Offline Fallback**: ใช้ local TTS เมื่อ offline
5. **User Feedback**: แสดงสถานะการโหลด

## 12. Cost Optimization

1. **Batch Requests**: รวม requests หลายตัว
2. **Caching**: เก็บผลลัพธ์ไว้ใช้ซ้ำ
3. **Compression**: ใช้ audio format ที่เหมาะสม
4. **Smart Loading**: โหลดเมื่อจำเป็นเท่านั้น

## Support

หากมีปัญหา สามารถติดต่อ:
- AI For Thai Support: support@aiforthai.in.th
- Documentation: https://docs.aiforthai.in.th
- Community: https://community.aiforthai.in.th




