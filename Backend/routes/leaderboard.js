const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');

// Get global leaderboard
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, sortBy = 'total_xp' } = req.query;
    
    const validSortFields = ['total_xp', 'level', 'streak', 'games_played'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'total_xp';
    
    const leaderboard = await Progress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user_id: 1,
          total_xp: 1,
          level: 1,
          streak: 1,
          last_activity: 1,
          'statistics.total_games_played': 1,
          'statistics.perfect_scores': 1,
          'statistics.total_play_time': 1,
          'user.username': 1,
          'user.profile.first_name': 1,
          'user.profile.last_name': 1,
          'user.profile.avatar': 1
        }
      },
      {
        $sort: { [sortField]: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Add rank to each entry
    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: leaderboardWithRank,
      total: leaderboardWithRank.length
    });
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leaderboard' 
    });
  }
});

// Get weekly leaderboard
router.get('/weekly', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyLeaderboard = await Progress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user_id: 1,
          total_xp: 1,
          level: 1,
          streak: 1,
          last_activity: 1,
          'statistics.total_games_played': 1,
          'statistics.perfect_scores': 1,
          'statistics.total_play_time': 1,
          'user.username': 1,
          'user.profile.first_name': 1,
          'user.profile.last_name': 1,
          'user.profile.avatar': 1,
          weekly_xp: {
            $sum: {
              $map: {
                input: '$daily_progress',
                as: 'daily',
                in: {
                  $cond: [
                    { $gte: ['$$daily.date', oneWeekAgo] },
                    '$$daily.xp_gained',
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $match: {
          weekly_xp: { $gt: 0 }
        }
      },
      {
        $sort: { weekly_xp: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Add rank to each entry
    const weeklyLeaderboardWithRank = weeklyLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: weeklyLeaderboardWithRank,
      total: weeklyLeaderboardWithRank.length
    });
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching weekly leaderboard' 
    });
  }
});

// Get user's rank
router.get('/user/:userId/rank', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy = 'total_xp' } = req.query;
    
    const validSortFields = ['total_xp', 'level', 'streak', 'games_played'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'total_xp';
    
    // Get user's progress
    const userProgress = await Progress.findOne({ user_id: userId });
    if (!userProgress) {
      return res.status(404).json({ 
        success: false, 
        message: 'User progress not found' 
      });
    }
    
    // Count users with higher score
    const higherCount = await Progress.countDocuments({
      [sortField]: { $gt: userProgress[sortField] }
    });
    
    const userRank = higherCount + 1;
    
    // Get total users
    const totalUsers = await Progress.countDocuments();
    
    res.json({
      success: true,
      data: {
        rank: userRank,
        totalUsers,
        percentile: Math.round(((totalUsers - userRank + 1) / totalUsers) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user rank' 
    });
  }
});

// Get friends leaderboard (if user has friends)
router.get('/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;
    
    // For now, return empty array since we don't have friends system
    // In the future, this would fetch friends' progress
    res.json({
      success: true,
      data: [],
      total: 0,
      message: 'Friends system not implemented yet'
    });
  } catch (error) {
    console.error('Error fetching friends leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching friends leaderboard' 
    });
  }
});

// Get category-specific leaderboard
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;
    
    const categoryLeaderboard = await Progress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user_id: 1,
          total_xp: 1,
          level: 1,
          streak: 1,
          last_activity: 1,
          'user.username': 1,
          'user.profile.first_name': 1,
          'user.profile.last_name': 1,
          'user.profile.avatar': 1,
          category_progress: {
            $filter: {
              input: '$categories',
              as: 'cat',
              cond: { $eq: ['$$cat.category_name', category] }
            }
          }
        }
      },
      {
        $match: {
          'category_progress.0': { $exists: true }
        }
      },
      {
        $addFields: {
          category_completion: { $arrayElemAt: ['$category_progress.completion_percentage', 0] }
        }
      },
      {
        $sort: { category_completion: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    // Add rank to each entry
    const categoryLeaderboardWithRank = categoryLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: categoryLeaderboardWithRank,
      total: categoryLeaderboardWithRank.length
    });
  } catch (error) {
    console.error('Error fetching category leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching category leaderboard' 
    });
  }
});

module.exports = router;
