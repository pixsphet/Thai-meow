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
    console.log('MongoDB Connected for arrange-sentence vocabulary seeding');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Additional vocabulary data for Arrange Sentence game
const arrangeSentenceData = [
  // Greetings with sentences
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
      },
      {
        thai: 'สวัสดี เหมียว',
        romanization: 'sà-wàt-dii mǐaw',
        english: 'Hello Meow'
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
        thai: 'ขอบคุณมาก',
        romanization: 'khàawp-khun mâak',
        english: 'Thank you very much'
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
      },
      {
        thai: 'ลาก่อน เหมียว',
        romanization: 'laa-gɔ̀ɔn mǐaw',
        english: 'Goodbye Meow'
      }
    ],
    tags: ['greeting', 'farewell'],
    frequency: 0
  },

  // Family with sentences
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
      },
      {
        thai: 'พ่อ ดี',
        romanization: 'phɔ̂ɔ dii',
        english: 'good father'
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
      },
      {
        thai: 'แม่ ดี',
        romanization: 'mɛ̂ɛ dii',
        english: 'good mother'
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
      },
      {
        thai: 'ลูก ดี',
        romanization: 'lûuk dii',
        english: 'good child'
      }
    ],
    tags: ['family', 'child'],
    frequency: 0
  },

  // Food with sentences
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
      },
      {
        thai: 'กิน ข้าว',
        romanization: 'kin khâaw',
        english: 'eat rice'
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
      },
      {
        thai: 'ดื่ม น้ำ',
        romanization: 'dʉ̀ʉm náam',
        english: 'drink water'
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
      },
      {
        thai: 'กิน ผัก',
        romanization: 'kin phàk',
        english: 'eat vegetables'
      }
    ],
    tags: ['food', 'vegetable'],
    frequency: 0
  },

  // Colors with sentences
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
      },
      {
        thai: 'ดอกไม้ สีแดง',
        romanization: 'dɔ̀ɔk-mái sǐi daaeng',
        english: 'red flower'
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
      },
      {
        thai: 'ต้นไม้ สีเขียว',
        romanization: 'dtôn-mái sǐi khǐaw',
        english: 'green tree'
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
      },
      {
        thai: 'ท้องฟ้า สีน้ำเงิน',
        romanization: 'thɔ́ɔng-fáa sǐi náam-ngəən',
        english: 'blue sky'
      }
    ],
    tags: ['color', 'basic'],
    frequency: 0
  },

  // Basic Verbs with sentences
  {
    word: 'กิน',
    thai_word: 'กิน',
    romanization: 'kin',
    meaning: 'eat',
    pronunciation: 'kin',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'กินข้าว',
        romanization: 'kin khâaw',
        english: 'eat rice'
      },
      {
        thai: 'กิน ผัก',
        romanization: 'kin phàk',
        english: 'eat vegetables'
      }
    ],
    tags: ['verb', 'action'],
    frequency: 0
  },
  {
    word: 'ดื่ม',
    thai_word: 'ดื่ม',
    romanization: 'dʉ̀ʉm',
    meaning: 'drink',
    pronunciation: 'dʉ̀ʉm',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'ดื่มน้ำ',
        romanization: 'dʉ̀ʉm náam',
        english: 'drink water'
      },
      {
        thai: 'ดื่ม ชา',
        romanization: 'dʉ̀ʉm chaa',
        english: 'drink tea'
      }
    ],
    tags: ['verb', 'action'],
    frequency: 0
  },
  {
    word: 'ไป',
    thai_word: 'ไป',
    romanization: 'pai',
    meaning: 'go',
    pronunciation: 'pai',
    category: 'verbs',
    difficulty: 'beginner',
    lesson_id: 9,
    usage_examples: [
      {
        thai: 'ไปโรงเรียน',
        romanization: 'pai roong-riian',
        english: 'go to school'
      },
      {
        thai: 'ไป บ้าน',
        romanization: 'pai bâan',
        english: 'go home'
      }
    ],
    tags: ['verb', 'movement'],
    frequency: 0
  },

  // Places with sentences
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
      },
      {
        thai: 'บ้าน ใหญ่',
        romanization: 'bâan yài',
        english: 'big house'
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
        english: 'go to school'
      },
      {
        thai: 'โรงเรียน ดี',
        romanization: 'roong-riian dii',
        english: 'good school'
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
        english: 'go to market'
      },
      {
        thai: 'ตลาด ใหญ่',
        romanization: 'ta-làat yài',
        english: 'big market'
      }
    ],
    tags: ['place', 'shopping'],
    frequency: 0
  },

  // Animals with sentences
  {
    word: 'หมา',
    thai_word: 'หมา',
    romanization: 'mǎa',
    meaning: 'dog',
    pronunciation: 'mǎa',
    category: 'animals',
    difficulty: 'beginner',
    lesson_id: 11,
    usage_examples: [
      {
        thai: 'หมา ดี',
        romanization: 'mǎa dii',
        english: 'good dog'
      },
      {
        thai: 'หมา ใหญ่',
        romanization: 'mǎa yài',
        english: 'big dog'
      }
    ],
    tags: ['animal', 'pet'],
    frequency: 0
  },
  {
    word: 'แมว',
    thai_word: 'แมว',
    romanization: 'mɛɛo',
    meaning: 'cat',
    pronunciation: 'mɛɛo',
    category: 'animals',
    difficulty: 'beginner',
    lesson_id: 11,
    usage_examples: [
      {
        thai: 'แมว ดี',
        romanization: 'mɛɛo dii',
        english: 'good cat'
      },
      {
        thai: 'แมว ตัวเล็ก',
        romanization: 'mɛɛo dtua lék',
        english: 'small cat'
      }
    ],
    tags: ['animal', 'pet'],
    frequency: 0
  },
  {
    word: 'เหมียว',
    thai_word: 'เหมียว',
    romanization: 'mǐaw',
    meaning: 'meow',
    pronunciation: 'mǐaw',
    category: 'animals',
    difficulty: 'beginner',
    lesson_id: 11,
    usage_examples: [
      {
        thai: 'เหมียว เหมียว',
        romanization: 'mǐaw mǐaw',
        english: 'meow meow'
      },
      {
        thai: 'สวัสดี เหมียว',
        romanization: 'sà-wàt-dii mǐaw',
        english: 'Hello Meow'
      }
    ],
    tags: ['animal', 'sound'],
    frequency: 0
  }
];

// Seed function
const seedArrangeSentenceVocabulary = async () => {
  try {
    console.log('🌱 Starting arrange-sentence vocabulary seeding...');
    
    // Add new vocabulary without clearing existing ones (skip duplicates)
    try {
      await Vocabulary.insertMany(arrangeSentenceData, { ordered: false });
    } catch (error) {
      if (error.code === 11000) {
        console.log('Some vocabulary items already exist, skipping duplicates...');
      } else {
        throw error;
      }
    }
    console.log(`✅ Seeded ${arrangeSentenceData.length} arrange-sentence vocabulary items`);
    
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
    
    console.log('\n🎉 Arrange-sentence vocabulary seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Arrange-sentence vocabulary seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedArrangeSentenceVocabulary();
});
