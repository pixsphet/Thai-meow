import apiClient from './apiClient';

class AchievementService {
  constructor() {
    this.baseURL = '/achievements';
  }

  // Get all achievements
  async getAllAchievements() {
    try {
      const response = await apiClient.get(this.baseURL);
      return response;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  // Get user achievements
  async getUserAchievements(userId) {
    try {
      const response = await apiClient.get(`${this.baseURL}/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }

  // Get achievement stats
  async getAchievementStats(userId) {
    try {
      const response = await apiClient.get(`${this.baseURL}/stats/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching achievement stats:', error);
      throw error;
    }
  }

  // Check and unlock achievements
  async checkAchievements(userId) {
    try {
      const response = await apiClient.post(`${this.baseURL}/check/${userId}`);
      return response;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Claim achievement
  async claimAchievement(userId, achievementId) {
    try {
      const response = await apiClient.post(`${this.baseURL}/claim`, {
        userId,
        achievementId
      });
      return response;
    } catch (error) {
      console.error('Error claiming achievement:', error);
      throw error;
    }
  }

  // Get achievement definitions
  async getAchievementDefinitions() {
    try {
      const response = await apiClient.get(`${this.baseURL}/definitions`);
      return response;
    } catch (error) {
      console.error('Error fetching achievement definitions:', error);
      throw error;
    }
  }

  // Check if user has achievement
  hasAchievement(userAchievements, achievementId) {
    return userAchievements.some(achievement => 
      achievement.achievementId === achievementId || 
      achievement._id === achievementId
    );
  }

  // Get achievement progress
  getAchievementProgress(userAchievements, achievementId) {
    const achievement = userAchievements.find(achievement => 
      achievement.achievementId === achievementId || 
      achievement._id === achievementId
    );
    
    if (!achievement) return 0;
    
    return achievement.progress || 0;
  }

  // Check if achievement is completed
  isAchievementCompleted(userAchievements, achievementId) {
    const achievement = userAchievements.find(achievement => 
      achievement.achievementId === achievementId || 
      achievement._id === achievementId
    );
    
    return achievement && achievement.completed;
  }

  // Get achievement by ID
  getAchievementById(achievements, achievementId) {
    return achievements.find(achievement => 
      achievement._id === achievementId || 
      achievement.id === achievementId
    );
  }

  // Calculate achievement progress percentage
  calculateProgressPercentage(current, target) {
    if (target === 0) return 100;
    return Math.min(100, Math.floor((current / target) * 100));
  }

  // Get achievement category
  getAchievementCategory(achievement) {
    const categories = {
      'level': 'Level',
      'streak': 'Streak',
      'score': 'Score',
      'game': 'Game',
      'time': 'Time',
      'special': 'Special'
    };
    
    return categories[achievement.category] || 'Other';
  }

  // Get achievement rarity
  getAchievementRarity(achievement) {
    const rarities = {
      'common': 'Common',
      'uncommon': 'Uncommon',
      'rare': 'Rare',
      'epic': 'Epic',
      'legendary': 'Legendary'
    };
    
    return rarities[achievement.rarity] || 'Common';
  }

  // Get achievement color
  getAchievementColor(achievement) {
    const colors = {
      'common': '#9CA3AF',
      'uncommon': '#10B981',
      'rare': '#3B82F6',
      'epic': '#8B5CF6',
      'legendary': '#F59E0B'
    };
    
    return colors[achievement.rarity] || '#9CA3AF';
  }
}

export default new AchievementService();