/**
 * Constants
 * ค่าคงที่ต่างๆ ในแอป
 */

// App Info
export const APP_INFO = {
  NAME: 'Thai Meow',
  VERSION: '1.0.0',
  DESCRIPTION: 'แอปเรียนภาษาไทยแนว Duolingo'
};

// Colors
export const COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#666666',
  LIGHT_GRAY: '#F5F5F5',
  DARK_GRAY: '#333333'
};

// Font Sizes
export const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 20,
  XLARGE: 24,
  XXLARGE: 32
};

// Spacing
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48
};

// Border Radius
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 24,
  ROUND: 50
};

// Levels
export const LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Exercise Types
export const EXERCISE_TYPES = {
  MATCHING: 'matching',
  FILL_BLANK: 'fill_blank',
  BUILD_SENTENCE: 'build_sentence',
  WORD_MATCHING: 'word_matching'
};

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  STREAK: 'streak',
  LESSON: 'lesson',
  GAME: 'game',
  VOCABULARY: 'vocabulary',
  SPECIAL: 'special'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  STREAK_REMINDER: 'streak_reminder',
  ACHIEVEMENT: 'achievement',
  LESSON_REMINDER: 'lesson_reminder',
  CHALLENGE_REMINDER: 'challenge_reminder'
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  PROGRESS_DATA: 'progress_data',
  ACHIEVEMENTS_DATA: 'achievements_data',
  DAILY_CHALLENGES_DATA: 'daily_challenges_data',
  VOCABULARY_DATA: 'vocabulary_data',
  LESSONS_DATA: 'lessons_data',
  GAMES_DATA: 'games_data',
  NOTIFICATIONS_DATA: 'notifications_data',
  SETTINGS_DATA: 'settings_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  PLACEMENT_TEST_RESULT: 'placement_test_result',
  PLACEMENT_TEST_COMPLETED: 'placement_test_completed'
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete'
  },
  LESSONS: {
    LIST: '/lessons',
    DETAIL: '/lessons/:id',
    PROGRESS: '/lessons/:id/progress'
  },
  GAMES: {
    LIST: '/games',
    DETAIL: '/games/:id',
    PROGRESS: '/games/:id/progress'
  },
  VOCABULARY: {
    LIST: '/vocabulary',
    LEARNED: '/vocabulary/learned',
    MASTERED: '/vocabulary/mastered',
    DIFFICULT: '/vocabulary/difficult'
  },
  ACHIEVEMENTS: {
    LIST: '/achievements',
    UNLOCK: '/achievements/unlock'
  },
  CHALLENGES: {
    DAILY: '/challenges/daily',
    COMPLETE: '/challenges/:id/complete'
  },
  ANALYTICS: {
    EVENTS: '/analytics/events',
    PROGRESS: '/analytics/progress'
  }
};

// Game Settings
export const GAME_SETTINGS = {
  MAX_ATTEMPTS: 3,
  TIME_LIMIT: 300, // 5 minutes
  POINTS_PER_CORRECT: 10,
  BONUS_POINTS: 5
};

// Notification Settings
export const NOTIFICATION_SETTINGS = {
  DEFAULT_REMINDER_TIME: '09:00',
  DEFAULT_REMINDER_DAYS: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'เกิดปัญหาในการเชื่อมต่ออินเทอร์เน็ต',
  API: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์',
  VALIDATION: 'ข้อมูลที่กรอกไม่ถูกต้อง',
  AUTH: 'เกิดข้อผิดพลาดในการยืนยันตัวตน',
  STORAGE: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
  UNKNOWN: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'เข้าสู่ระบบสำเร็จ',
  REGISTER: 'สมัครสมาชิกสำเร็จ',
  UPDATE: 'อัปเดตข้อมูลสำเร็จ',
  SAVE: 'บันทึกข้อมูลสำเร็จ',
  DELETE: 'ลบข้อมูลสำเร็จ'
};

export default {
  APP_INFO,
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  LEVELS,
  EXERCISE_TYPES,
  ACHIEVEMENT_TYPES,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  GAME_SETTINGS,
  NOTIFICATION_SETTINGS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
