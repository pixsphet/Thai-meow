import { API_CONFIG, buildApiUrl, handleApiError } from '../config/apiConfig';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.REQUEST_CONFIG.timeout;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = buildApiUrl(endpoint);
    
    // Get token from AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('authToken');
    
    // Debug logging (can be removed in production)
    // console.log('API Request - Endpoint:', endpoint);
    // console.log('API Request - Token exists:', !!token);
    
    const config = {
      ...API_CONFIG.REQUEST_CONFIG,
      ...options,
      headers: {
        ...API_CONFIG.REQUEST_CONFIG.headers,
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
    };
    
    // Remove undefined Authorization header
    if (!config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    
    // console.log('API Request - Headers:', config.headers);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // console.error('API Error Response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      // console.log('API Success Response:', data);
      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication API methods
  async login(email, password) {
    try {
      // ใช้ mock สำหรับตอนนี้
      console.log('🔐 Mock: Login attempt for', email);
      const mockResponse = {
        data: {
          user: { 
            id: 'mock_user_1', 
            email: email, 
            name: 'Mock User', 
            level: 'beginner', 
            points: 100, 
            gems: 50 
          },
          token: 'mock_token_' + Date.now()
        }
      };
      return mockResponse;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      // ใช้ mock สำหรับตอนนี้
      console.log('📝 Mock: Registration attempt for', userData.email);
      const mockResponse = {
        data: {
          user: { 
            id: 'mock_user_' + Date.now(), 
            email: userData.email, 
            name: userData.name || 'New User', 
            level: 'beginner', 
            points: 0, 
            gems: 10 
          },
          token: 'mock_token_' + Date.now()
        }
      };
      return mockResponse;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      // ใช้ mock สำหรับตอนนี้
      console.log('🚪 Mock: Logout attempt');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  async trackEvent(eventName, eventData = {}) {
    try {
      // ใช้ mock สำหรับตอนนี้ - ไม่ส่งไปยัง API จริง
      console.log('📊 Mock: Track event', eventName, eventData);
      const event = { 
        event: eventName, 
        data: eventData, 
        timestamp: new Date().toISOString() 
      };
      
      // บันทึกลง local storage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const events = await this.getStoredEvents();
      events.push(event);
      await AsyncStorage.setItem('analytics_events', JSON.stringify(events));
      
      return { success: true };
    } catch (error) {
      console.error('❌ Track event error:', error);
      throw error;
    }
  }

  async getStoredEvents() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const events = await AsyncStorage.getItem('analytics_events');
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error('❌ Get stored events error:', error);
      return [];
    }
  }

  // Vocabulary API methods
  async getVocabularies(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.VOCABULARY, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getVocabularyById(id) {
    try {
      return await this.get(`${API_CONFIG.ENDPOINTS.VOCABULARY}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getVocabulariesByCategory(category) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.VOCABULARY_BY_CATEGORY, { category });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getVocabulariesByLesson(lessonId) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.VOCABULARY_BY_LESSON, { lesson_id: lessonId });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async searchVocabularies(query) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.VOCABULARY_SEARCH, { q: query });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Games API methods
  async getGames(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.GAMES, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getGamesByLevel(level) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.GAMES_BY_LEVEL, { level });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getGamesByType(type) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.GAMES_BY_TYPE, { type });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Lessons API methods
  async getLessons(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.LESSONS, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getLessonsByLevel(level) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.LESSONS_BY_LEVEL, { level });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getLessonsByCategory(category) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.LESSONS_BY_CATEGORY, { category });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Audio API methods
  async getAudio(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.AUDIO, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getSimpleAudio(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.SIMPLE_AUDIO, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAiAudio(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.AI_AUDIO, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Arrange sentence API methods
  async getArrangeSentences(params = {}) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.ARRANGE_SENTENCE, params);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getArrangeSentencesByLevel(level) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.ARRANGE_SENTENCE_BY_LEVEL, { level });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // User progress API methods
  async getUserProgress(userId) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.USER_PROGRESS_BY_USER, { user_id: userId });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateUserProgress(userId, lessonId, progress) {
    try {
      return await this.post(API_CONFIG.ENDPOINTS.USER_PROGRESS, {
        user_id: userId,
        lesson_id: lessonId,
        progress: progress,
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Game results API methods
  async getGameResults(userId) {
    try {
      return await this.get(API_CONFIG.ENDPOINTS.GAME_RESULTS_BY_USER, { user_id: userId });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async saveGameResult(userId, gameId, score, timeSpent) {
    try {
      return await this.post(API_CONFIG.ENDPOINTS.GAME_RESULTS, {
        user_id: userId,
        game_id: gameId,
        score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
