import apiService from './apiService';

class UserService {
  constructor() {
    this.baseUrl = '/users';
  }

  // Get all users (for admin)
  async getAllUsers() {
    try {
      const response = await apiService.get(`${this.baseUrl}`);
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/${userId}`);
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user profile (public)
  async getUserProfile(userId) {
    try {
      const response = await apiService.get(`${this.baseUrl}/${userId}/profile`);
      return response;
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const response = await apiService.put(`${this.baseUrl}/${userId}/profile`, profileData);
      return response;
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user stats
  async updateUserStats(userId, stats) {
    try {
      const response = await apiService.put(`${this.baseUrl}/${userId}/stats`, { stats });
      return response;
    } catch (error) {
      console.error('Update user stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add achievement
  async addAchievement(userId, achievement) {
    try {
      const response = await apiService.post(`${this.baseUrl}/${userId}/achievements`, { achievement });
      return response;
    } catch (error) {
      console.error('Add achievement error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add badge
  async addBadge(userId, badge) {
    try {
      const response = await apiService.post(`${this.baseUrl}/${userId}/badges`, { badge });
      return response;
    } catch (error) {
      console.error('Add badge error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10, sortBy = 'total_xp') {
    try {
      const response = await apiService.get(`${this.baseUrl}/leaderboard/top?limit=${limit}&sortBy=${sortBy}`);
      return response;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return { success: false, error: error.message };
    }
  }

  // Search users
  async searchUsers(query, limit = 10) {
    try {
      const response = await apiService.get(`${this.baseUrl}/search/${query}?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Search users error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await apiService.delete(`${this.baseUrl}/${userId}`);
      return response;
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper function to calculate level from XP
  calculateLevelFromXP(xp) {
    // Level formula: every 100 XP = 1 level
    return Math.floor(xp / 100) + 1;
  }

  // Helper function to calculate XP needed for next level
  calculateXPForNextLevel(currentLevel) {
    return currentLevel * 100;
  }

  // Helper function to calculate XP progress for current level
  calculateXPProgress(currentXP, currentLevel) {
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // Helper function to format user stats
  formatUserStats(user) {
    if (!user || !user.stats) {
      return {
        level: 1,
        totalXP: 0,
        streak: 0,
        lessonsCompleted: 0,
        gamesPlayed: 0,
        achievements: 0,
        badges: 0
      };
    }

    return {
      level: user.stats.level || 1,
      totalXP: user.stats.total_xp || 0,
      streak: user.stats.streak || 0,
      longestStreak: user.stats.longest_streak || 0,
      lessonsCompleted: user.stats.lessons_completed || 0,
      gamesPlayed: user.stats.games_played || 0,
      totalTimeSpent: user.stats.total_time_spent || 0,
      achievements: user.achievements?.length || 0,
      badges: user.badges?.length || 0
    };
  }

  // Helper function to format user profile
  formatUserProfile(user) {
    if (!user) {
      return null;
    }

    return {
      id: user._id || user.id,
      email: user.email,
      username: user.username,
      profile: {
        firstName: user.profile?.first_name || '',
        lastName: user.profile?.last_name || '',
        fullName: `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim(),
        avatar: user.profile?.avatar || 'https://via.placeholder.com/150',
        bio: user.profile?.bio || '',
        country: user.profile?.country || '',
        language: user.profile?.language || 'th'
      },
      stats: this.formatUserStats(user),
      achievements: user.achievements || [],
      badges: user.badges || [],
      createdAt: user.created_at,
      lastLogin: user.last_login,
      isActive: user.is_active
    };
  }
}

export default new UserService();
