# 🎤 ElevenLabs TTS Setup Guide

## 📋 Overview
This guide will help you set up ElevenLabs TTS integration for the Thai Meow app.

## 🔧 Prerequisites
- Node.js installed
- ElevenLabs account and API key
- MongoDB Atlas connection

## 🚀 Setup Steps

### 1. Install Dependencies
```bash
cd Backend
npm install @elevenlabs/elevenlabs-js
```

### 2. Get ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account
3. Go to your profile settings
4. Copy your API key

### 3. Configure Environment Variables
Create or update your `.env` file in the Backend directory:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=supersecretjwtkey

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Test the Integration
```bash
# Start the backend server
cd Backend
node server.js

# Test the API
curl -X GET "http://localhost:3000/api/elevenlabs/status"
```

## 🎯 API Endpoints

### POST /api/elevenlabs/speak
Generate speech from text using latest models
```json
{
  "text": "สวัสดี",
  "options": {
    "voiceId": "pNInz6obpgDQGcFmaJgB",
    "modelId": "eleven_turbo_v2_5",
    "stability": 0.5,
    "similarityBoost": 0.8,
    "languageCode": "th",
    "autoMode": true,
    "applyTextNormalization": "auto"
  }
}
```

> **⚠️ Important**: v1 TTS models are deprecated and will be removed on 2025-12-15. We're using the latest `eleven_turbo_v2_5` model.

### POST /api/elevenlabs/game-audio
Generate audio for game vocabulary
```json
{
  "vocabData": {
    "thai": "ก",
    "roman": "g",
    "en": "chicken",
    "exampleTH": "ก ไก่"
  },
  "options": {
    "includeExample": true,
    "slowSpeech": true
  }
}
```

### GET /api/elevenlabs/status
Check API status and available voices

### GET /api/elevenlabs/cache
Get cache information

### DELETE /api/elevenlabs/cache
Clear audio cache

## 🎵 Frontend Usage

### Basic Usage
```javascript
import elevenLabsTtsService from '../services/elevenLabsTtsService';

// Speak Thai text
await elevenLabsTtsService.playThai('สวัสดี');

// Speak with options
await elevenLabsTtsService.playThai('สวัสดี', {
  emotion: 'happy',
  slowSpeech: true
});
```

### Game Integration
```javascript
// Speak consonant with example
await elevenLabsTtsService.speakConsonant('ก', 'ไก่');

// Speak vowel with example
await elevenLabsTtsService.speakVowel('อา', 'อ่าง');

// Speak tone with example
await elevenLabsTtsService.speakTone('ไม้เอก', 'ขา');
```

## 🔄 Fallback System

The TTS system has a robust fallback mechanism:

1. **ElevenLabs TTS** (Primary) - High quality AI voice
2. **AI For Thai TTS** (Secondary) - Local AI TTS
3. **Expo Speech** (Final) - Device TTS

## 📊 Features

### Voice Settings
- **Voice ID**: `pNInz6obpgDQGcFmaJgB` (Adam voice - good for Thai)
- **Model**: `eleven_turbo_v2_5` (latest model, replaces deprecated v1)
- **Stability**: 0.5 (balanced)
- **Similarity Boost**: 0.8 (enhanced for better quality)
- **Style**: 0.0-0.3 (emotion range)
- **Speaker Boost**: Enabled
- **Language Code**: `th` (Thai)
- **Auto Mode**: Enabled (reduces latency)
- **Text Normalization**: `auto` (automatic text processing)

### WebSocket API Support
- **Real-time streaming** for partial text input
- **Word-to-audio alignment** information
- **Lower latency** for continuous speech
- **Better for streaming** text scenarios

### Caching
- Audio files are cached locally
- Reduces API calls and improves performance
- Cache can be cleared via API

### Error Handling
- Automatic fallback to local TTS
- Comprehensive error logging
- Graceful degradation

## 🎮 Game Integration

### ThaiConsonantsGame
- Uses ElevenLabs for consonant pronunciation
- Fallback to local TTS if API fails
- Optimized for learning experience

### Vocabulary Games
- High-quality pronunciation for vocabulary
- Slow speech option for beginners
- Example sentences included

## 🔧 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Check if API key is correct
   - Verify account has credits
   - Check network connection

2. **Audio Not Playing**
   - Check if audio files are generated
   - Verify file permissions
   - Check browser audio settings

3. **Slow Performance**
   - Clear cache if needed
   - Check network speed
   - Monitor API usage

### Debug Commands
```bash
# Check API status
curl -X GET "http://localhost:3000/api/elevenlabs/status"

# Check cache size
curl -X GET "http://localhost:3000/api/elevenlabs/cache"

# Clear cache
curl -X DELETE "http://localhost:3000/api/elevenlabs/cache"
```

## 📈 Performance Tips

1. **Use Caching**: Audio files are cached to reduce API calls
2. **Batch Requests**: Group multiple TTS requests when possible
3. **Monitor Usage**: Keep track of API usage and costs
4. **Optimize Settings**: Adjust voice settings for your use case

## 🎉 Benefits

- **High Quality**: Professional AI voice synthesis
- **Natural Sound**: More natural than device TTS
- **Consistent**: Same voice across all devices
- **Customizable**: Adjustable voice settings
- **Reliable**: Robust fallback system

## 📝 Notes

- ElevenLabs has usage limits based on your plan
- Audio files are cached to improve performance
- The system gracefully falls back to local TTS if needed
- Voice settings can be customized per use case
