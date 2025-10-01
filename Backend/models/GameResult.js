const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  game_type: {
    type: String,
    required: true,
    enum: ['arrange-sentence', 'vocab-quiz', 'word-matching', 'fill-blank', 'audio-quiz']
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  total_questions: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  time_taken: {
    type: Number, // in seconds
    required: true,
    min: 0
  },
  diamonds_earned: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  lesson_id: {
    type: Number,
    required: true
  },
  correct_words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary'
  }],
  incorrect_words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary'
  }],
  questions_answered: [{
    question_id: mongoose.Schema.Types.ObjectId,
    correct: Boolean,
    time_spent: Number
  }],
  streak: {
    type: Number,
    default: 0
  },
  best_streak: {
    type: Number,
    default: 0
  },
  completed_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
gameResultSchema.index({ user_id: 1, game_type: 1 });
gameResultSchema.index({ user_id: 1, completed_at: -1 });
gameResultSchema.index({ category: 1, difficulty: 1 });
gameResultSchema.index({ lesson_id: 1 });

module.exports = mongoose.model('GameResult', gameResultSchema);
