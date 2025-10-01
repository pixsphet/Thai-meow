import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import vocabWordService from '../services/vocabWordService';
import { LinearGradient } from 'expo-linear-gradient';

const SimpleWordGame = ({ navigation, route }) => {
  const { lessonId = 11, level = 'Intermediate' } = route.params || {};
  
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      console.log('Fetching vocabulary for lesson:', lessonId);
      
      // ใช้ vocabWordService เพื่อดึงข้อมูลจาก MongoDB
      const response = await vocabWordService.getVocabWordsByLevel(level, 20);
      
      console.log('Fetched vocabulary data:', response);

      if (response.success && response.data && response.data.length > 0) {
        // Transform data to match expected format
        const transformedVocab = response.data.map(word => ({
          thai_word: word.thai,
          romanization: word.roman,
          meaning: word.en,
          example: word.exampleTH
        }));
        setVocabulary(transformedVocab);
      } else {
        // ใช้ mock data เมื่อ API ไม่ทำงาน
        const mockVocabulary = [
          {
            thai_word: 'คำถาม',
            romanization: 'kham tham',
            meaning: 'question',
            example: 'คุณมีคำถามอะไรไหม?'
          },
          {
            thai_word: 'การซื้อของ',
            romanization: 'kan sue khong',
            meaning: 'shopping',
            example: 'ฉันชอบการซื้อของ'
          },
          {
            thai_word: 'การเดินทาง',
            romanization: 'kan dern thang',
            meaning: 'travel',
            example: 'การเดินทางสนุกมาก'
          },
          {
            thai_word: 'อากาศ',
            romanization: 'a-kat',
            meaning: 'weather',
            example: 'วันนี้อากาศดี'
          },
          {
            thai_word: 'งานอดิเรก',
            romanization: 'ngaan a-di-rek',
            meaning: 'hobby',
            example: 'งานอดิเรกของฉันคือวาดรูป'
          }
        ];
        
        setVocabulary(mockVocabulary);
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      
      // ใช้ mock data เมื่อเกิด error
      const mockVocabulary = [
        {
          thai_word: 'คำถาม',
          romanization: 'kham tham',
          meaning: 'question',
          example: 'คุณมีคำถามอะไรไหม?'
        },
        {
          thai_word: 'การซื้อของ',
          romanization: 'kan sue khong',
          meaning: 'shopping',
          example: 'ฉันชอบการซื้อของ'
        },
        {
          thai_word: 'การเดินทาง',
          romanization: 'kan dern thang',
          meaning: 'travel',
          example: 'การเดินทางสนุกมาก'
        },
        {
          thai_word: 'อากาศ',
          romanization: 'a-kat',
          meaning: 'weather',
          example: 'วันนี้อากาศดี'
        },
        {
          thai_word: 'งานอดิเรก',
          romanization: 'ngaan a-di-rek',
          meaning: 'hobby',
          example: 'งานอดิเรกของฉันคือวาดรูป'
        }
      ];
      
      setVocabulary(mockVocabulary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [lessonId]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const currentWord = vocabulary[currentIndex];
    const isCorrect = answer === currentWord.meaning;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    // Auto proceed after 2 seconds
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      
      if (currentIndex < vocabulary.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Game completed
        Alert.alert(
          'เกมจบแล้ว!',
          `คุณได้คะแนน ${score + (isCorrect ? 1 : 0)} จาก ${vocabulary.length} คำ`,
          [
            { text: 'เล่นอีกครั้ง', onPress: resetGame },
            { text: 'กลับ', onPress: () => navigation.goBack() }
          ]
        );
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
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
            <Text style={styles.loadingText}>กำลังโหลดคำศัพท์...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>ไม่พบคำศัพท์</Text>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.buttonText}>กลับ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <LinearGradient
      colors={['#4CAF50', '#66BB6A', '#81C784']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← กลับ</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>คำศัพท์ Intermediate</Text>
            <Text style={styles.headerSubtitle}>Level 2</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>คะแนน: {score}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {vocabulary.length}
          </Text>
        </View>

        {/* Word Card */}
        <View style={styles.wordContainer}>
          <View style={styles.wordCard}>
            <Text style={styles.thaiWord}>{currentWord.thai_word}</Text>
            <Text style={styles.romanization}>({currentWord.romanization})</Text>
            <Text style={styles.example}>{currentWord.example}</Text>
          </View>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.questionText}>ความหมายของคำนี้คืออะไร?</Text>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedAnswer === currentWord.meaning && styles.correctButton,
              selectedAnswer && selectedAnswer !== currentWord.meaning && styles.wrongButton
            ]}
            onPress={() => handleAnswer(currentWord.meaning)}
            disabled={selectedAnswer !== null}
          >
            <Text style={[
              styles.optionText,
              selectedAnswer === currentWord.meaning && styles.correctText
            ]}>
              {currentWord.meaning}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Result */}
        {showResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {selectedAnswer === currentWord.meaning ? 'ถูกต้อง! ✅' : 'ผิด! ❌'}
            </Text>
            <Text style={styles.resultSubtext}>
              {selectedAnswer === currentWord.meaning ? 'เยี่ยมมาก!' : `คำตอบที่ถูกคือ: ${currentWord.meaning}`}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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
  wordContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  wordCard: {
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
  questionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  wrongButton: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  correctText: {
    color: 'white',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  resultSubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimpleWordGame;





