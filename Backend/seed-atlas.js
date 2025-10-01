const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Vocabulary = require('./models/Vocabulary');
const Lesson = require('./models/Lesson');
const UserProgress = require('./models/UserProgress');
const GameResult = require('./models/GameResult');

const seedAtlas = async () => {
  try {
    console.log('🌱 Seeding MongoDB Atlas with sample data...');
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please create a .env file with your MongoDB Atlas connection string');
      return;
    }
    
    console.log('📡 Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas!');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Vocabulary.deleteMany({});
    await Lesson.deleteMany({});
    await UserProgress.deleteMany({});
    await GameResult.deleteMany({});
    
    // Sample vocabulary data
    const sampleVocabularies = [
      {
        word: 'สวัสดี',
        thai_word: 'สวัสดี',
        meaning: 'Hello',
        pronunciation: 'sà-wàt-dii',
        category: 'greetings',
        lesson_id: 1,
        audioText: 'สวัสดี',
        image: '👋',
        examples: ['สวัสดีครับ', 'สวัสดีค่ะ'],
        difficulty: 'beginner'
      },
      {
        word: 'ขอบคุณ',
        thai_word: 'ขอบคุณ',
        meaning: 'Thank you',
        pronunciation: 'kɔ̀ɔp-kun',
        category: 'greetings',
        lesson_id: 1,
        audioText: 'ขอบคุณ',
        image: '🙏',
        examples: ['ขอบคุณครับ', 'ขอบคุณค่ะ'],
        difficulty: 'beginner'
      },
      {
        word: 'น้ำ',
        thai_word: 'น้ำ',
        meaning: 'Water',
        pronunciation: 'náam',
        category: 'basic',
        lesson_id: 2,
        audioText: 'น้ำ',
        image: '💧',
        examples: ['น้ำดื่ม', 'น้ำใส'],
        difficulty: 'beginner'
      },
      {
        word: 'อาหาร',
        thai_word: 'อาหาร',
        meaning: 'Food',
        pronunciation: 'aa-hǎan',
        category: 'basic',
        lesson_id: 2,
        audioText: 'อาหาร',
        image: '🍽️',
        examples: ['อาหารไทย', 'อาหารอร่อย'],
        difficulty: 'beginner'
      },
      {
        word: 'บ้าน',
        thai_word: 'บ้าน',
        meaning: 'House',
        pronunciation: 'bâan',
        category: 'basic',
        lesson_id: 2,
        audioText: 'บ้าน',
        image: '🏠',
        examples: ['บ้านใหญ่', 'บ้านสวย'],
        difficulty: 'beginner'
      }
    ];
    
    // Sample lesson data
    const sampleLessons = [
      {
        lesson_id: 1,
        title: 'Thai Greetings',
        description: 'Learn basic Thai greetings',
        level: 'Beginner',
        category: 'greetings',
        order: 1,
        total_questions: 5,
        estimated_time: 10
      },
      {
        lesson_id: 2,
        title: 'Basic Thai Words',
        description: 'Learn basic Thai vocabulary',
        level: 'Beginner',
        category: 'basic',
        order: 2,
        total_questions: 10,
        estimated_time: 15
      },
      {
        lesson_id: 3,
        title: 'Intermediate Thai',
        description: 'Learn intermediate Thai vocabulary',
        level: 'Intermediate',
        category: 'dialogue',
        order: 1,
        total_questions: 8,
        estimated_time: 20
      },
      {
        lesson_id: 4,
        title: 'Advanced Thai',
        description: 'Learn advanced Thai vocabulary',
        level: 'Advanced',
        category: 'dialogue',
        order: 1,
        total_questions: 12,
        estimated_time: 25
      }
    ];
    
    // Insert sample data
    console.log('📚 Inserting sample vocabularies...');
    await Vocabulary.insertMany(sampleVocabularies);
    console.log(`✅ Inserted ${sampleVocabularies.length} vocabularies`);
    
    console.log('📖 Inserting sample lessons...');
    for (const lesson of sampleLessons) {
      await Lesson.findOneAndUpdate(
        { lesson_id: lesson.lesson_id },
        lesson,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Inserted ${sampleLessons.length} lessons`);
    
    // Create indexes
    console.log('📊 Creating indexes...');
    try {
      await Vocabulary.collection.createIndex({ word: 1 });
      await Vocabulary.collection.createIndex({ lesson_id: 1 });
      await Vocabulary.collection.createIndex({ category: 1 });
      
      await Lesson.collection.createIndex({ lesson_id: 1 });
      await Lesson.collection.createIndex({ level: 1 });
      await Lesson.collection.createIndex({ category: 1 });
      
      console.log('✅ Indexes created successfully!');
    } catch (error) {
      console.log('⚠️ Some indexes already exist, continuing...');
    }
    
    // Verify data
    const vocabCount = await Vocabulary.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    
    console.log('📊 Database statistics:');
    console.log(`   - Vocabularies: ${vocabCount}`);
    console.log(`   - Lessons: ${lessonCount}`);
    
    console.log('🎉 MongoDB Atlas seeded successfully!');
    console.log('📋 You can now test your API endpoints:');
    console.log('   - GET /api/vocabulary');
    console.log('   - GET /api/games');
    console.log('   - GET /api/arrange-sentence');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Please check your username and password.');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network error. Please check your internet connection and IP whitelist.');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout. Please check your connection string and network.');
    } else {
      console.error('🔍 Unknown error. Please check your connection string format.');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};

// Run seeding
seedAtlas();
