const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profile: {
    first_name: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    last_name: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    date_of_birth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    country: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'th'
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      marketing: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profile_visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      show_email: {
        type: Boolean,
        default: false
      },
      show_activity: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    total_xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      type: Number,
      default: 0
    },
    longest_streak: {
      type: Number,
      default: 0
    },
    lessons_completed: {
      type: Number,
      default: 0
    },
    games_played: {
      type: Number,
      default: 0
    },
    total_time_spent: {
      type: Number,
      default: 0 // in minutes
    }
  },
  achievements: [{
    achievement_id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    unlocked_at: {
      type: Date,
      default: Date.now
    }
  }],
  badges: [{
    badge_id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    earned_at: {
      type: Date,
      default: Date.now
    }
  }],
  social: {
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    blocked_users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  learning_progress: {
    current_lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completed_lessons: [{
      lesson_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      },
      completed_at: {
        type: Date,
        default: Date.now
      },
      score: {
        type: Number,
        default: 0
      },
      time_spent: {
        type: Number,
        default: 0
      }
    }],
    favorite_categories: [{
      type: String
    }],
    learning_goals: {
      daily_xp_target: {
        type: Number,
        default: 100
      },
      weekly_lessons_target: {
        type: Number,
        default: 5
      },
      streak_goal: {
        type: Number,
        default: 7
      }
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  verification_token: {
    type: String,
    default: ''
  },
  password_reset_token: {
    type: String,
    default: ''
  },
  password_reset_expires: {
    type: Date
  },
  last_login: {
    type: Date
  },
  last_activity: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date
  }
});

// Update the updated_at field before saving
userSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Update the last_activity field before saving
userSchema.pre('save', function(next) {
  this.last_activity = new Date();
  next();
});

// Index for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ is_active: 1 });
userSchema.index({ created_at: -1 });
userSchema.index({ last_activity: -1 });

// Virtual for full name
userSchema.virtual('full_name').get(function() {
  if (this.profile.first_name && this.profile.last_name) {
    return `${this.profile.first_name} ${this.profile.last_name}`;
  }
  return this.username;
});

// Virtual for account age
userSchema.virtual('account_age_days').get(function() {
  const now = new Date();
  const created = this.created_at;
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    profile: {
      first_name: this.profile.first_name,
      last_name: this.profile.last_name,
      avatar: this.profile.avatar,
      bio: this.profile.bio,
      country: this.profile.country
    },
    stats: {
      total_xp: this.stats.total_xp,
      level: this.stats.level,
      streak: this.stats.streak,
      lessons_completed: this.stats.lessons_completed,
      games_played: this.stats.games_played
    },
    achievements: this.achievements,
    badges: this.badges,
    created_at: this.created_at
  };
};

// Method to check if user can access another user's profile
userSchema.methods.canAccessProfile = function(targetUser) {
  // User can always access their own profile
  if (this._id.equals(targetUser._id)) {
    return true;
  }
  
  // Check if target user is blocked
  if (this.social.blocked_users.includes(targetUser._id)) {
    return false;
  }
  
  // Check privacy settings
  switch (targetUser.preferences.privacy.profile_visibility) {
    case 'public':
      return true;
    case 'friends':
      return this.social.friends.includes(targetUser._id);
    case 'private':
      return false;
    default:
      return true;
  }
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ is_active: true });
};

// Static method to find by email or username
// Additional indexes (email and username already indexed above)

userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ],
    is_active: true
  });
};

module.exports = mongoose.model('User', userSchema);
