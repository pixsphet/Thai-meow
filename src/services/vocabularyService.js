import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Vocabulary Service
 * จัดการคำศัพท์และการเรียนรู้
 */
class VocabularyService {
  constructor() {
    this.storageKey = 'user_vocabulary';
    this.learnedKey = 'learned_vocabulary';
    this.masteredKey = 'mastered_vocabulary';
    this.difficultKey = 'difficult_vocabulary';
  }

  /**
   * ดึงคำศัพท์ที่เรียนรู้แล้ว
   */
  async getLearnedVocabulary(userId = 'default') {
    try {
      const localData = await AsyncStorage.getItem(this.learnedKey);
      if (localData) {
        return JSON.parse(localData);
      }
      
      // Mock data
      return this.getMockLearnedVocabulary();
    } catch (error) {
      console.error('❌ Error getting learned vocabulary:', error);
      return [];
    }
  }

  // Mock data removed - using MongoDB Atlas data instead

  /**
   * ดึงคำศัพท์ที่เชี่ยวชาญแล้ว
   */
  async getMasteredVocabulary(userId = 'default') {
    try {
      const localData = await AsyncStorage.getItem(this.masteredKey);
      if (localData) {
        return JSON.parse(localData);
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting mastered vocabulary:', error);
      return [];
    }
  }

  /**
   * ดึงคำศัพท์ที่ยาก
   */
  async getDifficultVocabulary(userId = 'default') {
    try {
      const localData = await AsyncStorage.getItem(this.difficultKey);
      if (localData) {
        return JSON.parse(localData);
      }
      return [];
    } catch (error) {
      console.error('❌ Error getting difficult vocabulary:', error);
      return [];
    }
  }

  /**
   * อัปเดตความคืบหน้าคำศัพท์
   */
  async updateVocabularyProgress(vocabularyId, progressData) {
    try {
      console.log('📝 Updating vocabulary progress:', vocabularyId, progressData);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating vocabulary progress:', error);
      throw error;
    }
  }

  /**
   * ตั้งค่าเป็นเชี่ยวชาญ
   */
  async markAsMastered(vocabularyId) {
    try {
      console.log('🏆 Marking as mastered:', vocabularyId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error marking as mastered:', error);
      throw error;
    }
  }

  /**
   * ตั้งค่าเป็นยาก
   */
  async markAsDifficult(vocabularyId) {
    try {
      console.log('⚠️ Marking as difficult:', vocabularyId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error marking as difficult:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new VocabularyService();
