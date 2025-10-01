/**
 * App Configuration
 * การตั้งค่าแอปพลิเคชัน
 */

import { Platform } from 'react-native';

// Environment
export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

// Current environment
export const CURRENT_ENV = __DEV__ ? ENV.DEVELOPMENT : ENV.PRODUCTION;

// API Configuration
export const API_CONFIG = {
  BASE_URL: CURRENT_ENV === ENV.PRODUCTION 
    ? 'https://api.thai-meow.com' 
    : 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Thai Meow',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  PACKAGE_NAME: 'com.thai-meow.app',
  DESCRIPTION: 'แอปเรียนภาษาไทยแนว Duolingo',
  AUTHOR: 'Thai Meow Team',
  SUPPORT_EMAIL: 'support@thai-meow.com',
  WEBSITE: 'https://thai-meow.com'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_DARK_MODE: true,
  ENABLE_BIOMETRIC_AUTH: false,
  ENABLE_SOCIAL_LOGIN: false
};

// Platform Configuration
export const PLATFORM_CONFIG = {
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  IS_WEB: Platform.OS === 'web'
};

// Storage Configuration
export const STORAGE_CONFIG = {
  MAX_STORAGE_SIZE: 50 * 1024 * 1024, // 50MB
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  BACKUP_INTERVAL: 60 * 60 * 1000 // 1 hour
};

// Game Configuration
export const GAME_CONFIG = {
  MAX_LEVEL: 100,
  XP_PER_LEVEL: 1000,
  MAX_STREAK: 365,
  DAILY_GOAL: 100,
  WEEKLY_GOAL: 700,
  MONTHLY_GOAL: 3000
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  DEFAULT_REMINDER_TIME: '09:00',
  QUIET_HOURS_START: '22:00',
  QUIET_HOURS_END: '08:00',
  MAX_NOTIFICATIONS_PER_DAY: 10
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLED: FEATURE_FLAGS.ENABLE_ANALYTICS,
  TRACKING_ID: 'GA-XXXXXXXXX',
  BATCH_SIZE: 10,
  FLUSH_INTERVAL: 30000 // 30 seconds
};

// Security Configuration
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL_CHARS: false,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  IMAGE_CACHE_SIZE: 100,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  LAZY_LOADING_THRESHOLD: 100,
  DEBOUNCE_DELAY: 300
};

// Debug Configuration
export const DEBUG_CONFIG = {
  ENABLED: __DEV__,
  LOG_LEVEL: __DEV__ ? 'debug' : 'error',
  SHOW_DEBUG_INFO: __DEV__,
  ENABLE_REDUX_DEVTOOLS: __DEV__
};

// Localization Configuration
export const LOCALIZATION_CONFIG = {
  DEFAULT_LANGUAGE: 'th',
  SUPPORTED_LANGUAGES: ['th', 'en'],
  FALLBACK_LANGUAGE: 'en'
};

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  AVAILABLE_THEMES: ['light', 'dark'],
  AUTO_SWITCH: false,
  SWITCH_TIME: {
    LIGHT: '06:00',
    DARK: '18:00'
  }
};

// Update Configuration
export const UPDATE_CONFIG = {
  CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  AUTO_UPDATE: false,
  FORCE_UPDATE: false,
  MINIMUM_VERSION: '1.0.0'
};

export default {
  ENV,
  CURRENT_ENV,
  API_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
  PLATFORM_CONFIG,
  STORAGE_CONFIG,
  GAME_CONFIG,
  NOTIFICATION_CONFIG,
  ANALYTICS_CONFIG,
  SECURITY_CONFIG,
  PERFORMANCE_CONFIG,
  DEBUG_CONFIG,
  LOCALIZATION_CONFIG,
  THEME_CONFIG,
  UPDATE_CONFIG
};
