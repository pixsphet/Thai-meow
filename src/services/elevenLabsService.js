import apiClient from './apiClient';

/**
 * ElevenLabs Service
 * Frontend service for ElevenLabs TTS API
 */
class ElevenLabsService {
  constructor() {
    this.baseUrl = '/elevenlabs';
  }

  /**
   * Speak Thai text using ElevenLabs TTS
   * @param {string} text - Text to speak
   * @param {Object} options - TTS options
   * @returns {Promise<boolean>} - Success status
   */
  async speakThai(text, options = {}) {
    try {
      console.log('🎤 ElevenLabs TTS speaking:', text);
      
      const response = await apiClient.post(`${this.baseUrl}/speak`, {
        text: text,
        options: {
          voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
          stability: 0.5,
          similarityBoost: 0.8,
          style: 0.2,
          useSpeakerBoost: true,
          modelId: 'eleven_turbo_v2_5',
          ...options
        }
      });

      if (response.data.success) {
        console.log('✅ ElevenLabs TTS completed successfully');
        return true;
      } else if (response.data.fallback) {
        console.log('⚠️ ElevenLabs not available, using fallback');
        return false; // ให้ frontend ใช้ fallback
      } else {
        throw new Error(response.data.message || 'TTS generation failed');
      }
    } catch (error) {
      console.error('❌ ElevenLabs TTS error:', error);
      throw error;
    }
  }

  /**
   * Generate game audio
   * @param {Object} vocabData - Vocabulary data
   * @param {Object} options - TTS options
   * @returns {Promise<Object>} - Audio result
   */
  async generateGameAudio(vocabData, options = {}) {
    try {
      const response = await apiClient.post(`${this.baseUrl}/game-audio`, {
        vocabData: vocabData,
        options: options
      });

      return response.data;
    } catch (error) {
      console.error('❌ ElevenLabs game audio error:', error);
      throw error;
    }
  }

  /**
   * Generate lesson audio
   * @param {Object} lessonData - Lesson data
   * @param {Object} options - TTS options
   * @returns {Promise<Object>} - Audio result
   */
  async generateLessonAudio(lessonData, options = {}) {
    try {
      const response = await apiClient.post(`${this.baseUrl}/lesson-audio`, {
        lessonData: lessonData,
        options: options
      });

      return response.data;
    } catch (error) {
      console.error('❌ ElevenLabs lesson audio error:', error);
      throw error;
    }
  }

  /**
   * Check API status
   * @returns {Promise<Object>} - API status
   */
  async checkStatus() {
    try {
      const response = await apiClient.get(`${this.baseUrl}/status`);
      return response.data;
    } catch (error) {
      console.error('❌ ElevenLabs status check error:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Get cache information
   * @returns {Promise<Object>} - Cache info
   */
  async getCacheInfo() {
    try {
      const response = await apiClient.get(`${this.baseUrl}/cache`);
      return response.data;
    } catch (error) {
      console.error('❌ ElevenLabs cache info error:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Clear cache
   * @returns {Promise<Object>} - Clear result
   */
  async clearCache() {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/cache`);
      return response.data;
    } catch (error) {
      console.error('❌ ElevenLabs clear cache error:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Stop current speech
   * @returns {Promise<void>}
   */
  async stop() {
    // ElevenLabs doesn't need explicit stop for HTTP requests
    console.log('🛑 ElevenLabs TTS stop requested');
  }

  /**
   * Cleanup resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    // No cleanup needed for HTTP requests
    console.log('🧹 ElevenLabs TTS cleanup completed');
  }
}

export default new ElevenLabsService();