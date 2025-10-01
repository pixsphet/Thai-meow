import apiClient from './apiClient';

class ProgressService {
  constructor() {
    this.baseURL = '/progress';
  }

  // Get user progress
  async getUserProgress(userId) {
    try {
      const response = await apiClient.get(`${this.baseURL}/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  // Update game progress
  async updateGameProgress(gameData) {
    try {
      const response = await apiClient.post(`${this.baseURL}/game`, gameData);
      return response;
    } catch (error) {
      console.error('Error updating game progress:', error);
      throw error;
    }
  }

  // Calculate level progress
  calculateLevelProgress(totalXp) {
    const levels = [
      { level: 1, xp: 0 },
      { level: 2, xp: 100 },
      { level: 3, xp: 250 },
      { level: 4, xp: 450 },
      { level: 5, xp: 700 },
      { level: 6, xp: 1000 },
      { level: 7, xp: 1350 },
      { level: 8, xp: 1750 },
      { level: 9, xp: 2200 },
      { level: 10, xp: 2700 }
    ];

    let currentLevel = 1;
    let nextLevelXp = 100;
    let progress = 0;

    for (let i = 0; i < levels.length - 1; i++) {
      if (totalXp >= levels[i].xp && totalXp < levels[i + 1].xp) {
        currentLevel = levels[i].level;
        nextLevelXp = levels[i + 1].xp;
        progress = (totalXp - levels[i].xp) / (levels[i + 1].xp - levels[i].xp);
        break;
      }
    }

    if (totalXp >= levels[levels.length - 1].xp) {
      currentLevel = levels[levels.length - 1].level;
      nextLevelXp = levels[levels.length - 1].xp;
      progress = 1;
    }

    return {
      currentLevel,
      nextLevelXp,
      progress: Math.min(progress, 1),
      xpToNextLevel: Math.max(0, nextLevelXp - totalXp)
    };
  }

  // Calculate XP needed for level
  calculateXpForLevel(level) {
    const levelXp = [
      0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700
    ];
    return levelXp[level - 1] || 0;
  }

  // Calculate total XP for level
  calculateTotalXpForLevel(level) {
    const levelXp = [
      0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700
    ];
    return levelXp[level] || 0;
  }

  // Get level info
  getLevelInfo(level) {
    const levelNames = [
      'Beginner', 'Novice', 'Apprentice', 'Student', 'Learner',
      'Scholar', 'Expert', 'Master', 'Grandmaster', 'Legend'
    ];

    return {
      level,
      name: levelNames[level - 1] || 'Unknown',
      xpRequired: this.calculateXpForLevel(level),
      totalXpRequired: this.calculateTotalXpForLevel(level)
    };
  }

  // Calculate streak bonus
  calculateStreakBonus(streak) {
    if (streak < 3) return 1;
    if (streak < 7) return 1.2;
    if (streak < 14) return 1.5;
    if (streak < 30) return 2;
    return 2.5;
  }

  // Calculate XP reward
  calculateXpReward(score, totalQuestions, streak = 0) {
    const baseXp = Math.floor((score / totalQuestions) * 50);
    const streakBonus = this.calculateStreakBonus(streak);
    const bonusXp = Math.floor(baseXp * (streakBonus - 1));
    
    return {
      baseXp,
      bonusXp,
      totalXp: baseXp + bonusXp,
      streakBonus
    };
  }

  // Calculate diamonds reward
  calculateDiamondsReward(score, totalQuestions, streak = 0) {
    const baseDiamonds = Math.floor((score / totalQuestions) * 10);
    const streakBonus = this.calculateStreakBonus(streak);
    const bonusDiamonds = Math.floor(baseDiamonds * (streakBonus - 1));
    
    return {
      baseDiamonds,
      bonusDiamonds,
      totalDiamonds: baseDiamonds + bonusDiamonds,
      streakBonus
    };
  }
}

export default new ProgressService();