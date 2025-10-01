const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  lesson_id: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    default: 0,
    min: 0
  },
  total_questions: {
    type: Number,
    default: 0,
    min: 0
  },
  completed_at: {
    type: Date,
    default: Date.now
  },
  diamonds_earned: {
    type: Number,
    default: 0,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
userProgressSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create compound index for efficient queries
userProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
