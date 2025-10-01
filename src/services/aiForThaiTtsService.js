import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import apiClient from './apiClient';

class AiForThaiTtsService {
  constructor() {
    this.isSpeaking = false;
    this.currentLanguage = 'th-TH';
    this.availableVoices = [];
    this.apiKey = 'ObDts2bk3smc2qsagGbISxE9b1sITgQb';
    this.apiUrl = 'https://aiforthai.in.th/service_ts.php';
    this.init();
  }

  async init() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices;
      console.log('🎤 AI For Thai TTS initialized with voices:', voices.length);
    } catch (error) {
      console.log('⚠️ Could not get available voices for AI For Thai TTS:', error);
    }
  }

  async playThai(text, options = {}) {
    console.log('🔍 playThai called with:', { text, textType: typeof text, options });
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn('⚠️ Invalid text provided to playThai:', { text, textType: typeof text });
      return false;
    }

    try {
      await this.stop();
      this.isSpeaking = true;

      console.log('🔊 AI For Thai TTS Speaking:', text);

      // For now, use local TTS directly to ensure it works
      console.log('🔄 Using local TTS directly...');
      await Speech.speak(text, {
        language: 'th-TH',
        pitch: 1.0,
        rate: 0.8,
        ...options,
        onDone: () => {
          console.log('✅ Local TTS completed');
          this.isSpeaking = false;
        },
        onError: (error) => {
          console.error('❌ Local TTS error:', error);
          this.isSpeaking = false;
        }
      });

      console.log('✅ TTS completed');
      return true;

    } catch (error) {
      console.error('❌ AI For Thai TTS failed:', error);
      this.isSpeaking = false;
      return false;
    }
  }

  async generateThaiSpeech(text, options = {}) {
    try {
      console.log('🎤 Generating speech with AI For Thai API...');
      console.log('📝 Text:', text);
      console.log('🔑 API Key:', this.apiKey ? 'Present' : 'Missing');
      console.log('🌐 API URL:', this.apiUrl);
      
      const formData = new FormData();
      formData.append('text', text);
      formData.append('api_key', this.apiKey);
      formData.append('voice', options.voice || 'female');
      formData.append('speed', options.speed || '1.0');
      formData.append('volume', options.volume || '1.0');
      formData.append('pitch', options.pitch || '1.0');

      console.log('📤 Sending request to AI For Thai API...');
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'audio/mpeg',
        },
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('🎵 Audio blob size:', audioBlob.size, 'bytes');
      
      // Convert blob to base64 for React Native
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const base64Audio = reader.result;
          console.log('✅ AI For Thai speech generated successfully, base64 length:', base64Audio.length);
          resolve(base64Audio);
        };
        reader.onerror = (error) => {
          console.error('❌ Error converting audio to base64:', error);
          reject(new Error('Failed to convert audio to base64'));
        };
        reader.readAsDataURL(audioBlob);
      });

    } catch (error) {
      console.error('❌ AI For Thai API error:', error);
      throw error;
    }
  }

  async speak(text, options = {}) {
    return this.playThai(text, options);
  }

  async speakSlowly(text, options = {}) {
    return this.playThai(text, { ...options, rate: 0.6 });
  }

  async speakQuickly(text, options = {}) {
    return this.playThai(text, { ...options, rate: 1.2 });
  }

  async speakWithEmotion(text, emotion = 'neutral', options = {}) {
    return this.playThai(text, { ...options, emotion });
  }

  async speakConsonant(consonant, example, options = {}) {
    return this.playThai(`${consonant} ${example}`, { ...options, rate: 0.6 });
  }

  async speakVowel(vowel, example, options = {}) {
    return this.playThai(`${vowel} ${example}`, { ...options, rate: 0.6 });
  }

  async speakTone(tone, example, options = {}) {
    return this.playThai(`${tone} ${example}`, { ...options, rate: 0.6 });
  }

  async stop() {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        this.isSpeaking = false;
        console.log('🛑 TTS stopped');
      }
    } catch (error) {
      console.error('❌ Error stopping TTS:', error);
      this.isSpeaking = false;
    }
  }

  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  getAvailableVoices() {
    return this.availableVoices;
  }
}

export default new AiForThaiTtsService();