const express = require('express');
const router = express.Router();
const DailyChallenge = require('../models/DailyChallenge');
const UserDailyChallenge = require('../models/UserDailyChallenge');
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Get all daily challenges (no auth required for frontend)
router.get('/', async (req, res) => {
  try {
    const challenges = await DailyChallenge.find({ is_active: true });
    res.json(challenges);
  } catch (error) {
    console.error('Error getting daily challenges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get today's daily challenges
router.get('/today', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's challenges
    const challenges = await DailyChallenge.find({
      date: today,
      is_active: true
    });
    
    // Get user's progress for today's challenges
    const userProgress = await UserDailyChallenge.find({
      user_id: userId,
      challenge_date: today
    });
    
    // Merge challenges with user progress
    const challengesWithProgress = challenges.map(challenge => {
      const userChallenge = userProgress.find(up => 
        up.challenge_id.toString() === challenge._id.toString()
      );
      
      return {
        ...challenge.toObject(),
        user_progress: userChallenge ? {
          current_progress: userChallenge.current_progress,
          target_value: userChallenge.target_value,
          is_completed: userChallenge.is_completed,
          completed_at: userChallenge.completed_at,
          rewards_claimed: userChallenge.rewards_claimed,
          progress_percentage: userChallenge.getProgressPercentage(),
          remaining_progress: userChallenge.getRemainingProgress()
        } : {
          current_progress: 0,
          target_value: challenge.target_value,
          is_completed: false,
          completed_at: null,
          rewards_claimed: false,
          progress_percentage: 0,
          remaining_progress: challenge.target_value
        }
      };
    });
    
    res.json({
      success: true,
      data: challengesWithProgress,
      total: challengesWithProgress.length
    });
  } catch (error) {
    console.error('Error fetching daily challenges:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching daily challenges' 
    });
  }
});

// Get user's daily challenge history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, limit = 30 } = req.query;
    
    let query = { user_id: userId };
    
    if (startDate && endDate) {
      query.challenge_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const history = await UserDailyChallenge.find(query)
      .populate('challenge_id')
      .sort({ challenge_date: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: history,
      total: history.length
    });
  } catch (error) {
    console.error('Error fetching challenge history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching challenge history' 
    });
  }
});

// Update daily challenge progress
router.post('/:challengeId/progress', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;
    const { progress_value, metadata = {} } = req.body;
    
    // Get the challenge
    const challenge = await DailyChallenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }
    
    // Check if challenge is for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (challenge.date.getTime() !== today.getTime()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Challenge is not available today' 
      });
    }
    
    // Find or create user daily challenge
    let userChallenge = await UserDailyChallenge.findOne({
      user_id: userId,
      challenge_id: challengeId,
      challenge_date: today
    });
    
    if (!userChallenge) {
      userChallenge = new UserDailyChallenge({
        user_id: userId,
        challenge_id: challengeId,
        challenge_date: today,
        target_value: challenge.target_value,
        metadata: metadata
      });
    }
    
    // Update progress
    await userChallenge.updateProgress(progress_value);
    
    // If challenge is completed, update user progress
    if (userChallenge.is_completed && !userChallenge.rewards_claimed) {
      await updateUserProgressFromChallenge(userId, challenge, userChallenge);
    }
    
    res.json({
      success: true,
      data: {
        challenge_id: challengeId,
        current_progress: userChallenge.current_progress,
        target_value: userChallenge.target_value,
        is_completed: userChallenge.is_completed,
        progress_percentage: userChallenge.getProgressPercentage(),
        remaining_progress: userChallenge.getRemainingProgress()
      }
    });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating challenge progress' 
    });
  }
});

