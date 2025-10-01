import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lesson Service
 * จัดการบทเรียน
 */
class LessonService {
  constructor() {
    this.storageKey = 'user_lessons';
  }

  /**
   * เริ่มต้น service
   */
  async initialize() {
    try {
      console.log('📚 Lesson service initialized');
    } catch (error) {
      console.error('❌ Error initializing lesson service:', error);
    }
  }

  /**
   * ดึงบทเรียนทั้งหมด
   */
  async getAllLessons() {
    try {
      const localData = await AsyncStorage.getItem(this.storageKey);
      if (localData) {
        return JSON.parse(localData);
      }
      
      // Mock data
      return this.getMockLessons();
    } catch (error) {
      console.error('❌ Error getting lessons:', error);
      return [];
    }
  }

  /**
   * Mock lessons สำหรับทดสอบ
   */
  getMockLessons() {
    return [
      {
        id: 'lesson_1',
        title: 'พยัญชนะพื้นฐาน',
        level: 'beginner',
        description: 'เรียนรู้พยัญชนะไทยพื้นฐาน',
        progress: 0,
        completed: false,
        unlocked: true
      },
      {
        id: 'lesson_2',
        title: 'สระพื้นฐาน',
        level: 'beginner',
        description: 'เรียนรู้สระไทยพื้นฐาน',
        progress: 0,
        completed: false,
        unlocked: false
      }
    ];
  }

  /**
   * อัปเดตความคืบหน้าบทเรียน
   */
  async updateLessonProgress(lessonId, progressData) {
    try {
      console.log('📝 Updating lesson progress:', lessonId, progressData);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating lesson progress:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new LessonService();
