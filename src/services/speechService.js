import * as Speech from 'expo-speech';

// AI Speech Service for Thai Language Learning
export class SpeechService {
  constructor() {
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  // Speak Thai text with proper pronunciation
  async speakThai(text, options = {}) {
    try {
      // Stop any current speech
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      const defaultOptions = {
        language: 'th-TH', // Thai language
        pitch: 1.0,
        rate: 0.8, // Slower rate for learning
        volume: 1.0,
        quality: 'enhanced', // Better quality for learning
        ...options,
      };

      return new Promise((resolve, reject) => {
        this.currentUtterance = Speech.speak(text, {
          ...defaultOptions,
          onStart: () => {
            this.isSpeaking = true;
            console.log('Speech started:', text);
          },
          onDone: () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.log('Speech completed:', text);
            resolve();
          },
          onStopped: () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.log('Speech stopped:', text);
            resolve();
          },
          onError: (error) => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.error('Speech error:', error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error('Speech service error:', error);
      throw error;
    }
  }

  // Speak with different speeds for learning
  async speakSlow(text) {
    return this.speakThai(text, { rate: 0.6 });
  }

  async speakNormal(text) {
    return this.speakThai(text, { rate: 0.8 });
  }

  async speakFast(text) {
    return this.speakThai(text, { rate: 1.0 });
  }

  // Speak with different pitches for variety
  async speakHighPitch(text) {
    return this.speakThai(text, { pitch: 1.2 });
  }

  async speakLowPitch(text) {
    return this.speakThai(text, { pitch: 0.8 });
  }

  // Stop current speech
  async stopSpeaking() {
    try {
      if (this.isSpeaking) {
        Speech.stop();
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.log('Speech stopped');
      }
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  // Check if currently speaking
  isCurrentlySpeaking() {
    return this.isSpeaking;
  }

  // Speak word with pronunciation guide
  async speakWordWithGuide(word, romanization) {
    try {
      // First speak the word
      await this.speakSlow(word);
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then speak the romanization
      await this.speakThai(`(${romanization})`, { rate: 0.7 });
    } catch (error) {
      console.error('Error speaking word with guide:', error);
      throw error;
    }
  }

  // Speak sentence with pauses
  async speakSentence(sentence, pauseDuration = 1000) {
    try {
      const words = sentence.split(' ');
      for (let i = 0; i < words.length; i++) {
        await this.speakThai(words[i], { rate: 0.7 });
        if (i < words.length - 1) {
          await new Promise(resolve => setTimeout(resolve, pauseDuration));
        }
      }
    } catch (error) {
      console.error('Error speaking sentence:', error);
      throw error;
    }
  }

  // Speak with emphasis on certain words
  async speakWithEmphasis(text, emphasizedWords = []) {
    try {
      let processedText = text;
      
      // Add emphasis markers for emphasized words
      emphasizedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        processedText = processedText.replace(regex, `**${word}**`);
      });

      // Speak with emphasis
      await this.speakThai(processedText, { rate: 0.8 });
    } catch (error) {
      console.error('Error speaking with emphasis:', error);
      throw error;
    }
  }

  // Get available voices
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices.filter(voice => voice.language.startsWith('th'));
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  // Set custom voice
  async setVoice(voiceId) {
    try {
      const voices = await this.getAvailableVoices();
      const voice = voices.find(v => v.identifier === voiceId);
      if (voice) {
        this.selectedVoice = voice;
        console.log('Voice set to:', voice.name);
      }
    } catch (error) {
      console.error('Error setting voice:', error);
    }
  }
}

// Create singleton instance
export const speechService = new SpeechService();

// Helper functions
export const speakThai = (text, options) => speechService.speakThai(text, options);
export const speakSlow = (text) => speechService.speakSlow(text);
export const speakNormal = (text) => speechService.speakNormal(text);
export const speakFast = (text) => speechService.speakFast(text);
export const stopSpeaking = () => speechService.stopSpeaking();
export const isSpeaking = () => speechService.isCurrentlySpeaking();

export default speechService;
