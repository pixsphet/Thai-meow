const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user progress (with optional auth)
router.get('/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      // Create initial progress if doesn't exist
      const newProgress = new Progress({
        user_id: req.params.userId
      });
      await newProgress.save();
      return res.json(newProgress);
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress by user ID (alternative route)
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      // Create initial progress if doesn't exist
      const newProgress = new Progress({
        user_id: req.params.userId
      });
      await newProgress.save();
      return res.json(newProgress);
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update game progress
router.post('/game', auth, async (req, res) => {
  try {
    const {
      userId,
      gameType,
      gameName,
      levelName,
      stageName,
      score,
      maxScore,
      timeSpent,
      correctAnswers,
      totalQuestions
    } = req.body;

    let progress = await Progress.findOne({ user_id: userId });
    
    if (!progress) {
      progress = new Progress({ user_id: userId });
    }

    // Add game played
    progress.games_played.push({
      game_type: gameType,
      game_name: gameName,
      level_name: levelName,
      stage_name: stageName,
      score: score,
      max_score: maxScore,
      time_spent: timeSpent,
      correct_answers: correctAnswers,
      total_questions: totalQuestions
    });

    // Update statistics
    progress.statistics.total_games_played += 1;
    progress.statistics.total_play_time += timeSpent;
    progress.statistics.total_correct_answers += correctAnswers;
    progress.statistics.total_questions_answered += totalQuestions;
    
    // Calculate average score
    const totalScore = progress.games_played.reduce((sum, game) => sum + game.score, 0);
    progress.statistics.average_score = Math.round(totalScore / progress.games_played.length);

    // Update perfect scores
    if (score === maxScore) {
      progress.statistics.perfect_scores += 1;
    }

    // Update last activity
    progress.last_activity = new Date();

    // Calculate XP (example: 10 XP per correct answer + bonus for perfect score)
    let xpEarned = correctAnswers * 10;
    if (score === maxScore) {
      xpEarned += 50; // Perfect score bonus
    }
    
    progress.total_xp += xpEarned;

    // Level up logic (example: 1000 XP per level)
    const newLevel = Math.floor(progress.total_xp / 1000) + 1;
    if (newLevel > progress.level) {
      progress.level = newLevel;
      // Add level up achievement
      progress.achievements.push({
        achievement_id: `level_${newLevel}`,
        achievement_name: `Level ${newLevel} Reached!`,
        description: `Congratulations! You've reached level ${newLevel}`,
        points: newLevel * 100
      });
    }

    // Update daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyProgress = progress.daily_progress.find(d => 
      d.date.getTime() === today.getTime()
    );
    
    if (!dailyProgress) {
      dailyProgress = {
        date: today,
        xp_earned: 0,
        games_played: 0,
        time_spent: 0,
        streak_maintained: false
      };
      progress.daily_progress.push(dailyProgress);
    }
    
    dailyProgress.xp_earned += xpEarned;
    dailyProgress.games_played += 1;
    dailyProgress.time_spent += timeSpent;
    dailyProgress.streak_maintained = true;

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayProgress = progress.daily_progress.find(d => 
      d.date.getTime() === yesterday.getTime()
    );
    
    if (yesterdayProgress && yesterdayProgress.streak_maintained) {
      progress.streak += 1;
    } else if (!yesterdayProgress || !yesterdayProgress.streak_maintained) {
      progress.streak = 1;
    }

    // Update best streak
    if (progress.streak > progress.statistics.best_streak) {
      progress.statistics.best_streak = progress.streak;
    }

    await progress.save();
    res.json({ message: 'Progress updated successfully', xpEarned, newLevel });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update level progress
router.post('/level', auth, async (req, res) => {
  try {
    const {
      userId,
      levelName,
      levelType,
      stageName,
      stageNumber,
      score,
      maxScore,
      isCompleted
    } = req.body;

    let progress = await Progress.findOne({ user_id: userId });
    
    if (!progress) {
      progress = new Progress({ user_id: userId });
    }

    // Find or create level
    let level = progress.levels.find(l => l.level_name === levelName);
    if (!level) {
      level = {
        level_name: levelName,
        level_type: levelType,
        is_completed: false,
        completion_percentage: 0,
        stages: []
      };
      progress.levels.push(level);
    }

    // Find or create stage
    let stage = level.stages.find(s => s.stage_name === stageName);
    if (!stage) {
      stage = {
        stage_name: stageName,
        stage_number: stageNumber,
        is_completed: false,
        score: 0,
        max_score: maxScore,
        attempts: 0,
        completed_at: null
      };
      level.stages.push(stage);
    }

    // Update stage
    stage.score = Math.max(stage.score, score);
    stage.attempts += 1;
    
    if (isCompleted) {
      stage.is_completed = true;
      stage.completed_at = new Date();
    }

    // Calculate level completion percentage
    const completedStages = level.stages.filter(s => s.is_completed).length;
    level.completion_percentage = Math.round((completedStages / level.stages.length) * 100);

    // Check if level is completed
    if (level.completion_percentage === 100) {
      level.is_completed = true;
    }

    await progress.save();
    res.json({ message: 'Level progress updated successfully' });
  } catch (error) {
    console.error('Error updating level progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category progress
router.post('/category', auth, async (req, res) => {
  try {
    const {
      userId,
      categoryName,
      categoryType,
      totalLessons,
      completedLessons
    } = req.body;

    let progress = await Progress.findOne({ user_id: userId });
    
    if (!progress) {
      progress = new Progress({ user_id: userId });
    }

    // Find or create category
    let category = progress.categories.find(c => c.category_name === categoryName);
    if (!category) {
      category = {
        category_name: categoryName,
        category_type: categoryType,
        is_completed: false,
        completion_percentage: 0,
        total_lessons: totalLessons,
        completed_lessons: 0,
        last_played: null
      };
      progress.categories.push(category);
    }

    // Update category
    category.completed_lessons = completedLessons;
    category.completion_percentage = Math.round((completedLessons / totalLessons) * 100);
    category.last_played = new Date();

    // Check if category is completed
    if (category.completion_percentage === 100) {
      category.is_completed = true;
    }

    await progress.save();
    res.json({ message: 'Category progress updated successfully' });
  } catch (error) {
    console.error('Error updating category progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topUsers = await Progress.find()
      .populate('user_id', 'username email')
      .sort({ total_xp: -1 })
      .limit(parseInt(limit));

    const leaderboard = topUsers.map((progress, index) => ({
      rank: index + 1,
      username: progress.user_id.username,
      total_xp: progress.total_xp,
      level: progress.level,
      streak: progress.streak
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user achievements
router.get('/:userId/achievements', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user_id: req.params.userId });
    
    if (!progress) {
      return res.json([]);
    }

    res.json(progress.achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
