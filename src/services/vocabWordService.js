import apiClient from './apiClient';

class VocabWordService {
  constructor() {
    this.baseURL = '/vocab-words';
  }

  // Get all vocabulary words
  async getAllVocabWords(params = {}) {
    try {
      const response = await apiClient.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabulary words:', error);
      throw error;
    }
  }

  // Get vocabulary words by lesson key
  async getVocabWordsByLesson(lessonKey, includeAudio = false) {
    try {
      const response = await apiClient.get(`${this.baseURL}/lesson/${lessonKey}`, {
        params: { includeAudio }
      });
      // Return the words array directly
      return response.words || [];
    } catch (error) {
      console.error(`❌ Error fetching vocabulary for lesson ${lessonKey}:`, error);
      throw error;
    }
  }

  // Get vocabulary words for game
  async getVocabWordsForGame(lessonKey, gameType = 'matching', count = 10) {
    try {
      const response = await apiClient.get(`${this.baseURL}/game/${lessonKey}`, {
        params: { gameType, count }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching game data for lesson ${lessonKey}:`, error);
      throw error;
    }
  }

  // Get random vocabulary words
  async getRandomVocabWords(count = 10, level = null, lessonKey = null) {
    try {
      const params = { count };
      if (level) params.level = level;
      if (lessonKey) params.lessonKey = lessonKey;
      
      const response = await apiClient.get(`${this.baseURL}/random`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching random vocabulary:', error);
      throw error;
    }
  }

  // Search vocabulary words
  async searchVocabWords(query, limit = 20) {
    try {
      const response = await apiClient.get(`${this.baseURL}/search`, {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching vocabulary:`, error);
      throw error;
    }
  }

  // Get vocabulary by level
  async getVocabWordsByLevel(level, limit = 50) {
    try {
      const response = await apiClient.get(this.baseURL, {
        params: { level, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching vocabulary for level ${level}:`, error);
      throw error;
    }
  }

  // Transform vocabulary data for games
  transformVocabForGame(vocabData, gameType = 'matching') {
    if (gameType === 'matching') {
      return vocabData.map(word => ({
        id: word._id,
        thai: word.thai,
        roman: word.roman,
        en: word.en,
        correctAnswer: word.en,
        exampleTH: word.exampleTH,
        exampleEN: word.exampleEN
      }));
    } else if (gameType === 'arrange') {
      return vocabData.map(word => ({
        id: word._id,
        thai: word.thai,
        roman: word.roman,
        en: word.en,
        sentence: word.exampleTH,
        parts: word.exampleTH.split(' '),
        correctOrder: word.exampleTH.split(' ')
      }));
    }
    return vocabData;
  }

  // Get vocabulary for specific game types
  async getMatchingGameData(lessonKey, count = 10) {
    return this.getVocabWordsForGame(lessonKey, 'matching', count);
  }

  async getArrangementGameData(lessonKey, count = 10) {
    return this.getVocabWordsForGame(lessonKey, 'arrange', count);
  }
}

export default new VocabWordService();
