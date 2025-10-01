import * as Speech from 'expo-speech';
import vaja9TtsService from './vaja9TtsService';

class AISpeechService {
  constructor() {
    this.isSpeaking = false;
    this.currentLanguage = 'th-TH';
    this.availableVoices = [];
    this.init();
  }

  async init() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices;
      console.log('🎤 AI Speech Service initialized with voices:', voices.length);
    } catch (error) {
      console.log('⚠️ Could not get available voices for AI Speech Service:', error);
    }
  }

  async speak(text, options = {}) {
    if (!text || typeof text !== 'string') {
      console.warn('⚠️ Invalid text provided to speak');
      return false;
    }

    try {
      await Speech.stop();
      this.isSpeaking = true;

      console.log('🔊 AI Speech Service Speaking:', text);

      // Try Vaja9 TTS first
      try {
        const success = await vaja9TtsService.playThai(text, options);
        if (success) {
          console.log('✅ Vaja9 TTS completed successfully');
          return true;
        }
      } catch (vaja9Error) {
        console.log('⚠️ Vaja9 TTS failed, using fallback:', vaja9Error.message);
      }

      // Fallback to local TTS
      await Speech.speak(text, {
        language: 'th-TH',
        pitch: 1.0,
        rate: 0.8,
        ...options,
        onDone: () => this.isSpeaking = false,
        onError: (error) => {
          console.error('❌ Local TTS error:', error);
          this.isSpeaking = false;
        }
      });

      console.log('✅ AI Speech Service completed');
      return true;

    } catch (error) {
      console.error('❌ AI Speech Service failed:', error);
      this.isSpeaking = false;
      return false;
    }
  }

  async speakWithEmotion(text, emotion = 'neutral', options = {}) {
    return this.speak(text, { ...options, emotion });
  }

  async speakSlowly(text, options = {}) {
    return this.speak(text, { ...options, rate: 0.6 });
  }

  async speakQuickly(text, options = {}) {
    return this.speak(text, { ...options, rate: 1.2 });
  }

  async stop() {
    if (this.isSpeaking) {
      await Speech.stop();
      this.isSpeaking = false;
      console.log('🛑 AI Speech Service stopped');
    }
  }

  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  getAvailableVoices() {
    return this.availableVoices;
  }
}

export default new AISpeechService();


