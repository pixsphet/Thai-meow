import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * App Context
 * จัดการ state หลักของแอปพลิเคชัน
 */

// Action Types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER: 'SET_USER',
  SET_PROGRESS: 'SET_PROGRESS',
  SET_ACHIEVEMENTS: 'SET_ACHIEVEMENTS',
  SET_DAILY_CHALLENGES: 'SET_DAILY_CHALLENGES',
  SET_VOCABULARY: 'SET_VOCABULARY',
  SET_LESSONS: 'SET_LESSONS',
  SET_GAMES: 'SET_GAMES',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
  UPDATE_VOCABULARY: 'UPDATE_VOCABULARY',
  UPDATE_LESSON: 'UPDATE_LESSON',
  UPDATE_GAME: 'UPDATE_GAME',
  UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
};

// Initial State
const initialState = {
  loading: true,
  error: null,
  user: null,
  progress: null,
  achievements: [],
  dailyChallenges: [],
  vocabulary: [],
  lessons: [],
  games: [],
  notifications: [],
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    
    case ActionTypes.SET_PROGRESS:
      return { ...state, progress: action.payload };
    
    case ActionTypes.SET_ACHIEVEMENTS:
      return { ...state, achievements: action.payload };
    
    case ActionTypes.SET_DAILY_CHALLENGES:
      return { ...state, dailyChallenges: action.payload };
    
    case ActionTypes.SET_VOCABULARY:
      return { ...state, vocabulary: action.payload };
    
    case ActionTypes.SET_LESSONS:
      return { ...state, lessons: action.payload };
    
    case ActionTypes.SET_GAMES:
      return { ...state, games: action.payload };
    
    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    
    case ActionTypes.UPDATE_PROGRESS:
      return { ...state, progress: { ...state.progress, ...action.payload } };
    
    case ActionTypes.ADD_ACHIEVEMENT:
      return { ...state, achievements: [...state.achievements, action.payload] };
    
    case ActionTypes.COMPLETE_CHALLENGE:
      return {
        ...state,
        dailyChallenges: state.dailyChallenges.map(challenge =>
          challenge.id === action.payload.id
            ? { ...challenge, ...action.payload }
            : challenge
        )
      };
    
    case ActionTypes.UPDATE_VOCABULARY:
      return {
        ...state,
        vocabulary: state.vocabulary.map(vocab =>
          vocab.id === action.payload.id
            ? { ...vocab, ...action.payload }
            : vocab
        )
      };
    
    case ActionTypes.UPDATE_LESSON:
      return {
        ...state,
        lessons: state.lessons.map(lesson =>
          lesson.id === action.payload.id
            ? { ...lesson, ...action.payload }
            : lesson
        )
      };
    
    case ActionTypes.UPDATE_GAME:
      return {
        ...state,
        games: state.games.map(game =>
          game.id === action.payload.id
            ? { ...game, ...action.payload }
            : game
        )
      };
    
    case ActionTypes.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload }
            : notification
        )
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      // Load user data
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(userData) });
      }
      
      // Load progress data
      const progressData = await AsyncStorage.getItem('progress_data');
      if (progressData) {
        dispatch({ type: ActionTypes.SET_PROGRESS, payload: JSON.parse(progressData) });
      }
      
      // Load achievements
      const achievementsData = await AsyncStorage.getItem('achievements_data');
      if (achievementsData) {
        dispatch({ type: ActionTypes.SET_ACHIEVEMENTS, payload: JSON.parse(achievementsData) });
      }
      
      // Load daily challenges
      const challengesData = await AsyncStorage.getItem('daily_challenges_data');
      if (challengesData) {
        dispatch({ type: ActionTypes.SET_DAILY_CHALLENGES, payload: JSON.parse(challengesData) });
      }
      
      // Load vocabulary
      const vocabularyData = await AsyncStorage.getItem('vocabulary_data');
      if (vocabularyData) {
        dispatch({ type: ActionTypes.SET_VOCABULARY, payload: JSON.parse(vocabularyData) });
      }
      
      // Load lessons
      const lessonsData = await AsyncStorage.getItem('lessons_data');
      if (lessonsData) {
        dispatch({ type: ActionTypes.SET_LESSONS, payload: JSON.parse(lessonsData) });
      }
      
      // Load games
      const gamesData = await AsyncStorage.getItem('games_data');
      if (gamesData) {
        dispatch({ type: ActionTypes.SET_GAMES, payload: JSON.parse(gamesData) });
      }
      
      // Load notifications
      const notificationsData = await AsyncStorage.getItem('notifications_data');
      if (notificationsData) {
        dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: JSON.parse(notificationsData) });
      }
      
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  // User actions
  const updateUser = async (updates) => {
    try {
      const updatedUser = { ...state.user, ...updates };
      dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  // Progress actions
  const updateProgress = async (updates) => {
    try {
      const updatedProgress = { ...state.progress, ...updates };
      dispatch({ type: ActionTypes.UPDATE_PROGRESS, payload: updatedProgress });
      await AsyncStorage.setItem('progress_data', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('❌ Error updating progress:', error);
    }
  };

  // Achievement actions
  const addAchievement = async (achievement) => {
    try {
      dispatch({ type: ActionTypes.ADD_ACHIEVEMENT, payload: achievement });
      const updatedAchievements = [...state.achievements, achievement];
      await AsyncStorage.setItem('achievements_data', JSON.stringify(updatedAchievements));
    } catch (error) {
      console.error('❌ Error adding achievement:', error);
    }
  };

  // Challenge actions
  const completeChallenge = async (challengeId, updates) => {
    try {
      dispatch({ type: ActionTypes.COMPLETE_CHALLENGE, payload: { id: challengeId, ...updates } });
    } catch (error) {
      console.error('❌ Error completing challenge:', error);
    }
  };

  // Vocabulary actions
  const updateVocabulary = async (vocabId, updates) => {
    try {
      dispatch({ type: ActionTypes.UPDATE_VOCABULARY, payload: { id: vocabId, ...updates } });
    } catch (error) {
      console.error('❌ Error updating vocabulary:', error);
    }
  };

  // Lesson actions
  const updateLesson = async (lessonId, updates) => {
    try {
      dispatch({ type: ActionTypes.UPDATE_LESSON, payload: { id: lessonId, ...updates } });
    } catch (error) {
      console.error('❌ Error updating lesson:', error);
    }
  };

  // Game actions
  const updateGame = async (gameId, updates) => {
    try {
      dispatch({ type: ActionTypes.UPDATE_GAME, payload: { id: gameId, ...updates } });
    } catch (error) {
      console.error('❌ Error updating game:', error);
    }
  };

  // Notification actions
  const updateNotification = async (notificationId, updates) => {
    try {
      dispatch({ type: ActionTypes.UPDATE_NOTIFICATION, payload: { id: notificationId, ...updates } });
    } catch (error) {
      console.error('❌ Error updating notification:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });
  };

  // Reset app
  const resetApp = async () => {
    try {
      await AsyncStorage.clear();
      dispatch({ type: ActionTypes.SET_USER, payload: null });
      dispatch({ type: ActionTypes.SET_PROGRESS, payload: null });
      dispatch({ type: ActionTypes.SET_ACHIEVEMENTS, payload: [] });
      dispatch({ type: ActionTypes.SET_DAILY_CHALLENGES, payload: [] });
      dispatch({ type: ActionTypes.SET_VOCABULARY, payload: [] });
      dispatch({ type: ActionTypes.SET_LESSONS, payload: [] });
      dispatch({ type: ActionTypes.SET_GAMES, payload: [] });
      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: [] });
    } catch (error) {
      console.error('❌ Error resetting app:', error);
    }
  };

  const value = {
    // State
    ...state,
    
    // Actions
    updateUser,
    updateProgress,
    addAchievement,
    completeChallenge,
    updateVocabulary,
    updateLesson,
    updateGame,
    updateNotification,
    clearError,
    resetApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
