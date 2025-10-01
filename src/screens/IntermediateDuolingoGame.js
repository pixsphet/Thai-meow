import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// --------------------------
// Header Component
// --------------------------
const HeaderComponent = ({ total, current, onClose, lives }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <FontAwesome6 name="xmark" size={26} color="#777" />
    </TouchableOpacity>
    <View style={styles.progressContainer}>
      <View 
        style={[
          styles.progressFill, 
          { width: `${(current / total) * 100}%`,
          backgroundColor: "#FE8305" 
        }]}
      />
    </View>
    <View style={styles.heartContainer}>
      <FontAwesome name="heart" size={18} color="#ff4757" />
      <Text style={styles.heartText}>{lives}</Text>
    </View>
  </View>
);

// --------------------------
// Cat Character
// --------------------------
const CatCharacter = () => (
  <View style={styles.catContainer}>
    <Image 
      source={require("../../src/asset/Catsmile1.png")} 
      style={[styles.catImage, { width: 118, height: 118 }]} 
      resizeMode="contain"
    />
  </View>
);

// --------------------------
// AudioButton
// --------------------------
const AudioButton = ({ onPress, size = 50 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  const handlePress = () => {
    setIsPlaying(true);
    animationRef.current?.play();

    onPress && onPress(); 

    setTimeout(() => {
      setIsPlaying(false);
      animationRef.current?.reset();
    }, 3000); 
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.audioButtonContainer}>
      <View style={styles.audioButtonInner}>
        {isPlaying ? (
          <LottieView
            source={require('../../src/asset/LoadingCat.json')}
            style={{ width: 45, height: 45 }}
            autoPlay
            loop={false}
          />
        ) : (
          <Image 
            source={require("../../src/asset/speaker.png")} 
            style={{ width: 60, height: 60 }} 
            resizeMode="contain" 
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

// --------------------------
// FeedbackBar
// --------------------------
const FeedbackBar = ({ isCorrect, onContinue }) => (
  <View style={[
    styles.feedbackContainer,
    { backgroundColor: isCorrect ? '#C4FAB3' : '#FFB4B4' }
  ]}>
    <View style={[
      styles.fullWidthButtonShadow,
      { backgroundColor: isCorrect ? '#34BD0A' : '#CC0000' }
    ]} />

    <View style={styles.feedbackContent}>
      <View style={styles.feedbackLeft}>
        <FontAwesome 
          name={isCorrect ? "check-circle" : "times-circle"} 
          size={24} 
          color={isCorrect ? '#38CB0A' : '#FF0000'} 
        />
        <Text style={[
          styles.feedbackText,
          { color: isCorrect ? '#38CB0A' : '#FF0000' } 
        ]}>
          {isCorrect ? 'Nice!' : 'Wrong'}
        </Text>
      </View> 
    </View> 
    <TouchableOpacity style={[
      styles.continueButton, 
      { backgroundColor: isCorrect ? '#3FE90B' : '#FF0000' } 
    ]} 
      onPress={onContinue}
    >
      <Text style={styles.continueButtonText}>CONTINUE</Text>
    </TouchableOpacity>
  </View>
);

// --------------------------
// Check Button
// --------------------------
const CheckButton = ({ onPress, disabled }) => (
  <View style={styles.bottomContainer}>
    <View style={styles.buttonShadow} />
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ["#e5e5e5", "#e5e5e5"] : ["#FFA500", "#FE8305"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.checkButton, disabled && styles.checkButtonDisabled]}
      >
        <Text style={[styles.checkButtonText, { color: disabled ? '#afafaf' : 'white' }]}>
          CHECK
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const IntermediateDuolingoGame = ({ navigation, route }) => {
  const { lessonId = 11, level = 'Intermediate' } = route.params || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  // Mock data for intermediate level
  const mockGameData = [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'สวัสดี ภาษาอังกฤษคืออะไร?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
      correct: 0,
      explanation: 'สวัสดี แปลว่า Hello ในภาษาอังกฤษ'
    },
    {
      id: 2,
      type: 'translation',
      question: 'Good morning',
      options: ['สวัสดีตอนเช้า', 'สวัสดีตอนเย็น', 'สวัสดีตอนบ่าย', 'สวัสดี'],
      correct: 0,
      explanation: 'Good morning แปลว่า สวัสดีตอนเช้า'
    },
    {
      id: 3,
      type: 'fill_blank',
      question: 'ฉันชื่อ ___',
      options: ['จอห์น', 'แมรี่', 'เดวิด', 'ลิซ่า'],
      correct: 0,
      explanation: 'ประโยคนี้ใช้ชื่อผู้ชาย'
    },
    {
      id: 4,
      type: 'listening',
      question: 'ฟังเสียงและเลือกคำตอบที่ถูกต้อง',
      audioText: 'ขอบคุณ',
      options: ['ขอบคุณ', 'ขอโทษ', 'สวัสดี', 'ลาก่อน'],
      correct: 0,
      explanation: 'เสียงที่ได้ยินคือ ขอบคุณ'
    },
    {
      id: 5,
      type: 'multiple_choice',
      question: 'ฉันหิว ภาษาอังกฤษคืออะไร?',
      options: ['I am hungry', 'I am thirsty', 'I am tired', 'I am happy'],
      correct: 0,
      explanation: 'ฉันหิว แปลว่า I am hungry'
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setGameData(mockGameData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Animate question appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentQuestion, gameData.length]);

  const speakText = (text, language = 'th-TH') => {
    Speech.speak(text, { language });
  };

  const handleAnswer = (answer) => {
    if (isCorrect !== null) return;
    
    setSelectedAnswer(answer);
    const question = gameData[currentQuestion];
    let correct = false;
    
    if (question.type === 'multiple_choice' || question.type === 'translation' || question.type === 'fill_blank' || question.type === 'listening') {
      correct = answer === question.correct;
    } else if (question.type === 'word_order') {
      correct = JSON.stringify(answer) === JSON.stringify(question.correct);
    }
    
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 15); // Higher points for intermediate
      setStreak(streak + 1);
    } else {
      setLives(lives - 1);
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < gameData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
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
    setIsCorrect(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
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
    );
  }

  if (lives <= 0) {
    return (
      <LinearGradient
        colors={['#F44336', '#E57373', '#FFCDD2']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gameOverContainer}>
            <View style={styles.gameOverCard}>
              <LottieView
                source={require('../../src/asset/LoadingCat.json')}
                autoPlay
                loop
                style={styles.gameOverAnimation}
              />
              <Text style={styles.gameOverText}>เกมจบ!</Text>
              <Text style={styles.finalScoreText}>คะแนนสุดท้าย: {score}</Text>
              <Text style={styles.encouragementText}>ไม่เป็นไร! ลองใหม่ได้เสมอ</Text>
              <TouchableOpacity style={styles.retryButton} onPress={resetGame}>
                <Text style={styles.retryButtonText}>เล่นใหม่</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>กลับ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent 
        total={gameData.length} 
        current={currentQuestion + 1} 
        onClose={() => navigation.goBack()}
        lives={lives}
      />

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.instructionTitle}>Duolingo Style - Intermediate</Text>
        </View>

        <View style={styles.questionSection}>
          <CatCharacter />
          <View style={styles.speechBubbleContainer}>
            <View style={styles.speechBubble}>
              <AudioButton onPress={() => speakText(gameData[currentQuestion]?.question || '')} />
              <Text style={styles.speechText}>{gameData[currentQuestion]?.question || ''}</Text>
            </View>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {gameData[currentQuestion]?.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption,
                isCorrect !== null && index === gameData[currentQuestion]?.correct && styles.correctOption,
                isCorrect !== null && selectedAnswer === index && !isCorrect && styles.wrongOption,
              ]}
              onPress={() => handleAnswer(index)}
              disabled={isCorrect !== null}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
                isCorrect !== null && index === gameData[currentQuestion]?.correct && styles.correctOptionText,
                isCorrect !== null && selectedAnswer === index && !isCorrect && styles.wrongOptionText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isCorrect !== null ? (
        <FeedbackBar 
          isCorrect={isCorrect} 
          onContinue={nextQuestion}
        />
      ) : (
        <CheckButton 
          onPress={handleAnswer} 
          disabled={selectedAnswer === null} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
  // Header styles
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  closeButton: { 
    padding: 8,
    marginRight: 8,
  },
  progressContainer: { 
    flex: 1, 
    height: 12, 
    backgroundColor: '#e5e5e5', 
    borderRadius: 6, 
    marginHorizontal: 12, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: 12, 
    backgroundColor: '#58cc02', 
    borderRadius: 6,
  },
  heartContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 8,
  },
  heartText: { 
    marginLeft: 4, 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#ff4757' 
  },

  // Content styles
  scrollView: {
    flex: 1,
  },
  scrollViewContent: { 
    paddingTop: 118, 
    paddingBottom: 100, 
    paddingHorizontal: 18,
    minHeight: '100%',
  },

  titleSection: {
    marginTop: 20, 	
    marginBottom: 20, 	 	
    alignItems: "center",
    justifyContent: "center"
  },

  instructionTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    textAlign: 'center',
    lineHeight: 32,
  },

  // Character styles
  catContainer: { 
    marginRight: 15,
    alignItems: 'center',
  },
  catImage: { 
    width: 80, 
    height: 80 
  },

  // Audio button styles
  audioButtonContainer: {
    alignItems: 'center',
    padding: 2,
    marginRight: 4
  },
  audioButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  questionSection: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 40,
    paddingHorizontal: 18,
  },

  speechBubbleContainer: {
    flex: 1,
  },

  speechBubble: {
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#edebebb8',
    padding: 16,
    top: 25,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  speechText: { 
    fontSize: 18, 
    color: '#2c3e50', 
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    lineHeight: 24,
  },

  // Options container
  optionsContainer: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  optionButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 60,
    justifyContent: 'center',
    marginBottom: 12,
  },

  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  optionText: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
  },

  selectedOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  correctOptionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  wrongOptionText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },

  // Bottom button styles
  bottomContainer: { 
    paddingHorizontal: 18, 
    paddingVertical: 16, 
    backgroundColor: '#ffffff', 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0',
    marginTop: -20, 
  },

  buttonShadow: {
    position: "absolute",
    top: 25,
    left: 18,
    right: 18,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#743b01", 
    opacity: 1,
  },

  checkButton: { 
    paddingVertical: 16, 
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 4,
    shadowColor: '#FE8305',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  checkButtonDisabled: {
    shadowColor: '#ccc',
  },

  checkButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Feedback styles
  feedbackContainer: { 
    paddingHorizontal: 18, 
    paddingVertical: 18, 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    minHeight: 140, 
  },

  feedbackContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginBottom: 20, 
  },

  feedbackLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  feedbackText: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginLeft: 12,
  },

  fullWidthButtonShadow: {
    position: "absolute",
    left: 18, 
    right: 18, 
    height: 50, 
    borderRadius: 15,
    bottom: 12, 
  },

  continueButton: { 
    backgroundColor: '#3FE90B', 
    paddingHorizontal: 24, 
    paddingVertical: 18, 
    borderRadius: 15,
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonText: { 
    color: '#ffffff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },

  // Loading styles
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
    color: '#2c3e50',
    fontWeight: '500',
    marginTop: 20,
  },

  // Game over styles
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    minWidth: 300,
  },
  gameOverAnimation: {
    width: 150,
    height: 150,
  },
  gameOverText: {
    fontSize: 28,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginTop: 20,
  },
  finalScoreText: {
    fontSize: 20,
    color: '#2c3e50',
    marginTop: 10,
  },
  encouragementText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    color: 'white',
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
    color: '#2c3e50',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default IntermediateDuolingoGame;