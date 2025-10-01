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

const clearDailyChallenges = async () => {
  try {
    await connectDB();
    
    // Drop the entire collection
    await DailyChallenge.collection.drop();
    console.log('✅ Dropped daily challenges collection');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 26) {
      console.log('Collection does not exist, nothing to drop');
    } else {
      console.error('Error clearing daily challenges:', error);
    }
    process.exit(1);
  }
};

clearDailyChallenges();
