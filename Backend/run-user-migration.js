#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// MongoDB Atlas connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://2755petchanan_db_user:19202546@cluster0.lu8vz2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Main migration function
const runMigration = async () => {
  try {
    console.log('🚀 Starting User Migration to MongoDB Atlas...');
    console.log('=' .repeat(50));
    
    // Connect to database
    await connectDB();
    
    // Check current user count
    const currentUserCount = await User.countDocuments();
    console.log(`📊 Current users in database: ${currentUserCount}`);
    
    // Sample users to migrate
    const usersToMigrate = [
      {
        email: 'admin@thai-meow.com',
        username: 'admin',
        password: 'admin123',
        profile: {
          first_name: 'Admin',
          last_name: 'User',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Thai Meow App Administrator',
          country: 'Thailand'
        },
        stats: {
          total_xp: 1000,
          level: 10,
          streak: 30,
          longest_streak: 30,
          lessons_completed: 20,
          games_played: 50,
          total_time_spent: 300
        }
      },
      {
        email: 'demo@thai-meow.com',
        username: 'demo_user',
        password: 'demo123',
        profile: {
          first_name: 'Demo',
          last_name: 'User',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Demo user for testing',
          country: 'Thailand'
        },
        stats: {
          total_xp: 500,
          level: 5,
          streak: 15,
          longest_streak: 20,
          lessons_completed: 10,
          games_played: 25,
          total_time_spent: 150
        }
      },
      {
        email: 'test@thai-meow.com',
        username: 'test_user',
        password: 'test123',
        profile: {
          first_name: 'Test',
          last_name: 'User',
          avatar: 'https://via.placeholder.com/150',
          bio: 'Test user for development',
          country: 'Thailand'
        },
        stats: {
          total_xp: 200,
          level: 2,
          streak: 5,
          longest_streak: 10,
          lessons_completed: 3,
          games_played: 8,
          total_time_spent: 60
        }
      }
    ];
    
    console.log(`\n👥 Migrating ${usersToMigrate.length} users...`);
    console.log('-' .repeat(30));
    
    const migratedUsers = [];
    
    for (const userData of usersToMigrate) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { email: userData.email },
            { username: userData.username }
          ]
        });
        
        if (existingUser) {
          console.log(`⚠️ User ${userData.email} already exists, updating...`);
          
          // Update existing user
          const updatedUser = await User.findByIdAndUpdate(
            existingUser._id,
            {
              $set: {
                profile: {
                  first_name: userData.profile.first_name,
                  last_name: userData.profile.last_name,
                  avatar: userData.profile.avatar,
                  bio: userData.profile.bio,
                  country: userData.profile.country,
                  language: 'th'
                },
                stats: {
                  total_xp: userData.stats.total_xp,
                  level: userData.stats.level,
                  streak: userData.stats.streak,
                  longest_streak: userData.stats.longest_streak,
                  lessons_completed: userData.stats.lessons_completed,
                  games_played: userData.stats.games_played,
                  total_time_spent: userData.stats.total_time_spent
                },
                last_activity: new Date(),
                updated_at: new Date()
              }
            },
            { new: true }
          );
          
          migratedUsers.push(updatedUser);
          console.log(`✅ User updated: ${userData.email} (${userData.username})`);
          continue;
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create new user
        const user = new User({
          email: userData.email,
          password: hashedPassword,
          username: userData.username,
          profile: {
            first_name: userData.profile.first_name,
            last_name: userData.profile.last_name,
            avatar: userData.profile.avatar,
            bio: userData.profile.bio,
            country: userData.profile.country,
            language: 'th'
          },
          preferences: {
            theme: 'auto',
            notifications: {
              email: true,
              push: true,
              marketing: false
            },
            privacy: {
              profile_visibility: 'public',
              show_email: false,
              show_activity: true
            }
          },
          stats: {
            total_xp: userData.stats.total_xp,
            level: userData.stats.level,
            streak: userData.stats.streak,
            longest_streak: userData.stats.longest_streak,
            lessons_completed: userData.stats.lessons_completed,
            games_played: userData.stats.games_played,
            total_time_spent: userData.stats.total_time_spent
          },
          achievements: [],
          badges: [],
          social: {
            friends: [],
            followers: [],
            following: [],
            blocked_users: []
          },
          learning_progress: {
            current_lesson: null,
            completed_lessons: [],
            favorite_categories: [],
            learning_goals: {
              daily_xp_target: 100,
              weekly_lessons_target: 5,
              streak_goal: 7
            }
          },
          is_active: true,
          is_verified: false,
          verification_token: '',
          password_reset_token: '',
          password_reset_expires: null,
          last_login: null,
          last_activity: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null
        });
        
        await user.save();
        migratedUsers.push(user);
        console.log(`✅ User created: ${userData.email} (${userData.username})`);
        
      } catch (error) {
        console.error(`❌ Error processing user ${userData.email}:`, error.message);
      }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log(`🎉 Migration completed!`);
    console.log(`📊 Total users processed: ${migratedUsers.length}`);
    console.log(`📊 Total users in database: ${await User.countDocuments()}`);
    
    // Display migrated users
    console.log('\n👥 Migrated users:');
    console.log('-' .repeat(30));
    migratedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Level: ${user.stats.level}, XP: ${user.stats.total_xp}`);
      console.log(`   Streak: ${user.stats.streak}, Lessons: ${user.stats.lessons_completed}`);
      console.log('');
    });
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    if (migratedUsers.length > 0) {
      const testUser = migratedUsers[0];
      const testPassword = usersToMigrate[0].password;
      
      const isValidPassword = await bcrypt.compare(testPassword, testUser.password);
      if (isValidPassword) {
        console.log('✅ Password authentication working correctly');
      } else {
        console.log('❌ Password authentication failed');
      }
    }
    
    console.log('\n🚀 Migration completed successfully!');
    console.log('You can now use the app with MongoDB Atlas user data.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run migration
runMigration();
