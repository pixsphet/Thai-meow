import apiService from './apiService';

class DataService {
  // Vocabulary data
  async getVocabularies(category = null, level = null) {
    try {
      const params = {};
      if (category) params.category = category;
      if (level) params.level = level;
      
      return await apiService.getVocabularies(params);
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      throw error;
    }
  }

  async getVocabulariesByCategory(category) {
    try {
      return await apiService.getVocabulariesByCategory(category);
    } catch (error) {
      console.error('Error fetching vocabularies by category:', error);
      throw error;
    }
  }

  async getVocabulariesByLesson(lessonId) {
    try {
      return await apiService.getVocabulariesByLesson(lessonId);
    } catch (error) {
      console.error('Error fetching vocabularies by lesson:', error);
      throw error;
    }
  }

  async searchVocabularies(query) {
    try {
      return await apiService.searchVocabularies(query);
    } catch (error) {
      console.error('Error searching vocabularies:', error);
      throw error;
    }
  }

  // Game data
  async getGames(level = null, type = null) {
    try {
      const params = {};
      if (level) params.level = level;
      if (type) params.type = type;
      
      return await apiService.getGames(params);
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  async getGamesByLevel(level) {
    try {
      return await apiService.getGamesByLevel(level);
    } catch (error) {
      console.error('Error fetching games by level:', error);
      throw error;
    }
  }

  async getGamesByType(type) {
    try {
      return await apiService.getGamesByType(type);
    } catch (error) {
      console.error('Error fetching games by type:', error);
      throw error;
    }
  }

  // Lesson data
  async getLessons(level = null, category = null) {
    try {
      const params = {};
      if (level) params.level = level;
      if (category) params.category = category;
      
      return await apiService.getLessons(params);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  }

  async getLessonsByLevel(level) {
    try {
      return await apiService.getLessonsByLevel(level);
    } catch (error) {
      console.error('Error fetching lessons by level:', error);
      throw error;
    }
  }

  async getLessonsByCategory(category) {
    try {
      return await apiService.getLessonsByCategory(category);
    } catch (error) {
      console.error('Error fetching lessons by category:', error);
      throw error;
    }
  }

  // Audio data
  async getAudio(params = {}) {
    try {
      return await apiService.getAudio(params);
    } catch (error) {
      console.error('Error fetching audio:', error);
      throw error;
    }
  }

  async getSimpleAudio(params = {}) {
    try {
      return await apiService.getSimpleAudio(params);
    } catch (error) {
      console.error('Error fetching simple audio:', error);
      throw error;
    }
  }

  async getAiAudio(params = {}) {
    try {
      return await apiService.getAiAudio(params);
    } catch (error) {
      console.error('Error fetching AI audio:', error);
      throw error;
    }
  }

  // Arrange sentence data
  async getArrangeSentences(level = null) {
    try {
      const params = {};
      if (level) params.level = level;
      
      return await apiService.getArrangeSentences(params);
    } catch (error) {
      console.error('Error fetching arrange sentences:', error);
      throw error;
    }
  }

  async getArrangeSentencesByLevel(level) {
    try {
      return await apiService.getArrangeSentencesByLevel(level);
    } catch (error) {
      console.error('Error fetching arrange sentences by level:', error);
      throw error;
    }
  }

  // User progress
  async getUserProgress(userId) {
    try {
      return await apiService.getUserProgress(userId);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async updateUserProgress(userId, lessonId, progress) {
    try {
      return await apiService.updateUserProgress(userId, lessonId, progress);
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  // Game results
  async getGameResults(userId) {
    try {
      return await apiService.getGameResults(userId);
    } catch (error) {
      console.error('Error fetching game results:', error);
      throw error;
    }
  }

  async saveGameResult(userId, gameId, score, timeSpent) {
    try {
      return await apiService.saveGameResult(userId, gameId, score, timeSpent);
    } catch (error) {
      console.error('Error saving game result:', error);
      throw error;
    }
  }

  // Helper methods for specific game types
  async getThaiConsonants() {
    try {
      return await this.getVocabulariesByCategory('basic_letters');
    } catch (error) {
      console.error('Error fetching Thai consonants:', error);
      throw error;
    }
  }

  async getThaiVowels() {
    try {
      return await this.getVocabulariesByCategory('vowels');
    } catch (error) {
      console.error('Error fetching Thai vowels:', error);
      throw error;
    }
  }

  async getThaiTones() {
    try {
      return await this.getVocabulariesByCategory('tones');
    } catch (error) {
      console.error('Error fetching Thai tones:', error);
      throw error;
    }
  }

  async getGreetings() {
    try {
      return await this.getVocabulariesByCategory('greetings');
    } catch (error) {
      console.error('Error fetching greetings:', error);
      throw error;
    }
  }

  async getNumbers() {
    try {
      return await this.getVocabulariesByCategory('numbers');
    } catch (error) {
      console.error('Error fetching numbers:', error);
      throw error;
    }
  }

  async getFamily() {
    try {
      return await this.getVocabulariesByCategory('family');
    } catch (error) {
      console.error('Error fetching family:', error);
      throw error;
    }
  }

  async getFood() {
    try {
      return await this.getVocabulariesByCategory('food');
    } catch (error) {
      console.error('Error fetching food:', error);
      throw error;
    }
  }

  async getColors() {
    try {
      return await this.getVocabulariesByCategory('colors');
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  }

  async getVerbs() {
    try {
      return await this.getVocabulariesByCategory('verbs');
    } catch (error) {
      console.error('Error fetching verbs:', error);
      throw error;
    }
  }

  async getPlaces() {
    try {
      return await this.getVocabulariesByCategory('places');
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }

  async getTime() {
    try {
      return await this.getVocabulariesByCategory('time');
    } catch (error) {
      console.error('Error fetching time:', error);
      throw error;
    }
  }

  async getWeather() {
    try {
      return await this.getVocabulariesByCategory('weather');
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  async getHobbies() {
    try {
      return await this.getVocabulariesByCategory('hobbies');
    } catch (error) {
      console.error('Error fetching hobbies:', error);
      throw error;
    }
  }

  async getShopping() {
    try {
      return await this.getVocabulariesByCategory('shopping');
    } catch (error) {
      console.error('Error fetching shopping:', error);
      throw error;
    }
  }

  async getTravel() {
    try {
      return await this.getVocabulariesByCategory('travel');
    } catch (error) {
      console.error('Error fetching travel:', error);
      throw error;
    }
  }

  async getConversation() {
    try {
      return await this.getVocabulariesByCategory('conversation');
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async getAnimals() {
    try {
      return await this.getVocabulariesByCategory('animals');
    } catch (error) {
      console.error('Error fetching animals:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;
