const mongoose = require('mongoose');

const userDailyChallengeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DailyChallenge',
    required: true
  },
  
  // วันที่ของความท้าทาย
  challenge_date: {
    type: Date,
    required: true
  },
  
  // ความคืบหน้าปัจจุบัน
  current_progress: {
    type: Number,
    default: 0
  },
  
  // เป้าหมาย
  target_value: {
    type: Number,
    required: true
  },
  
  // สถานะการเสร็จสิ้น
  is_completed: {
    type: Boolean,
    default: false
  },
  
  // วันที่เสร็จสิ้น
  completed_at: {
    type: Date
  },
  
  // รางวัลที่ได้รับ
  rewards_claimed: {
    type: Boolean,
    default: false
  },
  
  // วันที่รับรางวัล
  rewards_claimed_at: {
    type: Date
  },
  
  // ข้อมูลเพิ่มเติม
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // วันที่สร้างและอัปเดต
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userDailyChallengeSchema.index({ user_id: 1, challenge_date: 1 }, { unique: true });
userDailyChallengeSchema.index({ challenge_id: 1 });
userDailyChallengeSchema.index({ is_completed: 1 });
userDailyChallengeSchema.index({ challenge_date: 1 });
userDailyChallengeSchema.index({ created_at: -1 });

// Compound index for efficient queries
userDailyChallengeSchema.index({ 
  user_id: 1, 
  challenge_date: 1, 
  is_completed: 1 
});

// Static method to get user's daily challenges
userDailyChallengeSchema.statics.getUserDailyChallenges = function(userId, date = null) {
  const targetDate = date || new Date();
  targetDate.setHours(0, 0, 0, 0);
  
  return this.find({
    user_id: userId,
    challenge_date: targetDate
  }).populate('challenge_id');
};

// Static method to get user's completed challenges
userDailyChallengeSchema.statics.getUserCompletedChallenges = function(userId, startDate, endDate) {
  return this.find({
    user_id: userId,
    is_completed: true,
    completed_at: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('challenge_id');
};

// Static method to get user's challenge statistics
userDailyChallengeSchema.statics.getUserChallengeStats = function(userId) {
  return this.aggregate([
    { $match: { user_id: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total_challenges: { $sum: 1 },
        completed_challenges: {
          $sum: { $cond: ['$is_completed', 1, 0] }
        },
        total_xp_earned: {
          $sum: {
            $cond: [
              '$is_completed',
              { $ifNull: ['$metadata.xp_earned', 0] },
              0
            ]
          }
        },
        completion_rate: {
          $avg: { $cond: ['$is_completed', 1, 0] }
        }
      }
    }
  ]);
};

// Instance method to update progress
userDailyChallengeSchema.methods.updateProgress = function(newProgress) {
  this.current_progress = newProgress;
  
  // Check if challenge is completed
  if (this.current_progress >= this.target_value && !this.is_completed) {
    this.is_completed = true;
    this.completed_at = new Date();
  }
  
  this.updated_at = new Date();
  return this.save();
};

// Instance method to claim rewards
userDailyChallengeSchema.methods.claimRewards = function() {
  if (this.is_completed && !this.rewards_claimed) {
    this.rewards_claimed = true;
    this.rewards_claimed_at = new Date();
    this.updated_at = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to get progress percentage
userDailyChallengeSchema.methods.getProgressPercentage = function() {
  return Math.min(100, Math.round((this.current_progress / this.target_value) * 100));
};

// Instance method to get remaining progress
userDailyChallengeSchema.methods.getRemainingProgress = function() {
  return Math.max(0, this.target_value - this.current_progress);
};

module.exports = mongoose.model('UserDailyChallenge', userDailyChallengeSchema);
