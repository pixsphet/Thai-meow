const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  lesson_id: {
    type: Number,
    required: true
  },
  question_type: {
    type: String,
    required: true,
    enum: ['multiple_choice', 'translation', 'arrange_sentence', 'fill_blank']
  },
  question_text: {
    type: String,
    required: true
  },
  word: {
    type: String,
    required: true
  },
  romanization: {
    type: String,
    default: ''
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    correct: {
      type: Boolean,
      default: false
    }
  }],
  correct_answer: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
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
questionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);
