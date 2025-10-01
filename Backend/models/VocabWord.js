const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
  thai: { 
    type: String, 
    required: true, 
    index: true 
  },
  roman: String,
  en: String,
  pos: String,
  lessonKey: { 
    type: String, 
    index: true 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'] 
  },
  tags: [String],
  exampleTH: String,
  exampleEN: String,
  audioUrl: String,
}, { 
  timestamps: true 
});

module.exports = mongoose.model('VocabWord', vocabSchema);
