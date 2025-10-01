const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Vocabulary = require('./models/Vocabulary');
const Lesson = require('./models/Lesson');
const UserProgress = require('./models/UserProgress');
const GameResult = require('./models/GameResult');

// Connection strings
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/thai_meow';
const ATLAS_MONGODB_URI = process.env.MONGODB_URI;

const migrateToAtlas = async () => {
  try {
    console.log('🚀 Starting migration to MongoDB Atlas...');
    
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    await mongoose.connect(LOCAL_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to local MongoDB');
    
    // Get all data from local database
    console.log('📊 Fetching data from local database...');
    
    const vocabularies = await Vocabulary.find({});
    const lessons = await Lesson.find({});
    const userProgress = await UserProgress.find({});
    const gameResults = await GameResult.find({});
    
    console.log(`📚 Found ${vocabularies.length} vocabularies`);
    console.log(`📖 Found ${lessons.length} lessons`);
    console.log(`👤 Found ${userProgress.length} user progress records`);
    console.log(`🎮 Found ${gameResults.length} game results`);
    
    // Disconnect from local MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from local MongoDB');
    
    // Connect to MongoDB Atlas
    console.log('☁️ Connecting to MongoDB Atlas...');
    await mongoose.connect(ATLAS_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Clear existing data in Atlas
    console.log('🧹 Clearing existing data in Atlas...');
    await Vocabulary.deleteMany({});
    await Lesson.deleteMany({});
    await UserProgress.deleteMany({});
    await GameResult.deleteMany({});
    
    // Insert data to Atlas
    console.log('📤 Inserting data to Atlas...');
    
    if (vocabularies.length > 0) {
      await Vocabulary.insertMany(vocabularies);
      console.log(`✅ Inserted ${vocabularies.length} vocabularies`);
    }
    
    if (lessons.length > 0) {
      await Lesson.insertMany(lessons);
      console.log(`✅ Inserted ${lessons.length} lessons`);
    }
    
    if (userProgress.length > 0) {
      await UserProgress.insertMany(userProgress);
      console.log(`✅ Inserted ${userProgress.length} user progress records`);
    }
    
    if (gameResults.length > 0) {
      await GameResult.insertMany(gameResults);
      console.log(`✅ Inserted ${gameResults.length} game results`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 Data summary:');
    console.log(`   - Vocabularies: ${vocabularies.length}`);
    console.log(`   - Lessons: ${lessons.length}`);
    console.log(`   - User Progress: ${userProgress.length}`);
    console.log(`   - Game Results: ${gameResults.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};

// Run migration
migrateToAtlas();




