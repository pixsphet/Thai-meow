const mongoose = require('mongoose');
const DailyChallenge = require('./models/DailyChallenge');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_meow';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const fixIndex = async () => {
  try {
    await connectDB();
    
    // Drop the unique index on date
    try {
      await DailyChallenge.collection.dropIndex('date_1');
      console.log('✅ Dropped unique index on date');
    } catch (error) {
      console.log('Index does not exist or already dropped');
    }
    
    // Create a non-unique index on date
    await DailyChallenge.collection.createIndex({ date: 1 });
    console.log('✅ Created non-unique index on date');
    
    // Clear all existing challenges
    await DailyChallenge.deleteMany({});
    console.log('✅ Cleared all existing challenges');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing index:', error);
    process.exit(1);
  }
};

fixIndex();
