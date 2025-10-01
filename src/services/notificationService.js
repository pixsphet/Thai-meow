import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Notification Service
 * จัดการการแจ้งเตือน
 */
class NotificationService {
  constructor() {
    this.storageKey = 'notification_settings';
  }

  /**
   * เริ่มต้น service
   */
  async initialize() {
    try {
      console.log('🔔 Notification service initialized');
    } catch (error) {
      console.error('❌ Error initializing notification service:', error);
    }
  }

  /**
   * ดึงการตั้งค่าการแจ้งเตือน
   */
  async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.storageKey);
      if (settings) {
        return JSON.parse(settings);
      }
      
      // Default settings
      return {
        dailyReminder: true,
        streakReminder: true,
        achievementNotification: true,
        lessonReminder: true,
        challengeReminder: true,
        soundEnabled: true,
        vibrationEnabled: true,
        reminderTime: '09:00',
        reminderDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false,
        }
      };
    } catch (error) {
      console.error('❌ Error getting notification settings:', error);
      return {};
    }
  }

  /**
   * อัปเดตการตั้งค่าการแจ้งเตือน
   */
  async updateNotificationSettings(settings) {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(settings));
      console.log('✅ Notification settings updated');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating notification settings:', error);
      throw error;
    }
  }

  /**
   * ส่งการแจ้งเตือนทดสอบ
   */
  async sendTestNotification() {
    try {
      console.log('📱 Sending test notification');
      return { success: true };
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new NotificationService();
