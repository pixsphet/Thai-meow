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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const ThaiVowelsGame = ({ navigation, route }) => {
  const [currentMode, setCurrentMode] = useState('lesson');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vowels, setVowels] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameData, setGameData] = useState([]);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  // Mock data removed - using MongoDB Atlas data instead

  useEffect(() => {
    // Load data from MongoDB Atlas
    loadDataFromAtlas();
    
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

  // Load data from MongoDB Atlas
  const loadDataFromAtlas = async () => {
    try {
      setLoading(true);
      
      // Load vowels from MongoDB
      const vowelsData = await vocabWordService.getVocabWordsByLesson('vowels_basic');
      
      if (vowelsData && vowelsData.length > 0) {
        // Transform data to match expected format for ThaiVowelsGame
        const transformedVowels = vowelsData.map(word => ({
          id: word._id,
          char: word.thai, // Use 'char' instead of 'thai' for display
          name: word.exampleTH, // Use exampleTH as name
          meaning: word.en, // English meaning
          sound: word.exampleTH, // Sound for TTS
          image: '🔤', // Default image
          order: word.order || 1,
          type: word.type || 'basic',
          roman: word.roman, // Romanization
          example: word.exampleTH, // Example
          audio: word.audioUrl
        }));
        setVowels(transformedVowels);
        console.log('✅ Vowels loaded from MongoDB Atlas:', transformedVowels.length);
      } else {
        // No fallback - show empty state
        setVowels([]);
        console.log('⚠️ No vowels data available');
      }
      
      console.log('✅ Data loading completed');
    } catch (error) {
      console.error('❌ Error loading data from Atlas:', error);
      // No fallback - show empty state
      setVowels([]);
      console.log('⚠️ No data available due to error');
    } finally {
      setLoading(false);
    }
  };

  const generateGameData = (mode) => {
    switch (mode) {
      case 'matching':
        return generateMatchingGame();
      case 'multiple':
        return generateMultipleChoiceGame();
      case 'fill':
        return generateFillBlankGame();
      case 'order':
        return generateOrderingGame();
      case 'quiz':
        return generateQuizGame();
      default:
        return [];
    }
  };

  const generateMatchingGame = () => {
    const shuffled = [...vowels].sort(() => 0.5 - Math.random()).slice(0, 6);
    return shuffled.map(vowel => ({
      type: 'matching',
      vowel: vowel,
      options: [
        { ...vowel, correct: true },
        ...shuffled.filter(v => v.char !== vowel.char).slice(0, 2).map(v => ({ ...v, correct: false }))
      ].sort(() => 0.5 - Math.random())
    }));
  };

  const generateMultipleChoiceGame = () => {
    const shuffled = [...vowels].sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map(vowel => ({
      type: 'multiple',
      question: `เสียง "${vowel.sound}" ตรงกับสระตัวไหน?`,
      vowel: vowel,
      options: [
        vowel,
        ...shuffled.filter(v => v.char !== vowel.char).slice(0, 3)
      ].sort(() => 0.5 - Math.random())
    }));
  };

  const generateFillBlankGame = () => {
    const sequence = vowels.slice(0, 8);
    return sequence.map((vowel, index) => ({
      type: 'fill',
      question: `เติมสระที่หายไป: ${sequence.slice(0, index).map(v => v.char).join(', ')} __ ${sequence.slice(index + 1, index + 3).map(v => v.char).join(', ')}`,
      correct: vowel,
      options: [vowel, ...vowels.filter(v => v.char !== vowel.char).slice(0, 3)]
    }));
  };

  const generateOrderingGame = () => {
    const shuffled = vowels.slice(0, 8).sort(() => 0.5 - Math.random());
    return [{
      type: 'order',
      question: 'เรียงสระตามลำดับ',
      vowels: shuffled,
      correct: [...shuffled].sort((a, b) => a.order - b.order)
    }];
  };

  const generateQuizGame = () => {
    const allGames = [
      ...generateMatchingGame().slice(0, 2),
      ...generateMultipleChoiceGame().slice(0, 3),
      ...generateFillBlankGame().slice(0, 2),
      ...generateOrderingGame()
    ];
    return allGames.sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const question = gameData[currentQuestion];
    let correct = false;
    
    switch (question.type) {
      case 'matching':
        correct = answer.correct;
        break;
      case 'multiple':
        correct = answer.char === question.vowel.char;
        break;
      case 'fill':
        correct = answer.char === question.correct.char;
        break;
      case 'order':
        correct = JSON.stringify(answer) === JSON.stringify(question.correct);
        break;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
      setXp(xp + 10);
      if (xp + 10 >= level * 100) {
        setLevel(level + 1);
        setXp(0);
      }
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
        `${currentMode === 'quiz' ? 'Quiz' : 'เกม'} เสร็จสิ้น!`,
        `คะแนน: ${score}\nStreak: ${streak}\nXP: ${xp}\nLevel: ${level}`,
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

  const startGame = (mode) => {
    setCurrentMode(mode);
    setGameData(generateGameData(mode));
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const renderMiniLesson = () => {
    return (
      <ScrollView style={styles.lessonContainer}>
        <Text style={styles.lessonTitle}>สระไทย</Text>
        <Text style={styles.lessonSubtitle}>เรียนรู้สระพื้นฐาน 18 ตัว</Text>
        
        <View style={styles.vowelsGrid}>
          {vowels.map((vowel, index) => (
            <View key={index} style={[styles.vowelCard, { backgroundColor: getVowelTypeColor(vowel.type) }]}>
              <Text style={styles.vowelChar}>{vowel.char}</Text>
              <Text style={styles.vowelName}>{vowel.name}</Text>
              <Text style={styles.vowelMeaning}>{vowel.meaning}</Text>
              <Text style={styles.vowelImage}>{vowel.image}</Text>
              <Text style={styles.vowelType}>{vowel.type}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const getVowelTypeColor = (type) => {
    switch (type) {
      case 'short': return '#E3F2FD';
      case 'long': return '#E8F5E8';
      case 'special': return '#FFF3E0';
      default: return '#F5F5F5';
    }
  };

  const renderGame = () => {
    if (loading || !gameData[currentQuestion]) return null;
    
    const question = gameData[currentQuestion];
    
    switch (question.type) {
      case 'matching':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>จับคู่สระกับเสียง</Text>
            <View style={styles.matchingContainer}>
              <View style={styles.vowelDisplay}>
                <Text style={styles.vowelChar}>{question.vowel.char}</Text>
                <Text style={styles.vowelName}>{question.vowel.name}</Text>
              </View>
              <View style={styles.optionsContainer}>
                {question.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedAnswer === option && styles.selectedOption,
                      showResult && option.correct && styles.correctOption,
                      showResult && selectedAnswer === option && !option.correct && styles.wrongOption,
                    ]}
                    onPress={() => handleAnswer(option)}
                    disabled={showResult}
                  >
                    <Text style={styles.optionText}>{option.sound}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );
        
      case 'multiple':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option.char === question.vowel.char && styles.correctOption,
                    showResult && selectedAnswer === option && option.char !== question.vowel.char && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <Text style={styles.optionChar}>{option.char}</Text>
                  <Text style={styles.optionName}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'fill':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option.char === question.correct.char && styles.correctOption,
                    showResult && selectedAnswer === option && option.char !== question.correct.char && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <Text style={styles.optionChar}>{option.char}</Text>
                  <Text style={styles.optionName}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        
      case 'order':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            <View style={styles.orderingContainer}>
              {question.vowels.map((vowel, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.orderButton,
                    selectedAnswer && selectedAnswer.includes(vowel) && styles.selectedOption,
                    showResult && question.correct.includes(vowel) && styles.correctOption,
                    showResult && selectedAnswer && selectedAnswer.includes(vowel) && !question.correct.includes(vowel) && styles.wrongOption,
                  ]}
                  onPress={() => {
                    if (showResult) return;
                    const newAnswer = selectedAnswer ? [...selectedAnswer, vowel] : [vowel];
                    setSelectedAnswer(newAnswer);
                    
                    if (newAnswer.length === question.vowels.length) {
                      handleAnswer(newAnswer);
                    }
                  }}
                  disabled={showResult}
                >
                  <Text style={styles.orderChar}>{vowel.char}</Text>
                  <Text style={styles.orderName}>{vowel.name}</Text>
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
            <Text style={styles.loadingText}>กำลังโหลด...</Text>
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
      colors={['#9C27B0', '#BA68C8', '#CE93D8']}
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
            <Text style={styles.headerTitle}>สระไทย</Text>
            <Text style={styles.headerSubtitle}>Level {level} • XP: {xp}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>❤️ {lives}</Text>
            <Text style={styles.statsText}>🔥 {streak}</Text>
            <Text style={styles.statsText}>⭐ {score}</Text>
          </View>
        </View>

        {currentMode === 'lesson' ? (
          renderMiniLesson()
        ) : (
          <>
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

            {/* Game */}
            <Animated.View
              style={[
                styles.gameWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              {renderGame()}
            </Animated.View>
          </>
        )}

        {/* Game Mode Selection */}
        {currentMode === 'lesson' && (
          <View style={styles.modeSelection}>
            <TouchableOpacity style={styles.modeButton} onPress={() => startGame('matching')}>
              <Text style={styles.modeButtonText}>🎯 จับคู่</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton} onPress={() => startGame('multiple')}>
              <Text style={styles.modeButtonText}>❓ เลือกคำตอบ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton} onPress={() => startGame('fill')}>
              <Text style={styles.modeButtonText}>✏️ เติมคำ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton} onPress={() => startGame('order')}>
              <Text style={styles.modeButtonText}>📋 เรียงลำดับ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton} onPress={() => startGame('quiz')}>
              <Text style={styles.modeButtonText}>🧠 แบบทดสอบ</Text>
            </TouchableOpacity>
          </View>
        )}

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
    color: '#9C27B0',
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
  lessonContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  lessonSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  vowelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  vowelCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  vowelChar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  vowelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  vowelMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  vowelImage: {
    fontSize: 24,
    marginBottom: 5,
  },
  vowelType: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: 'bold',
  },
  modeSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  modeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  gameWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gameContainer: {
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
    color: '#9C27B0',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  matchingContainer: {
    alignItems: 'center',
  },
  vowelDisplay: {
    backgroundColor: '#F3E5F5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
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
    alignItems: 'center',
    minWidth: 100,
  },
  selectedOption: {
    borderColor: '#9C27B0',
    backgroundColor: '#F3E5F5',
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
    color: '#9C27B0',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionChar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 5,
  },
  optionName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  orderingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  orderButton: {
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
    alignItems: 'center',
    minWidth: 80,
  },
  orderChar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  orderName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
});

export default ThaiVowelsGame;





