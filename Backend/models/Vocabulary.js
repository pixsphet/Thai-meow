const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  thai_word: {
    type: String,
    required: true
  },
  romanization: {
    type: String,
    required: false,
    default: ''
  },
  meaning: {
    type: String,
    required: true
  },
  pronunciation: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: [
      'basic_letters',      // พยัญชนะพื้นฐาน
      'vowels',            // สระ
      'special_vowels',    // สระพิเศษ
      'tones',             // วรรณยุกต์
      'greetings',         // คำทักทาย
      'numbers',           // ตัวเลข
      'family',            // ครอบครัว
      'food',              // อาหาร
      'colors',            // สี
      'verbs',             // คำกริยา
      'places',            // สถานที่
      'time',              // เวลา
      'weather',           // อากาศ
      'hobbies',           // งานอดิเรก
      'shopping',          // การซื้อของ
      'travel',            // การเดินทาง
      'conversation',      // การสนทนา
      'animals',           // สัตว์
      'dialogue',          // บทสนทนา
      'quiz',              // ควิซ
      'summary',           // สรุป
      'real_life_practice', // ฝึกใช้จริง
      'time_periods',      // ช่วงเวลา
      'days',              // วัน
      'drinks',            // เครื่องดื่ม
      'storage_classifiers', // หน่วยนับ
      'age_questions',     // คำถามอายุ
      'basic',             // พื้นฐาน
      'questions',         // คำถาม
      'conjunctions',      // คำสันธาน
      'classifiers',       // หน่วยนับ
      'time_units',        // หน่วยเวลา
      'time_expressions',  // สำนวนเวลา
      'months',            // เดือน
      'parents',           // พ่อแม่
      'siblings',          // พี่น้อง
      'children',          // ลูก
      'grandparents',      // ปู่ย่าตายาย
      'spouse',            // คู่สมรส
      'family_general',    // ครอบครัวทั่วไป
      'grandchildren',     // หลาน
      'main_dishes',       // อาหารจานหลัก
      'desserts',          // ของหวาน
      'proteins',          // โปรตีน
      'primary_colors',    // สีหลัก
      'neutral_colors',    // สีกลาง
      'metallic_colors',   // สีโลหะ
      'movement_verbs',    // คำกริยาการเคลื่อนไหว
      'communication_verbs', // คำกริยาการสื่อสาร
      'consumption_verbs',  // คำกริยาการบริโภค
      'action_verbs',      // คำกริยาการกระทำ
      'rest_verbs',        // คำกริยาการพักผ่อน
      'activity_verbs',    // คำกริยากิจกรรม
      'educational',       // การศึกษา
      'residential',       // ที่อยู่อาศัย
      'commercial',        // พาณิชย์
      'public_services',   // บริการสาธารณะ
      'recreational',      // นันทนาการ
      'transportation_tourism', // การขนส่งและการท่องเที่ยว
      'what_questions',    // คำถามอะไร
      'where_questions',   // คำถามที่ไหน
      'why_questions',     // คำถามทำไม
      'who_questions',     // คำถามใคร
      'quantity_questions', // คำถามจำนวน
      'choice_questions',  // คำถามเลือก
      'when_questions',    // คำถามเมื่อไหร่
      'how_questions',     // คำถามอย่างไร
      'pricing',           // ราคา
      'payment',           // การชำระเงิน
      'transaction',       // การทำธุรกรรม
      'shopping_items',    // สินค้าสำหรับซื้อ
      'movement',          // การเคลื่อนไหว
      'directions',        // ทิศทาง
      'transportation',    // การขนส่ง
      'boarding',          // การขึ้นรถ/เรือ/เครื่องบิน
      'atmospheric_conditions', // สภาพบรรยากาศ
      'temperature',       // อุณหภูมิ
      'precipitation',     // หยาดน้ำฟ้า
      'weather_forecast',  // พยากรณ์อากาศ
      'moisture',          // ความชื้น
      'seasons',           // ฤดูกาล
      'sports',            // กีฬา
      'arts_crafts',       // ศิลปะและงานฝีมือ
      'entertainment',     // ความบันเทิง
      'recreation',        // นันทนาการ
      'lifestyle',         // วิถีชีวิต
      'causal_conjunctions', // คำสันธานแสดงเหตุผล
      'coordinating_conjunctions', // คำสันธานประสาน
      'temporal_conjunctions', // คำสันธานแสดงเวลา
      'purpose_conjunctions', // คำสันธานแสดงจุดประสงค์
      'contrastive_conjunctions', // คำสันธานแสดงความขัดแย้ง
      'people_classifiers', // หน่วยนับคน
      'animal_classifiers', // หน่วยนับสัตว์
      'flat_object_classifiers', // หน่วยนับสิ่งของแบน
      'celestial_classifiers', // หน่วยนับสิ่งของบนฟ้า
      'building_classifiers', // หน่วยนับอาคาร
      'piece_classifiers', // หน่วยนับชิ้น
      'vehicle_classifiers', // หน่วยนับยานพาหนะ
      'book_classifiers',  // หน่วยนับหนังสือ
      'container_classifiers', // หน่วยนับภาชนะ
      'advanced'           // ระดับสูง
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  lesson_id: {
    type: Number,
    required: true
  },
  usage_examples: [{
    thai: String,
    romanization: String,
    english: String
  }],
  example: {
    type: String,
    default: ''
  },
  related_words: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary'
  }],
  image_url: {
    type: String,
    default: ''
  },
  audio_url: {
    type: String,
    default: ''
  },
  tags: [String],
  frequency: {
    type: Number,
    default: 0,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true
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
vocabularySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Create indexes for better performance
vocabularySchema.index({ thai_word: 1 });
vocabularySchema.index({ category: 1 });
vocabularySchema.index({ difficulty: 1 });
vocabularySchema.index({ lesson_id: 1 });
vocabularySchema.index({ tags: 1 });
vocabularySchema.index({ is_active: 1 });

// Text search index
vocabularySchema.index({
  word: 'text',
  thai_word: 'text',
  meaning: 'text',
  tags: 'text'
});

// Unique index for word
vocabularySchema.index({ word: 1 }, { unique: true });

module.exports = mongoose.model('Vocabulary', vocabularySchema);
