// API Configuration for MongoDB Atlas
export const API_CONFIG = {
  // MongoDB Atlas Backend API
  BASE_URL: 'http://localhost:3000/api',
  
  // API Endpoints
  ENDPOINTS: {
    // Vocabulary endpoints
    VOCABULARY: '/vocabulary',
    VOCABULARY_BY_CATEGORY: '/vocabulary/category',
    VOCABULARY_BY_LESSON: '/vocabulary/lesson',
    VOCABULARY_SEARCH: '/vocabulary/search',
    
    // Game endpoints
    GAMES: '/games',
    GAMES_BY_LEVEL: '/games/level',
    GAMES_BY_TYPE: '/games/type',
    
    // Lesson endpoints
    LESSONS: '/lessons',
    LESSONS_BY_LEVEL: '/lessons/level',
    LESSONS_BY_CATEGORY: '/lessons/category',
    
    // Audio endpoints
    AUDIO: '/audio',
    SIMPLE_AUDIO: '/simple-audio',
    AI_AUDIO: '/ai-audio',
    
    // Arrange sentence endpoints
    ARRANGE_SENTENCE: '/arrange-sentence',
    ARRANGE_SENTENCE_BY_LEVEL: '/arrange-sentence/level',
    
    // User progress endpoints
    USER_PROGRESS: '/user-progress',
    USER_PROGRESS_BY_USER: '/user-progress/user',
    USER_PROGRESS_BY_LESSON: '/user-progress/lesson',
    
    // Progress endpoints (for new progress system)
    PROGRESS: '/progress',
    PROGRESS_GAME: '/progress/game',
    PROGRESS_LEVEL: '/progress/level',
    PROGRESS_CATEGORY: '/progress/category',
    PROGRESS_LEADERBOARD: '/progress/leaderboard',
    
    // Achievement endpoints
    ACHIEVEMENTS: '/achievements',
    ACHIEVEMENTS_USER: '/achievements/user',
    ACHIEVEMENTS_CHECK: '/achievements/check',
    ACHIEVEMENTS_SEED: '/achievements/seed',
    
    // Daily challenge endpoints
    DAILY_CHALLENGES: '/daily-challenges',
    DAILY_CHALLENGES_USER: '/daily-challenges/user',
    DAILY_CHALLENGES_CLAIM: '/daily-challenges/claim',
    
    // Game results endpoints
    GAME_RESULTS: '/game-results',
    GAME_RESULTS_BY_USER: '/game-results/user',
    GAME_RESULTS_BY_GAME: '/game-results/game',
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
  
  // Error handling
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'Data not found.',
    UNAUTHORIZED: 'Unauthorized access.',
    FORBIDDEN: 'Access forbidden.',
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.code === 'NETWORK_ERROR') {
    return API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
  } else if (error.code === 'TIMEOUT') {
    return API_CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR;
  } else if (error.response?.status === 404) {
    return API_CONFIG.ERROR_MESSAGES.NOT_FOUND;
  } else if (error.response?.status === 401) {
    return API_CONFIG.ERROR_MESSAGES.UNAUTHORIZED;
  } else if (error.response?.status === 403) {
    return API_CONFIG.ERROR_MESSAGES.FORBIDDEN;
  } else if (error.response?.status >= 500) {
    return API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
  }
  
  return error.message || 'An unexpected error occurred.';
};

export default API_CONFIG;
