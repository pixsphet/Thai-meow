const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://2755petchanan_db_user:19202546@cluster0.lu8vz2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedAchievements = async () => {
  try {
    console.log('🌱 Starting to seed achievements...');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('🗑️  Cleared existing achievements');

    const defaultAchievements = [
      // Learning achievements
      {
        achievement_id: 'first_game',
        name: 'First Steps',
        description: 'Play your first game',
        category: 'learning',
        criteria: { type: 'first_game', value: 1, operator: '>=' },
        points: 10,
        icon: 'play-circle',
        color: '#4CAF50',
        rarity: 'common'
      },
      {
        achievement_id: 'level_5',
        name: 'Rising Star',
        description: 'Reach level 5',
        category: 'level',
        criteria: { type: 'level_reached', value: 5, operator: '>=' },
        points: 50,
        icon: 'star',
        color: '#FFD700',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'level_10',
        name: 'Expert Learner',
        description: 'Reach level 10',
        category: 'level',
        criteria: { type: 'level_reached', value: 10, operator: '>=' },
        points: 100,
        icon: 'trophy',
        color: '#FF6B6B',
        rarity: 'rare'
      },
      {
        achievement_id: 'level_20',
        name: 'Master Learner',
        description: 'Reach level 20',
        category: 'level',
        criteria: { type: 'level_reached', value: 20, operator: '>=' },
        points: 200,
        icon: 'crown',
        color: '#9C27B0',
        rarity: 'epic'
      },
      
      // Streak achievements
      {
        achievement_id: 'streak_3',
        name: 'Getting Started',
        description: 'Maintain a 3-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 3, operator: '>=' },
        points: 25,
        icon: 'flame',
        color: '#FF9800',
        rarity: 'common'
      },
      {
        achievement_id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 7, operator: '>=' },
        points: 75,
        icon: 'fire',
        color: '#F44336',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'streak_14',
        name: 'Two Week Champion',
        description: 'Maintain a 14-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 14, operator: '>=' },
        points: 150,
        icon: 'medal',
        color: '#E91E63',
        rarity: 'rare'
      },
      {
        achievement_id: 'streak_30',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        category: 'streak',
        criteria: { type: 'streak_days', value: 30, operator: '>=' },
        points: 300,
        icon: 'crown',
        color: '#9C27B0',
        rarity: 'legendary'
      },
      
      // Score achievements
      {
        achievement_id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Get a perfect score in a game',
        category: 'score',
        criteria: { type: 'perfect_scores', value: 1, operator: '>=' },
        points: 30,
        icon: 'checkmark-circle',
        color: '#4CAF50',
        rarity: 'common'
      },
      {
        achievement_id: 'perfect_5',
        name: 'Flawless',
        description: 'Get 5 perfect scores',
        category: 'score',
        criteria: { type: 'perfect_scores', value: 5, operator: '>=' },
        points: 100,
        icon: 'medal',
        color: '#FFD700',
        rarity: 'rare'
      },
      {
        achievement_id: 'perfect_10',
        name: 'Perfect Master',
        description: 'Get 10 perfect scores',
        category: 'score',
        criteria: { type: 'perfect_scores', value: 10, operator: '>=' },
        points: 200,
        icon: 'trophy',
        color: '#FF6B6B',
        rarity: 'epic'
      },
      
      // Game achievements
      {
        achievement_id: 'games_10',
        name: 'Game Enthusiast',
        description: 'Play 10 games',
        category: 'game',
        criteria: { type: 'games_played', value: 10, operator: '>=' },
        points: 50,
        icon: 'game-controller',
        color: '#2196F3',
        rarity: 'common'
      },
      {
        achievement_id: 'games_25',
        name: 'Game Lover',
        description: 'Play 25 games',
        category: 'game',
        criteria: { type: 'games_played', value: 25, operator: '>=' },
        points: 100,
        icon: 'gamepad',
        color: '#FF9800',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'games_50',
        name: 'Game Master',
        description: 'Play 50 games',
        category: 'game',
        criteria: { type: 'games_played', value: 50, operator: '>=' },
        points: 200,
        icon: 'trophy',
        color: '#FF6B6B',
        rarity: 'epic'
      },
      {
        achievement_id: 'games_100',
        name: 'Game Legend',
        description: 'Play 100 games',
        category: 'game',
        criteria: { type: 'games_played', value: 100, operator: '>=' },
        points: 500,
        icon: 'crown',
        color: '#9C27B0',
        rarity: 'legendary'
      },
      
      // Time achievements
      {
        achievement_id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a game in under 2 minutes',
        category: 'time',
        criteria: { type: 'speed_demon', value: 1, operator: '>=' },
        points: 40,
        icon: 'flash',
        color: '#FF9800',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'daily_player',
        name: 'Daily Player',
        description: 'Play games on consecutive days',
        category: 'time',
        criteria: { type: 'daily_player', value: 1, operator: '>=' },
        points: 60,
        icon: 'calendar',
        color: '#4CAF50',
        rarity: 'uncommon'
      },
      {
        achievement_id: 'marathon_player',
        name: 'Marathon Player',
        description: 'Play for more than 1 hour in a single session',
        category: 'time',
        criteria: { type: 'total_play_time', value: 3600, operator: '>=' },
        points: 80,
        icon: 'time',
        color: '#2196F3',
        rarity: 'rare'
      },
      
      // Special achievements
      {
        achievement_id: 'early_bird',
        name: 'Early Bird',
        description: 'Play a game before 8 AM',
        category: 'special',
        criteria: { type: 'early_bird', value: 1, operator: '>=' },
        points: 25,
        icon: 'sunny',
        color: '#FFD700',
        rarity: 'common'
      },
      {
        achievement_id: 'night_owl',
        name: 'Night Owl',
        description: 'Play a game after 10 PM',
        category: 'special',
        criteria: { type: 'night_owl', value: 1, operator: '>=' },
        points: 25,
        icon: 'moon',
        color: '#673AB7',
        rarity: 'common'
      },
      {
        achievement_id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Play games on both Saturday and Sunday',
        category: 'special',
        criteria: { type: 'weekend_warrior', value: 1, operator: '>=' },
        points: 50,
        icon: 'calendar-outline',
        color: '#FF5722',
        rarity: 'uncommon'
      }
    ];

    // Insert achievements
    await Achievement.insertMany(defaultAchievements);
    console.log(`✅ Successfully seeded ${defaultAchievements.length} achievements`);

    // Display summary
    const categories = [...new Set(defaultAchievements.map(a => a.category))];
    const rarities = [...new Set(defaultAchievements.map(a => a.rarity))];
    
    console.log('\n📊 Achievement Summary:');
    console.log(`📁 Categories: ${categories.join(', ')}`);
    console.log(`⭐ Rarities: ${rarities.join(', ')}`);
    console.log(`🎯 Total Points Available: ${defaultAchievements.reduce((sum, a) => sum + a.points, 0)}`);

  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeding
connectDB().then(() => {
  seedAchievements();
});
