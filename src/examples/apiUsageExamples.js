/**
 * 📚 API Usage Examples
 * ตัวอย่างการใช้งาน API Client สำหรับ MongoDB Atlas
 */

import apiClient from '../services/apiClient';

// ========================================
// 👤 USER MANAGEMENT EXAMPLES
// ========================================

/**
 * ตัวอย่างการสมัครสมาชิก
 */
export const registerUserExample = async () => {
  try {
    const userData = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123'
    };

    const response = await apiClient.registerUser(userData);
    console.log('✅ User registered:', response);
    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการเข้าสู่ระบบ
 */
export const loginUserExample = async () => {
  try {
    const credentials = {
      email: 'user@example.com',
      password: 'password123'
    };

    const response = await apiClient.loginUser(credentials);
    console.log('✅ User logged in:', response);
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการดึงข้อมูลโปรไฟล์ผู้ใช้
 */
export const getUserProfileExample = async (userId) => {
  try {
    const response = await apiClient.getUserProfile(userId);
    console.log('✅ User profile:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to get user profile:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการอัปเดตโปรไฟล์ผู้ใช้
 */
export const updateUserProfileExample = async (userId) => {
  try {
    const profileData = {
      profile: {
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Thai language learner',
        country: 'TH',
        language: 'th'
      }
    };

    const response = await apiClient.updateUserProfile(userId, profileData);
    console.log('✅ Profile updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการอัปเดตสถิติผู้ใช้
 */
export const updateUserStatsExample = async (userId) => {
  try {
    const stats = {
      total_xp: 150,
      level: 2,
      streak: 5,
      lessons_completed: 3,
      games_played: 5
    };

    const response = await apiClient.updateUserStats(userId, stats);
    console.log('✅ Stats updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to update stats:', error);
    throw error;
  }
};

// ========================================
// 📊 PROGRESS MANAGEMENT EXAMPLES
// ========================================

/**
 * ตัวอย่างการดึงข้อมูลความคืบหน้าผู้ใช้
 */
export const getUserProgressExample = async (userId) => {
  try {
    const response = await apiClient.getUserProgress(userId);
    console.log('✅ User progress:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to get progress:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการอัปเดตความคืบหน้าเกม
 */
export const updateGameProgressExample = async (userId) => {
  try {
    const gameData = {
      userId: userId,
      gameType: 'vocabulary',
      gameName: 'Basic Words',
      levelName: 'Beginner',
      stageName: 'Stage 1',
      score: 85,
      maxScore: 100,
      timeSpent: 120,
      correctAnswers: 17,
      totalQuestions: 20
    };

    const response = await apiClient.updateGameProgress(gameData);
    console.log('✅ Game progress updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Failed to update game progress:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการดึงข้อมูล achievement
 */
export const getAchievementsExample = async (userId) => {
  try {
    const [userAchievements, allAchievements, stats] = await Promise.all([
      apiClient.getUserAchievements(userId),
      apiClient.getAllAchievements(),
      apiClient.getAchievementStats(userId)
    ]);

    console.log('✅ User achievements:', userAchievements);
    console.log('✅ All achievements:', allAchievements);
    console.log('✅ Achievement stats:', stats);

    return {
      userAchievements,
      allAchievements,
      stats
    };
  } catch (error) {
    console.error('❌ Failed to get achievements:', error);
    throw error;
  }
};

// ========================================
// 🎮 GAME DATA EXAMPLES
// ========================================

/**
 * ตัวอย่างการดึงข้อมูลคำศัพท์
 */
export const getVocabularyExample = async () => {
  try {
    // ดึงคำศัพท์ทั้งหมด
    const allVocabulary = await apiClient.getVocabulary();
    console.log('✅ All vocabulary:', allVocabulary);

    // ดึงคำศัพท์ตามหมวดหมู่
    const greetingsVocabulary = await apiClient.getVocabularyByCategory('greetings');
    console.log('✅ Greetings vocabulary:', greetingsVocabulary);

    // ค้นหาคำศัพท์
    const searchResults = await apiClient.searchVocabulary('สวัสดี');
    console.log('✅ Search results:', searchResults);

    return {
      all: allVocabulary,
      greetings: greetingsVocabulary,
      search: searchResults
    };
  } catch (error) {
    console.error('❌ Failed to get vocabulary:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการดึงข้อมูลเกม
 */
export const getGamesExample = async () => {
  try {
    // ดึงเกมทั้งหมด
    const allGames = await apiClient.getGames();
    console.log('✅ All games:', allGames);

    // ดึงเกมตามระดับ
    const beginnerGames = await apiClient.getGamesByLevel('beginner');
    console.log('✅ Beginner games:', beginnerGames);

    // ดึงเกมตามประเภท
    const vocabularyGames = await apiClient.getGamesByType('vocabulary');
    console.log('✅ Vocabulary games:', vocabularyGames);

    return {
      all: allGames,
      beginner: beginnerGames,
      vocabulary: vocabularyGames
    };
  } catch (error) {
    console.error('❌ Failed to get games:', error);
    throw error;
  }
};

// ========================================
// 📚 LESSON EXAMPLES
// ========================================

/**
 * ตัวอย่างการดึงข้อมูลบทเรียน
 */
export const getLessonsExample = async () => {
  try {
    // ดึงบทเรียนทั้งหมด
    const allLessons = await apiClient.getLessons();
    console.log('✅ All lessons:', allLessons);

    // ดึงบทเรียนตามระดับ
    const beginnerLessons = await apiClient.getLessonsByLevel('beginner');
    console.log('✅ Beginner lessons:', beginnerLessons);

    // ดึงบทเรียนตามหมวดหมู่
    const greetingsLessons = await apiClient.getLessonsByCategory('greetings');
    console.log('✅ Greetings lessons:', greetingsLessons);

    return {
      all: allLessons,
      beginner: beginnerLessons,
      greetings: greetingsLessons
    };
  } catch (error) {
    console.error('❌ Failed to get lessons:', error);
    throw error;
  }
};

// ========================================
// 🎵 AUDIO EXAMPLES
// ========================================

/**
 * ตัวอย่างการใช้งาน Audio API
 */
export const getAudioExample = async () => {
  try {
    const text = 'สวัสดี';

    // ดึง audio ปกติ
    const audio = await apiClient.getAudio(text);
    console.log('✅ Audio:', audio);

    // ดึง simple audio
    const simpleAudio = await apiClient.getSimpleAudio(text);
    console.log('✅ Simple audio:', simpleAudio);

    // ดึง AI audio
    const aiAudio = await apiClient.getAIAudio(text, {
      voice: 'th-TH-Standard-A',
      speed: 1.0,
      pitch: 1.0
    });
    console.log('✅ AI audio:', aiAudio);

    return {
      audio,
      simpleAudio,
      aiAudio
    };
  } catch (error) {
    console.error('❌ Failed to get audio:', error);
    throw error;
  }
};

// ========================================
// 🏆 LEADERBOARD EXAMPLES
// ========================================

/**
 * ตัวอย่างการดึงข้อมูล leaderboard
 */
export const getLeaderboardExample = async () => {
  try {
    // ดึง global leaderboard
    const globalLeaderboard = await apiClient.getGlobalLeaderboard(50, 'total_xp');
    console.log('✅ Global leaderboard:', globalLeaderboard);

    // ดึง weekly leaderboard
    const weeklyLeaderboard = await apiClient.getWeeklyLeaderboard(50);
    console.log('✅ Weekly leaderboard:', weeklyLeaderboard);

    return {
      global: globalLeaderboard,
      weekly: weeklyLeaderboard
    };
  } catch (error) {
    console.error('❌ Failed to get leaderboard:', error);
    throw error;
  }
};

// ========================================
// 🎯 DAILY CHALLENGES EXAMPLES
// ========================================

/**
 * ตัวอย่างการใช้งาน Daily Challenges
 */
export const getDailyChallengesExample = async (userId) => {
  try {
    // ดึง daily challenges
    const dailyChallenges = await apiClient.getDailyChallenges();
    console.log('✅ Daily challenges:', dailyChallenges);

    // ดึง user daily challenges
    const userChallenges = await apiClient.getUserDailyChallenges(userId);
    console.log('✅ User challenges:', userChallenges);

    // Complete challenge
    if (dailyChallenges.length > 0) {
      const challengeId = dailyChallenges[0]._id;
      const completion = await apiClient.completeDailyChallenge(
        challengeId,
        userId,
        85,
        120
      );
      console.log('✅ Challenge completed:', completion);
    }

    return {
      dailyChallenges,
      userChallenges
    };
  } catch (error) {
    console.error('❌ Failed to get daily challenges:', error);
    throw error;
  }
};

// ========================================
// 🔧 UTILITY EXAMPLES
// ========================================

/**
 * ตัวอย่างการทดสอบการเชื่อมต่อ
 */
export const testConnectionExample = async () => {
  try {
    const response = await apiClient.testConnection();
    console.log('✅ API connection test:', response);
    return response;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  }
};

/**
 * ตัวอย่างการตรวจสอบ authentication
 */
export const checkAuthenticationExample = async () => {
  try {
    const isAuthenticated = await apiClient.isAuthenticated();
    console.log('✅ Is authenticated:', isAuthenticated);

    if (isAuthenticated) {
      const token = await apiClient.getToken();
      console.log('✅ Token:', token ? 'Present' : 'Not found');
    }

    return isAuthenticated;
  } catch (error) {
    console.error('❌ Authentication check failed:', error);
    throw error;
  }
};

// ========================================
// 🚀 COMPLETE WORKFLOW EXAMPLES
// ========================================

/**
 * ตัวอย่างการทำงานแบบสมบูรณ์ - เริ่มต้นจากศูนย์
 */
export const completeWorkflowExample = async () => {
  try {
    console.log('🚀 Starting complete workflow example...');

    // 1. ทดสอบการเชื่อมต่อ
    await testConnectionExample();

    // 2. ตรวจสอบ authentication
    const isAuthenticated = await checkAuthenticationExample();

    if (!isAuthenticated) {
      // 3. สมัครสมาชิก (ถ้ายังไม่มี)
      console.log('📝 Registering new user...');
      const registerResponse = await registerUserExample();
      const userId = registerResponse.user.id;

      // 4. เข้าสู่ระบบ
      console.log('🔐 Logging in...');
      await loginUserExample();
    } else {
      // ใช้ user ID ที่มีอยู่
      const userId = '68db4ffb42926b9c8645a416';
    }

    // 5. ดึงข้อมูลโปรไฟล์
    console.log('👤 Getting user profile...');
    const userProfile = await getUserProfileExample(userId);

    // 6. ดึงข้อมูลความคืบหน้า
    console.log('📊 Getting user progress...');
    const userProgress = await getUserProgressExample(userId);

    // 7. ดึงข้อมูลคำศัพท์
    console.log('📚 Getting vocabulary...');
    const vocabulary = await getVocabularyExample();

    // 8. ดึงข้อมูลเกม
    console.log('🎮 Getting games...');
    const games = await getGamesExample();

    // 9. ดึงข้อมูลบทเรียน
    console.log('📖 Getting lessons...');
    const lessons = await getLessonsExample();

    // 10. ดึงข้อมูล achievements
    console.log('🏆 Getting achievements...');
    const achievements = await getAchievementsExample(userId);

    // 11. ดึงข้อมูล leaderboard
    console.log('🥇 Getting leaderboard...');
    const leaderboard = await getLeaderboardExample();

    // 12. ดึงข้อมูล daily challenges
    console.log('🎯 Getting daily challenges...');
    const dailyChallenges = await getDailyChallengesExample(userId);

    console.log('✅ Complete workflow finished successfully!');
    
    return {
      userProfile,
      userProgress,
      vocabulary,
      games,
      lessons,
      achievements,
      leaderboard,
      dailyChallenges
    };

  } catch (error) {
    console.error('❌ Complete workflow failed:', error);
    throw error;
  }
};

// ========================================
// 📱 REACT NATIVE COMPONENT EXAMPLES
// ========================================

/**
 * ตัวอย่างการใช้งานใน React Native Component
 */
export const useApiInComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiClient.getVocabulary();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
    fetchData
  };
};

/**
 * ตัวอย่างการใช้งานใน useEffect
 */
export const useApiWithEffect = (userId) => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        setLoading(true);
        const progress = await apiClient.getUserProgress(userId);
        setUserProgress(progress);
      } catch (error) {
        console.error('Failed to load user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserProgress();
    }
  }, [userId]);

  return { userProgress, loading };
};

export default {
  // User Management
  registerUserExample,
  loginUserExample,
  getUserProfileExample,
  updateUserProfileExample,
  updateUserStatsExample,

  // Progress Management
  getUserProgressExample,
  updateGameProgressExample,
  getAchievementsExample,

  // Game Data
  getVocabularyExample,
  getGamesExample,

  // Lessons
  getLessonsExample,

  // Audio
  getAudioExample,

  // Leaderboard
  getLeaderboardExample,

  // Daily Challenges
  getDailyChallengesExample,

  // Utilities
  testConnectionExample,
  checkAuthenticationExample,

  // Complete Workflow
  completeWorkflowExample,

  // React Native Examples
  useApiInComponent,
  useApiWithEffect
};
