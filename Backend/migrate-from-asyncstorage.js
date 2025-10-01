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

// Function to create user from AsyncStorage data
const createUserFromAsyncStorage = async (userData) => {
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
              first_name: userData.profile?.first_name || 'User',
              last_name: userData.profile?.last_name || '',
              avatar: userData.profile?.avatar || 'https://via.placeholder.com/150',
              bio: userData.profile?.bio || '',
              country: userData.profile?.country || 'Thailand',
              date_of_birth: userData.profile?.date_of_birth || null,
              gender: userData.profile?.gender || null,
              language: userData.profile?.language || 'th'
            },
            last_activity: new Date(),
            updated_at: new Date()
          }
        },
        { new: true }
      );
      
      return updatedUser;
    }
    
    // Hash password if provided
    let hashedPassword = userData.password;
    if (userData.password && !userData.password.startsWith('$2')) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    }
    
    // Create new user
    const user = new User({
      email: userData.email,
      password: hashedPassword || 'defaultpassword123',
      username: userData.username,
      profile: {
        first_name: userData.profile?.first_name || 'User',
        last_name: userData.profile?.last_name || '',
        avatar: userData.profile?.avatar || 'https://via.placeholder.com/150',
        bio: userData.profile?.bio || '',
        country: userData.profile?.country || 'Thailand',
        date_of_birth: userData.profile?.date_of_birth || null,
        gender: userData.profile?.gender || null,
        language: userData.profile?.language || 'th'
      },
      preferences: {
        theme: userData.preferences?.theme || 'auto',
        notifications: {
          email: userData.preferences?.notifications?.email !== false,
          push: userData.preferences?.notifications?.push !== false,
          marketing: userData.preferences?.notifications?.marketing || false
        },
        privacy: {
          profile_visibility: userData.preferences?.privacy?.profile_visibility || 'public',
          show_email: userData.preferences?.privacy?.show_email || false,
          show_activity: userData.preferences?.privacy?.show_activity !== false
        }
      },
      stats: {
        total_xp: userData.stats?.total_xp || 0,
        level: userData.stats?.level || 1,
        streak: userData.stats?.streak || 0,
        longest_streak: userData.stats?.longest_streak || 0,
        lessons_completed: userData.stats?.lessons_completed || 0,
        games_played: userData.stats?.games_played || 0,
        total_time_spent: userData.stats?.total_time_spent || 0
      },
      achievements: userData.achievements || [],
      badges: userData.badges || [],
      social: {
        friends: userData.social?.friends || [],
        followers: userData.social?.followers || [],
        following: userData.social?.following || [],
        blocked_users: userData.social?.blocked_users || []
      },
      learning_progress: {
        current_lesson: userData.learning_progress?.current_lesson || null,
        completed_lessons: userData.learning_progress?.completed_lessons || [],
        favorite_categories: userData.learning_progress?.favorite_categories || [],
        learning_goals: {
          daily_xp_target: userData.learning_progress?.learning_goals?.daily_xp_target || 100,
          weekly_lessons_target: userData.learning_progress?.learning_goals?.weekly_lessons_target || 5,
          streak_goal: userData.learning_progress?.learning_goals?.streak_goal || 7
        }
      },
      is_active: userData.is_active !== false,
      is_verified: userData.is_verified || false,
      verification_token: userData.verification_token || '',
      password_reset_token: userData.password_reset_token || '',
      password_reset_expires: userData.password_reset_expires || null,
      last_login: userData.last_login || null,
      last_activity: new Date(),
      created_at: userData.created_at || new Date(),
      updated_at: new Date(),
      deleted_at: userData.deleted_at || null
    });
    
    await user.save();
    return user;
    
  } catch (error) {
    console.error(`❌ Error creating user ${userData.email}:`, error.message);
    throw error;
  }
};

// Sample data from AsyncStorage (this would be extracted from the app)
const sampleAsyncStorageData = [
  {
    id: 'user123',
    email: 'john@example.com',
    username: 'john_doe',
    password: 'password123',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Learning Thai language',
      country: 'Thailand'
    },
    stats: {
      total_xp: 150,
      level: 2,
      streak: 5,
      lessons_completed: 3,
      games_played: 10
    },
    created_at: new Date('2024-01-01'),
    last_login: new Date('2024-01-15')
  },
  {
    id: 'user456',
    email: 'jane@example.com',
    username: 'jane_smith',
    password: 'password456',
    profile: {
      first_name: 'Jane',
      last_name: 'Smith',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Thai language enthusiast',
      country: 'USA'
    },
    stats: {
      total_xp: 300,
      level: 3,
      streak: 10,
      lessons_completed: 5,
      games_played: 20
    },
    created_at: new Date('2024-01-05'),
    last_login: new Date('2024-01-14')
  }
];

// Migration function
const migrateFromAsyncStorage = async () => {
  try {
    console.log('🚀 Starting migration from AsyncStorage to MongoDB Atlas...');
    
    // Connect to database
    await connectDB();
    
    console.log('👥 Migrating users from AsyncStorage data...');
    const migratedUsers = [];
    
    for (const userData of sampleAsyncStorageData) {
      try {
        const user = await createUserFromAsyncStorage(userData);
        migratedUsers.push(user);
        console.log(`✅ User migrated: ${userData.email} (${userData.username})`);
      } catch (error) {
        console.error(`❌ Failed to migrate user ${userData.email}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total users migrated: ${migratedUsers.length}`);
    console.log(`📊 Total users in database: ${await User.countDocuments()}`);
    
    // Display migrated users
    console.log('\n👥 Migrated users:');
    migratedUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username}) - ID: ${user._id}`);
      console.log(`   Level: ${user.stats.level}, XP: ${user.stats.total_xp}, Streak: ${user.stats.streak}`);
    });
    
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    if (migratedUsers.length > 0) {
      const testUser = migratedUsers[0];
      const testPassword = sampleAsyncStorageData[0].password;
      
      const isValidPassword = await bcrypt.compare(testPassword, testUser.password);
      if (isValidPassword) {
        console.log('✅ Password authentication working correctly');
      } else {
        console.log('❌ Password authentication failed');
      }
    }
    
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
migrateFromAsyncStorage();
