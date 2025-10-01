import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const UserContext = createContext({
  user: null,
  loading: true,
  updateUser: () => {},
  logout: () => {}
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      await authService.initializeAuth();
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      if (user && user.id) {
        const response = await userService.getUserById(user.id);
        if (response.success) {
          const formattedUser = userService.formatUserProfile(response.user);
          setUser(formattedUser);
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (user && user.id) {
        const response = await userService.updateUserProfile(user.id, profileData);
        if (response.success) {
          const formattedUser = userService.formatUserProfile(response.user);
          setUser(formattedUser);
          return { success: true, user: formattedUser };
        } else {
          return { success: false, error: response.message };
        }
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUserStats = async (stats) => {
    try {
      if (user && user.id) {
        const response = await userService.updateUserStats(user.id, stats);
        if (response.success) {
          const formattedUser = userService.formatUserProfile(response.user);
          setUser(formattedUser);
          return { success: true, user: formattedUser };
        } else {
          return { success: false, error: response.message };
        }
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Update user stats error:', error);
      return { success: false, error: error.message };
    }
  };

  const addAchievement = async (achievement) => {
    try {
      if (user && user.id) {
        const response = await userService.addAchievement(user.id, achievement);
        if (response.success) {
          const formattedUser = userService.formatUserProfile(response.user);
          setUser(formattedUser);
          return { success: true, user: formattedUser };
        } else {
          return { success: false, error: response.message };
        }
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Add achievement error:', error);
      return { success: false, error: error.message };
    }
  };

  const addBadge = async (badge) => {
    try {
      if (user && user.id) {
        const response = await userService.addBadge(user.id, badge);
        if (response.success) {
          const formattedUser = userService.formatUserProfile(response.user);
          setUser(formattedUser);
          return { success: true, user: formattedUser };
        } else {
          return { success: false, error: response.message };
        }
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Add badge error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    updateUser,
    refreshUser,
    updateUserProfile,
    updateUserStats,
    addAchievement,
    addBadge,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
