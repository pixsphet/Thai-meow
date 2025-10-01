import apiService from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.initializeAuth();
  }

  // Initialize auth state from MongoDB Atlas
  async initializeAuth() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        // Verify token with MongoDB Atlas
        const userData = await this.verifyToken(token);
        if (userData) {
          this.currentUser = userData;
          this.notifyListeners();
        }
      }
    } catch (error) {
      console.error('Error initializing auth from MongoDB Atlas:', error);
    }
  }

  // Verify token with MongoDB Atlas
  async verifyToken(token) {
    try {
      // Mock token verification
      console.log('🔐 Mock: Verifying token');
      return {
        id: 'mock_user_1',
        email: 'test@example.com',
        name: 'Mock User',
        level: 'beginner',
        points: 100,
        gems: 50
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Register new user
  async register(email, password, username) {
    try {
      console.log('📝 Registering user:', email);
      
      const response = await apiService.register({
        email,
        password,
        username
      });
      
      if (response.data) {
        this.currentUser = response.data.user;
        await AsyncStorage.setItem('currentUser', JSON.stringify(response.data.user));
        if (response.data.token) {
          await AsyncStorage.setItem('authToken', response.data.token);
          console.log('✅ Token stored in AsyncStorage');
          console.log('✅ Token preview:', response.data.token.substring(0, 20) + '...');
        } else {
          console.log('❌ No token in response');
        }
        this.notifyListeners();
        console.log('✅ User registered successfully');
        return { success: true, user: response.data.user };
      } else {
        console.log('❌ Registration failed');
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: error.message };
    }
  }

  // Login user
  async login(email, password) {
    try {
      console.log('🔑 Logging in user:', email);
      
      const response = await apiService.login(email, password);
      
      if (response.data) {
        this.currentUser = response.data.user;
        // Only store token, not user data (user data comes from MongoDB Atlas)
        if (response.data.token) {
          await AsyncStorage.setItem('auth_token', response.data.token);
          console.log('✅ Token stored in AsyncStorage');
          console.log('✅ Token preview:', response.data.token.substring(0, 20) + '...');
        } else {
          console.log('❌ No token in response');
        }
        this.notifyListeners();
        console.log('✅ User logged in successfully');
        return { success: true, user: response.data.user };
      } else {
        console.log('❌ Login failed');
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Logout user
  async logout() {
    try {
      console.log('🚪 Logging out user');
      
      const response = await apiService.logout();
      
      this.currentUser = null;
      // Only remove token, user data is in MongoDB Atlas
      await AsyncStorage.removeItem('auth_token');
      this.notifyListeners();
      console.log('✅ User logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get user profile from MongoDB
  async getUserProfile(userId) {
    try {
      // Mock user profile
      console.log('👤 Mock: Getting user profile for', userId);
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Mock User',
        level: 'beginner',
        points: 100,
        gems: 50
      };
      
      this.currentUser = mockUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(mockUser));
      this.notifyListeners();
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      // Mock update user profile
      console.log('👤 Mock: Updating user profile for', userId);
      const updatedUser = { ...this.currentUser, ...profileData };
      
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.notifyListeners();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user stats
  async updateUserStats(userId, stats) {
    try {
      // Mock update user stats
      console.log('📊 Mock: Updating user stats for', userId);
      const updatedUser = { ...this.currentUser, ...stats };
      
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.notifyListeners();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user stats error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add achievement
  async addAchievement(userId, achievement) {
    try {
      // Mock add achievement
      console.log('🏆 Mock: Adding achievement for', userId);
      const updatedUser = { ...this.currentUser };
      if (!updatedUser.achievements) updatedUser.achievements = [];
      updatedUser.achievements.push(achievement);
      
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.notifyListeners();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Add achievement error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add badge
  async addBadge(userId, badge) {
    try {
      // Mock add badge
      console.log('🎖️ Mock: Adding badge for', userId);
      const updatedUser = { ...this.currentUser };
      if (!updatedUser.badges) updatedUser.badges = [];
      updatedUser.badges.push(badge);
      
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.notifyListeners();
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Add badge error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Add auth state listener
  onAuthStateChanged(callback) {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.authListeners.forEach(callback => {
      callback(this.currentUser);
    });
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      console.log('👤 Mock: Updating user profile');
      
      const updatedUser = { ...this.currentUser, ...userData };
      this.currentUser = updatedUser;
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.notifyListeners();
      console.log('✅ Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      console.log('🔐 Mock: Changing password');
      
      // Mock password change
      console.log('✅ Password changed successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Password change error:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      console.log('🔄 Mock: Resetting password for:', email);
      
      // Mock password reset
      console.log('✅ Password reset email sent');
      return { success: true };
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete account
  async deleteAccount() {
    try {
      console.log('🗑️ Mock: Deleting account');
      
      // Mock account deletion
      this.currentUser = null;
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('auth_token');
      this.notifyListeners();
      console.log('✅ Account deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Account deletion error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
