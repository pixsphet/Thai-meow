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

// Mock users data (ข้อมูลผู้ใช้ที่สมัครในระบบเดิม)
const mockUsers = [
  {
    email: 'user1@example.com',
    username: 'user1',
    password: 'password123',
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Learning Thai language',
      country: 'Thailand'
    }
  },
  {
    email: 'user2@example.com',
    username: 'user2',
    password: 'password123',
    profile: {
      first_name: 'Jane',
      last_name: 'Smith',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Thai language enthusiast',
      country: 'USA'
    }
  },
  {
    email: 'test@example.com',
    username: 'testuser',
    password: 'test123',
    profile: {
      first_name: 'Test',
      last_name: 'User',
      avatar: 'https://via.placeholder.com/150',
      bio: 'Testing the app',
      country: 'Thailand'
    }
  }
];

// Migration function
const migrateUsers = async () => {
  try {
    console.log('🚀 Starting user migration to MongoDB Atlas...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing users (optional - remove this if you want to keep existing data)
    console.log('🗑️ Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared');
    
    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of mockUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { email: userData.email },
            { username: userData.username }
          ]
        });
        
        if (existingUser) {
          console.log(`⚠️ User ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create user with full schema
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
            date_of_birth: null,
            gender: null,
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
            total_xp: 0,
            level: 1,
            streak: 0,
            longest_streak: 0,
            lessons_completed: 0,
            games_played: 0,
            total_time_spent: 0
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
        createdUsers.push(user);
        console.log(`✅ User created: ${userData.email} (${userData.username})`);
        
      } catch (error) {
        console.error(`❌ Error creating user ${userData.email}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total users created: ${createdUsers.length}`);
    console.log(`📊 Total users in database: ${await User.countDocuments()}`);
    
    // Display created users
    console.log('\n👥 Created users:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.username}) - ID: ${user._id}`);
    });
    
    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const testUser = createdUsers[0];
    const testPassword = mockUsers[0].password;
    
    const isValidPassword = await bcrypt.compare(testPassword, testUser.password);
    if (isValidPassword) {
      console.log('✅ Password authentication working correctly');
    } else {
      console.log('❌ Password authentication failed');
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
migrateUsers();
