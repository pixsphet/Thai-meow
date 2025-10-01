import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Error Handler
 * จัดการ error ต่างๆ ในแอป
 */

// Error types
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTH_ERROR',
  STORAGE: 'STORAGE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error messages
const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'เกิดปัญหาในการเชื่อมต่ออินเทอร์เน็ต',
  [ErrorTypes.API]: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์',
  [ErrorTypes.VALIDATION]: 'ข้อมูลที่กรอกไม่ถูกต้อง',
  [ErrorTypes.AUTH]: 'เกิดข้อผิดพลาดในการยืนยันตัวตน',
  [ErrorTypes.STORAGE]: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
  [ErrorTypes.UNKNOWN]: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
};

/**
 * จัดการ error และแสดงข้อความ
 */
export const handleError = (error, customMessage = null) => {
  console.error('❌ Error:', error);
  
  const errorType = getErrorType(error);
  const message = customMessage || ErrorMessages[errorType] || ErrorMessages[ErrorTypes.UNKNOWN];
  
  // Log error to storage
  logError(error, errorType);
  
  // Show alert
  Alert.alert('เกิดข้อผิดพลาด', message);
  
  return {
    type: errorType,
    message,
    originalError: error
  };
};

/**
 * กำหนดประเภท error
 */
const getErrorType = (error) => {
  if (error.message?.includes('Network')) return ErrorTypes.NETWORK;
  if (error.message?.includes('API')) return ErrorTypes.API;
  if (error.message?.includes('Validation')) return ErrorTypes.VALIDATION;
  if (error.message?.includes('Auth')) return ErrorTypes.AUTH;
  if (error.message?.includes('Storage')) return ErrorTypes.STORAGE;
  return ErrorTypes.UNKNOWN;
};

/**
 * บันทึก error ลง storage
 */
const logError = async (error, type) => {
  try {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type,
      message: error.message,
      stack: error.stack
    };
    
    const existingLogs = await AsyncStorage.getItem('error_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);
    
    // Keep only last 50 errors
    if (logs.length > 50) {
      logs.splice(0, logs.length - 50);
    }
    
    await AsyncStorage.setItem('error_logs', JSON.stringify(logs));
  } catch (logError) {
    console.error('❌ Error logging error:', logError);
  }
};

/**
 * แสดง error message แบบเงียบ
 */
export const showSilentError = (error) => {
  console.error('❌ Silent Error:', error);
  logError(error, getErrorType(error));
};

/**
 * แสดง error message แบบ custom
 */
export const showCustomError = (title, message) => {
  Alert.alert(title, message);
};

/**
 * แสดง error message แบบ retry
 */
export const showRetryError = (error, onRetry) => {
  Alert.alert(
    'เกิดข้อผิดพลาด',
    'เกิดข้อผิดพลาดในการโหลดข้อมูล',
    [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลองใหม่', onPress: onRetry }
    ]
  );
};

export default {
  handleError,
  showSilentError,
  showCustomError,
  showRetryError,
  ErrorTypes
};
