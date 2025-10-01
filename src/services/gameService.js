import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Game Service
 * จัดการเกมและแบบฝึกหัด
 */
class GameService {
  constructor() {
    this.storageKey = 'user_games';
  }

  /**
   * เริ่มต้น service
   */
  async initialize() {
    try {
      console.log('🎮 Game service initialized');
    } catch (error) {
      console.error('❌ Error initializing game service:', error);
    }
  }

  /**
   * ดึงเกมทั้งหมด
   */
  async getAllGames() {
    try {
      const localData = await AsyncStorage.getItem(this.storageKey);
      if (localData) {
        return JSON.parse(localData);
      }
      
      // Mock data
      return this.getMockGames();
    } catch (error) {
      console.error('❌ Error getting games:', error);
      return [];
    }
  }

  /**
   * Mock games สำหรับทดสอบ
   */
  getMockGames() {
    return [
      {
        id: 'game_1',
        title: 'จับคู่คำศัพท์',
        type: 'matching',
        level: 'beginner',
        description: 'จับคู่คำศัพท์ไทย-อังกฤษ',
        progress: 0,
        completed: false,
        unlocked: true
      },
      {
        id: 'game_2',
        title: 'เติมคำในช่องว่าง',
        type: 'fill_blank',
        level: 'beginner',
        description: 'เติมคำที่หายไปในประโยค',
        progress: 0,
        completed: false,
        unlocked: false
      }
    ];
  }

  /**
   * อัปเดตความคืบหน้าเกม
   */
  async updateGameProgress(gameId, progressData) {
    try {
      console.log('📝 Updating game progress:', gameId, progressData);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating game progress:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new GameService();
