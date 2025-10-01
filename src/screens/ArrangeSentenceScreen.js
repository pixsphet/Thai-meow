import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import vaja9TtsService from '../services/vaja9TtsService';
import vocabWordService from '../services/vocabWordService';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const ArrangeSentenceScreen = ({ navigation, route }) => {
  const { lessonId } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // ดึงข้อมูลเกมจาก MongoDB Atlas
  const fetchGameData = async () => {
    try {
      setLoading(true);
      console.log('Fetching arrange sentence game data from MongoDB Atlas...');
      
      // Get vocabulary data from MongoDB Atlas
      const vocabData = await vocabWordService.getRandomVocabWords(5, 'Beginner', 'greetings');
      
      if (vocabData && vocabData.length > 0) {
        // Transform vocabulary data into arrange sentence questions
        const formattedQuestions = vocabData.map((word, index) => ({
          id: word._id || `question_${index}`,
          thai_sentence: `${word.thai} หมายถึง ${word.en}`,
          english_sentence: `${word.thai} means ${word.en}`,
          correct_thai_words: [word.thai, 'หมายถึง', word.en],
          options: [
            { text: word.thai, type: "thai", correct: true, audio_url: null, audio_available: false },
            { text: 'หมายถึง', type: "thai", correct: true, audio_url: null, audio_available: false },
            { text: word.en, type: "english", correct: true, audio_url: null, audio_available: false },
            { text: 'คือ', type: "thai", correct: false, audio_url: null, audio_available: false }
          ],
          audio: {
            thai_sentence: null,
            english_sentence: null,
            romanization: word.roman
          }
        }));
        setQuestions(formattedQuestions);
        console.log('✅ Questions loaded from MongoDB Atlas:', formattedQuestions.length);
      } else {
        throw new Error('No vocabulary data received from MongoDB Atlas');
      }
    } catch (error) {
      console.error('❌ Error fetching game data from MongoDB Atlas:', error);
      // No fallback - show empty state
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  // Animation effects
  useEffect(() => {
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
  }, [currentQuestion]);

  // Bounce animation for correct answers
  const bounceAnimation = () => {
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
  };

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (currentQ && currentQ.options) {
      // สร้าง wordBank จาก options
      const wordBank = currentQ.options.map(option => option.text);
      setAvailableWords([...wordBank]);
      setSelectedWords([]);
      setProgress((currentQuestion / questions.length) * 100);
    }
  }, [currentQuestion, currentQ, questions.length]);

  const handleWordSelect = (word) => {
    if (selectedWords.includes(word)) return;
    
    const newSelected = [...selectedWords, word];
    const newAvailable = availableWords.filter(w => w !== word);
    
    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
  };

  const handleWordRemove = (word) => {
    const newSelected = selectedWords.filter(w => w !== word);
    const newAvailable = [...availableWords, word];
    
    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
  };

  const checkAnswer = async () => {
    const correctAnswer = currentQ.correct_thai_words || currentQ.correctAnswer;
    const isAnswerCorrect = selectedWords.length === correctAnswer.length &&
      selectedWords.every(word => correctAnswer.includes(word));
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      bounceAnimation();
    } else {
      setStreak(0);
    }
    
    // เล่นเสียง feedback ด้วย Vaja9 TTS
    try {
      if (isAnswerCorrect) {
        await vaja9TtsService.speakWithEmotion('ดีมาก!', 'happy');
      } else {
        await vaja9TtsService.speakWithEmotion('ลองใหม่นะ', 'encouraging');
      }
    } catch (error) {
      console.error('Error speaking feedback:', error);
    }
  };

  // เล่นเสียงด้วย Vaja9 TTS
  const playAudio = async (text, emotion = 'neutral') => {
    if (text) {
      try {
        await vaja9TtsService.playThai(text, {
          speed: 0.9,
          pitch: 1.0,
          emotion: emotion
        });
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    } else {
      console.log('Speech synthesis not available');
    }
  };

  const handleContinue = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setIsCorrect(null);
    } else {
      // Navigate to lesson complete screen
      navigation.navigate('LessonComplete', { 
        lessonId,
        score: questions.filter((_, i) => i <= currentQuestion).length,
        totalQuestions: questions.length 
      });
    }
  };

  if (loading || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>กำลังโหลดเกม...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQ) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>ไม่พบข้อมูลเกม</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#FF6B6B', '#FFE66D', '#4ECDC4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header with Score */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.streakText}>🔥 {streak} streak</Text>
              </View>
            </View>
            
            <Text style={styles.title}>เรียงประโยคให้ถูกต้อง</Text>
            <Text style={styles.subtitle}>Arrange sentences correctly</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#FF6B6B', '#FFE66D']}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={styles.progressText}>{currentQuestion + 1} / {questions.length}</Text>
            </View>
          </Animated.View>

          {/* Cat and Speech Bubble */}
          <Animated.View 
            style={[
              styles.catContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.catWrapper}>
              <Image
                source={require('../asset/Grumpy Cat.png')}
                style={styles.catImage}
                resizeMode="contain"
              />
              <View style={styles.speechBubble}>
                <TouchableOpacity 
                  style={styles.speechButton}
                  onPress={() => playAudio(currentQ.thai_sentence, 'excited')}
                >
                  <Text style={styles.speechIcon}>🔊</Text>
                  <Text style={styles.speechText}>{currentQ.thai_sentence || 'Loading...'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* English Translation */}
            <View style={styles.translationContainer}>
              <Text style={styles.translationText}>{currentQ.english_sentence}</Text>
            </View>
          </Animated.View>

          {/* Answer Area */}
          <Animated.View 
            style={[
              styles.answerArea,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.answerLabel}>Drag words here to form the sentence:</Text>
            <View style={[
              styles.answerBox,
              isCorrect === true && styles.correctAnswer,
              isCorrect === false && styles.incorrectAnswer
            ]}>
              {selectedWords.length === 0 ? (
                <Text style={styles.placeholderText}>Tap words below to start building your sentence</Text>
              ) : (
                selectedWords.map((word, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.selectedWord,
                      { transform: [{ scale: bounceAnim }] }
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.selectedWordButton}
                      onPress={() => handleWordRemove(word)}
                    >
                      <Text style={styles.selectedWordText}>{word}</Text>
                      <Text style={styles.removeIcon}>×</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </View>
          </Animated.View>

          {/* Word Bank */}
          <Animated.View 
            style={[
              styles.wordBank,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.wordBankLabel}>Available words:</Text>
            <View style={styles.wordGrid}>
              {availableWords.map((word, index) => {
                const option = currentQ.options?.find(opt => opt.text === word);
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.wordButtonWrapper,
                      { transform: [{ scale: scaleAnim }] }
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.wordButton}
                      onPress={() => handleWordSelect(word)}
                    >
                      <Text style={styles.wordText}>{word}</Text>
                      <TouchableOpacity
                        style={styles.audioButton}
                        onPress={() => playAudio(option?.text || '', option?.correct ? 'happy' : 'neutral')}
                      >
                        <Text style={styles.audioIcon}>🔊</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>

          {/* Check Button */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.checkButton,
                selectedWords.length === 0 && styles.checkButtonDisabled
              ]}
              onPress={checkAnswer}
              disabled={selectedWords.length === 0}
            >
              <LinearGradient
                colors={selectedWords.length === 0 ? ['#CCCCCC', '#999999'] : ['#FF6B6B', '#FFE66D']}
                style={styles.checkButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.checkButtonText}>
                  {selectedWords.length === 0 ? 'Select words first' : 'CHECK ANSWER'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Feedback Modal */}
        {showFeedback && (
          <View style={styles.feedbackOverlay}>
            <Animated.View 
              style={[
                styles.feedbackContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={[
                styles.feedbackBanner,
                isCorrect ? styles.correctBanner : styles.incorrectBanner
              ]}>
                <Text style={styles.feedbackIcon}>
                  {isCorrect ? '🎉' : '💪'}
                </Text>
                <Text style={styles.feedbackText}>
                  {isCorrect ? 'Excellent!' : 'Keep trying!'}
                </Text>
                <Text style={styles.feedbackSubtext}>
                  {isCorrect ? `You got it right! +${streak > 1 ? streak * 10 : 10} points` : 'Don\'t give up!'}
                </Text>
              </View>
              
              {isCorrect && (
                <View style={styles.correctAnswerContainer}>
                  <Text style={styles.correctAnswerLabel}>Correct sentence:</Text>
                  <Text style={styles.correctAnswerText}>{currentQ.thai_sentence}</Text>
                  <Text style={styles.correctAnswerTranslation}>{currentQ.english_sentence}</Text>
                </View>
              )}
              
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  isCorrect ? styles.correctContinue : styles.incorrectContinue
                ]}
                onPress={handleContinue}
              >
                <LinearGradient
                  colors={isCorrect ? ['#4CAF50', '#8BC34A'] : ['#FF9800', '#FFC107']}
                  style={styles.continueButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.continueButtonText}>
                    {currentQuestion < questions.length - 1 ? 'NEXT QUESTION' : 'FINISH GAME'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  streakText: {
    fontSize: 14,
    color: '#FFE66D',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  catContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  catWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  catImage: {
    width: 150,
    height: 150,
  },
  speechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  speechButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speechIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  speechText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  translationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  translationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerArea: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  answerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerBox: {
    minHeight: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  incorrectAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  selectedWord: {
    margin: 3,
  },
  selectedWordButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedWordText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 5,
  },
  removeIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  wordBank: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  wordBankLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordButtonWrapper: {
    margin: 5,
  },
  wordButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  wordText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 8,
  },
  audioButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
  },
  audioIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checkButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkButtonDisabled: {
    opacity: 0.6,
  },
  checkButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  feedbackBanner: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  feedbackIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  feedbackSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  correctBanner: {
    backgroundColor: '#4CAF50',
  },
  incorrectBanner: {
    backgroundColor: '#FF9800',
  },
  correctAnswerContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
  },
  correctAnswerLabel: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  correctAnswerTranslation: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    width: '100%',
  },
  correctContinue: {
    // No additional styles needed
  },
  incorrectContinue: {
    // No additional styles needed
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ArrangeSentenceScreen;

