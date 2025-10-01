import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

/**
 * Helper Functions
 * ฟังก์ชันช่วยเหลือต่างๆ
 */

const { width, height } = Dimensions.get('window');

/**
 * จัดรูปแบบวันที่
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * จัดรูปแบบเวลา
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * คำนวณเปอร์เซ็นต์
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * สร้าง ID แบบสุ่ม
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * ตรวจสอบว่าเป็น email ที่ถูกต้องหรือไม่
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * ตรวจสอบว่าเป็นรหัสผ่านที่แข็งแกร่งหรือไม่
 */
export const isStrongPassword = (password) => {
  // อย่างน้อย 8 ตัวอักษร, มีตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * ตรวจสอบว่าเป็นเบอร์โทรศัพท์ที่ถูกต้องหรือไม่
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * จัดรูปแบบเบอร์โทรศัพท์
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * ตรวจสอบว่าเป็น URL ที่ถูกต้องหรือไม่
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * สร้าง delay
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * ตรวจสอบว่าเป็น object ที่ว่างหรือไม่
 */
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

/**
 * ลบข้อมูลที่ซ้ำกันใน array
 */
export const removeDuplicates = (array, key) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * เรียงลำดับ array
 */
export const sortArray = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * ค้นหาใน array
 */
export const searchInArray = (array, query, keys) => {
  if (!query) return array;
  
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
  });
};

/**
 * ตรวจสอบว่าเป็น mobile device หรือไม่
 */
export const isMobile = () => {
  return width < 768;
};

/**
 * ตรวจสอบว่าเป็น tablet หรือไม่
 */
export const isTablet = () => {
  return width >= 768 && width < 1024;
};

/**
 * ตรวจสอบว่าเป็น desktop หรือไม่
 */
export const isDesktop = () => {
  return width >= 1024;
};

/**
 * คำนวณขนาดหน้าจอ
 */
export const getScreenSize = () => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

/**
 * บันทึกข้อมูลลง storage
 */
export const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Error saving to storage:', error);
    return false;
  }
};

/**
 * อ่านข้อมูลจาก storage
 */
export const getFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Error getting from storage:', error);
    return null;
  }
};

/**
 * ลบข้อมูลจาก storage
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('❌ Error removing from storage:', error);
    return false;
  }
};

/**
 * ล้างข้อมูลทั้งหมดใน storage
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

export default {
  formatDate,
  formatTime,
  calculatePercentage,
  generateId,
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  formatPhone,
  isValidUrl,
  delay,
  isEmpty,
  removeDuplicates,
  sortArray,
  searchInArray,
  isMobile,
  isTablet,
  isDesktop,
  getScreenSize,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  clearStorage
};
