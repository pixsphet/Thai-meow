const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Vocabulary = require('./models/Vocabulary');
const Lesson = require('./models/Lesson');
const UserProgress = require('./models/UserProgress');
const GameResult = require('./models/GameResult');

const setupAtlas = async () => {
  try {
    console.log('🚀 Setting up MongoDB Atlas...');
    
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please create a .env file with your MongoDB Atlas connection string');
      console.log('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority');
      return;
    }
    
    console.log('📡 Connecting to MongoDB Atlas...');
    console.log('🔗 Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@'));
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState}`);
    
    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    
    // Vocabulary indexes
    await Vocabulary.collection.createIndex({ word: 1 });
    await Vocabulary.collection.createIndex({ lesson_id: 1 });
    await Vocabulary.collection.createIndex({ category: 1 });
    
    // Lesson indexes
    await Lesson.collection.createIndex({ lesson_id: 1 });
    await Lesson.collection.createIndex({ level: 1 });
    await Lesson.collection.createIndex({ category: 1 });
    
    // UserProgress indexes
    await UserProgress.collection.createIndex({ user_id: 1 });
    await UserProgress.collection.createIndex({ lesson_id: 1 });
    await UserProgress.collection.createIndex({ user_id: 1, lesson_id: 1 });
    
    // GameResult indexes
    await GameResult.collection.createIndex({ user_id: 1 });
    await GameResult.collection.createIndex({ game_type: 1 });
    await GameResult.collection.createIndex({ created_at: -1 });
    
    console.log('✅ Indexes created successfully!');
    
    // Test basic operations
    console.log('🧪 Testing basic operations...');
    
    const vocabCount = await Vocabulary.countDocuments();
    const lessonCount = await Lesson.countDocuments();
    const userProgressCount = await UserProgress.countDocuments();
    const gameResultCount = await GameResult.countDocuments();
    
    console.log('📊 Database statistics:');
    console.log(`   - Vocabularies: ${vocabCount}`);
    console.log(`   - Lessons: ${lessonCount}`);
    console.log(`   - User Progress: ${userProgressCount}`);
    console.log(`   - Game Results: ${gameResultCount}`);
    
    console.log('🎉 MongoDB Atlas setup completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Run "npm run migrate-atlas" to migrate data from local MongoDB');
    console.log('2. Run "npm run test-atlas" to test the connection');
    console.log('3. Update your Frontend to use the new Atlas endpoints');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Please check your username and password.');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network error. Please check your internet connection and IP whitelist.');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout. Please check your connection string and network.');
    } else {
      console.error('🔍 Unknown error. Please check your connection string format.');
    }
    
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Verify your username and password');
    console.log('3. Check your IP whitelist in MongoDB Atlas');
    console.log('4. Ensure your cluster is running');
    console.log('5. Check your network connection');
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas');
    process.exit(0);
  }
};

// Run setup
setupAtlas();
