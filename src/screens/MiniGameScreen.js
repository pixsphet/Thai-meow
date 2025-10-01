import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { DESIGN_SYSTEM, COMMON_STYLES } from '../config/designSystem';
import { speakThai, speakSlow, speakNormal, speakFast, stopSpeaking } from '../services/speechService';

const { width, height } = Dimensions.get('window');

// Design tokens
const EDGE = 16;
const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};
const FONT_SIZE = {
  body: 14,
  bodyLarge: 16,
  title: 20,
  titleLarge: 24,
};
const COLORS = {
  primary: '#FF8000',
  secondary: '#FFD180',
  background: '#FFF7E0',
  surface: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  success: '#4CAF50',
  error: '#F44336',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export default function MiniGameScreen({ navigation, route }) {
  const { lessonId, level = 'Beginner' } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState('normal'); // slow, normal, fast
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);

  const currentQuestion = questions[currentQuestionIndex];

  // AI Speech Functions for Vocabulary Game
  const speakWord = async (word, romanization) => {
    try {
      setIsSpeaking(true);
      await stopSpeaking(); // Stop any current speech
      
      // Speak the word first
      if (speechSpeed === 'slow') {
        await speakSlow(word);
      } else if (speechSpeed === 'fast') {
        await speakFast(word);
      } else {
        await speakNormal(word);
      }
      
      // Wait a bit then speak romanization
      await new Promise(resolve => setTimeout(resolve, 800));
      await speakThai(`(${romanization})`, { rate: 0.6 });
      
    } catch (error) {
      console.error('Error speaking word:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakCorrectAnswer = async (answer) => {
    try {
      setIsSpeaking(true);
      await speakThai(`คำตอบที่ถูกต้องคือ ${answer}`, { rate: 0.7 });
    } catch (error) {
      console.error('Error speaking correct answer:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakResult = async (isCorrect) => {
    try {
      setIsSpeaking(true);
      if (isCorrect) {
        await speakThai('ถูกต้อง! ยอดเยี่ยม!', { rate: 0.8 });
      } else {
        await speakThai('ผิด! ลองใหม่', { rate: 0.8 });
      }
    } catch (error) {
      console.error('Error speaking result:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakQuestion = async () => {
    if (currentQuestion) {
      await speakWord(currentQuestion.word, currentQuestion.romanization);
    }
  };

  const changeSpeechSpeed = () => {
    const speeds = ['slow', 'normal', 'fast'];
    const currentIndex = speeds.indexOf(speechSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeechSpeed(speeds[nextIndex]);
  };

  // ดึงคำถามจาก API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      console.log('Fetching questions for lessonId:', lessonId);
      const response = await fetch(`http://localhost:3000/game/quiz/${lessonId}?count=5`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched questions:', data);
      setQuestions(data);
      
      // เริ่ม animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
      
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('เกิดข้อผิดพลาด', `ไม่สามารถโหลดคำถามได้: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // บันทึกความคืบหน้าผู้ใช้
  const saveUserProgress = async (lessonId, score, totalQuestions) => {
    try {
      const response = await fetch('http://localhost:3000/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          score,
          totalQuestions,
          completedAt: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        console.log('Progress saved successfully');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchQuestions();
    }
  }, [lessonId]);

  // เริ่ม animation เมื่อ component mount
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: ((currentQuestionIndex + 1) / questions.length) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(option);
    setShowResult(true);
    
    if (option.correct) {
      setScore(score + 1);
    }

    // Animation สำหรับการเลือกคำตอบ
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // ไปคำถามถัดไปหลังจาก 1.5 วินาที
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // เกมจบ
        setGameCompleted(true);
        saveUserProgress(lessonId, score + (option.correct ? 1 : 0), questions.length);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
    fetchQuestions();
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FFF7E0', '#FFD180', '#FFA726']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('../asset/animations/check.json')}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
          <Text style={styles.loadingText}>กำลังโหลดคำถาม...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!currentQuestion && !loading) {
    return (
      <LinearGradient
        colors={['#FFF7E0', '#FFD180', '#FFA726']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ไม่พบคำถาม</Text>
          <Text style={styles.errorSubText}>lessonId: {lessonId}</Text>
          <Text style={styles.errorSubText}>questions length: {questions.length}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQuestions}>
            <Text style={styles.buttonText}>ลองใหม่</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (gameCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isHighScore = percentage >= 80;
    
    return (
      <LinearGradient
        colors={[COLORS.background, COLORS.secondary, COLORS.primary]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable 
              style={styles.topBarButton}
              onPress={goBack}
              accessibilityLabel="กลับ"
            >
              <Text style={styles.topBarButtonText}>←</Text>
            </Pressable>
            <Text style={styles.topBarTitle}>ผลการเล่น</Text>
            <Pressable 
              style={styles.topBarButton}
              onPress={() => {/* Favorite action */}}
              accessibilityLabel="เพิ่มในรายการโปรด"
            >
              <Text style={styles.topBarButtonText}>♡</Text>
            </Pressable>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header Card */}
            <View style={styles.headerCard}>
              <LinearGradient
                colors={[COLORS.surface, '#F8F9FA']}
                style={styles.headerCardGradient}
              >
                <View style={styles.headerCardContent}>
                  <View style={styles.headerCardLeft}>
                    <Text style={styles.headerCardTitle}>เกมคำศัพท์</Text>
                    <Text style={styles.headerCardSubtitle}>
                      บทเรียนที่ {lessonId} - ระดับ {level}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>⭐⭐⭐⭐⭐</Text>
                      <Text style={styles.ratingCount}>({questions.length} คำถาม)</Text>
                    </View>
                  </View>
                  <View style={styles.headerCardRight}>
                    <Text style={styles.feeText}>ฟรี</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Main Image */}
            <View style={styles.imageContainer}>
              <LottieView
                source={require('../asset/Success.json')}
                autoPlay
                loop={false}
                style={styles.mainImage}
                resizeMode="contain"
              />
            </View>

            {/* Results Section */}
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>ผลการเล่น</Text>
              <Text style={styles.resultsScore}>
                คุณได้ {score} จาก {questions.length} คะแนน
              </Text>
              <Text style={styles.resultsPercentage}>
                {percentage}%
              </Text>
              <Text style={styles.resultsMessage}>
                {isHighScore ? 'ยอดเยี่ยม! 🎉' : 'ดีมาก! 👍'}
              </Text>
            </View>

            {/* Stats List */}
            <View style={styles.statsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>สถิติการเล่น</Text>
                <Pressable style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>ดูทั้งหมด</Text>
                </Pressable>
              </View>
              
              <FlatList
                data={[
                  { label: 'คำตอบที่ถูก', value: score, icon: '✅' },
                  { label: 'คำตอบที่ผิด', value: questions.length - score, icon: '❌' },
                  { label: 'เปอร์เซ็นต์', value: `${percentage}%`, icon: '📊' },
                  { label: 'เวลาที่ใช้', value: '2:30 นาที', icon: '⏱️' },
                ]}
                renderItem={({ item }) => (
                  <View style={styles.statItem}>
                    <Text style={styles.statIcon}>{item.icon}</Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                    <Text style={styles.statValue}>{item.value}</Text>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.statSeparator} />}
                scrollEnabled={false}
              />
            </View>

            {/* CTA Button */}
            <Pressable style={styles.ctaButton} onPress={resetGame}>
              <LinearGradient
                colors={[COLORS.primary, '#FF9500']}
                style={styles.ctaGradient}
              >
                <View style={styles.ctaContent}>
                  <Text style={styles.ctaIcon}>🔓</Text>
                  <Text style={styles.ctaLabel}>เล่นอีกครั้ง</Text>
                  <Text style={styles.ctaArrow}>→</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF7E0', '#FFD180', '#FFA726']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>← กลับ</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เกมคำศัพท์</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>คะแนน: {score}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      {/* Question */}
      <Animated.View
        style={[
          styles.questionContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.questionNumber}>
          คำถามที่ {currentQuestionIndex + 1}
        </Text>
        <Text style={styles.questionWord}>
          {currentQuestion?.word}
        </Text>
        <Text style={styles.questionRomanization}>
          {currentQuestion?.romanization}
        </Text>
        <Text style={styles.questionPrompt}>
          เลือกความหมายที่ถูกต้อง
        </Text>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
              styles.optionButton,
              selectedAnswer === option && option.correct && styles.correctOption,
              selectedAnswer === option && !option.correct && styles.incorrectOption,
              selectedAnswer !== null && option.correct && styles.correctOption,
            ]}
            onPress={() => handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === option && styles.selectedOptionText,
              ]}
            >
              {option.text}
              </Text>
            </TouchableOpacity>
        ))}
      </View>

      {/* Result Feedback */}
      {showResult && (
        <Animated.View
          style={[
            styles.resultContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.resultText}>
            {selectedAnswer?.correct ? 'ถูกต้อง!' : 'ผิด!'}
          </Text>
          {!selectedAnswer?.correct && (
            <Text style={styles.correctAnswerText}>
              คำตอบที่ถูกต้อง: {currentQuestion?.correctAnswer}
            </Text>
          )}
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: EDGE,
    paddingVertical: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  topBarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topBarButtonText: {
    fontSize: FONT_SIZE.title,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  topBarTitle: {
    fontSize: FONT_SIZE.titleLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  // Header Card
  headerCard: {
    margin: EDGE,
    borderRadius: 25,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerCardGradient: {
    borderRadius: 25,
    padding: SPACING.lg,
  },
  headerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCardLeft: {
    flex: 1,
  },
  headerCardTitle: {
    fontSize: FONT_SIZE.titleLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerCardSubtitle: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FONT_SIZE.body,
    marginRight: SPACING.xs,
  },
  ratingCount: {
    fontSize: FONT_SIZE.body,
    color: COLORS.textSecondary,
  },
  headerCardRight: {
    alignItems: 'flex-end',
  },
  feeText: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  // Main Image
  imageContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  mainImage: {
    width: Math.min(360, width - 2 * EDGE),
    height: 200,
  },
  // Results Section
  resultsSection: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
    paddingHorizontal: EDGE,
  },
  resultsTitle: {
    fontSize: FONT_SIZE.titleLarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  resultsScore: {
    fontSize: FONT_SIZE.bodyLarge,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  resultsPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: SPACING.md,
  },
  resultsMessage: {
    fontSize: FONT_SIZE.title,
    color: COLORS.text,
    fontWeight: '600',
  },
  // Stats Section
  statsSection: {
    margin: EDGE,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  seeAllText: {
    fontSize: FONT_SIZE.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  statIcon: {
    fontSize: FONT_SIZE.title,
    marginRight: SPACING.md,
  },
  statLabel: {
    fontSize: FONT_SIZE.bodyLarge,
    color: COLORS.text,
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZE.bodyLarge,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statSeparator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: SPACING.lg + 24 + SPACING.md, // icon width + margin + padding
  },
  // CTA Button
  ctaButton: {
    margin: EDGE,
    borderRadius: 25,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaGradient: {
    borderRadius: 25,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIcon: {
    fontSize: FONT_SIZE.title,
    marginRight: SPACING.sm,
  },
  ctaLabel: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: COLORS.surface,
    flex: 1,
    textAlign: 'center',
  },
  ctaArrow: {
    fontSize: FONT_SIZE.title,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 200,
    height: 200,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreContainer: {
    padding: 10,
  },
  scoreText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  questionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  questionWord: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  questionRomanization: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  questionPrompt: {
    fontSize: 18,
    color: '#333',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Legacy styles (kept for compatibility)
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successAnimation: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  completionScore: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  completionPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 40,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
