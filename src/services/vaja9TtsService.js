import * as Speech from 'expo-speech';
import aiForThaiTtsService from './aiForThaiTtsService';

/**
 * Vaja9 TTS Service (using AI For Thai API)
 * Primary TTS service using AI For Thai API with fallback to local TTS
 */
class Vaja9TtsService {
  constructor() {
    this.isSpeaking = false;
    this.currentLanguage = 'th-TH';
    this.availableVoices = [];
    this.init();
  }

  async init() {
    try {
      // Get available voices for fallback
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices;
      console.log('🎤 Vaja9 TTS initialized with fallback voices:', voices.length);
    } catch (error) {
      console.log('⚠️ Could not get available voices:', error);
    }
  }

  /**
   * Speak Thai text using AI For Thai TTS (primary) with fallback to local TTS
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async playThai(text, options = {}) {
    console.log('🔍 vaja9TtsService.playThai called with:', { text, textType: typeof text, options });
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn('⚠️ Invalid text provided to vaja9TtsService.playThai:', { text, textType: typeof text });
      return false;
    }

    try {
      // Stop any current speech
      await this.stop();

      // Set speaking state
      this.isSpeaking = true;

      console.log('🔊 Vaja9 TTS (AI For Thai) Speaking:', text);

      // Try AI For Thai TTS first
      try {
        const success = await aiForThaiTtsService.playThai(text, options);
        if (success) {
          console.log('✅ AI For Thai TTS completed successfully');
          this.isSpeaking = false;
          return true;
        } else {
          console.log('⚠️ AI For Thai TTS not available, falling back to local TTS');
        }
      } catch (aiError) {
        console.log('⚠️ AI For Thai TTS failed, falling back to local TTS:', aiError.message);
      }

      // Fallback to local TTS
      const defaultOptions = {
        language: 'th-TH',
        pitch: 1.0,
        rate: 0.8,
        ...options
      };

      await new Promise((resolve, reject) => {
        Speech.speak(text, {
          ...defaultOptions,
          onDone: () => {
            console.log('✅ Local TTS completed');
            this.isSpeaking = false;
            resolve();
          },
          onError: (error) => {
            console.error('❌ Local TTS error:', error);
            this.isSpeaking = false;
            reject(error);
          }
        });
      });

      console.log('✅ Local TTS completed successfully');
      return true;

    } catch (error) {
      console.error('❌ Vaja9 TTS failed:', error);
      return false;
    } finally {
      this.isSpeaking = false;
    }
  }

  /**
   * Speak Thai text using AI For Thai API
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speak(text, options = {}) {
    try {
      console.log('🎤 AI For Thai TTS request:', text);
      
      // Use AI For Thai TTS service
      const success = await aiForThaiTtsService.playThai(text, options);
      
      if (success) {
        console.log('✅ AI For Thai TTS completed successfully');
        return true;
      } else {
        throw new Error('AI For Thai TTS failed');
      }
    } catch (error) {
      console.error('❌ AI For Thai TTS error:', error);
      throw error;
    }
  }

  /**
   * Speak Thai text (alias for playThai)
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakThai(text, options = {}) {
    return this.playThai(text, options);
  }

  /**
   * Speak Thai text with slow speech
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakSlowly(text, options = {}) {
    return this.playThai(text, {
      ...options,
      speed: 0.7
    });
  }

  /**
   * Speak Thai text with fast speech
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakQuickly(text, options = {}) {
    return this.playThai(text, {
      ...options,
      speed: 1.3
    });
  }

  /**
   * Speak Thai text with emotion
   * @param {string} text - Text to speak
   * @param {string} emotion - Emotion type
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakWithEmotion(text, emotion = 'happy', options = {}) {
    const voiceMap = {
      'happy': 'female',
      'sad': 'female',
      'angry': 'female',
      'excited': 'female',
      'calm': 'female'
    };

    return this.playThai(text, {
      ...options,
      voice: voiceMap[emotion] || 'female',
      pitch: emotion === 'happy' ? 1.1 : emotion === 'sad' ? 0.9 : 1.0
    });
  }

  /**
   * Speak Thai consonant with example
   * @param {string} consonant - Thai consonant
   * @param {string} example - Example word
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakConsonant(consonant, example, options = {}) {
    const text = `${consonant} ${example}`;
    return this.playThai(text, {
      ...options,
      speed: 0.8
    });
  }

  /**
   * Speak Thai vowel with example
   * @param {string} vowel - Thai vowel
   * @param {string} example - Example word
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakVowel(vowel, example, options = {}) {
    const text = `${vowel} ${example}`;
    return this.playThai(text, {
      ...options,
      speed: 0.8
    });
  }

  /**
   * Speak Thai tone with example
   * @param {string} tone - Thai tone
   * @param {string} example - Example word
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakTone(tone, example, options = {}) {
    const text = `${tone} ${example}`;
    return this.playThai(text, {
      ...options,
      speed: 0.8
    });
  }

  /**
   * Stop current speech
   * @returns {Promise<void>}
   */
  async stop() {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
        this.isSpeaking = false;
        console.log('🛑 TTS stopped');
      }
    } catch (error) {
      console.error('❌ Error stopping TTS:', error);
    }
  }

  /**
   * Check if currently speaking
   * @returns {boolean} - Speaking status
   */
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  /**
   * Get available voices
   * @returns {Array} - Available voices
   */
  getAvailableVoices() {
    return this.availableVoices;
  }

  /**
   * Check AI For Thai API status
   * @returns {Promise<Object>} - API status
   */
  async checkStatus() {
    try {
      // Test with a simple text
      const testText = 'สวัสดี';
      const success = await aiForThaiTtsService.playThai(testText, { voice: 'female' });
      
      if (success) {
        return {
          status: 'success',
          message: 'AI For Thai API working'
        };
      } else {
        return {
          status: 'error',
          message: 'AI For Thai API not responding'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Get available AI For Thai voices
   * @returns {Array} - Available voices
   */
  getVaja9Voices() {
    return [
      { id: 'female', name: 'Thai Female', language: 'th' },
      { id: 'male', name: 'Thai Male', language: 'th' },
      { id: 'child_male', name: 'Thai Child Male', language: 'th' },
      { id: 'child_female', name: 'Thai Child Female', language: 'th' }
    ];
  }

  /**
   * Cleanup resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    await this.stop();
  }
}

export default new Vaja9TtsService();
