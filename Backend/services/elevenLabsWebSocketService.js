const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class ElevenLabsWebSocketService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'wss://api.elevenlabs.io/v1/text-to-speech';
    this.cacheDir = path.join(__dirname, '../cache/audio/elevenlabs');
    
    // สร้าง cache directory ถ้าไม่มี
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
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

  // สร้างเสียงพูดด้วย WebSocket API
  async generateThaiSpeechWebSocket(text, options = {}) {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not found. Please check API key.');
    }

    const {
      voiceId = 'pNInz6obpgDQGcFmaJgB', // Adam voice
      stability = 0.5,
      similarityBoost = 0.8,
      style = 0.0,
      useSpeakerBoost = true,
      modelId = 'eleven_turbo_v2_5',
      languageCode = 'th',
      enableLogging = true,
      enableSsmlParsing = false,
      outputFormat = 'mp3_44100_128',
      inactivityTimeout = 20,
      syncAlignment = false,
      autoMode = true,
      applyTextNormalization = 'auto',
      seed = null
    } = options;

    try {
      // ตรวจสอบ cache ก่อน
      const cacheKey = this.generateCacheKey(text, voiceId, { stability, similarityBoost, style });
      const cachedFile = this.getCachedAudio(cacheKey);
      
      if (cachedFile) {
        console.log('🎵 Using cached audio from ElevenLabs WebSocket');
        return {
          success: true,
          audioPath: cachedFile,
          cached: true
        };
      }

      console.log('🎤 Generating Thai speech with ElevenLabs WebSocket:', text);

      // สร้าง WebSocket connection
      const wsUrl = `${this.baseUrl}/${voiceId}/stream-input`;
      const ws = new WebSocket(wsUrl, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return new Promise((resolve, reject) => {
        let audioChunks = [];
        let isFinal = false;

        ws.on('open', () => {
          console.log('🔌 WebSocket connected to ElevenLabs');

          // ส่งการตั้งค่าเริ่มต้น
          const initMessage = {
            text: " ",
            voice_settings: {
              speed: 1,
              stability: stability,
              similarity_boost: similarityBoost,
              style: style,
              use_speaker_boost: useSpeakerBoost
            },
            xi_api_key: this.apiKey
          };

          ws.send(JSON.stringify(initMessage));

          // ส่งข้อความที่ต้องการพูด
          const textMessage = {
            text: text,
            try_trigger_generation: true
          };

          ws.send(JSON.stringify(textMessage));

          // ส่งข้อความปิด
          const closeMessage = {
            text: ""
          };

          ws.send(JSON.stringify(closeMessage));
        });

        ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            
            if (message.audio) {
              // แปลง base64 เป็น buffer
              const audioBuffer = Buffer.from(message.audio, 'base64');
              audioChunks.push(audioBuffer);
              
              if (message.isFinal) {
                isFinal = true;
              }
            }
          } catch (error) {
            console.error('❌ Error parsing WebSocket message:', error);
          }
        });

        ws.on('close', () => {
          console.log('🔌 WebSocket connection closed');
          
          if (audioChunks.length > 0) {
            // รวม audio chunks
            const finalAudioBuffer = Buffer.concat(audioChunks);
            
            // บันทึกลง cache
            const filePath = this.saveToCache(cacheKey, finalAudioBuffer);
            
            console.log('✅ ElevenLabs WebSocket speech generated successfully');
            
            resolve({
              success: true,
              audioPath: filePath,
              cached: false,
              buffer: finalAudioBuffer
            });
          } else {
            reject(new Error('No audio data received from WebSocket'));
          }
        });

        ws.on('error', (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        });

        // ตั้งค่า timeout
        setTimeout(() => {
          if (!isFinal) {
            ws.close();
            reject(new Error('WebSocket timeout'));
          }
        }, inactivityTimeout * 1000);
      });

    } catch (error) {
      console.error('❌ ElevenLabs WebSocket speech generation failed:', error);
      throw error;
    }
  }

  // สร้างเสียงพูดสำหรับเกมด้วย WebSocket
  async generateGameAudioWebSocket(vocabData, options = {}) {
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

    return this.generateThaiSpeechWebSocket(text, {
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      stability: 0.6,
      similarityBoost: 0.7,
      style: 0.2,
      useSpeakerBoost: true,
      autoMode: true,
      applyTextNormalization: 'auto'
    });
  }

  // สร้างเสียงพูดสำหรับบทเรียนด้วย WebSocket
  async generateLessonAudioWebSocket(lessonData, options = {}) {
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

    return this.generateThaiSpeechWebSocket(text, {
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      stability: 0.7,
      similarityBoost: 0.8,
      style: 0.3,
      useSpeakerBoost: true,
      autoMode: true,
      applyTextNormalization: 'auto'
    });
  }

  // ตรวจสอบสถานะ API
  async checkApiStatus() {
    if (!this.apiKey) {
      return {
        status: 'error',
        message: 'API key not found'
      };
    }

    try {
      // ทดสอบการเชื่อมต่อ WebSocket
      const testText = 'สวัสดี';
      const result = await this.generateThaiSpeechWebSocket(testText);
      
      return {
        status: 'success',
        message: 'WebSocket API working',
        testResult: result.success
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

module.exports = new ElevenLabsWebSocketService();
