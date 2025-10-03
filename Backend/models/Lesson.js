const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  key: {
    type: String,
    index: true,
    unique: true,
    sparse: true
  },
  titleTH: String,
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'] 
  },
  note: String,
  order: Number,
  // Keep legacy fields for backward compatibility
  lesson_id: { 
    type: Number, 
    unique: true,
    sparse: true 
  },
  title: { 
    type: String 
  },
}, { 
  timestamps: true 
});

// Pre-save middleware to update updated_at
lessonSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);