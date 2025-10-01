const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Vocabulary = require('../models/Vocabulary');

// Thai Consonants Lesson Data
const thaiConsonantsLesson = {
  lesson_id: 1,
  level: 'Beginner',
  title: 'พยัญชนะไทย ก-ฮ',
  description: 'เรียนรู้พยัญชนะพื้นฐาน 44 ตัว พร้อมภาพประกอบและเสียงอ่าน',
  category: 'consonants',
  difficulty: 'easy',
  estimated_time: 30,
  total_questions: 50,
  xp_reward: 100,
  unlock_condition: null
};

// Thai Consonants Vocabulary Data
const thaiConsonantsVocabulary = [
  { word: 'ก', thai_word: 'ก', romanization: 'ga', meaning: 'chicken', example: 'ไก่', audioText: 'กอ ไก่', lesson_id: 1, category: 'consonant', image: '🐓', order: 1 },
  { word: 'ข', thai_word: 'ข', romanization: 'kha', meaning: 'egg', example: 'ไข่', audioText: 'ขอ ไข่', lesson_id: 1, category: 'consonant', image: '🥚', order: 2 },
  { word: 'ฃ', thai_word: 'ฃ', romanization: 'kha', meaning: 'bottle', example: 'ขวด', audioText: 'ขอ ไข่', lesson_id: 1, category: 'consonant', image: '🍼', order: 3 },
  { word: 'ค', thai_word: 'ค', romanization: 'kha', meaning: 'buffalo', example: 'ควาย', audioText: 'ขอ ไข่', lesson_id: 1, category: 'consonant', image: '🐃', order: 4 },
  { word: 'ฅ', thai_word: 'ฅ', romanization: 'kha', meaning: 'person', example: 'คน', audioText: 'ขอ ไข่', lesson_id: 1, category: 'consonant', image: '👤', order: 5 },
  { word: 'ฆ', thai_word: 'ฆ', romanization: 'kha', meaning: 'bell', example: 'ระฆัง', audioText: 'ขอ ไข่', lesson_id: 1, category: 'consonant', image: '🔔', order: 6 },
  { word: 'ง', thai_word: 'ง', romanization: 'nga', meaning: 'snake', example: 'งู', audioText: 'งอ งู', lesson_id: 1, category: 'consonant', image: '🐍', order: 7 },
  { word: 'จ', thai_word: 'จ', romanization: 'ja', meaning: 'plate', example: 'จาน', audioText: 'จอ จาน', lesson_id: 1, category: 'consonant', image: '🍽️', order: 8 },
  { word: 'ฉ', thai_word: 'ฉ', romanization: 'cha', meaning: 'cymbals', example: 'ฉิ่ง', audioText: 'ฉอ ฉิ่ง', lesson_id: 1, category: 'consonant', image: '🥁', order: 9 },
  { word: 'ช', thai_word: 'ช', romanization: 'cha', meaning: 'elephant', example: 'ช้าง', audioText: 'ฉอ ฉิ่ง', lesson_id: 1, category: 'consonant', image: '🐘', order: 10 },
  { word: 'ซ', thai_word: 'ซ', romanization: 'sa', meaning: 'chain', example: 'โซ่', audioText: 'ซอ โซ่', lesson_id: 1, category: 'consonant', image: '⛓️', order: 11 },
  { word: 'ฌ', thai_word: 'ฌ', romanization: 'cha', meaning: 'tree', example: 'เฌอ', audioText: 'ฉอ ฉิ่ง', lesson_id: 1, category: 'consonant', image: '🌳', order: 12 },
  { word: 'ญ', thai_word: 'ญ', romanization: 'ya', meaning: 'woman', example: 'หญิง', audioText: 'ญอ หญิง', lesson_id: 1, category: 'consonant', image: '👩', order: 13 },
  { word: 'ฎ', thai_word: 'ฎ', romanization: 'da', meaning: 'crown', example: 'ชฎา', audioText: 'ดอ เด็ก', lesson_id: 1, category: 'consonant', image: '👑', order: 14 },
  { word: 'ฏ', thai_word: 'ฏ', romanization: 'ta', meaning: 'goad', example: 'ปฏัก', audioText: 'ตอ เต่า', lesson_id: 1, category: 'consonant', image: '🔱', order: 15 },
  { word: 'ฐ', thai_word: 'ฐ', romanization: 'tha', meaning: 'base', example: 'ฐาน', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '🏛️', order: 16 },
  { word: 'ฑ', thai_word: 'ฑ', romanization: 'tha', meaning: 'Mantod', example: 'มณโฑ', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '👸', order: 17 },
  { word: 'ฒ', thai_word: 'ฒ', romanization: 'tha', meaning: 'elder', example: 'ผู้เฒ่า', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '👴', order: 18 },
  { word: 'ณ', thai_word: 'ณ', romanization: 'na', meaning: 'novice', example: 'เณร', audioText: 'นอ หนู', lesson_id: 1, category: 'consonant', image: '👨‍🦲', order: 19 },
  { word: 'ด', thai_word: 'ด', romanization: 'da', meaning: 'child', example: 'เด็ก', audioText: 'ดอ เด็ก', lesson_id: 1, category: 'consonant', image: '👶', order: 20 },
  { word: 'ต', thai_word: 'ต', romanization: 'ta', meaning: 'turtle', example: 'เต่า', audioText: 'ตอ เต่า', lesson_id: 1, category: 'consonant', image: '🐢', order: 21 },
  { word: 'ถ', thai_word: 'ถ', romanization: 'tha', meaning: 'bag', example: 'ถุง', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '👜', order: 22 },
  { word: 'ท', thai_word: 'ท', romanization: 'tha', meaning: 'soldier', example: 'ทหาร', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '🪖', order: 23 },
  { word: 'ธ', thai_word: 'ธ', romanization: 'tha', meaning: 'flag', example: 'ธง', audioText: 'ถอ ถุง', lesson_id: 1, category: 'consonant', image: '🏳️', order: 24 },
  { word: 'น', thai_word: 'น', romanization: 'na', meaning: 'mouse', example: 'หนู', audioText: 'นอ หนู', lesson_id: 1, category: 'consonant', image: '🐭', order: 25 },
  { word: 'บ', thai_word: 'บ', romanization: 'ba', meaning: 'leaf', example: 'ใบไม้', audioText: 'บอ บ้าน', lesson_id: 1, category: 'consonant', image: '🍃', order: 26 },
  { word: 'ป', thai_word: 'ป', romanization: 'pa', meaning: 'fish', example: 'ปลา', audioText: 'ปอ ปู', lesson_id: 1, category: 'consonant', image: '🐟', order: 27 },
  { word: 'ผ', thai_word: 'ผ', romanization: 'pha', meaning: 'bee', example: 'ผึ้ง', audioText: 'พอ พาน', lesson_id: 1, category: 'consonant', image: '🐝', order: 28 },
  { word: 'ฝ', thai_word: 'ฝ', romanization: 'fa', meaning: 'lid', example: 'ฝา', audioText: 'ฟอ ฟัน', lesson_id: 1, category: 'consonant', image: '🪣', order: 29 },
  { word: 'พ', thai_word: 'พ', romanization: 'pha', meaning: 'tray', example: 'พาน', audioText: 'พอ พาน', lesson_id: 1, category: 'consonant', image: '🍽️', order: 30 },
  { word: 'ฟ', thai_word: 'ฟ', romanization: 'fa', meaning: 'tooth', example: 'ฟัน', audioText: 'ฟอ ฟัน', lesson_id: 1, category: 'consonant', image: '🦷', order: 31 },
  { word: 'ภ', thai_word: 'ภ', romanization: 'pha', meaning: 'junk', example: 'สำเภา', audioText: 'พอ พาน', lesson_id: 1, category: 'consonant', image: '⛵', order: 32 },
  { word: 'ม', thai_word: 'ม', romanization: 'ma', meaning: 'horse', example: 'ม้า', audioText: 'มอ ม้า', lesson_id: 1, category: 'consonant', image: '🐴', order: 33 },
  { word: 'ย', thai_word: 'ย', romanization: 'ya', meaning: 'giant', example: 'ยักษ์', audioText: 'ญอ หญิง', lesson_id: 1, category: 'consonant', image: '👹', order: 34 },
  { word: 'ร', thai_word: 'ร', romanization: 'ra', meaning: 'boat', example: 'เรือ', audioText: 'รอ เรือ', lesson_id: 1, category: 'consonant', image: '🚤', order: 35 },
  { word: 'ล', thai_word: 'ล', romanization: 'la', meaning: 'monkey', example: 'ลิง', audioText: 'ลอ ลิง', lesson_id: 1, category: 'consonant', image: '🐵', order: 36 },
  { word: 'ว', thai_word: 'ว', romanization: 'wa', meaning: 'ring', example: 'แหวน', audioText: 'วอ แหวน', lesson_id: 1, category: 'consonant', image: '💍', order: 37 },
  { word: 'ศ', thai_word: 'ศ', romanization: 'sa', meaning: 'pavilion', example: 'ศาลา', audioText: 'ซอ โซ่', lesson_id: 1, category: 'consonant', image: '🏛️', order: 38 },
  { word: 'ษ', thai_word: 'ษ', romanization: 'sa', meaning: 'hermit', example: 'ฤาษี', audioText: 'ซอ โซ่', lesson_id: 1, category: 'consonant', image: '🧙', order: 39 },
  { word: 'ส', thai_word: 'ส', romanization: 'sa', meaning: 'tiger', example: 'เสือ', audioText: 'ซอ โซ่', lesson_id: 1, category: 'consonant', image: '🐅', order: 40 },
  { word: 'ห', thai_word: 'ห', romanization: 'ha', meaning: 'box', example: 'หีบ', audioText: 'หอ หีบ', lesson_id: 1, category: 'consonant', image: '📦', order: 41 },
  { word: 'ฬ', thai_word: 'ฬ', romanization: 'la', meaning: 'kite', example: 'จุฬา', audioText: 'ลอ ลิง', lesson_id: 1, category: 'consonant', image: '🪁', order: 42 },
  { word: 'อ', thai_word: 'อ', romanization: 'a', meaning: 'basin', example: 'อ่าง', audioText: 'ออ อ่าง', lesson_id: 1, category: 'consonant', image: '🛁', order: 43 },
  { word: 'ฮ', thai_word: 'ฮ', romanization: 'ha', meaning: 'owl', example: 'นกฮูก', audioText: 'หอ หีบ', lesson_id: 1, category: 'consonant', image: '🦉', order: 44 }
];

