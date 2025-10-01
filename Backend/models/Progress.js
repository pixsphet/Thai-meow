const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // ข้อมูลความคืบหน้าโดยรวม
  total_xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 0
  },
  last_activity: {
    type: Date,
    default: Date.now
  },
  
  // ความคืบหน้าในแต่ละระดับ
  levels: [{
    level_name: {
      type: String,
      required: true
    },
    level_type: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    is_completed: {
      type: Boolean,
      default: false
    },
    completion_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    stages: [{
      stage_name: {
        type: String,
        required: true
      },
      stage_number: {
        type: Number,
        required: true
      },
      is_completed: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        default: 0
      },
      max_score: {
        type: Number,
        default: 100
      },
      attempts: {
        type: Number,
        default: 0
      },
      completed_at: {
        type: Date
      }
    }]
  }],
  
  // ข้อมูลเกมที่เล่น
  games_played: [{
    game_type: {
      type: String,
      required: true
    },
    game_name: {
      type: String,
      required: true
    },
    level_name: {
      type: String,
      required: true
    },
    stage_name: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    max_score: {
      type: Number,
      required: true
    },
    time_spent: {
      type: Number, // ในวินาที
      default: 0
    },
    correct_answers: {
      type: Number,
      default: 0
    },
    total_questions: {
      type: Number,
      default: 0
    },
    played_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // ข้อมูลหมวดหมู่ที่เรียน
  categories: [{
    category_name: {
      type: String,
      required: true
    },
    category_type: {
      type: String,
      enum: ['consonants', 'vowels', 'tones', 'vocabulary', 'grammar'],
      required: true
    },
    is_completed: {
      type: Boolean,
      default: false
    },
    completion_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    total_lessons: {
      type: Number,
      default: 0
    },
    completed_lessons: {
      type: Number,
      default: 0
    },
    last_played: {
      type: Date
    }
  }],
  
  // ข้อมูลสถิติ
  statistics: {
    total_play_time: {
      type: Number, // ในวินาที
      default: 0
    },
    total_games_played: {
      type: Number,
      default: 0
    },
    average_score: {
      type: Number,
      default: 0
    },
    best_streak: {
      type: Number,
      default: 0
    },
    perfect_scores: {
      type: Number,
      default: 0
    },
    total_correct_answers: {
      type: Number,
      default: 0
    },
    total_questions_answered: {
      type: Number,
      default: 0
    }
  },
  
  // ข้อมูลรางวัลและความสำเร็จ
  achievements: [{
    achievement_id: {
      type: String,
      required: true
    },
    achievement_name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    unlocked_at: {
      type: Date,
      default: Date.now
    },
    points: {
      type: Number,
      default: 0
    }
  }],
  
  // ข้อมูลการเรียนประจำวัน
  daily_progress: [{
    date: {
      type: Date,
      required: true
    },
    xp_earned: {
      type: Number,
      default: 0
    },
    games_played: {
      type: Number,
      default: 0
    },
    time_spent: {
      type: Number,
      default: 0
    },
    streak_maintained: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes
progressSchema.index({ user_id: 1 }, { unique: true });
progressSchema.index({ 'levels.level_name': 1 });
progressSchema.index({ 'categories.category_name': 1 });
progressSchema.index({ last_activity: -1 });

module.exports = mongoose.model('Progress', progressSchema);
