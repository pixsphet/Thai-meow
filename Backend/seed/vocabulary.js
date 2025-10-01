require('dotenv').config();
const mongoose = require('mongoose');
const Vocabulary = require('../models/Vocabulary');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_meow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Sample vocabulary data
const vocabularyData = [
  // Basic Letters
  {
    word: 'ก',
    thai_word: 'ก',
    romanization: 'gor',
    meaning: 'chicken',
    pronunciation: 'gɔɔ',
    category: 'basic_letters',
    difficulty: 'beginner',
    lesson_id: 1,
    usage_examples: [
      {
        thai: 'ไก่',
        romanization: 'gài',
        english: 'chicken'
      }
    ],
    tags: ['alphabet', 'animal'],
    frequency: 0
  },
  {
    word: 'ข',
    thai_word: 'ข',
    romanization: 'khor',
    meaning: 'egg',
    pronunciation: 'khɔɔ',
    category: 'basic_letters',
    difficulty: 'beginner',
    lesson_id: 1,
    usage_examples: [
      {
        thai: 'ไข่',
        romanization: 'khài',
        english: 'egg'
      }
    ],
    tags: ['alphabet', 'food'],
    frequency: 0
  },
  {
    word: 'ค',
    thai_word: 'ค',
    romanization: 'kho',
    meaning: 'buffalo',
    pronunciation: 'khɔɔ',
    category: 'basic_letters',
    difficulty: 'beginner',
    lesson_id: 1,
    usage_examples: [
      {
        thai: 'ควาย',
        romanization: 'khwaai',
        english: 'buffalo'
      }
    ],
    tags: ['alphabet', 'animal'],
    frequency: 0
  },

  // Greetings
  {
    word: 'สวัสดี',
    thai_word: 'สวัสดี',
    romanization: 'sà-wàt-dii',
    meaning: 'hello',
    pronunciation: 'sà-wàt-dii',
    category: 'greetings',
    difficulty: 'beginner',
    lesson_id: 3,
    usage_examples: [
      {
        thai: 'สวัสดีครับ',
        romanization: 'sà-wàt-dii khráp',
        english: 'Hello (male speaker)'
      },
      {
        thai: 'สวัสดีค่ะ',
        romanization: 'sà-wàt-dii khâ',
        english: 'Hello (female speaker)'
      }
    ],
    tags: ['greeting', 'polite'],
    frequency: 0
  },
  {
    word: 'ขอบคุณ',
    thai_word: 'ขอบคุณ',
    romanization: 'khàawp-khun',
    meaning: 'thank you',
    pronunciation: 'khàawp-khun',
    category: 'greetings',
    difficulty: 'beginner',
    lesson_id: 3,
    usage_examples: [
      {
        thai: 'ขอบคุณครับ',
        romanization: 'khàawp-khun khráp',
        english: 'Thank you (male speaker)'
      },
      {
        thai: 'ขอบคุณค่ะ',
        romanization: 'khàawp-khun khâ',
        english: 'Thank you (female speaker)'
      }
    ],
    tags: ['greeting', 'polite', 'gratitude'],
    frequency: 0
  },
  {
    word: 'ลาก่อน',
    thai_word: 'ลาก่อน',
    romanization: 'laa-gɔ̀ɔn',
    meaning: 'goodbye',
    pronunciation: 'laa-gɔ̀ɔn',
    category: 'greetings',
    difficulty: 'beginner',
    lesson_id: 3,
    usage_examples: [
      {
        thai: 'ลาก่อนครับ',
        romanization: 'laa-gɔ̀ɔn khráp',
        english: 'Goodbye (male speaker)'
      }
    ],
    tags: ['greeting', 'farewell'],
    frequency: 0
  },

  // Numbers
  {
    word: 'หนึ่ง',
    thai_word: 'หนึ่ง',
    romanization: 'nʉ̀ng',
    meaning: 'one',
    pronunciation: 'nʉ̀ng',
    category: 'numbers',
    difficulty: 'beginner',
    lesson_id: 4,
    usage_examples: [
      {
        thai: 'หนึ่งคน',
        romanization: 'nʉ̀ng khon',
        english: 'one person'
      }
    ],
    tags: ['number', 'counting'],
    frequency: 0
  },
  {
    word: 'สอง',
    thai_word: 'สอง',
    romanization: 'sɔ̌ɔng',
    meaning: 'two',
    pronunciation: 'sɔ̌ɔng',
    category: 'numbers',
    difficulty: 'beginner',
    lesson_id: 4,
    usage_examples: [
      {
        thai: 'สองคน',
        romanization: 'sɔ̌ɔng khon',
        english: 'two people'
      }
    ],
    tags: ['number', 'counting'],
    frequency: 0
  },
  {
    word: 'สาม',
    thai_word: 'สาม',
    romanization: 'sǎam',
    meaning: 'three',
    pronunciation: 'sǎam',
    category: 'numbers',
    difficulty: 'beginner',
    lesson_id: 4,
    usage_examples: [
      {
        thai: 'สามคน',
        romanization: 'sǎam khon',
        english: 'three people'
      }
    ],
    tags: ['number', 'counting'],
    frequency: 0
  },

  // Family
  {
    word: 'พ่อ',
    thai_word: 'พ่อ',
    romanization: 'phɔ̂ɔ',
    meaning: 'father',
    pronunciation: 'phɔ̂ɔ',
    category: 'family',
    difficulty: 'beginner',
    lesson_id: 6,
    usage_examples: [
      {
        thai: 'พ่อของฉัน',
        romanization: 'phɔ̂ɔ khɔ̌ɔng chǎn',
        english: 'my father'
      }
    ],
    tags: ['family', 'parent'],
    frequency: 0
  },
  {
    word: 'แม่',
    thai_word: 'แม่',
    romanization: 'mɛ̂ɛ',
    meaning: 'mother',
    pronunciation: 'mɛ̂ɛ',
    category: 'family',
    difficulty: 'beginner',
    lesson_id: 6,
    usage_examples: [
      {
        thai: 'แม่ของฉัน',
        romanization: 'mɛ̂ɛ khɔ̌ɔng chǎn',
        english: 'my mother'
      }
    ],
    tags: ['family', 'parent'],
    frequency: 0
  },
  {
    word: 'ลูก',
    thai_word: 'ลูก',
    romanization: 'lûuk',
    meaning: 'child',
    pronunciation: 'lûuk',
    category: 'family',
    difficulty: 'beginner',
    lesson_id: 6,
    usage_examples: [
      {
        thai: 'ลูกของฉัน',
        romanization: 'lûuk khɔ̌ɔng chǎn',
        english: 'my child'
      }
    ],
    tags: ['family', 'child'],
    frequency: 0
  },

  // Food
  {
    word: 'ข้าว',
    thai_word: 'ข้าว',
    romanization: 'khâaw',
    meaning: 'rice',
    pronunciation: 'khâaw',
    category: 'food',
    difficulty: 'beginner',
    lesson_id: 7,
    usage_examples: [
      {
        thai: 'ข้าวสวย',
        romanization: 'khâaw sǔay',
        english: 'cooked rice'
      }
    ],
    tags: ['food', 'staple'],
    frequency: 0
  },
  {
    word: 'น้ำ',
    thai_word: 'น้ำ',
    romanization: 'náam',
    meaning: 'water',
    pronunciation: 'náam',
    category: 'food',
    difficulty: 'beginner',
    lesson_id: 7,
    usage_examples: [
      {
        thai: 'น้ำดื่ม',
        romanization: 'náam dʉ̀ʉm',
        english: 'drinking water'
      }
    ],
    tags: ['food', 'drink'],
    frequency: 0
  },
  {
    word: 'ผัก',
    thai_word: 'ผัก',
    romanization: 'phàk',
    meaning: 'vegetable',
    pronunciation: 'phàk',
    category: 'food',
    difficulty: 'beginner',
    lesson_id: 7,
    usage_examples: [
      {
        thai: 'ผักสด',
        romanization: 'phàk sòt',
        english: 'fresh vegetables'
      }
    ],
    tags: ['food', 'vegetable'],
    frequency: 0
  },

  // Colors
  {
    word: 'แดง',
    thai_word: 'แดง',
    romanization: 'daaeng',
    meaning: 'red',
    pronunciation: 'daaeng',
    category: 'colors',
    difficulty: 'beginner',
    lesson_id: 8,
    usage_examples: [
      {
        thai: 'สีแดง',
        romanization: 'sǐi daaeng',
        english: 'red color'
      }
    ],
    tags: ['color', 'basic'],
    frequency: 0
  },
  {
    word: 'เขียว',
    thai_word: 'เขียว',
    romanization: 'khǐaw',
    meaning: 'green',
    pronunciation: 'khǐaw',
    category: 'colors',
    difficulty: 'beginner',
    lesson_id: 8,
    usage_examples: [
      {
        thai: 'สีเขียว',
        romanization: 'sǐi khǐaw',
        english: 'green color'
      }
    ],
    tags: ['color', 'basic'],
    frequency: 0
  },
  {
    word: 'น้ำเงิน',
    thai_word: 'น้ำเงิน',
    romanization: 'náam-ngəən',
    meaning: 'blue',
    pronunciation: 'náam-ngəən',
    category: 'colors',
    difficulty: 'beginner',
    lesson_id: 8,
    usage_examples: [
      {
        thai: 'สีน้ำเงิน',
        romanization: 'sǐi náam-ngəən',
        english: 'blue color'
      }
    ],
    tags: ['color', 'basic'],
    frequency: 0
  },

  // Basic Verbs
  {
    word: 'กิน',
    thai_word: 'กิน',
    romanization: 'kin',
    meaning: 'to eat',
    pronunciation: 'kin',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'กินข้าว',
        romanization: 'kin khâaw',
        english: 'to eat rice'
      }
    ],
    tags: ['verb', 'action'],
    frequency: 0
  },
  {
    word: 'ดื่ม',
    thai_word: 'ดื่ม',
    romanization: 'dʉ̀ʉm',
    meaning: 'to drink',
    pronunciation: 'dʉ̀ʉm',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'ดื่มน้ำ',
        romanization: 'dʉ̀ʉm náam',
        english: 'to drink water'
      }
    ],
    tags: ['verb', 'action'],
    frequency: 0
  },
  {
    word: 'ไป',
    thai_word: 'ไป',
    romanization: 'pai',
    meaning: 'to go',
    pronunciation: 'pai',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'ไปโรงเรียน',
        romanization: 'pai roong-riian',
        english: 'to go to school'
      }
    ],
    tags: ['verb', 'movement'],
    frequency: 0
  },

  // Places
  {
    word: 'บ้าน',
    thai_word: 'บ้าน',
    romanization: 'bâan',
    meaning: 'house',
    pronunciation: 'bâan',
    category: 'places',
    difficulty: 'beginner',
    lesson_id: 10,
    usage_examples: [
      {
        thai: 'บ้านของฉัน',
        romanization: 'bâan khɔ̌ɔng chǎn',
        english: 'my house'
      }
    ],
    tags: ['place', 'home'],
    frequency: 0
  },
  {
    word: 'โรงเรียน',
    thai_word: 'โรงเรียน',
    romanization: 'roong-riian',
    meaning: 'school',
    pronunciation: 'roong-riian',
    category: 'places',
    difficulty: 'beginner',
    lesson_id: 10,
    usage_examples: [
      {
        thai: 'ไปโรงเรียน',
        romanization: 'pai roong-riian',
        english: 'to go to school'
      }
    ],
    tags: ['place', 'education'],
    frequency: 0
  },
  {
    word: 'ตลาด',
    thai_word: 'ตลาด',
    romanization: 'ta-làat',
    meaning: 'market',
    pronunciation: 'ta-làat',
    category: 'places',
    difficulty: 'beginner',
    lesson_id: 10,
    usage_examples: [
      {
        thai: 'ไปตลาด',
        romanization: 'pai ta-làat',
        english: 'to go to the market'
      }
    ],
    tags: ['place', 'shopping'],
    frequency: 0
  }
];

// Seed function
const seedVocabulary = async () => {
  try {
    console.log('🌱 Starting vocabulary seeding...');
    
    // Clear existing vocabulary
    await Vocabulary.deleteMany({});
    console.log('✅ Cleared existing vocabulary');
    
    // Insert new vocabulary
    await Vocabulary.insertMany(vocabularyData);
    console.log(`✅ Seeded ${vocabularyData.length} vocabulary items`);
    
    // Show summary by category
    const categoryStats = await Vocabulary.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Vocabulary by Category:');
    categoryStats.forEach(stat => {
      console.log(`- ${stat._id}: ${stat.count} words`);
    });
    
    console.log('\n🎉 Vocabulary seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Vocabulary seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedVocabulary();
});
