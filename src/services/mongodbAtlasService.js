import { apiClient } from './apiClient';
import { MONGODB_ATLAS_CONFIG } from '../config/mongodbAtlasConfig';

/**
 * MongoDB Atlas Service
 * บริการจัดการข้อมูลทั้งหมดผ่าน MongoDB Atlas เท่านั้น
 * ไม่ใช้ AsyncStorage หรือ local storage
 */
class MongoDBAtlasService {
  constructor() {
    this.baseURL = MONGODB_ATLAS_CONFIG.API_BASE_URL;
  }

  /**
   * ดึงข้อมูลผู้ใช้จาก MongoDB Atlas
   */
  async getUserData(userId) {
    try {
      const response = await apiClient.get(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.USER_DATA}/${userId}`);
      console.log('✅ User data loaded from MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error loading user data from MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * อัปเดตข้อมูลผู้ใช้ใน MongoDB Atlas
   */
  async updateUserData(userId, userData) {
    try {
      const response = await apiClient.put(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.USER_DATA}/${userId}`, userData);
      console.log('✅ User data updated in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user data in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * ดึงความคืบหน้าผู้ใช้จาก MongoDB Atlas
   */
  async getUserProgress(userId) {
    try {
      const response = await apiClient.get(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.USER_PROGRESS}/${userId}`);
      console.log('✅ User progress loaded from MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error loading user progress from MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * อัปเดตความคืบหน้าผู้ใช้ใน MongoDB Atlas
   */
  async updateUserProgress(userId, progressData) {
    try {
      const response = await apiClient.put(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.PROGRESS_UPDATE}/${userId}`, progressData);
      console.log('✅ User progress updated in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user progress in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * ดึงรางวัลผู้ใช้จาก MongoDB Atlas
   */
  async getUserAchievements(userId) {
    try {
      const response = await apiClient.get(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.USER_ACHIEVEMENTS}/${userId}`);
      console.log('✅ User achievements loaded from MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error loading user achievements from MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * อัปเดตรางวัลผู้ใช้ใน MongoDB Atlas
   */
  async updateUserAchievements(userId, achievements) {
    try {
      const response = await apiClient.put(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.ACHIEVEMENTS_CLAIM}/${userId}`, { achievements });
      console.log('✅ User achievements updated in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user achievements in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * บันทึกผลการเล่นเกมใน MongoDB Atlas
   */
  async saveGameResult(userId, gameResult) {
    try {
      const response = await apiClient.post(MONGODB_ATLAS_CONFIG.ENDPOINTS.GAME_RESULTS, {
        user_id: userId,
        ...gameResult
      });
      console.log('✅ Game result saved in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error saving game result in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * บันทึกความคืบหน้าบทเรียนใน MongoDB Atlas
   */
  async saveLessonProgress(userId, lessonProgress) {
    try {
      const response = await apiClient.post(MONGODB_ATLAS_CONFIG.ENDPOINTS.LESSON_PROGRESS, {
        user_id: userId,
        ...lessonProgress
      });
      console.log('✅ Lesson progress saved in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error saving lesson progress in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * ดึงสถิติผู้ใช้จาก MongoDB Atlas
   */
  async getUserStats(userId) {
    try {
      const response = await apiClient.get(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.PROGRESS_STATS}/${userId}`);
      console.log('✅ User stats loaded from MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error loading user stats from MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * ดึงข้อมูลภารกิจรายวันจาก MongoDB Atlas
   */
  async getDailyChallenges() {
    try {
      const response = await apiClient.get(MONGODB_ATLAS_CONFIG.ENDPOINTS.DAILY_CHALLENGES);
      console.log('✅ Daily challenges loaded from MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error loading daily challenges from MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * อัปเดตภารกิจรายวันใน MongoDB Atlas
   */
  async updateDailyChallenge(userId, challengeId, progress) {
    try {
      const response = await apiClient.put(`${MONGODB_ATLAS_CONFIG.ENDPOINTS.DAILY_CHALLENGES_CLAIM}/${challengeId}`, {
        user_id: userId,
        progress
      });
      console.log('✅ Daily challenge updated in MongoDB Atlas');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating daily challenge in MongoDB Atlas:', error);
      throw error;
    }
  }

  /**
   * ตรวจสอบการเชื่อมต่อ MongoDB Atlas
   */
  async checkConnection() {
    try {
      const response = await apiClient.get('/health');
      console.log('✅ MongoDB Atlas connection successful');
      return response.status === 200;
    } catch (error) {
      console.error('❌ MongoDB Atlas connection failed:', error);
      return false;
    }
  }

  /**
   * Sync ข้อมูลทั้งหมดกับ MongoDB Atlas
   */
  async syncAllData(userId) {
    try {
      console.log('🔄 Syncing all data with MongoDB Atlas...');
      
      const [userData, progress, achievements, stats] = await Promise.allSettled([
        this.getUserData(userId),
        this.getUserProgress(userId),
        this.getUserAchievements(userId),
        this.getUserStats(userId)
      ]);

      const result = {
        userData: userData.status === 'fulfilled' ? userData.value : null,
        progress: progress.status === 'fulfilled' ? progress.value : null,
        achievements: achievements.status === 'fulfilled' ? achievements.value : [],
        stats: stats.status === 'fulfilled' ? stats.value : null
      };

      console.log('✅ All data synced with MongoDB Atlas');
      return result;
    } catch (error) {
      console.error('❌ Error syncing data with MongoDB Atlas:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new MongoDBAtlasService();
