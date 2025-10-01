import * as Speech from 'expo-speech';
import elevenLabsService from './elevenLabsService';

/**
 * ElevenLabs TTS Service
 * Primary TTS service using ElevenLabs with fallback to local TTS only
 */
class ElevenLabsTtsService {
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
      console.log('🎤 ElevenLabs TTS initialized with fallback voices:', voices.length);
    } catch (error) {
      console.log('⚠️ Could not get available voices:', error);
    }
  }

  /**
   * Speak Thai text using ElevenLabs TTS (primary) with fallback to local TTS
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async playThai(text, options = {}) {
    if (!text || typeof text !== 'string') {
      console.warn('⚠️ Invalid text provided to playThai');
      return false;
    }

    try {
      // Stop any current speech
      await this.stop();

      // Set speaking state
      this.isSpeaking = true;

      console.log('🔊 ElevenLabs TTS Speaking:', text);

      // Try ElevenLabs first
      try {
        const success = await elevenLabsService.speakThai(text, options);
        if (success) {
          console.log('✅ ElevenLabs TTS completed successfully');
          return true;
        } else {
          console.log('⚠️ ElevenLabs not available, falling back to local TTS');
        }
      } catch (elevenLabsError) {
        console.log('⚠️ ElevenLabs failed, falling back to local TTS:', elevenLabsError.message);
      }

      // Fallback to local TTS only
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
      console.error('❌ ElevenLabs TTS failed:', error);
      return false;
    } finally {
      this.isSpeaking = false;
    }
  }

  /**
   * Speak Thai text (alias for playThai)
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speak(text, options = {}) {
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
      slowSpeech: true,
      rate: 0.6
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
      rate: 1.2
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
    return this.playThai(text, {
      ...options,
      style: emotion === 'happy' ? 0.3 : emotion === 'sad' ? -0.3 : 0.0,
      stability: 0.7
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
      slowSpeech: true
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
      slowSpeech: true
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
      slowSpeech: true
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
        await elevenLabsService.stop();
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
   * Check ElevenLabs API status
   * @returns {Promise<Object>} - API status
   */
  async checkStatus() {
    return await elevenLabsService.checkStatus();
  }

  /**
   * Get cache information
   * @returns {Promise<Object>} - Cache info
   */
  async getCacheInfo() {
    return await elevenLabsService.getCacheInfo();
  }

  /**
   * Clear cache
   * @returns {Promise<Object>} - Clear result
   */
  async clearCache() {
    return await elevenLabsService.clearCache();
  }

  /**
   * Cleanup resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    await this.stop();
    await elevenLabsService.cleanup();
  }
}

export default new ElevenLabsTtsService();