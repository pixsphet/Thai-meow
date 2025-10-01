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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import vaja9TtsService from '../services/vaja9TtsService';
import apiService from '../services/apiService';
import vocabWordService from '../services/vocabWordService';
// Test imports removed
import { useProgressTracking } from '../hooks/useProgressTracking';
import { useProgress } from '../contexts/ProgressContext';
import { useTheme } from '../contexts/ThemeContext';
import GameModeSelector from '../components/GameModeSelector';

const { width } = Dimensions.get('window');

const ThaiConsonantsGame = ({ navigation, route }) => {
  const [currentMode, setCurrentMode] = useState('lesson'); // lesson, matching, multiple, drag, fill, order, quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [consonants, setConsonants] = useState([]);
  const [vowels, setVowels] = useState([]);
  const [tones, setTones] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('consonants'); // consonants, vowels, tones
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  // Progress tracking
  const { trackThaiConsonantsProgress, startGameTracking, endGameTracking } = useProgressTracking();
  const { getTotalXP, getCurrentLevel, getCurrentStreak } = useProgress();
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  // Mock data removed - using MongoDB Atlas data instead

  // Mock data removed - using MongoDB Atlas data instead

  // Mock data removed - using MongoDB Atlas data instead

  // AI For Thai Real TTS function
  const speakText = async (text, language = 'th-TH') => {
    console.log('🔊 Vaja9 TTS Speaking:', text);
    
    try {
      // Use Vaja9 TTS
      await vaja9TtsService.playThai(text, {
        language: language,
        emotion: 'happy' // Use happy emotion for learning
      });
      console.log('✅ Vaja9 TTS completed successfully');
      return;
    } catch (error) {
      console.log('❌ Vaja9 TTS failed:', error);
      
      // Fallback to basic expo-speech
      try {
        console.log('🔄 Fallback to basic expo-speech');
        await Speech.speak(text, { language: 'th-TH' });
        console.log('✅ Basic TTS completed');
      } catch (finalError) {
        console.error('❌ All TTS methods failed:', finalError);
      }
    }
  };


  useEffect(() => {
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
      
      // Load consonants from MongoDB
      const consonantsData = await vocabWordService.getVocabWordsByLesson('consonants_basic');
      
      if (consonantsData && consonantsData.length > 0) {
        // Transform data to match expected format for ThaiConsonantsGame
        const transformedConsonants = consonantsData.map(word => ({
          id: word._id,
          char: word.thai, // Use 'char' instead of 'thai' for display
          name: word.exampleTH, // Use exampleTH as name (e.g., "กอ-ไก่")
          meaning: word.en, // English meaning
          sound: word.exampleTH, // Sound for TTS
          image: '🔤', // Default image
          roman: word.roman, // Romanization
          example: word.exampleTH, // Example
          audio: word.audioUrl
        }));
        setConsonants(transformedConsonants);
        console.log('✅ Consonants loaded from MongoDB Atlas:', transformedConsonants.length);
      } else {
        // No fallback - show empty state
        setConsonants([]);
        console.log('⚠️ No consonants data available');
      }
      
      // Load vowels from MongoDB
      const vowelsData = await vocabWordService.getVocabWordsByLesson('vowels_basic');
      if (vowelsData && vowelsData.length > 0) {
        // Transform data to match expected format for ThaiConsonantsGame
        const transformedVowels = vowelsData.map(word => ({
          id: word._id,
          char: word.thai, // Use 'char' instead of 'thai' for display
          name: word.exampleTH, // Use exampleTH as name
          meaning: word.en, // English meaning
          sound: word.exampleTH, // Sound for TTS
          image: '🔤', // Default image
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
      
      // Load tones from MongoDB
      const tonesData = await vocabWordService.getVocabWordsByLesson('tones');
      if (tonesData && tonesData.length > 0) {
        // Transform data to match expected format for ThaiConsonantsGame
        const transformedTones = tonesData.map(word => ({
          id: word._id,
          char: word.thai, // Use 'char' instead of 'thai' for display
          name: word.exampleTH, // Use exampleTH as name
          meaning: word.en, // English meaning
          sound: word.exampleTH, // Sound for TTS
          image: '🔤', // Default image
          roman: word.roman, // Romanization
          example: word.exampleTH, // Example
          audio: word.audioUrl
        }));
        setTones(transformedTones);
        console.log('✅ Tones loaded from MongoDB Atlas:', transformedTones.length);
      } else {
        // No fallback - show empty state
        setTones([]);
        console.log('⚠️ No tones data available');
      }
      
      console.log('✅ Data loading completed');
    } catch (error) {
      console.error('❌ Error loading data from Atlas:', error);
      // No fallback - show empty state
      setConsonants([]);
      setVowels([]);
      setTones([]);
      console.log('⚠️ No data available due to error');
    } finally {
      setLoading(false);
    }
  };

  // Start game tracking when mode changes to game
  useEffect(() => {
    if (currentMode !== 'lesson' && !gameStartTime) {
      setGameStartTime(Date.now());
      startGameTracking({
        gameType: 'thai_consonants',
        gameName: 'Thai Consonants Game',
        levelName: 'Basic Consonants',
        stageName: `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Game`,
        maxScore: gameData.length * 10
      });
      setTotalQuestions(gameData.length);
    }
  }, [currentMode, gameData.length]);

  // Update progress when game ends
  const endGame = async () => {
    if (gameStartTime) {
      const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
      try {
        await endGameTracking(true);
        console.log('Game progress saved successfully');
      } catch (error) {
        console.error('Error saving game progress:', error);
      }
    }
  };

  // Test API connection
  const handleTestApi = async () => {
    // Test function removed
  };

  // Test functions removed

  // Test functions removed

  // Get current data based on category
  const getCurrentData = () => {
    switch (currentCategory) {
      case 'consonants':
        return consonants;
      case 'vowels':
        return vowels;
      case 'tones':
        return tones;
      default:
        return consonants;
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
    const currentData = getCurrentData();
    const shuffled = [...currentData].sort(() => 0.5 - Math.random()).slice(0, 6);
    return shuffled.map(item => ({
      type: 'matching',
      item: item,
      options: [
        { ...item, correct: true },
        ...shuffled.filter(c => c.char !== item.char).slice(0, 2).map(c => ({ ...c, correct: false }))
      ].sort(() => 0.5 - Math.random())
    }));
  };

  const generateMultipleChoiceGame = () => {
    const currentData = getCurrentData();
    const shuffled = [...currentData].sort(() => 0.5 - Math.random()).slice(0, 10);
    return shuffled.map(item => ({
      type: 'multiple',
      question: `เสียง "${item.sound}" ตรงกับ${currentCategory === 'consonants' ? 'พยัญชนะ' : currentCategory === 'vowels' ? 'สระ' : 'วรรณยุกต์'}ตัวไหน?`,
      item: item,
      options: [
        item,
        ...shuffled.filter(c => c.char !== item.char).slice(0, 3)
      ].sort(() => 0.5 - Math.random())
    }));
  };

  const generateFillBlankGame = () => {
    const currentData = getCurrentData();
    const sequence = currentData.slice(0, 10);
    return sequence.map((item, index) => ({
      type: 'fill',
      question: `เติม${currentCategory === 'consonants' ? 'พยัญชนะ' : currentCategory === 'vowels' ? 'สระ' : 'วรรณยุกต์'}ที่หายไป: ${sequence.slice(0, index).map(c => c.char).join(', ')} __ ${sequence.slice(index + 1, index + 3).map(c => c.char).join(', ')}`,
      correct: item,
      options: [item, ...currentData.filter(c => c.char !== item.char).slice(0, 3)]
    }));
  };

  const generateOrderingGame = () => {
    const currentData = getCurrentData();
    const shuffled = currentData.slice(0, 8).sort(() => 0.5 - Math.random());
    return [{
      type: 'order',
      question: `เรียง${currentCategory === 'consonants' ? 'พยัญชนะตามลำดับ ก-ฮ' : currentCategory === 'vowels' ? 'สระตามลำดับ' : 'วรรณยุกต์ตามลำดับ'}`,
      items: shuffled,
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

  const handleAnswer = async (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const question = gameData[currentQuestion];
    let correct = false;
    
    switch (question.type) {
      case 'matching':
        correct = answer.correct;
        break;
      case 'multiple':
        correct = answer.char === question.item.char;
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
    
    // Update progress tracking
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
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

  const nextQuestion = async () => {
    if (currentQuestion < gameData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // Game finished - save progress
      await endGame();
      
      // Navigate to Game Complete screen
      navigation.navigate('GameComplete', {
        score,
        maxScore: gameData.length * 10,
        correctAnswers,
        totalQuestions,
        timeSpent: Math.floor((Date.now() - gameStartTime) / 1000),
        gameType: 'Thai Consonants Game',
        levelName: 'Basic Consonants',
        stageName: `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Game`
      });
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
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setGameStartTime(null);
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
    const currentData = getCurrentData();
    
    const categoryTitle = currentCategory === 'consonants' ? 'พยัญชนะไทย ก-ฮ' : 
                         currentCategory === 'vowels' ? 'สระไทย' : 'วรรณยุกต์ไทย';
    const categorySubtitle = currentCategory === 'consonants' ? 'เรียนรู้พยัญชนะพื้นฐาน 44 ตัว พร้อมภาพประกอบและเสียงอ่าน' :
                            currentCategory === 'vowels' ? 'เรียนรู้สระพื้นฐาน 18 ตัว พร้อมภาพประกอบและเสียงอ่าน' :
                            'เรียนรู้วรรณยุกต์ 4 รูป 5 เสียง พร้อมภาพประกอบและเสียงอ่าน';

    return (
      <ScrollView style={styles.lessonContainer}>
        <Text style={styles.lessonTitle}>{categoryTitle}</Text>
        <Text style={styles.lessonSubtitle}>{categorySubtitle}</Text>
        
        <View style={styles.itemsGrid}>
          {currentData.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.itemCard}
              onPress={() => {
                // Speak the full pronunciation like "กอ ไก่", "ขอ ไข่"
                if (currentCategory === 'consonants') {
                  speakText(item.sound, 'th-TH'); // This already contains "กอ ไก่", "ขอ ไข่"
                } else if (currentCategory === 'vowels') {
                  speakText(`อ${item.char}`, 'th-TH'); // For vowels like "อะ", "อา"
                } else if (currentCategory === 'tones') {
                  speakText(item.name, 'th-TH'); // For tones like "ไม้เอก", "ไม้โท"
                }
              }}
            >
              <Text style={styles.itemChar}>{item.char}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeaning}>{item.meaning}</Text>
              <Text style={styles.itemImage}>{item.image}</Text>
              <TouchableOpacity 
                style={styles.soundButton} 
                onPress={() => {
                  // Speak the full pronunciation like "กอ ไก่", "ขอ ไข่"
                  if (currentCategory === 'consonants') {
                    speakText(item.sound, 'th-TH'); // This already contains "กอ ไก่", "ขอ ไข่"
                  } else if (currentCategory === 'vowels') {
                    speakText(`อ${item.char}`, 'th-TH'); // For vowels like "อะ", "อา"
                  } else if (currentCategory === 'tones') {
                    speakText(item.name, 'th-TH'); // For tones like "ไม้เอก", "ไม้โท"
                  }
                }}
              >
                <Text style={styles.soundButtonText}>🔊</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderGame = () => {
    if (loading || !gameData[currentQuestion]) return null;
    
    const question = gameData[currentQuestion];
    
    // Add safety checks
    if (!question || !question.type) {
      console.log('❌ Invalid question data:', question);
      return null;
    }
    
    switch (question.type) {
      case 'matching':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>จับคู่พยัญชนะกับภาพ</Text>
            <View style={styles.matchingContainer}>
              <View style={styles.consonantDisplay}>
                <Text style={styles.consonantChar}>{question.consonant?.char || '?'}</Text>
                <Text style={styles.consonantName}>{question.consonant?.name || 'Unknown'}</Text>
              </View>
              <View style={styles.optionsContainer}>
                {question.options?.map((option, index) => (
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
                    <Text style={styles.optionImage}>{option.image}</Text>
                    <Text style={styles.optionText}>{option.meaning}</Text>
                  </TouchableOpacity>
                )) || []}
              </View>
            </View>
          </View>
        );
        
      case 'multiple':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question || 'เลือกคำตอบที่ถูกต้อง'}</Text>
            <View style={styles.optionsContainer}>
              {question.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option.char === question.consonant?.char && styles.correctOption,
                    showResult && selectedAnswer === option && option.char !== question.consonant?.char && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <Text style={styles.optionChar}>{option.char}</Text>
                  <Text style={styles.optionName}>{option.name}</Text>
                </TouchableOpacity>
              )) || []}
            </View>
          </View>
        );
        
      case 'fill':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question || 'เติมคำที่หายไป'}</Text>
            <View style={styles.optionsContainer}>
              {question.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === option && styles.selectedOption,
                    showResult && option.char === question.correct?.char && styles.correctOption,
                    showResult && selectedAnswer === option && option.char !== question.correct?.char && styles.wrongOption,
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={showResult}
                >
                  <Text style={styles.optionChar}>{option.char}</Text>
                  <Text style={styles.optionName}>{option.name}</Text>
                </TouchableOpacity>
              )) || []}
            </View>
          </View>
        );
        
      case 'order':
        return (
          <View style={styles.gameContainer}>
            <Text style={styles.questionText}>{question.question || 'เรียงลำดับพยัญชนะ'}</Text>
            <View style={styles.orderingContainer}>
              {question.consonants?.map((consonant, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.orderButton,
                    selectedAnswer && selectedAnswer.includes(consonant) && styles.selectedOption,
                    showResult && question.correct?.includes(consonant) && styles.correctOption,
                    showResult && selectedAnswer && selectedAnswer.includes(consonant) && !question.correct?.includes(consonant) && styles.wrongOption,
                  ]}
                  onPress={() => {
                    if (showResult) return;
                    const newAnswer = selectedAnswer ? [...selectedAnswer, consonant] : [consonant];
                    setSelectedAnswer(newAnswer);
                    
                    if (newAnswer.length === question.consonants?.length) {
                      handleAnswer(newAnswer);
                    }
                  }}
                  disabled={showResult}
                >
                  <Text style={styles.orderChar}>{consonant?.char || '?'}</Text>
                  <Text style={styles.orderName}>{consonant?.name || 'Unknown'}</Text>
                </TouchableOpacity>
              )) || []}
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
      colors={theme.gradients.orange}
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
            <Text style={styles.headerTitle}>
              {currentCategory === 'consonants' ? 'พยัญชนะไทย ก-ฮ' : 
               currentCategory === 'vowels' ? 'สระไทย' : 'วรรณยุกต์ไทย'}
            </Text>
            <Text style={styles.headerSubtitle}>Level {level} • XP: {xp}</Text>
          </View>
        </View>

        {/* Test buttons removed */}
          
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>❤️ {lives}</Text>
          <Text style={styles.statsText}>🔥 {streak}</Text>
          <Text style={styles.statsText}>⭐ {score}</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[styles.categoryButton, currentCategory === 'consonants' && styles.activeCategory]}
            onPress={() => setCurrentCategory('consonants')}
          >
            <Text style={[styles.categoryText, currentCategory === 'consonants' && styles.activeCategoryText]}>
              พยัญชนะ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, currentCategory === 'vowels' && styles.activeCategory]}
            onPress={() => setCurrentCategory('vowels')}
          >
            <Text style={[styles.categoryText, currentCategory === 'vowels' && styles.activeCategoryText]}>
              สระ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.categoryButton, currentCategory === 'tones' && styles.activeCategory]}
            onPress={() => setCurrentCategory('tones')}
          >
            <Text style={[styles.categoryText, currentCategory === 'tones' && styles.activeCategoryText]}>
              วรรณยุกต์
            </Text>
          </TouchableOpacity>
        </View>

           {/* Test buttons removed */}


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
          <GameModeSelector
            onModeSelect={startGame}
            currentCategory={currentCategory}
          />
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
    color: '#FF6B6B',
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
  // Test styles removed
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
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'white',
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
    // Test styles removed
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    position: 'relative',
  },
  itemChar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemImage: {
    fontSize: 24,
    marginBottom: 10,
  },
  soundButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soundButtonText: {
    fontSize: 16,
  },
  consonantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  consonantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  consonantChar: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 5,
  },
  consonantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  consonantMeaning: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  consonantImage: {
    fontSize: 24,
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 28,
  },
  matchingContainer: {
    alignItems: 'center',
  },
  consonantDisplay: {
    backgroundColor: '#FFE0E0',
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
    borderColor: '#FF6B6B',
    backgroundColor: '#FFE0E0',
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
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 5,
  },
  optionImage: {
    fontSize: 24,
  },
  optionChar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
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
    color: '#FF6B6B',
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

export default ThaiConsonantsGame;
