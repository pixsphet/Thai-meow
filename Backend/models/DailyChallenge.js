const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  
  // ข้อมูลความท้าทาย
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // ประเภทความท้าทาย
  type: {
    type: String,
    enum: [
      'xp_goal',           // เป้าหมาย XP
      'streak_goal',       // เป้าหมาย Streak
      'games_played',      // จำนวนเกมที่เล่น
      'perfect_scores',    // คะแนนเต็ม
      'time_spent',        // เวลาเล่น
      'categories_completed', // หมวดหมู่ที่จบ
      'correct_answers',   // คำตอบที่ถูก
      'daily_login',       // เข้าสู่ระบบทุกวัน
      'special_achievement' // ความสำเร็จพิเศษ
    ],
    required: true
  },
  
  // เป้าหมาย
  target_value: {
    type: Number,
    required: true
  },
  
  // รางวัล
  rewards: {
    xp_bonus: {
      type: Number,
      default: 0
    },
    streak_bonus: {
      type: Number,
      default: 0
    },
    special_reward: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    }
  },
  
  // ระดับความยาก
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // หมวดหมู่ที่เกี่ยวข้อง
  categories: [{
    type: String,
    enum: [
      'basic_letters', 'vowels', 'special_vowels', 'tones',
      'greetings', 'numbers', 'family', 'food', 'colors',
      'verbs', 'places', 'time', 'weather', 'hobbies',
      'shopping', 'travel', 'conversation', 'animals',
      'dialogue', 'quiz', 'summary', 'real_life_practice'
    ]
  }],
  
  // ระดับผู้เล่นที่เหมาะสม
  target_levels: [{
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: ['Beginner', 'Intermediate', 'Advanced']
  }],
  
  // สถานะ
  is_active: {
    type: Boolean,
    default: true
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
dailyChallengeSchema.index({ date: 1 });
dailyChallengeSchema.index({ type: 1 });
dailyChallengeSchema.index({ difficulty: 1 });
dailyChallengeSchema.index({ is_active: 1 });
dailyChallengeSchema.index({ created_at: -1 });

// Static method to get today's challenge
dailyChallengeSchema.statics.getTodaysChallenge = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    date: today,
    is_active: true
  });
};

// Static method to create daily challenges
dailyChallengeSchema.statics.createDailyChallenges = function() {
  const challenges = [
    {
      date: new Date(),
      title: 'Daily XP Goal',
      description: 'Earn 100 XP today',
      type: 'xp_goal',
      target_value: 100,
      rewards: {
        xp_bonus: 50,
        streak_bonus: 1
      },
      difficulty: 'easy',
      categories: ['basic_letters', 'vowels'],
      target_levels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      date: new Date(),
      title: 'Perfect Score Master',
      description: 'Get 3 perfect scores today',
      type: 'perfect_scores',
      target_value: 3,
      rewards: {
        xp_bonus: 100,
        special_reward: 'Perfect Score Badge'
      },
      difficulty: 'medium',
      categories: ['basic_letters', 'vowels', 'tones'],
      target_levels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      date: new Date(),
      title: 'Streak Keeper',
      description: 'Maintain your streak for 3 days',
      type: 'streak_goal',
      target_value: 3,
      rewards: {
        xp_bonus: 75,
        streak_bonus: 2
      },
      difficulty: 'medium',
      categories: ['basic_letters', 'vowels', 'tones'],
      target_levels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      date: new Date(),
      title: 'Game Marathon',
      description: 'Play 5 games today',
      type: 'games_played',
      target_value: 5,
      rewards: {
        xp_bonus: 80,
        special_reward: 'Marathon Badge'
      },
      difficulty: 'easy',
      categories: ['basic_letters', 'vowels', 'tones'],
      target_levels: ['Beginner', 'Intermediate', 'Advanced']
    },
    {
      date: new Date(),
      title: 'Time Master',
      description: 'Spend 30 minutes learning today',
      type: 'time_spent',
      target_value: 1800, // 30 minutes in seconds
      rewards: {
        xp_bonus: 120,
        special_reward: 'Time Master Badge'
      },
      difficulty: 'hard',
      categories: ['basic_letters', 'vowels', 'tones'],
      target_levels: ['Beginner', 'Intermediate', 'Advanced']
    }
  ];
  
  return this.insertMany(challenges);
};

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
