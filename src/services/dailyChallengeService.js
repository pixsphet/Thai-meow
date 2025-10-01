import { API_CONFIG } from '../config/apiConfig';

class DailyChallengeService {
  // Get today's daily challenges
  async getTodaysChallenges() {
    try {
      const apiService = require('./apiService').default;
      const response = await apiService.get('/daily-challenges/today');
      return response;
    } catch (error) {
      console.error('Error fetching today\'s challenges:', error);
      throw error;
    }
  }

  // Get user's challenge history
  async getChallengeHistory(startDate = null, endDate = null, limit = 30) {
    try {
      const apiService = require('./apiService').default;
      let endpoint = `/daily-challenges/history?limit=${limit}`;
      
      if (startDate && endDate) {
        endpoint += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching challenge history:', error);
      throw error;
    }
  }

  // Update challenge progress
  async updateChallengeProgress(challengeId, progressValue, metadata = {}) {
    try {
      const apiService = require('./apiService').default;
      const response = await apiService.post(`/daily-challenges/${challengeId}/progress`, {
        progress_value: progressValue,
        metadata: metadata
      });
      return response;
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }

  // Claim rewards for completed challenge
  async claimChallengeRewards(challengeId) {
    try {
      const apiService = require('./apiService').default;
      const response = await apiService.post(`/daily-challenges/${challengeId}/claim`);
      return response;
    } catch (error) {
      console.error('Error claiming challenge rewards:', error);
      throw error;
    }
  }

  // Get user's challenge statistics
  async getChallengeStats() {
    try {
      const apiService = require('./apiService').default;
      const response = await apiService.get('/daily-challenges/stats');
      return response;
    } catch (error) {
      console.error('Error fetching challenge stats:', error);
      throw error;
    }
  }

  // Create daily challenges (admin)
  async createDailyChallenges() {
    try {
      const apiService = require('./apiService').default;
      const response = await apiService.post('/daily-challenges/create');
      return response;
    } catch (error) {
      console.error('Error creating daily challenges:', error);
      throw error;
    }
  }

  // Helper function to get auth token (no longer needed - using apiService)
  // async getAuthToken() {
  //   try {
  //     const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  //     const token = await AsyncStorage.getItem('authToken');
  //     return token;
  //   } catch (error) {
  //     console.error('Error getting auth token:', error);
  //     return null;
  //   }
  // }

  // Format challenge data for display
  formatChallengeData(challenge) {
    return {
      id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      type: challenge.type,
      targetValue: challenge.target_value,
      difficulty: challenge.difficulty,
      rewards: challenge.rewards,
      categories: challenge.categories,
      targetLevels: challenge.target_levels,
      userProgress: challenge.user_progress || {
        current_progress: 0,
        target_value: challenge.target_value,
        is_completed: false,
        completed_at: null,
        rewards_claimed: false,
        progress_percentage: 0,
        remaining_progress: challenge.target_value
      }
    };
  }

  // Get challenge type display name
  getChallengeTypeDisplayName(type) {
    const typeNames = {
      'xp_goal': 'เป้าหมาย XP',
      'streak_goal': 'เป้าหมาย Streak',
      'games_played': 'เกมที่เล่น',
      'perfect_scores': 'คะแนนเต็ม',
      'time_spent': 'เวลาเล่น',
      'categories_completed': 'หมวดหมู่ที่จบ',
      'correct_answers': 'คำตอบที่ถูก',
      'daily_login': 'เข้าสู่ระบบทุกวัน',
      'special_achievement': 'ความสำเร็จพิเศษ'
    };
    return typeNames[type] || type;
  }

  // Get difficulty display name
  getDifficultyDisplayName(difficulty) {
    const difficultyNames = {
      'easy': 'ง่าย',
      'medium': 'ปานกลาง',
      'hard': 'ยาก',
      'expert': 'ผู้เชี่ยวชาญ'
    };
    return difficultyNames[difficulty] || difficulty;
  }

  // Get difficulty color
  getDifficultyColor(difficulty) {
    const colors = {
      'easy': '#4CAF50',
      'medium': '#FF9800',
      'hard': '#F44336',
      'expert': '#9C27B0'
    };
    return colors[difficulty] || '#9E9E9E';
  }

  // Get challenge icon
  getChallengeIcon(type) {
    const icons = {
      'xp_goal': 'star',
      'streak_goal': 'fire',
      'games_played': 'game-controller',
      'perfect_scores': 'trophy',
      'time_spent': 'time',
      'categories_completed': 'checkmark-circle',
      'correct_answers': 'checkmark',
      'daily_login': 'log-in',
      'special_achievement': 'medal'
    };
    return icons[type] || 'help-circle';
  }

  // Format progress value based on challenge type
  formatProgressValue(type, value) {
    switch (type) {
      case 'time_spent':
        return this.formatTimeDuration(value);
      case 'xp_goal':
      case 'streak_goal':
      case 'games_played':
      case 'perfect_scores':
      case 'categories_completed':
      case 'correct_answers':
        return value.toString();
      default:
        return value.toString();
    }
  }

  // Format time duration
  formatTimeDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  // Calculate time remaining until next day
  getTimeUntilNextDay() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, totalMs: diff };
  }

  // Check if challenge is expiring soon
  isChallengeExpiringSoon() {
    const { hours } = this.getTimeUntilNextDay();
    return hours < 2; // Less than 2 hours remaining
  }

  // Get challenge completion status
  getChallengeStatus(challenge) {
    if (challenge.userProgress.is_completed) {
      return 'completed';
    } else if (challenge.userProgress.progress_percentage > 0) {
      return 'in_progress';
    } else {
      return 'not_started';
    }
  }

  // Get challenge status color
  getChallengeStatusColor(status) {
    const colors = {
      'completed': '#4CAF50',
      'in_progress': '#FF9800',
      'not_started': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  }

  // Get challenge status text
  getChallengeStatusText(status) {
    const texts = {
      'completed': 'เสร็จสิ้น',
      'in_progress': 'กำลังทำ',
      'not_started': 'ยังไม่เริ่ม'
    };
    return texts[status] || 'ไม่ทราบ';
  }
}

export default new DailyChallengeService();


