import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const GameCompleteScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { getTotalXP, getCurrentLevel, getCurrentStreak } = useProgress();
  
  const {
    score = 0,
    maxScore = 100,
    correctAnswers = 0,
    totalQuestions = 0,
    timeSpent = 0,
    gameType = 'Thai Consonants Game',
    levelName = 'Basic Consonants',
    stageName = 'Game'
  } = route.params || {};

  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [levelUp, setLevelUp] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Calculate XP earned
    const baseXP = Math.round((score / maxScore) * 50);
    const perfectBonus = score === maxScore ? 50 : 0;
    const timeBonus = Math.max(0, 20 - Math.floor(timeSpent / 60));
    const totalXP = baseXP + perfectBonus + timeBonus;
    
    setXpEarned(totalXP);

    // Check for level up
    const currentLevel = getCurrentLevel();
    const currentXP = getTotalXP();
    const newLevel = Math.floor((currentXP + totalXP) / 1000) + 1;
    setLevelUp(newLevel > currentLevel);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: (score / maxScore) * 100,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, 500);

    // Show celebration for perfect score
    if (score === maxScore) {
      setTimeout(() => setShowCelebration(true), 1000);
    }
  }, []);

  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 70) return '#FF9800';
    return '#F44336';
  };

  const getScoreMessage = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage === 100) return 'เยี่ยมมาก! คะแนนเต็ม!';
    if (percentage >= 90) return 'ยอดเยี่ยม!';
    if (percentage >= 70) return 'ดีมาก!';
    if (percentage >= 50) return 'ไม่เลว!';
    return 'ลองใหม่นะ!';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Animated.View
      style={[
        styles.statCard,
        { backgroundColor: theme.card },
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Celebration Animation */}
      {showCelebration && (
        <View style={styles.celebrationContainer}>
          <LottieView
            source={require('../../src/asset/animations/celebration.json')}
            autoPlay
            loop={false}
            style={styles.celebrationAnimation}
          />
        </View>
      )}

      <Animated.ScrollView
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: getScoreColor() + '20' }]}>
            <Ionicons
              name={score === maxScore ? 'trophy' : 'star'}
              size={48}
              color={getScoreColor()}
            />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {score === maxScore ? 'เกมเสร็จสิ้น!' : 'เกมจบแล้ว!'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {getScoreMessage()}
          </Text>
        </Animated.View>

        {/* Score Display */}
        <Animated.View
          style={[
            styles.scoreContainer,
            { backgroundColor: theme.card },
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={[styles.scoreLabel, { color: theme.text }]}>คะแนน</Text>
          <Text style={[styles.scoreValue, { color: getScoreColor() }]}>
            {score}/{maxScore}
          </Text>
          
          {/* Progress Bar */}
          <View style={[styles.progressBar, { backgroundColor: theme.textSecondary + '20' }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: getScoreColor(),
                },
              ]}
            />
          </View>
          
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round((score / maxScore) * 100)}%
          </Text>
        </Animated.View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="checkmark-circle"
            title="ตอบถูก"
            value={`${correctAnswers}/${totalQuestions}`}
            color="#4CAF50"
            subtitle={`${Math.round((correctAnswers / totalQuestions) * 100)}%`}
          />
          <StatCard
            icon="time"
            title="เวลาที่ใช้"
            value={formatTime(timeSpent)}
            color="#2196F3"
          />
          <StatCard
            icon="star"
            title="XP ที่ได้"
            value={`+${xpEarned}`}
            color="#FFD93D"
          />
          <StatCard
            icon="fire"
            title="Streak ปัจจุบัน"
            value={getCurrentStreak()}
            color="#FF6B6B"
          />
        </View>

        {/* Level Up Notification */}
        {levelUp && (
          <Animated.View
            style={[
              styles.levelUpContainer,
              { backgroundColor: theme.primary + '20' },
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <Ionicons name="trophy" size={32} color={theme.primary} />
            <Text style={[styles.levelUpText, { color: theme.primary }]}>
              Level Up! 🎉
            </Text>
            <Text style={[styles.levelUpSubtext, { color: theme.text }]}>
              คุณได้เลื่อนระดับแล้ว!
            </Text>
          </Animated.View>
        )}

        {/* Game Info */}
        <View style={[styles.gameInfo, { backgroundColor: theme.card }]}>
          <Text style={[styles.gameInfoTitle, { color: theme.text }]}>ข้อมูลเกม</Text>
          <View style={styles.gameInfoRow}>
            <Text style={[styles.gameInfoLabel, { color: theme.textSecondary }]}>เกม:</Text>
            <Text style={[styles.gameInfoValue, { color: theme.text }]}>{gameType}</Text>
          </View>
          <View style={styles.gameInfoRow}>
            <Text style={[styles.gameInfoLabel, { color: theme.textSecondary }]}>ระดับ:</Text>
            <Text style={[styles.gameInfoValue, { color: theme.text }]}>{levelName}</Text>
          </View>
          <View style={styles.gameInfoRow}>
            <Text style={[styles.gameInfoLabel, { color: theme.textSecondary }]}>ด่าน:</Text>
            <Text style={[styles.gameInfoValue, { color: theme.text }]}>{stageName}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={[theme.primary, theme.primary + 'CC']}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.buttonText}>เล่นใหม่</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.buttonGradient}
            >
              <Ionicons name="home" size={20} color="white" />
              <Text style={styles.buttonText}>หน้าหลัก</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  celebrationAnimation: {
    width: screenWidth,
    height: screenHeight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 30,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    width: (screenWidth - 52) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  levelUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  levelUpText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  levelUpSubtext: {
    fontSize: 14,
    marginLeft: 8,
  },
  gameInfo: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  gameInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gameInfoLabel: {
    fontSize: 14,
  },
  gameInfoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  playAgainButton: {
    // Additional styles if needed
  },
  homeButton: {
    // Additional styles if needed
  },
});

export default GameCompleteScreen;