const seedThaiConsonants = async () => {
  try {
    console.log('Starting to seed Thai Consonants lesson...');
    
    // Check if lesson already exists
    const existingLesson = await Lesson.findOne({ lesson_id: 1 });
    if (existingLesson) {
      console.log('Thai Consonants lesson already exists, updating...');
      await Lesson.updateOne({ lesson_id: 1 }, thaiConsonantsLesson);
    } else {
      console.log('Creating new Thai Consonants lesson...');
      await Lesson.create(thaiConsonantsLesson);
    }
    
    // Clear existing vocabulary for this lesson
    await Vocabulary.deleteMany({ lesson_id: 1 });
    console.log('Cleared existing vocabulary for lesson 1');
    
    // Insert new vocabulary
    console.log('Inserting Thai Consonants vocabulary...');
    await Vocabulary.insertMany(thaiConsonantsVocabulary);
    
    console.log('✅ Thai Consonants lesson seeded successfully!');
    console.log(`📚 Lesson: ${thaiConsonantsLesson.title}`);
    console.log(`📝 Vocabulary: ${thaiConsonantsVocabulary.length} consonants`);
    
  } catch (error) {
    console.error('❌ Error seeding Thai Consonants lesson:', error);
    throw error;
  }
};

module.exports = seedThaiConsonants;

// Run if called directly
if (require.main === module) {
  require('../config/database');
  seedThaiConsonants()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