// Claim rewards for completed challenge
router.post('/:challengeId/claim', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;
    
    const userChallenge = await UserDailyChallenge.findOne({
      user_id: userId,
      challenge_id: challengeId,
      is_completed: true,
      rewards_claimed: false
    });
    
    if (!userChallenge) {
      return res.status(400).json({ 
        success: false, 
        message: 'Challenge not completed or rewards already claimed' 
      });
    }
    
    // Claim rewards
    await userChallenge.claimRewards();
    
    res.json({
      success: true,
      message: 'Rewards claimed successfully',
      data: {
        challenge_id: challengeId,
        rewards_claimed: true,
        rewards_claimed_at: userChallenge.rewards_claimed_at
      }
    });
  } catch (error) {
    console.error('Error claiming rewards:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error claiming rewards' 
    });
  }
});

// Get user's challenge statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await UserDailyChallenge.getUserChallengeStats(userId);
    
    // Get additional stats
    const totalChallenges = await UserDailyChallenge.countDocuments({ user_id: userId });
    const completedChallenges = await UserDailyChallenge.countDocuments({ 
      user_id: userId, 
      is_completed: true 
    });
    
    const currentStreak = await getCurrentChallengeStreak(userId);
    
    res.json({
      success: true,
      data: {
        total_challenges: totalChallenges,
        completed_challenges: completedChallenges,
        completion_rate: totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0,
        current_streak: currentStreak,
        ...stats[0]
      }
    });
  } catch (error) {
    console.error('Error fetching challenge stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching challenge stats' 
    });
  }
});

// Create daily challenges (admin only)
router.post('/create', auth, async (req, res) => {
  try {
    // Check if user is admin (you can implement admin check here)
    // For now, we'll allow any authenticated user to create challenges
    
    const challenges = await DailyChallenge.createDailyChallenges();
    
    res.json({
      success: true,
      message: 'Daily challenges created successfully',
      data: challenges
    });
  } catch (error) {
    console.error('Error creating daily challenges:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating daily challenges' 
    });
  }
});

// Helper function to update user progress from completed challenge
async function updateUserProgressFromChallenge(userId, challenge, userChallenge) {
  try {
    // Get user's progress
    let userProgress = await Progress.findOne({ user_id: userId });
    if (!userProgress) {
      userProgress = new Progress({ user_id: userId });
    }
    
    // Add XP bonus
    if (challenge.rewards.xp_bonus > 0) {
      userProgress.total_xp += challenge.rewards.xp_bonus;
    }
    
    // Add streak bonus
    if (challenge.rewards.streak_bonus > 0) {
      userProgress.streak += challenge.rewards.streak_bonus;
    }
    
    // Update last activity
    userProgress.last_activity = new Date();
    
    // Update statistics
    if (!userProgress.statistics) {
      userProgress.statistics = {
        total_play_time: 0,
        total_games_played: 0,
        average_score: 0,
        best_streak: 0,
        perfect_scores: 0,
        total_correct_answers: 0,
        total_questions_answered: 0
      };
    }
    
    // Update daily progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyProgress = userProgress.daily_progress.find(dp => 
      dp.date.getTime() === today.getTime()
    );
    
    if (!dailyProgress) {
      dailyProgress = {
        date: today,
        xp_gained: 0,
        games_played: 0,
        time_spent: 0,
        challenges_completed: 0
      };
      userProgress.daily_progress.push(dailyProgress);
    }
    
    dailyProgress.xp_gained += challenge.rewards.xp_bonus || 0;
    dailyProgress.challenges_completed += 1;
    
    // Save progress
    await userProgress.save();
    
    // Update user challenge metadata
    userChallenge.metadata = {
      ...userChallenge.metadata,
      xp_earned: challenge.rewards.xp_bonus || 0,
      streak_bonus: challenge.rewards.streak_bonus || 0,
      completed_at: new Date()
    };
    
    await userChallenge.save();
    
  } catch (error) {
    console.error('Error updating user progress from challenge:', error);
  }
}

// Helper function to get current challenge streak
async function getCurrentChallengeStreak(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const challenges = await UserDailyChallenge.find({
        user_id: userId,
        challenge_date: currentDate,
        is_completed: true
      });
      
      if (challenges.length === 0) {
        break;
      }
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating challenge streak:', error);
    return 0;
  }
}

module.exports = router;
