import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import progressService from '../services/progressService';
import achievementService from '../services/achievementService';

export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const userContext = useContext(UserContext);
  const user = userContext?.user || null;
  
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Load user progress when user changes
  useEffect(() => {
    // console.log('ProgressContext - User data:', user);
    // console.log('ProgressContext - User ID:', user?.id);
    if (user?.id) {
      loadUserProgress();
    } else {
      setProgress(null);
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      // console.log('ProgressContext - Loading progress for user ID:', user.id);
      
      // Check token before making request
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const token = await AsyncStorage.getItem('authToken');
      // console.log('ProgressContext - Token exists:', !!token);
      // console.log('ProgressContext - Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      if (!token) {
        // console.log('ProgressContext - No token found, creating initial progress');
        setProgress({
          user_id: user.id,
          total_xp: 0,
          level: 1,
          streak: 0,
          levels: [],
          games_played: [],
          categories: [],
          statistics: {
            total_play_time: 0,
            total_games_played: 0,
            average_score: 0,
            best_streak: 0,
            perfect_scores: 0,
            total_correct_answers: 0,
            total_questions_answered: 0
          },
          achievements: [],
          daily_progress: []
        });
        setLoading(false);
        return;
      }
      
      // Check if user.id is valid ObjectId format
      if (!user.id || user.id.length !== 24) {
        console.log('ProgressContext - Invalid user ID format:', user.id);
        // Use a default ObjectId for testing
        const defaultUserId = '68db4ffb42926b9c8645a416';
        console.log('ProgressContext - Using default user ID for testing:', defaultUserId);
        
        // Try to load progress with default ID
        try {
          // ใช้ mock data แทน API calls
          console.log('ProgressContext - Using mock data for testing');
          const [userProgress, userAchievements, allAchievementsData, stats] = await Promise.allSettled([
            Promise.resolve({
              user_id: defaultUserId,
              total_xp: 0,
              level: 1,
              streak: 0,
              levels: [],
              games_played: [],
              categories: [],
              statistics: {
                total_play_time: 0,
                total_games_played: 0,
                average_score: 0,
                best_streak: 0,
                perfect_scores: 0,
                total_correct_answers: 0,
                total_questions_answered: 0
              },
              achievements: [],
              daily_progress: []
            }),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve(null)
          ]);
          
          // Handle results...
          if (userProgress.status === 'fulfilled') {
            setProgress(userProgress.value);
          } else {
            setProgress({
              user_id: defaultUserId,
              total_xp: 0,
              level: 1,
              streak: 0,
              levels: [],
              games_played: [],
              categories: [],
              statistics: {
                total_play_time: 0,
                total_games_played: 0,
                average_score: 0,
                best_streak: 0,
                perfect_scores: 0,
                total_correct_answers: 0,
                total_questions_answered: 0
              },
              achievements: [],
              daily_progress: []
            });
          }
          
          if (userAchievements.status === 'fulfilled') {
            setAchievements(userAchievements.value);
          } else {
            setAchievements([]);
          }
          
          if (allAchievementsData.status === 'fulfilled') {
            setAllAchievements(allAchievementsData.value);
          } else {
            setAllAchievements([]);
          }
          
          if (stats.status === 'fulfilled') {
            setAchievementStats(stats.value);
          } else {
            setAchievementStats(null);
          }
          
        } catch (error) {
          console.error('❌ Error loading data from Atlas:', error);
          setProgress({
            user_id: defaultUserId,
            total_xp: 0,
            level: 1,
            streak: 0,
            levels: [],
            games_played: [],
            categories: [],
            statistics: {
              total_play_time: 0,
              total_games_played: 0,
              average_score: 0,
              best_streak: 0,
              perfect_scores: 0,
              total_correct_answers: 0,
              total_questions_answered: 0
            },
            achievements: [],
            daily_progress: []
          });
          setAchievements([]);
          setAllAchievements([]);
          setAchievementStats(null);
        }
        
        setLoading(false);
        return;
      }
      
      // Load user progress and achievements in parallel
      // console.log('ProgressContext - Making API calls with user ID:', user.id);
      // ใช้ mock data แทน API calls
      console.log('ProgressContext - Using mock data for user:', user.id);
      const [userProgress, userAchievements, allAchievementsData, stats] = await Promise.allSettled([
        Promise.resolve({
          user_id: user.id,
          total_xp: 0,
          level: 1,
          streak: 0,
          levels: [],
          games_played: [],
          categories: [],
          statistics: {
            total_play_time: 0,
            total_games_played: 0,
            average_score: 0,
            best_streak: 0,
            perfect_scores: 0,
            total_correct_answers: 0,
            total_questions_answered: 0
          },
          achievements: [],
          daily_progress: []
        }),
        Promise.resolve([]),
        Promise.resolve([]),
        Promise.resolve(null)
      ]);
      
      // Handle user progress
      if (userProgress.status === 'fulfilled') {
        setProgress(userProgress.value);
      } else {
        // console.log('ProgressContext - Failed to load user progress, creating initial progress:', userProgress.reason);
        setProgress({
          user_id: user.id,
          total_xp: 0,
          level: 1,
          streak: 0,
          levels: [],
          games_played: [],
          categories: [],
          statistics: {
            total_play_time: 0,
            total_games_played: 0,
            average_score: 0,
            best_streak: 0,
            perfect_scores: 0,
            total_correct_answers: 0,
            total_questions_answered: 0
          },
          achievements: [],
          daily_progress: []
        });
      }
      
      // Handle achievements
      if (userAchievements.status === 'fulfilled') {
        setAchievements(userAchievements.value);
      } else {
        // console.log('ProgressContext - Failed to load user achievements:', userAchievements.reason);
        setAchievements([]);
      }
      
      // Handle all achievements
      if (allAchievementsData.status === 'fulfilled') {
        setAllAchievements(allAchievementsData.value);
      } else {
        // console.log('ProgressContext - Failed to load all achievements:', allAchievementsData.reason);
        setAllAchievements([]);
      }
      
      // Handle achievement stats
      if (stats.status === 'fulfilled') {
        setAchievementStats(stats.value);
      } else {
        // console.log('ProgressContext - Failed to load achievement stats:', stats.reason);
        setAchievementStats(null);
      }
      
    } catch (error) {
      console.error('❌ Error loading data from Atlas:', error);
      // Create initial progress as fallback
      setProgress({
        user_id: user.id,
        total_xp: 0,
        level: 1,
        streak: 0,
        levels: [],
        games_played: [],
        categories: [],
        statistics: {
          total_play_time: 0,
          total_games_played: 0,
          average_score: 0,
          best_streak: 0,
          perfect_scores: 0,
          total_correct_answers: 0,
          total_questions_answered: 0
        },
        achievements: [],
        daily_progress: []
      });
      setAchievements([]);
      setAllAchievements([]);
      setAchievementStats(null);
    } finally {
      setLoading(false);
    }
  };

  const updateGameProgress = async (gameData) => {
    try {
      if (!user?.id) {
        // console.log('ProgressContext - No user ID, skipping game progress update');
        return { success: false, message: 'No user logged in' };
      }
      
      // Mock update game progress
      console.log('ProgressContext - Mock: Updating game progress for user:', user.id);
      const result = { success: true, message: 'Game progress updated' };
      
      // Check for new achievements (don't wait for it to complete)
      checkAchievements().catch(error => {
        // console.log('ProgressContext - Achievement check failed:', error)
      });
      
      // Reload progress to get updated data (don't wait for it to complete)
      loadUserProgress().catch(error => {
        // console.log('ProgressContext - Progress reload failed:', error)
      });
      
      return result;
    } catch (error) {
      console.error('Error updating game progress:', error);
      // Don't throw error, just log it and return a safe response
      return { success: false, message: error.message };
    }
  };

  const checkAchievements = async () => {
    try {
      if (!user?.id) {
        // console.log('ProgressContext - No user ID, skipping achievement check');
        return { success: false, message: 'No user logged in' };
      }
      
      // Mock check achievements
      console.log('ProgressContext - Mock: Checking achievements for user:', user.id);
      const result = { success: true, unlocked: [] };
      if (result.unlocked && result.unlocked.length > 0) {
        // console.log('🎉 New achievements unlocked:', result.unlocked);
        // You could show a notification here
      }
      return result;
    } catch (error) {
      console.error('Error checking achievements:', error);
      // Don't throw error, just log it and return a safe response
      return { success: false, message: error.message };
    }
  };

  const updateLevelProgress = async (levelData) => {
    try {
      if (!user?.id) {
        // console.log('ProgressContext - No user ID, skipping level progress update');
        return { success: false, message: 'No user logged in' };
      }
      
      // Mock update level progress
      console.log('ProgressContext - Mock: Updating level progress for user:', user.id);
      const result = { success: true, message: 'Level progress updated' };
      
      // Reload progress to get updated data (don't wait for it to complete)
      loadUserProgress().catch(error => {
        // console.log('ProgressContext - Progress reload failed:', error)
      });
      
      return result;
    } catch (error) {
      console.error('Error updating level progress:', error);
      return { success: false, message: error.message };
    }
  };

  const updateCategoryProgress = async (categoryData) => {
    try {
      if (!user?.id) {
        // console.log('ProgressContext - No user ID, skipping category progress update');
        return { success: false, message: 'No user logged in' };
      }
      
      // Mock update category progress
      console.log('ProgressContext - Mock: Updating category progress for user:', user.id);
      const result = { success: true, message: 'Category progress updated' };
      
      // Reload progress to get updated data (don't wait for it to complete)
      loadUserProgress().catch(error => {
        // console.log('ProgressContext - Progress reload failed:', error)
      });
      
      return result;
    } catch (error) {
      console.error('Error updating category progress:', error);
      return { success: false, message: error.message };
    }
  };

  const loadLeaderboard = async (limit = 10) => {
    try {
      // Mock load leaderboard
      console.log('ProgressContext - Mock: Loading leaderboard');
      const leaderboardData = [];
      setLeaderboard(leaderboardData);
      return leaderboardData;
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Return empty array instead of throwing error
      setLeaderboard([]);
      return [];
    }
  };

  // Helper functions
  const getLevelProgress = (levelName) => {
    if (!progress?.levels) return null;
    return progress.levels.find(l => l.level_name === levelName);
  };

  const getCategoryProgress = (categoryName) => {
    if (!progress?.categories) return null;
    return progress.categories.find(c => c.category_name === categoryName);
  };

  const getTotalXP = () => {
    return progress?.total_xp || 0;
  };

  const getCurrentLevel = () => {
    return progress?.level || 1;
  };

  const getCurrentStreak = () => {
    return progress?.streak || 0;
  };

  const getXPForNextLevel = () => {
    const currentLevel = getCurrentLevel();
    return progressService.calculateXPForNextLevel(currentLevel);
  };

  const getLevelProgressPercentage = () => {
    const totalXP = getTotalXP();
    const currentLevel = getCurrentLevel();
    return progressService.calculateLevelProgress(totalXP, currentLevel);
  };

  const getStatistics = () => {
    return progress?.statistics || {
      total_play_time: 0,
      total_games_played: 0,
      average_score: 0,
      best_streak: 0,
      perfect_scores: 0,
      total_correct_answers: 0,
      total_questions_answered: 0
    };
  };

  const getRecentGames = (limit = 5) => {
    if (!progress?.games_played) return [];
    return progress.games_played
      .sort((a, b) => new Date(b.played_at) - new Date(a.played_at))
      .slice(0, limit);
  };

  const getDailyProgress = (date = new Date()) => {
    if (!progress?.daily_progress) return null;
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return progress.daily_progress.find(d => {
      const dDate = new Date(d.date);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === targetDate.getTime();
    });
  };

  const isStreakMaintained = () => {
    const today = new Date();
    const dailyProgress = getDailyProgress(today);
    return dailyProgress?.streak_maintained || false;
  };

  const getAchievementCount = () => {
    return achievements?.length || 0;
  };

  const getPerfectScoreCount = () => {
    return getStatistics().perfect_scores || 0;
  };

  const getAverageScore = () => {
    return Math.round(getStatistics().average_score || 0);
  };

  const getTotalPlayTime = () => {
    const totalSeconds = getStatistics().total_play_time || 0;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return { hours, minutes, totalSeconds };
  };

  const value = {
    progress,
    loading,
    achievements,
    allAchievements,
    achievementStats,
    leaderboard,
    updateGameProgress,
    updateLevelProgress,
    updateCategoryProgress,
    loadLeaderboard,
    loadUserProgress,
    checkAchievements,
    getLevelProgress,
    getCategoryProgress,
    getTotalXP,
    getCurrentLevel,
    getCurrentStreak,
    getXPForNextLevel,
    getLevelProgressPercentage,
    getStatistics,
    getRecentGames,
    getDailyProgress,
    isStreakMaintained,
    getAchievementCount,
    getPerfectScoreCount,
    getAverageScore,
    getTotalPlayTime
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
