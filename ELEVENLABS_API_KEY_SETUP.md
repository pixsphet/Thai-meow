# 🔑 ElevenLabs API Key Setup Guide

## 📋 Overview
This guide will help you get your ElevenLabs API key and configure it for the Thai Meow app.

## 🚀 Step-by-Step Setup

### 1. Create ElevenLabs Account
1. Go to [ElevenLabs.io](https://elevenlabs.io/)
2. Click "Sign Up" or "Get Started"
3. Create your account with email and password

### 2. Get Your API Key
1. After logging in, go to your **Profile** (click on your avatar)
2. Navigate to **Profile Settings**
3. Scroll down to **API Keys** section
4. Click **"Create API Key"**
5. Give it a name like "Thai Meow App"
6. Copy the generated API key (starts with `sk-`)

### 3. Configure Your Environment
Create or update your `.env` file in the Backend directory:

```env
# ElevenLabs API Key
ELEVENLABS_API_KEY=sk-your-actual-api-key-here

# Other existing variables...
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=supersecretjwtkey
PORT=3000
```

### 4. Test Your Setup
```bash
# Restart the server
cd Backend
node server.js

# Test the API
curl -X GET "http://localhost:3000/api/elevenlabs/status"
```

Expected response:
```json
{
  "status": "success",
  "message": "API working. Found X voices",
  "voices": 65
}
```

## 💰 Pricing Information

### Free Tier
- **10,000 characters per month**
- **3 custom voices**
- **Basic models**

### Starter Plan ($5/month)
- **30,000 characters per month**
- **10 custom voices**
- **All models including latest**

### Creator Plan ($22/month)
- **100,000 characters per month**
- **30 custom voices**
- **Commercial use**

## 🎯 Recommended Plan for Thai Meow

For the Thai Meow app, we recommend:

### **Starter Plan ($5/month)**
- Sufficient for development and testing
- Access to latest `eleven_turbo_v2_5` model
- Good for small to medium usage

### **Creator Plan ($22/month)**
- Better for production use
- More characters for extensive testing
- Commercial use rights

## 🔧 Troubleshooting

### Common Issues

#### 1. "API key not found" Error
```bash
⚠️ ElevenLabs API key not found. TTS will not work.
```

**Solution:**
- Check if `.env` file exists in Backend directory
- Verify `ELEVENLABS_API_KEY` is set correctly
- Restart the server after adding the key

#### 2. "Client not initialized" Error
```json
{"status":"error","message":"Client not initialized"}
```

**Solution:**
- Ensure API key is valid and active
- Check if account has sufficient credits
- Verify network connection

#### 3. "Invalid API key" Error
```json
{"error":"Invalid API key"}
```

**Solution:**
- Double-check the API key format (should start with `sk-`)
- Ensure no extra spaces or characters
- Try generating a new API key

### Debug Commands

```bash
# Check if .env file exists
ls -la Backend/.env

# Check if API key is loaded
cd Backend
node -e "require('dotenv').config(); console.log('API Key:', process.env.ELEVENLABS_API_KEY ? 'Found' : 'Not found');"

# Test API status
curl -X GET "http://localhost:3000/api/elevenlabs/status"
```

## 🎵 Testing TTS

Once your API key is set up, test the TTS:

```bash
# Test basic speech
curl -X POST "http://localhost:3000/api/elevenlabs/speak" \
  -H "Content-Type: application/json" \
  -d '{"text": "สวัสดี"}'

# Test with options
curl -X POST "http://localhost:3000/api/elevenlabs/speak" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "สวัสดี",
    "options": {
      "modelId": "eleven_turbo_v2_5",
      "stability": 0.7,
      "similarityBoost": 0.8
    }
  }'
```

## 📊 Usage Monitoring

### Check Your Usage
1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/speech-synthesis)
2. Navigate to **Usage** section
3. Monitor your character usage

### Cache Management
```bash
# Check cache size
curl -X GET "http://localhost:3000/api/elevenlabs/cache"

# Clear cache if needed
curl -X DELETE "http://localhost:3000/api/elevenlabs/cache"
```

## 🔒 Security Best Practices

### 1. Never Commit API Keys
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys regularly

### 2. Limit API Key Permissions
- Use specific API keys for different environments
- Monitor usage regularly
- Set up usage alerts

### 3. Production Setup
```env
# Production environment
ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
NODE_ENV=production
```

## 🎉 Next Steps

After setting up your API key:

1. **Test the TTS** in the app
2. **Adjust voice settings** for optimal Thai pronunciation
3. **Monitor usage** to stay within limits
4. **Set up caching** for better performance
5. **Configure fallbacks** for reliability

## 📞 Support

If you encounter issues:

1. Check [ElevenLabs Documentation](https://elevenlabs.io/docs)
2. Visit [ElevenLabs Community](https://community.elevenlabs.io/)
3. Contact ElevenLabs Support
4. Check our app logs for detailed error messages

---

**Happy coding! 🎤✨**
