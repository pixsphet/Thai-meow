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

const seedDailyChallenges = async () => {
  try {
    await connectDB();
    
    // Clear existing challenges for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await DailyChallenge.deleteMany({ date: today });
    console.log('Cleared existing challenges for today');
    
    // Create challenges one by one
    const challenges = [
      {
        date: today,
        title: 'Daily XP Goal',
        description: 'Earn 100 XP today',
        type: 'xp_goal',
        target_value: 100,
        rewards: {
          xp_bonus: 50,
          streak_bonus: 1
        },
        difficulty: 'easy',
        categories: ['basic_letters', 'vowels'],
        target_levels: ['Beginner', 'Intermediate', 'Advanced']
      },
      {
        date: today,
        title: 'Perfect Score Master',
        description: 'Get 3 perfect scores today',
        type: 'perfect_scores',
        target_value: 3,
        rewards: {
          xp_bonus: 100,
          special_reward: 'Perfect Score Badge'
        },
        difficulty: 'medium',
        categories: ['basic_letters', 'vowels', 'tones'],
        target_levels: ['Beginner', 'Intermediate', 'Advanced']
      },
      {
        date: today,
        title: 'Streak Keeper',
        description: 'Maintain your streak for 3 days',
        type: 'streak_goal',
        target_value: 3,
        rewards: {
          xp_bonus: 75,
          streak_bonus: 2
        },
        difficulty: 'medium',
        categories: ['basic_letters', 'vowels', 'tones'],
        target_levels: ['Beginner', 'Intermediate', 'Advanced']
      },
      {
        date: today,
        title: 'Game Marathon',
        description: 'Play 5 games today',
        type: 'games_played',
        target_value: 5,
        rewards: {
          xp_bonus: 80,
          special_reward: 'Marathon Badge'
        },
        difficulty: 'easy',
        categories: ['basic_letters', 'vowels', 'tones'],
        target_levels: ['Beginner', 'Intermediate', 'Advanced']
      },
      {
        date: today,
        title: 'Time Master',
        description: 'Spend 30 minutes learning today',
        type: 'time_spent',
        target_value: 1800, // 30 minutes in seconds
        rewards: {
          xp_bonus: 120,
          special_reward: 'Time Master Badge'
        },
        difficulty: 'hard',
        categories: ['basic_letters', 'vowels', 'tones'],
        target_levels: ['Beginner', 'Intermediate', 'Advanced']
      }
    ];
    
    let createdCount = 0;
    for (const challengeData of challenges) {
      try {
        const challenge = new DailyChallenge(challengeData);
        await challenge.save();
        console.log(`✅ Created: ${challenge.title}`);
        createdCount++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️  Skipped (duplicate): ${challengeData.title}`);
        } else {
          console.error(`❌ Error creating ${challengeData.title}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdCount} daily challenges for today`);
    
    // Display all challenges for today
    const allChallenges = await DailyChallenge.find({ date: today });
    console.log('\n📋 Today\'s challenges:');
    allChallenges.forEach((challenge, index) => {
      console.log(`${index + 1}. ${challenge.title} - ${challenge.description}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding daily challenges:', error);
    process.exit(1);
  }
};

seedDailyChallenges();
