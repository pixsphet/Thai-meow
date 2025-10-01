import { API_CONFIG } from '../config/apiConfig';

class LeaderboardService {
  // Get global leaderboard
  async getGlobalLeaderboard(limit = 50, sortBy = 'total_xp') {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/global?limit=${limit}&sortBy=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch global leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      throw error;
    }
  }

  // Get weekly leaderboard
  async getWeeklyLeaderboard(limit = 50) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/weekly?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weekly leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching weekly leaderboard:', error);
      throw error;
    }
  }

  // Get user's rank
  async getUserRank(userId, sortBy = 'total_xp') {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/user/${userId}/rank?sortBy=${sortBy}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user rank');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user rank:', error);
      throw error;
    }
  }

  // Get friends leaderboard
  async getFriendsLeaderboard(userId, limit = 20) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/friends/${userId}?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch friends leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching friends leaderboard:', error);
      throw error;
    }
  }

  // Get category-specific leaderboard
  async getCategoryLeaderboard(category, limit = 50) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/category/${category}?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch category leaderboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching category leaderboard:', error);
      throw error;
    }
  }

  // Get top players by different metrics
  async getTopPlayers(metric = 'total_xp', limit = 10) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/leaderboard/global?sortBy=${metric}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top players');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top players:', error);
      throw error;
    }
  }

  // Get leaderboard statistics
  async getLeaderboardStats() {
    try {
      const [global, weekly] = await Promise.all([
        this.getGlobalLeaderboard(10),
        this.getWeeklyLeaderboard(10)
      ]);

      return {
        global: {
          totalPlayers: global.total,
          topPlayers: global.data.slice(0, 3)
        },
        weekly: {
          totalPlayers: weekly.total,
          topPlayers: weekly.data.slice(0, 3)
        }
      };
    } catch (error) {
      console.error('Error fetching leaderboard stats:', error);
      throw error;
    }
  }

  // Format leaderboard data for display
  formatLeaderboardData(data) {
    return data.map((entry, index) => ({
      rank: entry.rank || index + 1,
      userId: entry.user_id,
      username: entry.user?.username || 'Unknown',
      firstName: entry.user?.profile?.first_name || '',
      lastName: entry.user?.profile?.last_name || '',
      avatar: entry.user?.profile?.avatar || '',
      totalXp: entry.total_xp || 0,
      level: entry.level || 1,
      streak: entry.streak || 0,
      gamesPlayed: entry.statistics?.total_games_played || 0,
      perfectScores: entry.statistics?.perfect_scores || 0,
      playTime: entry.statistics?.total_play_time || 0,
      lastActivity: entry.last_activity,
      weeklyXp: entry.weekly_xp || 0
    }));
  }

  // Get rank badge color based on rank
  getRankBadgeColor(rank) {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    if (rank <= 10) return '#4CAF50'; // Green
    if (rank <= 50) return '#2196F3'; // Blue
    return '#9E9E9E'; // Gray
  }

  // Get rank emoji based on rank
  getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏆';
    if (rank <= 50) return '⭐';
    return '📊';
  }

  // Format time duration
  formatTimeDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  // Format XP with commas
  formatXP(xp) {
    return xp.toLocaleString();
  }

  // Get relative time
  getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  }
}

export default new LeaderboardService();
