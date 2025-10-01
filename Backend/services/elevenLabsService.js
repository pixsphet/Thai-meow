const { ElevenLabsClient, stream } = require('@elevenlabs/elevenlabs-js');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.client = null;
    this.cacheDir = path.join(__dirname, '../cache/audio/elevenlabs');
    
    // สร้าง cache directory ถ้าไม่มี
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    this.initializeClient();
  }

  initializeClient() {
    if (!this.apiKey) {
      console.warn('⚠️ ElevenLabs API key not found. TTS will not work.');
      return;
    }

    try {
      this.client = new ElevenLabsClient({
        apiKey: this.apiKey,
      });
      console.log('✅ ElevenLabs client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ElevenLabs client:', error);
    }
  }

  // สร้าง cache key สำหรับไฟล์เสียง
  generateCacheKey(text, voiceId, settings = {}) {
    const crypto = require('crypto');
    const keyData = `${text}-${voiceId}-${JSON.stringify(settings)}`;
    return crypto.createHash('md5').update(keyData).digest('hex');
  }

  // ตรวจสอบว่าไฟล์เสียงมีอยู่ใน cache หรือไม่
  getCachedAudio(cacheKey) {
    const filePath = path.join(this.cacheDir, `${cacheKey}.mp3`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return null;
  }

  // บันทึกไฟล์เสียงลง cache
  saveToCache(cacheKey, audioBuffer) {
    const filePath = path.join(this.cacheDir, `${cacheKey}.mp3`);
    fs.writeFileSync(filePath, audioBuffer);
    return filePath;
  }

  // สร้างเสียงพูดภาษาไทย
  async generateThaiSpeech(text, options = {}) {
    if (!this.client) {
      console.warn('⚠️ ElevenLabs client not initialized. Please check API key.');
      return {
        success: false,
        message: 'ElevenLabs client not initialized. Please check API key.',
        fallback: true
      };
    }

    const {
      voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam voice (good for Thai)
      stability = 0.5,
      similarityBoost = 0.5,
      style = 0.0,
      useSpeakerBoost = true
    } = options;

    try {
      // ตรวจสอบ cache ก่อน
      const cacheKey = this.generateCacheKey(text, voiceId, { stability, similarityBoost, style });
      const cachedFile = this.getCachedAudio(cacheKey);
      
      if (cachedFile) {
        console.log('🎵 Using cached audio from ElevenLabs');
        return {
          success: true,
          audioPath: cachedFile,
          cached: true
        };
      }

      console.log('🎤 Generating Thai speech with ElevenLabs:', text);

      // ใช้ stream API ใหม่
      const audioStream = await this.client.textToSpeech.stream(voiceId, {
        text: text,
        modelId: 'eleven_turbo_v2_5', // ใช้ model ใหม่
        voiceSettings: {
          stability: stability,
          similarityBoost: similarityBoost,
          style: style,
          useSpeakerBoost: useSpeakerBoost
        }
      });

      // แปลง audio stream เป็น buffer
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      // บันทึกลง cache
      const filePath = this.saveToCache(cacheKey, audioBuffer);

      console.log('✅ ElevenLabs speech generated successfully');

      return {
        success: true,
        audioPath: filePath,
        cached: false,
        buffer: audioBuffer
      };

    } catch (error) {
      console.error('❌ ElevenLabs speech generation failed:', error);
      return {
        success: false,
        message: error.message,
        fallback: true
      };
    }
  }

  // สร้างเสียงพูดสำหรับเกม
  async generateGameAudio(vocabData, options = {}) {
    const {
      includeExample = true,
      slowSpeech = false
    } = options;

    let text = vocabData.thai;
    
    if (includeExample && vocabData.exampleTH) {
      text += `. ตัวอย่าง: ${vocabData.exampleTH}`;
    }

    if (slowSpeech) {
      // เพิ่มการเว้นวรรคเพื่อให้พูดช้าลง
      text = text.split('').join(' ');
    }

    return this.generateThaiSpeech(text, {
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
      stability: 0.6,
      similarityBoost: 0.7,
      style: 0.2,
      useSpeakerBoost: true
    });
  }

  // สร้างเสียงพูดสำหรับบทเรียน
  async generateLessonAudio(lessonData, options = {}) {
    const {
      includeTranslation = false,
      slowSpeech = true
    } = options;

    let text = lessonData.titleTH;
    
    if (includeTranslation && lessonData.title) {
      text += `. ${lessonData.title}`;
    }

    if (slowSpeech) {
      text = text.split('').join(' ');
    }

    return this.generateThaiSpeech(text, {
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      stability: 0.7,
      similarityBoost: 0.8,
      style: 0.3,
      useSpeakerBoost: true
    });
  }

  // ตรวจสอบสถานะ API
  async checkApiStatus() {
    if (!this.client) {
      return {
        status: 'error',
        message: 'Client not initialized - Please check API key',
        fallback: true
      };
    }

    try {
      const voices = await this.client.voices.getAll();
      return {
        status: 'success',
        message: `API working. Found ${voices.voices.length} voices`,
        voices: voices.voices.length
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        fallback: true
      };
    }
  }

  // ล้าง cache
  clearCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
      });
      console.log('✅ ElevenLabs cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      return false;
    }
  }

  // ดูขนาด cache
  getCacheSize() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let totalSize = 0;
      files.forEach(file => {
        if (file.endsWith('.mp3')) {
          const filePath = path.join(this.cacheDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      });
      return {
        files: files.filter(f => f.endsWith('.mp3')).length,
        size: totalSize,
        sizeMB: (totalSize / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      console.error('❌ Failed to get cache size:', error);
      return { files: 0, size: 0, sizeMB: '0.00' };
    }
  }
}

module.exports = new ElevenLabsService();
