const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ is_active: true })
      .sort({ category: 1, points: 1 });
    
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's unlocked achievements (with optional auth)
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      return res.json([]);
    }
    
    res.json(progress.achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get achievement stats for user (with optional auth)
router.get('/stats/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      return res.json({
        total_achievements: 0,
        unlocked_achievements: 0,
        completion_percentage: 0,
        total_points: 0,
        recent_achievements: []
      });
    }
    
    const allAchievements = await Achievement.find({ is_active: true });
    const unlockedCount = progress.achievements.length;
    const totalCount = allAchievements.length;
    const totalPoints = progress.achievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
    
    res.json({
      total_achievements: totalCount,
      unlocked_achievements: unlockedCount,
      completion_percentage: totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0,
      total_points: totalPoints,
      recent_achievements: progress.achievements.slice(-5).reverse()
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check and unlock achievements for user
router.post('/check/:userId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      return res.status(404).json({ message: 'User progress not found' });
    }
    
    const allAchievements = await Achievement.find({ is_active: true });
    const unlockedAchievements = [];
    
    for (const achievement of allAchievements) {
      // Skip if already unlocked
      if (progress.achievements.some(a => a.achievement_id === achievement.achievement_id)) {
        continue;
      }
      
      // Check prerequisites
      if (achievement.prerequisites && achievement.prerequisites.length > 0) {
        const hasPrerequisites = achievement.prerequisites.every(prereq => 
          progress.achievements.some(a => a.achievement_id === prereq.achievement_id)
        );
        
        if (!hasPrerequisites) {
          continue;
        }
      }
      
      // Check criteria
      let shouldUnlock = false;
      const { type, value, operator } = achievement.criteria;
      
      switch (type) {
        case 'total_xp':
          shouldUnlock = checkCriteria(progress.total_xp, value, operator);
          break;
        case 'level_reached':
          shouldUnlock = checkCriteria(progress.level, value, operator);
          break;
        case 'streak_days':
          shouldUnlock = checkCriteria(progress.streak, value, operator);
          break;
        case 'games_played':
          shouldUnlock = checkCriteria(progress.statistics.total_games_played, value, operator);
          break;
        case 'perfect_scores':
          shouldUnlock = checkCriteria(progress.statistics.perfect_scores, value, operator);
          break;
        case 'total_play_time':
          shouldUnlock = checkCriteria(progress.statistics.total_play_time, value, operator);
          break;
        case 'correct_answers':
          shouldUnlock = checkCriteria(progress.statistics.total_correct_answers, value, operator);
          break;
        case 'categories_completed':
          const completedCategories = progress.categories.filter(c => c.is_completed).length;
          shouldUnlock = checkCriteria(completedCategories, value, operator);
          break;
        case 'consecutive_wins':
          // Check for consecutive perfect scores in recent games
          const recentGames = progress.games_played.slice(-5);
          const consecutiveWins = recentGames.filter(g => g.score === g.max_score).length;
          shouldUnlock = checkCriteria(consecutiveWins, value, operator);
          break;
        case 'first_game':
          shouldUnlock = progress.statistics.total_games_played >= 1;
          break;
        case 'daily_player':
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const todayProgress = progress.daily_progress.find(d => 
            d.date.getTime() === today.getTime()
          );
          const yesterdayProgress = progress.daily_progress.find(d => 
            d.date.getTime() === yesterday.getTime()
          );
          
          shouldUnlock = todayProgress && yesterdayProgress && 
                         todayProgress.games_played > 0 && yesterdayProgress.games_played > 0;
          break;
        case 'speed_demon':
          // Check if user completed a game in under 2 minutes
          const fastGames = progress.games_played.filter(g => g.time_spent < 120);
          shouldUnlock = checkCriteria(fastGames.length, value, operator);
          break;
        case 'perfectionist':
          // Check if user got perfect score in recent games
          const recentPerfectGames = progress.games_played.slice(-10);
          const perfectCount = recentPerfectGames.filter(g => g.score === g.max_score).length;
          shouldUnlock = checkCriteria(perfectCount, value, operator);
          break;
      }
      
      if (shouldUnlock) {
        const unlockedAchievement = {
          achievement_id: achievement.achievement_id,
          achievement_name: achievement.name,
          description: achievement.description,
          points: achievement.points,
          category: achievement.category,
          icon: achievement.icon,
          color: achievement.color,
          rarity: achievement.rarity,
          unlocked_at: new Date()
        };
        
        progress.achievements.push(unlockedAchievement);
        unlockedAchievements.push(unlockedAchievement);
        
        // Add XP bonus
        if (achievement.rewards.xp_bonus > 0) {
          progress.total_xp += achievement.rewards.xp_bonus;
        }
      }
    }
    
    await progress.save();
    
    res.json({
      message: 'Achievements checked',
      unlocked: unlockedAchievements,
      totalUnlocked: progress.achievements.length
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to check criteria
function checkCriteria(actualValue, targetValue, operator) {
  switch (operator) {
    case '>=':
      return actualValue >= targetValue;
    case '>':
      return actualValue > targetValue;
    case '=':
      return actualValue === targetValue;
    case '<':
      return actualValue < targetValue;
    case '<=':
      return actualValue <= targetValue;
    default:
      return false;
  }
}

// Seed default achievements
router.post('/seed', async (req, res) => {
  try {
    const defaultAchievements = [
      // Learning achievements
      {
        achievement_id: 'first_game',
        name: 'First Steps',
        description: 'Play your first game',
        category: 'learning',
        criteria: { type: 'first_game', value: 1, operator: '>=' },
        points: 10,
        icon: 'play-circle',
        color: '#4CAF50',
        rarity: 'common'
      },
      {
        achievement_id: 'level_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        category: 'level',
        criteria: { type: 'level_reached', value: 5, operator: '>=' },
        points: 50,
        icon: 'star',
        color: '#FFD700',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'level_10',
        name: 'Expert Learner',
        description: 'Reach level 10',
        category: 'level',
        criteria: { type: 'level_reached', value: 10, operator: '>=' },
        points: 100,
        icon: 'trophy',
        color: '#FF6B6B',
        rarity: 'rare'
      },
      
      // Streak achievements
      {
        achievement_id: 'streak_3',
        name: 'Getting Started',
        description: 'Maintain a 3-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 3, operator: '>=' },
        points: 25,
        icon: 'flame',
        color: '#FF9800',
        rarity: 'common'
      },
      {
        achievement_id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 7, operator: '>=' },
        points: 75,
        icon: 'fire',
        color: '#F44336',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'streak_30',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 30, operator: '>=' },
        points: 200,
        icon: 'crown',
        color: '#9C27B0',
        rarity: 'legendary'
      },
      
      // Score achievements
      {
        achievement_id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Get a perfect score in a game',
        category: 'score',
        criteria: { type: 'perfect_scores', value: 1, operator: '>=' },
        points: 30,
        icon: 'checkmark-circle',
        color: '#4CAF50',
        rarity: 'common'
      },
      {
        achievement_id: 'perfect_5',
        name: 'Flawless',
        description: 'Get 5 perfect scores',
        category: 'score',
        criteria: { type: 'perfect_scores', value: 5, operator: '>=' },
        points: 100,
        icon: 'medal',
        color: '#FFD700',
        rarity: 'rare'
      },
      
      // Game achievements
      {
        achievement_id: 'games_10',
        name: 'Game Enthusiast',
        description: 'Play 10 games',
        category: 'game',
        criteria: { type: 'games_played', value: 10, operator: '>=' },
        points: 50,
        icon: 'game-controller',
        color: '#2196F3',
        rarity: 'common'
      },
      {
        achievement_id: 'games_50',
        name: 'Game Master',
        description: 'Play 50 games',
        category: 'game',
        criteria: { type: 'games_played', value: 50, operator: '>=' },
        points: 150,
        icon: 'trophy',
        color: '#FF6B6B',
        rarity: 'epic'
      },
      
      // Time achievements
      {
        achievement_id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a game in under 2 minutes',
        category: 'time',
        criteria: { type: 'speed_demon', value: 1, operator: '>=' },
        points: 40,
        icon: 'flash',
        color: '#FF9800',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'daily_player',
        name: 'Daily Player',
        description: 'Play games on consecutive days',
        category: 'time',
        criteria: { type: 'daily_player', value: 1, operator: '>=' },
        points: 60,
        icon: 'calendar',
        color: '#4CAF50',
        rarity: 'uncommon'
      }
    ];
    
    // Clear existing achievements
    await Achievement.deleteMany({});
    
    // Insert new achievements
    await Achievement.insertMany(defaultAchievements);
    
    res.json({ message: 'Achievements seeded successfully', count: defaultAchievements.length });
  } catch (error) {
    console.error('Error seeding achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
