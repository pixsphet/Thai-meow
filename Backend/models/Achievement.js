const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievement_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'learning',      // การเรียนรู้
      'streak',        // การเล่นติดต่อกัน
      'score',         // คะแนน
      'level',         // ระดับ
      'game',          // เกม
      'time',          // เวลา
      'special'        // พิเศษ
    ]
  },
  criteria: {
    type: {
      type: String,
      required: true,
      enum: [
        'total_xp',           // XP รวม
        'level_reached',      // ระดับที่ถึง
        'streak_days',        // วันติดต่อกัน
        'games_played',       // เกมที่เล่น
        'perfect_scores',     // คะแนนเต็ม
        'total_play_time',    // เวลาเล่นรวม
        'correct_answers',    // คำตอบที่ถูก
        'categories_completed', // หมวดหมู่ที่จบ
        'consecutive_wins',   // ชนะติดต่อกัน
        'first_game',         // เกมแรก
        'daily_player',       // เล่นทุกวัน
        'speed_demon',        // เล่นเร็ว
        'perfectionist',      // สมบูรณ์แบบ
        'early_bird',         // เล่นเช้า
        'night_owl',          // เล่นดึก
        'weekend_warrior'     // เล่นวันหยุด
      ]
    },
    value: {
      type: Number,
      required: true
    },
    operator: {
      type: String,
      required: true,
      enum: ['>=', '>', '=', '<', '<=']
    }
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  icon: {
    type: String,
    default: 'trophy'
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_hidden: {
    type: Boolean,
    default: false
  },
  prerequisites: [{
    achievement_id: {
      type: String,
      ref: 'Achievement'
    }
  }],
  rewards: {
    xp_bonus: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ achievement_id: 1 }, { unique: true });
achievementSchema.index({ category: 1 });
achievementSchema.index({ is_active: 1 });
achievementSchema.index({ rarity: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
