// MongoDB Atlas Configuration
// ข้อมูลทั้งหมดจะถูกเก็บใน MongoDB Atlas เท่านั้น

export const MONGODB_ATLAS_CONFIG = {
  // API Base URL for MongoDB Atlas Backend
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // MongoDB Atlas Collections
  COLLECTIONS: {
    USERS: 'users',
    PROGRESS: 'progress',
    ACHIEVEMENTS: 'achievements',
    LESSONS: 'lessons',
    VOCABULARY: 'vocabulary',
    GAMES: 'games',
    DAILY_CHALLENGES: 'daily_challenges'
  },
  
  // Data Storage Strategy
  STORAGE_STRATEGY: {
    // ใช้ MongoDB Atlas เป็นหลัก
    PRIMARY: 'mongodb_atlas',
    
    // ใช้ AsyncStorage เฉพาะสำหรับ
    CACHE_ONLY: [
      'auth_token',        // โทเค็นการเข้าสู่ระบบ
      'app_settings',      // การตั้งค่าแอป
      'offline_mode'       // โหมดออฟไลน์
    ],
    
    // ข้อมูลที่ต้องเก็บใน MongoDB Atlas เท่านั้น
    MONGODB_ONLY: [
      'user_progress',     // ความคืบหน้าผู้ใช้
      'user_achievements', // รางวัลผู้ใช้
      'user_data',         // ข้อมูลผู้ใช้
      'game_results',      // ผลการเล่นเกม
      'lesson_progress',   // ความคืบหน้าบทเรียน
      'daily_streak',      // แสตรีก
      'statistics',        // สถิติ
      'vocabulary',        // คำศัพท์ทั้งหมด
      'learned_vocabulary', // คำศัพท์ที่เรียนแล้ว
      'mastered_vocabulary', // คำศัพท์ที่เชี่ยวชาญ
      'difficult_vocabulary' // คำศัพท์ที่ยาก
    ]
  },
  
  // API Endpoints for MongoDB Atlas
  ENDPOINTS: {
    // User endpoints
    USER_PROGRESS: '/progress/user',
    USER_ACHIEVEMENTS: '/achievements/user',
    USER_DATA: '/users',
    
    // Progress endpoints
    PROGRESS_UPDATE: '/progress',
    PROGRESS_STATS: '/progress/stats',
    
    // Game endpoints
    GAME_RESULTS: '/game-results',
    GAME_STATS: '/games/stats',
    
    // Lesson endpoints
    LESSON_PROGRESS: '/lessons/progress',
    LESSON_COMPLETE: '/lessons/complete',
    
    // Achievement endpoints
    ACHIEVEMENTS_ALL: '/achievements',
    ACHIEVEMENTS_CLAIM: '/achievements/claim',
    
    // Daily challenge endpoints
    DAILY_CHALLENGES: '/daily-challenges',
    DAILY_CHALLENGES_CLAIM: '/daily-challenges/claim',
    
    // Vocabulary endpoints
    VOCABULARY_ALL: '/vocabulary',
    VOCABULARY_CATEGORY: '/vocabulary/category',
    VOCABULARY_LEARNED: '/vocabulary/learned',
    VOCABULARY_MASTERED: '/vocabulary/mastered',
    VOCABULARY_DIFFICULT: '/vocabulary/difficult',
    VOCABULARY_SEARCH: '/vocabulary/search'
  },
  
  // Error Handling
  ERROR_HANDLING: {
    // ไม่มี fallback ไปยัง local storage
    NO_LOCAL_FALLBACK: true,
    
    // แสดงข้อความเมื่อไม่สามารถเชื่อมต่อ MongoDB Atlas ได้
    OFFLINE_MESSAGE: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  },
  
  // Data Sync Strategy
  SYNC_STRATEGY: {
    // Sync ทุกครั้งที่มีการเปลี่ยนแปลง
    SYNC_ON_CHANGE: true,
    
    // ไม่เก็บข้อมูลใน local storage
    NO_LOCAL_CACHE: true,
    
    // ใช้ real-time updates จาก MongoDB Atlas
    REAL_TIME_UPDATES: true
  }
};

// Helper functions
export const isMongoDBOnlyData = (dataType) => {
  return MONGODB_ATLAS_CONFIG.STORAGE_STRATEGY.MONGODB_ONLY.includes(dataType);
};

export const isCacheOnlyData = (dataType) => {
  return MONGODB_ATLAS_CONFIG.STORAGE_STRATEGY.CACHE_ONLY.includes(dataType);
};

export const getMongoDBEndpoint = (endpoint) => {
  return `${MONGODB_ATLAS_CONFIG.API_BASE_URL}${endpoint}`;
};

export default MONGODB_ATLAS_CONFIG;
