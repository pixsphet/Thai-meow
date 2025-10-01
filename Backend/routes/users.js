const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all users (for admin purposes)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ is_active: true })
      .select('-password -verification_token -password_reset_token')
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is trying to access their own profile or has permission
    if (req.user.userId !== id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const user = await User.findById(id).select('-password -verification_token -password_reset_token');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile (public information)
router.get('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password -verification_token -password_reset_token -email');
    
    if (!user || !user.is_active) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return public profile
    const publicProfile = user.getPublicProfile();
    
    res.json({
      success: true,
      user: publicProfile
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/:id/profile', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if user is updating their own profile
    if (req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.is_active;
    delete updateData.is_verified;
    delete updateData.verification_token;
    delete updateData.password_reset_token;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updated_at: new Date()
      },
      { new: true }
    ).select('-password -verification_token -password_reset_token');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user stats
router.put('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { stats } = req.body;
    
    // Check if user is updating their own stats
    if (req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Update user stats
    const user = await User.findByIdAndUpdate(
      id,
      { 
        $set: {
          'stats.total_xp': stats.total_xp || 0,
          'stats.level': stats.level || 1,
          'stats.streak': stats.streak || 0,
          'stats.longest_streak': stats.longest_streak || 0,
          'stats.lessons_completed': stats.lessons_completed || 0,
          'stats.games_played': stats.games_played || 0,
          'stats.total_time_spent': stats.total_time_spent || 0,
          updated_at: new Date()
        }
      },
      { new: true }
    ).select('-password -verification_token -password_reset_token');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Stats updated successfully',
      user: user
    });
  } catch (error) {
    console.error('Update user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add achievement
router.post('/:id/achievements', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { achievement } = req.body;
    
    // Check if user is adding to their own achievements
    if (req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Check if achievement already exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const existingAchievement = user.achievements.find(
      a => a.achievement_id === achievement.achievement_id
    );
    
    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already exists'
      });
    }
    
    // Add achievement
    user.achievements.push({
      ...achievement,
      unlocked_at: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Achievement added successfully',
      user: user
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add badge
router.post('/:id/badges', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { badge } = req.body;
    
    // Check if user is adding to their own badges
    if (req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Check if badge already exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const existingBadge = user.badges.find(
      b => b.badge_id === badge.badge_id
    );
    
    if (existingBadge) {
      return res.status(400).json({
        success: false,
        message: 'Badge already exists'
      });
    }
    
    // Add badge
    user.badges.push({
      ...badge,
      earned_at: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Badge added successfully',
      user: user
    });
  } catch (error) {
    console.error('Add badge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const { limit = 10, sortBy = 'total_xp' } = req.query;
    
    const users = await User.find({ is_active: true })
      .select('username profile stats achievements badges created_at')
      .sort({ [`stats.${sortBy}`]: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        achievements: user.achievements.length,
        badges: user.badges.length,
        created_at: user.created_at
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;
    
    const users = await User.find({
      is_active: true,
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { 'profile.first_name': { $regex: query, $options: 'i' } },
        { 'profile.last_name': { $regex: query, $options: 'i' } }
      ]
    })
    .select('username profile stats created_at')
    .limit(parseInt(limit));
    
    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        created_at: user.created_at
      }))
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user is deleting their own account or has admin rights
    if (req.user.userId !== id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Soft delete
    const user = await User.findByIdAndUpdate(id, {
      is_active: false,
      deleted_at: new Date(),
      updated_at: new Date()
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
