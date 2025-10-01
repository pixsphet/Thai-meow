import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const BeginnerDuolingoGame = ({ navigation, route }) => {
  const { lessonId = 1, level = 'Beginner' } = route.params || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  // Beginner level game data
  const generateGameData = () => {
    return [
      // Basic Greetings
      {
        type: 'multiple_choice',
        question: 'สวัสดี ภาษาอังกฤษคืออะไร?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 0,
        explanation: 'สวัสดี = Hello'
      },
      {
        type: 'multiple_choice',
        question: 'ขอบคุณ ภาษาอังกฤษคืออะไร?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 2,
        explanation: 'ขอบคุณ = Thank you'
      },
      {
        type: 'multiple_choice',
        question: 'ขอโทษ ภาษาอังกฤษคืออะไร?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
        correct: 3,
        explanation: 'ขอโทษ = Sorry'
      },
      
      // Basic Words
      {
        type: 'multiple_choice',
        question: 'ใช่ ภาษาอังกฤษคืออะไร?',
        options: ['Yes', 'No', 'Maybe', 'Sure'],
        correct: 0,
        explanation: 'ใช่ = Yes'
      },
      {
        type: 'multiple_choice',
        question: 'ไม่ ภาษาอังกฤษคืออะไร?',
        options: ['Yes', 'No', 'Maybe', 'Sure'],
        correct: 1,
        explanation: 'ไม่ = No'
      },
      
      // Fill in the Blank
      {
        type: 'fill_blank',
        question: 'เติมคำในประโยค: _____ ครับ/ค่ะ',
        options: ['สวัสดี', 'ขอบคุณ', 'ขอโทษ', 'ลาก่อน'],
        correct: 0,
        explanation: 'สวัสดีครับ/ค่ะ = Hello'
      },
      {
        type: 'fill_blank',
        question: 'เติมคำในประโยค: _____ มากครับ/ค่ะ',
        options: ['สวัสดี', 'ขอบคุณ', 'ขอโทษ', 'ลาก่อน'],
        correct: 1,
        explanation: 'ขอบคุณมากครับ/ค่ะ = Thank you very much'
      },
      
      // Translation
      {
        type: 'translation',
        question: 'แปลเป็นภาษาอังกฤษ: "สวัสดีครับ"',
        options: [
          'Hello (male)',
          'Hello (female)',
          'Goodbye',
          'Thank you'
        ],
        correct: 0,
        explanation: 'สวัสดีครับ = Hello (male speaker)'
      },
      {
        type: 'translation',
        question: 'แปลเป็นภาษาอังกฤษ: "ขอบคุณค่ะ"',
        options: [
          'Hello (female)',
          'Thank you (female)',
          'Sorry (female)',
          'Goodbye (female)'
        ],
        correct: 1,
        explanation: 'ขอบคุณค่ะ = Thank you (female speaker)'
      },
      
      // Word Order
      {
        type: 'word_order',
        question: 'เรียงประโยคให้ถูกต้อง',
        words: ['สวัสดี', 'ครับ'],
        correct: [0, 1],
        explanation: 'สวัสดีครับ = Hello (male)'
      },
      {
        type: 'word_order',
        question: 'เรียงประโยคให้ถูกต้อง',
        words: ['ขอบคุณ', 'มาก', 'ค่ะ'],
        correct: [0, 1, 2],
        explanation: 'ขอบคุณมากค่ะ = Thank you very much (female)'
      }
    ];
  };

  useEffect(() => {
    const data = generateGameData();
    setGameData(data);
    setLoading(false);
    
    // Start animations
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
  }, []);

  useEffect(() => {
    // Update progress animation
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / gameData.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion, gameData.length]);

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const question = gameData[currentQuestion];
    let correct = false;
    
    if (question.type === 'multiple_choice' || question.type === 'translation' || question.type === 'fill_blank') {
      correct = answer === question.correct;
    } else if (question.type === 'word_order') {
      correct = JSON.stringify(answer) === JSON.stringify(question.correct);
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setLives(lives - 1);
      setStreak(0);
    }
    
    // Auto advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQuestion < gameData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Game finished
      Alert.alert(
        'เกมจบแล้ว!',
        `คะแนน: ${score}\nStreak: ${streak}\nชีวิตที่เหลือ: ${lives}`,
        [
          { text: 'เล่นใหม่', onPress: resetGame },
          { text: 'กลับ', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const renderQuestion = () => {
    if (loading || !gameData[currentQuestion]) return null;
    
    const question = gameData[currentQuestion];
    
    switch (question.type) {
      case 'multiple_choice':
      case 'translation':
      case 'fill_blank':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOption,
                    showResult && index === question.correct && styles.correctOption,
                    showResult && selectedAnswer === index && !isCorrect && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswer(index)}
                  disabled={showResult}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAnswer === index && styles.selectedOptionText,
                    showResult && index === question.correct && styles.correctOptionText,
                    showResult && selectedAnswer === index && !isCorrect && styles.wrongOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'word_order':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.wordOrderContainer}>
              {question.words.map((word, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.wordButton,
                    selectedAnswer && selectedAnswer.includes(index) && styles.selectedWord,
                    showResult && question.correct.includes(index) && styles.correctWord,
                    showResult && selectedAnswer && selectedAnswer.includes(index) && !question.correct.includes(index) && styles.wrongWord,
                  ]}
                  onPress={() => {
                    if (showResult) return;
                    const newAnswer = selectedAnswer ? [...selectedAnswer, index] : [index];
                    setSelectedAnswer(newAnswer);
                    
                    if (newAnswer.length === question.words.length) {
                      handleAnswer(newAnswer);
                    }
                  }}
                  disabled={showResult}
                >
                  <Text style={[
                    styles.wordText,
                    selectedAnswer && selectedAnswer.includes(index) && styles.selectedWordText,
                    showResult && question.correct.includes(index) && styles.correctWordText,
                    showResult && selectedAnswer && selectedAnswer.includes(index) && !question.correct.includes(index) && styles.wrongWordText,
                  ]}>
                    {word}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }

  if (lives <= 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gameOverContainer}>
            <LottieView
              source={require('../../src/asset/LoadingCat.json')}
              autoPlay
              loop
              style={styles.gameOverAnimation}
            />
            <Text style={styles.gameOverText}>เกมจบ!</Text>
            <Text style={styles.finalScoreText}>คะแนนสุดท้าย: {score}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={resetGame}>
              <Text style={styles.retryButtonText}>เล่นใหม่</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>กลับ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#2196F3', '#64B5F6', '#90CAF9']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← กลับ</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Duolingo Style</Text>
            <Text style={styles.headerSubtitle}>Beginner Level</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>❤️ {lives}</Text>
            <Text style={styles.statsText}>🔥 {streak}</Text>
            <Text style={styles.statsText}>⭐ {score}</Text>
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
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} / {gameData.length}
          </Text>
        </View>

        {/* Question */}
        <Animated.View
          style={[
            styles.questionWrapper,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {renderQuestion()}
        </Animated.View>

        {/* Result Feedback */}
        {showResult && (
          <Animated.View style={styles.resultContainer}>
            <View style={styles.resultContent}>
              {isCorrect ? (
                <LottieView
                  source={require('../asset/Success.json')}
                  autoPlay
                  loop={false}
                  style={styles.resultAnimation}
                />
              ) : (
                <LottieView
                  source={require('../../src/asset/LoadingCat.json')}
                  autoPlay
                  loop={false}
                  style={styles.resultAnimation}
                />
              )}
              <Text style={[
                styles.resultText,
                isCorrect ? styles.correctText : styles.wrongText
              ]}>
                {isCorrect ? 'ถูกต้อง!' : 'ผิด!'}
              </Text>
              <Text style={styles.explanationText}>
                {gameData[currentQuestion]?.explanation}
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
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverAnimation: {
    width: 200,
    height: 200,
  },
  gameOverText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
  },
  finalScoreText: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  statsText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
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
  questionWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  questionText: {
    fontSize: 20,
    color: '#1976D2',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedOption: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  wrongOptionText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  wordOrderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  wordButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedWord: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  correctWord: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  wrongWord: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  wordText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  selectedWordText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  correctWordText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  wrongWordText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  resultContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultAnimation: {
    width: 100,
    height: 100,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  correctText: {
    color: '#4CAF50',
  },
  wrongText: {
    color: '#F44336',
  },
  explanationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
});

export default BeginnerDuolingoGame;
