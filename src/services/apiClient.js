/**
 * 🚀 API Client for MongoDB Atlas Integration
 * Complete API client with all GET and POST requests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.timeout = 10000;
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    
    const config = {
      method: 'GET',
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Remove undefined Authorization header
    if (!config.headers.Authorization) {
      delete config.headers.Authorization;
    }

    try {
      console.log(`🌐 API Request: ${config.method} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response: ${config.method} ${url}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${config.method} ${url}`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // ========================================
  // 👤 USER MANAGEMENT APIs
  // ========================================

  /**
   * Register new user
   */
  async registerUser(userData) {
    return this.post('/auth/register', userData);
  }

  /**
   * Login user
   */
  async loginUser(credentials) {
    const response = await this.post('/auth/login', credentials);
    
    // Store token
    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }
    
    return response;
  }

  /**
   * Logout user
   */
  async logoutUser() {
    await AsyncStorage.removeItem('authToken');
    return { success: true, message: 'Logged out successfully' };
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    return this.get(`/users/${userId}`);
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId, profileData) {
    return this.put(`/users/${userId}/profile`, profileData);
  }

  /**
   * Update user stats
   */
  async updateUserStats(userId, stats) {
    return this.put(`/users/${userId}/stats`, { stats });
  }

  /**
   * Add user achievement
   */
  async addUserAchievement(userId, achievement) {
    return this.post(`/users/${userId}/achievements`, { achievement });
  }

  /**
   * Add user badge
   */
  async addUserBadge(userId, badge) {
    return this.post(`/users/${userId}/badges`, { badge });
  }

  // ========================================
  // 📊 PROGRESS MANAGEMENT APIs
  // ========================================

  /**
   * Get user progress
   */
  async getUserProgress(userId) {
    return this.get(`/progress/${userId}`);
  }

  /**
   * Update game progress
   */
  async updateGameProgress(gameData) {
    return this.post('/progress/game', gameData);
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId) {
    return this.get(`/achievements/user/${userId}`);
  }

  /**
   * Get achievement stats
   */
  async getAchievementStats(userId) {
    return this.get(`/achievements/stats/${userId}`);
  }

  /**
   * Get all achievements
   */
  async getAllAchievements() {
    return this.get('/achievements');
  }

  /**
   * Check and unlock achievements
   */
  async checkAchievements(userId) {
    return this.post(`/achievements/check/${userId}`);
  }

  // ========================================
  // 🎮 GAME DATA APIs
  // ========================================

  /**
   * Get vocabulary
   */
  async getVocabulary(params = {}) {
    return this.get('/vocabulary', params);
  }

  /**
   * Get vocabulary by category
   */
  async getVocabularyByCategory(category) {
    return this.get('/vocabulary/category', { category });
  }

  /**
   * Get vocabulary by lesson
   */
  async getVocabularyByLesson(lessonId) {
    return this.get('/vocabulary/lesson', { lessonId });
  }

  /**
   * Search vocabulary
   */
  async searchVocabulary(query) {
    return this.get('/vocabulary/search', { q: query });
  }

  /**
   * Get games
   */
  async getGames(params = {}) {
    return this.get('/games', params);
  }

  /**
   * Get games by level
   */
  async getGamesByLevel(level) {
    return this.get('/games/level', { level });
  }

  /**
   * Get games by type
   */
  async getGamesByType(type) {
    return this.get('/games/type', { type });
  }

  // ========================================
  // 📚 LESSON APIs
  // ========================================

  /**
   * Get lessons
   */
  async getLessons(params = {}) {
    return this.get('/lessons', params);
  }

  /**
   * Get lessons by level
   */
  async getLessonsByLevel(level) {
    return this.get('/lessons/level', { level });
  }

  /**
   * Get lessons by category
   */
  async getLessonsByCategory(category) {
    return this.get('/lessons/category', { category });
  }

  // ========================================
  // 🎵 AUDIO APIs
  // ========================================

  /**
   * Get audio
   */
  async getAudio(text) {
    return this.get('/audio', { text });
  }

  /**
   * Get simple audio
   */
  async getSimpleAudio(text) {
    return this.get('/simple-audio', { text });
  }

  /**
   * Get AI audio
   */
  async getAIAudio(text, options = {}) {
    return this.post('/ai-audio', {
      text,
      voice: options.voice || 'th-TH-Standard-A',
      speed: options.speed || 1.0,
      pitch: options.pitch || 1.0,
      volume: options.volume || 1.0
    });
  }

  // ========================================
  // 🏆 LEADERBOARD APIs
  // ========================================

  /**
   * Get global leaderboard
   */
  async getGlobalLeaderboard(limit = 50, sortBy = 'total_xp') {
    return this.get('/leaderboard', { limit, sortBy });
  }

  /**
   * Get weekly leaderboard
   */
  async getWeeklyLeaderboard(limit = 50) {
    return this.get('/leaderboard/weekly', { limit });
  }

  // ========================================
  // 🎯 DAILY CHALLENGES APIs
  // ========================================

  /**
   * Get daily challenges
   */
  async getDailyChallenges() {
    return this.get('/daily-challenges');
  }

  /**
   * Get user daily challenges
   */
  async getUserDailyChallenges(userId) {
    return this.get(`/daily-challenges/user/${userId}`);
  }

  /**
   * Complete daily challenge
   */
  async completeDailyChallenge(challengeId, userId, score, timeSpent) {
    return this.post('/daily-challenges/complete', {
      challengeId,
      userId,
      score,
      timeSpent
    });
  }

  // ========================================
  // 🔧 UTILITY METHODS
  // ========================================

  /**
   * Test API connection
   */
  async testConnection() {
    return this.get('/test');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored token
   */
  async getToken() {
    return await AsyncStorage.getItem('authToken');
  }

  /**
   * Set token
   */
  async setToken(token) {
    await AsyncStorage.setItem('authToken', token);
  }

  /**
   * Clear token
   */
  async clearToken() {
    await AsyncStorage.removeItem('authToken');
  }

  /**
   * Refresh token (if implemented)
   */
  async refreshToken() {
    try {
      const response = await this.post('/auth/refresh');
      if (response.token) {
        await this.setToken(response.token);
      }
      return response;
    } catch (error) {
      await this.clearToken();
      throw error;
    }
  }
}

// Export singleton instance
export default new ApiClient();
