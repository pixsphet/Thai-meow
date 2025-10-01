import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

const WordMatchingGame = ({ navigation, route }) => {
  const { lessonId = 11, level = 'Intermediate' } = route.params || {};
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // TTS function
  const speakText = async (text, language = 'th-TH') => {
    try {
      console.log('🔊 Speaking text:', text, 'Language:', language);
      
      // Stop any current speech
      await Speech.stop();
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Speak with basic settings
      await Speech.speak(text, {
        language: language,
        pitch: 1.0,
        rate: 0.6,
        onStart: () => console.log('✅ Speech started:', text),
        onDone: () => console.log('✅ Speech completed:', text),
        onError: (error) => console.error('❌ Speech error:', text, error),
      });
      
    } catch (error) {
      console.error('❌ TTS Error:', error);
      
      // Try with minimal settings
      try {
        await Speech.speak(text);
      } catch (fallbackError) {
        console.error('❌ Fallback TTS Error:', fallbackError);
      }
    }
  };

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/vocabulary/game/word-matching/${lessonId}?count=5`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Fetched game data:', data);

      if (data.questions && data.questions.length > 0) {
        // แปลงข้อมูลเป็นรูปแบบ Word Matching Game
        const wordMatchingQuestions = data.questions.map((question, index) => {
          const correctAnswer = question.correct_answer;
          const wrongAnswers = question.wrong_answers || [];
          
          // สร้างตัวเลือกโดยรวมคำตอบที่ถูกและผิด
          const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
          
          return {
            id: index + 1,
            thaiWord: question.thai_word,
            romanization: question.romanization,
            meaning: question.meaning,
            example: question.example,
            correctAnswer: correctAnswer,
            options: allOptions,
            audioText: question.thaiWord
          };
        });

        setQuestions(wordMatchingQuestions);
      } else {
        // ใช้ mock data เมื่อ API ไม่ทำงาน
        const mockQuestions = [
          {
            id: 1,
            thaiWord: 'คำถาม',
            romanization: 'kham tham',
            meaning: 'question',
            example: 'คุณมีคำถามอะไรไหม?',
            correctAnswer: 'question',
            options: ['question', 'answer', 'problem', 'solution'],
            audioText: 'คำถาม'
          },
          {
            id: 2,
            thaiWord: 'การซื้อของ',
            romanization: 'kan sue khong',
            meaning: 'shopping',
            example: 'ฉันชอบการซื้อของ',
            correctAnswer: 'shopping',
            options: ['shopping', 'cooking', 'reading', 'writing'],
            audioText: 'การซื้อของ'
          },
          {
            id: 3,
            thaiWord: 'การเดินทาง',
            romanization: 'kan dern thang',
            meaning: 'travel',
            example: 'การเดินทางสนุกมาก',
            correctAnswer: 'travel',
            options: ['travel', 'work', 'study', 'sleep'],
            audioText: 'การเดินทาง'
          },
          {
            id: 4,
            thaiWord: 'อากาศ',
            romanization: 'a-kat',
            meaning: 'weather',
            example: 'วันนี้อากาศดี',
            correctAnswer: 'weather',
            options: ['weather', 'food', 'clothes', 'house'],
            audioText: 'อากาศ'
          },
          {
            id: 5,
            thaiWord: 'งานอดิเรก',
            romanization: 'ngaan a-di-rek',
            meaning: 'hobby',
            example: 'งานอดิเรกของฉันคือวาดรูป',
            correctAnswer: 'hobby',
            options: ['hobby', 'job', 'school', 'home'],
            audioText: 'งานอดิเรก'
          }
        ];
        
        setQuestions(mockQuestions);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, [lessonId]);

  // Animation effects
  useEffect(() => {
    if (questions.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [questions]);

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // ป้องกันการเลือกซ้ำ
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
      
      // Bounce animation for correct answer
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setStreak(0);
    }

    // Auto proceed after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setShowFeedback(false);
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <LottieView
              source={require('../../src/asset/LoadingCat.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
            <Text style={styles.loadingText}>กำลังโหลดเกม...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (gameCompleted) {
    return (
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.completionContainer}>
            <LottieView
              source={require('../asset/Success.json')}
              autoPlay
              loop
              style={styles.successAnimation}
            />
            <Text style={styles.completionTitle}>ยินดีด้วย!</Text>
            <Text style={styles.completionSubtitle}>คุณทำได้ดีมาก!</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>คะแนน: {score}</Text>
              <Text style={styles.streakText}>Streak สูงสุด: {streak}</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
                <Text style={styles.buttonText}>เล่นอีกครั้ง</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Text style={styles.buttonText}>กลับ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <LinearGradient
      colors={['#4CAF50', '#66BB6A', '#81C784']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Word Matching</Text>
            <Text style={styles.headerSubtitle}>จับคู่คำศัพท์</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.streakText}>Streak: {streak}</Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
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
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.questionCard}>
            <TouchableOpacity 
              style={styles.audioButton}
              onPress={() => speakText(currentQuestion.audioText, 'th-TH')}
            >
              <Text style={styles.audioButtonText}>🔊 ฟังเสียง</Text>
            </TouchableOpacity>
            <Text style={styles.thaiWord}>{currentQuestion.thaiWord}</Text>
            <Text style={styles.romanization}>({currentQuestion.romanization})</Text>
            <Text style={styles.example}>{currentQuestion.example}</Text>
          </View>
        </Animated.View>

        {/* Answer Options */}
        <Animated.View 
          style={[
            styles.optionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.correctAnswer;
            const showCorrect = showFeedback && isCorrectAnswer;
            const showWrong = showFeedback && isSelected && !isCorrectAnswer;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                  showCorrect && styles.correctOption,
                  showWrong && styles.wrongOption,
                ]}
                onPress={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  showCorrect && styles.correctOptionText,
                  showWrong && styles.wrongOptionText,
                ]}>
                  {option}
                </Text>
                {showCorrect && (
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                )}
                {showWrong && (
                  <Ionicons name="close-circle" size={24} color="white" />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Feedback Modal */}
        {showFeedback && (
          <Animated.View 
            style={[
              styles.feedbackModal,
              {
                opacity: fadeAnim,
                transform: [{ scale: bounceAnim }]
              }
            ]}
          >
            <View style={styles.feedbackContent}>
              <Ionicons 
                name={isCorrect ? "checkmark-circle" : "close-circle"} 
                size={60} 
                color={isCorrect ? "#4CAF50" : "#F44336"} 
              />
              <Text style={styles.feedbackText}>
                {isCorrect ? "ถูกต้อง!" : "ผิด!"}
              </Text>
              <Text style={styles.feedbackSubtext}>
                {isCorrect ? "เยี่ยมมาก!" : `คำตอบที่ถูกคือ: ${currentQuestion.correctAnswer}`}
              </Text>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
    color: 'white',
    fontWeight: '500',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  streakText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    marginTop: 8,
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  audioButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thaiWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  romanization: {
    fontSize: 18,
    color: '#4CAF50',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  example: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  selectedOptionText: {
    color: 'white',
  },
  correctOptionText: {
    color: 'white',
  },
  wrongOptionText: {
    color: 'white',
  },
  feedbackModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
  },
  feedbackSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  completionSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 15,
  },
  playAgainButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default WordMatchingGame;
