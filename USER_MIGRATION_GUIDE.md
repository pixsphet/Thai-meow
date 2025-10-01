# 🚀 User Migration Guide - MongoDB Atlas

## 📋 Overview
This guide explains how to migrate user data from the local system to MongoDB Atlas and set up the new user management system.

## 🏗️ What's Been Implemented

### Backend Changes
1. **User Model** (`Backend/models/User.js`) - Complete user schema with:
   - Profile information
   - Authentication data
   - Learning statistics
   - Achievements & badges
   - Social features
   - Learning progress

2. **User Routes** (`Backend/routes/users.js`) - API endpoints for:
   - User CRUD operations
   - Profile management
   - Stats updates
   - Achievement/badge management
   - Leaderboard
   - User search

3. **Auth Routes** (`Backend/routes/auth.js`) - Authentication endpoints:
   - User registration
   - User login
   - Profile management
   - Password management

### Frontend Changes
1. **User Service** (`Frontend/thai-meow/src/services/userService.js`) - Service for:
   - User data management
   - Profile updates
   - Stats management
   - Achievement/badge handling

2. **Updated Auth Service** (`Frontend/thai-meow/src/services/authService.js`) - Enhanced with:
   - MongoDB Atlas integration
   - User profile management
   - Stats updates

3. **Updated User Context** (`Frontend/thai-meow/src/contexts/UserContext.js`) - Context with:
   - MongoDB Atlas data fetching
   - Real-time user updates
   - Profile management functions

## 🚀 Migration Steps

### Step 1: Run User Migration
```bash
cd Backend
node run-user-migration.js
```

This will:
- Connect to MongoDB Atlas
- Create sample users with full profiles
- Set up authentication
- Test the system

### Step 2: Test the System
```bash
cd Backend
node test-user-system.js
```

This will:
- Test user authentication
- Test JWT token generation
- Test user stats updates
- Test achievement system
- Test user search and leaderboard

### Step 3: Start the Backend Server
```bash
cd Backend
npm start
```

### Step 4: Test Frontend Integration
1. Open the React Native app
2. Try registering a new user
3. Try logging in with existing users
4. Check if user data is properly synced with MongoDB Atlas

## 📊 Sample Users Created

The migration creates these sample users:

1. **Admin User**
   - Email: `admin@thai-meow.com`
   - Username: `admin`
   - Password: `admin123`
   - Level: 10, XP: 1000

2. **Demo User**
   - Email: `demo@thai-meow.com`
   - Username: `demo_user`
   - Password: `demo123`
   - Level: 5, XP: 500

3. **Test User**
   - Email: `test@thai-meow.com`
   - Username: `test_user`
   - Password: `test123`
   - Level: 2, XP: 200

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### User Management
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/profile` - Get public user profile
- `PUT /api/users/:id/profile` - Update user profile
- `PUT /api/users/:id/stats` - Update user stats
- `POST /api/users/:id/achievements` - Add achievement
- `POST /api/users/:id/badges` - Add badge
- `GET /api/users/leaderboard/top` - Get leaderboard
- `GET /api/users/search/:query` - Search users

## 🎯 Key Features

### User Profile Management
- Complete profile information
- Avatar support
- Bio and country
- Language preferences

### Learning Statistics
- Total XP tracking
- Level calculation
- Streak management
- Lessons completed
- Games played
- Time spent learning

### Achievement System
- Achievement tracking
- Badge system
- Unlock timestamps
- Progress monitoring

### Social Features
- Friends system
- Followers/following
- User search
- Leaderboard
- Privacy settings

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation
- Error handling
- Privacy controls

## 📱 Frontend Integration

### Using User Context
```javascript
import { useUser } from '../contexts/UserContext';

const { 
  user, 
  loading, 
  updateUserProfile, 
  updateUserStats, 
  addAchievement,
  addBadge 
} = useUser();
```

### Updating User Stats
```javascript
const result = await updateUserStats({
  total_xp: 150,
  level: 2,
  streak: 5,
  lessons_completed: 3
});
```

### Adding Achievements
```javascript
const result = await addAchievement({
  achievement_id: 'first_lesson',
  name: 'First Lesson',
  description: 'Completed your first lesson',
  icon: '🎓'
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**
   - Check MongoDB Atlas connection string
   - Verify network access
   - Check credentials

2. **Authentication Failed**
   - Verify JWT secret
   - Check token expiration
   - Validate user credentials

3. **Data Not Syncing**
   - Check API endpoints
   - Verify request headers
   - Check error logs

### Debug Commands

```bash
# Check MongoDB connection
node -e "require('./config/database')()"

# Test user authentication
node test-user-system.js

# Check user data
node -e "require('dotenv').config(); const mongoose = require('mongoose'); const User = require('./models/User'); mongoose.connect(process.env.MONGODB_URI).then(() => User.find()).then(users => console.log(users)).then(() => process.exit())"
```

## ✅ Success Indicators

- ✅ Users can register and login
- ✅ User data is stored in MongoDB Atlas
- ✅ Profile updates work correctly
- ✅ Stats are tracked and updated
- ✅ Achievements can be added
- ✅ Leaderboard displays correctly
- ✅ User search works
- ✅ JWT authentication is working

## 🎉 Next Steps

1. **Customize User Schema** - Add more fields as needed
2. **Implement Notifications** - Add push notifications
3. **Add Social Features** - Implement friends system
4. **Create Admin Panel** - Build admin interface
5. **Add Analytics** - Track user behavior
6. **Implement Caching** - Add Redis for performance

## 📞 Support

If you encounter any issues:
1. Check the console logs
2. Verify MongoDB Atlas connection
3. Test API endpoints individually
4. Check user permissions
5. Review error messages

The system is now fully integrated with MongoDB Atlas and ready for production use! 🚀
