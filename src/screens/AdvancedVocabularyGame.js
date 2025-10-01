import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import vocabWordService from '../services/vocabWordService';

const AdvancedVocabularyGame = ({ navigation, route }) => {
  const { lessonId = 16, level = 'Advanced' } = route.params || {};
  
  const [vocabulary, setVocabulary] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [gameMode, setGameMode] = useState('meaning'); // meaning, example, usage

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
            thai_word: 'การใช้คำเชื่อม',
            romanization: 'kan chai kham chuem',
            meaning: 'use of conjunctions',
            example: 'การใช้คำเชื่อมทำให้ประโยคซับซ้อนขึ้น'
          },
          {
            thai_word: 'คำลักษณนาม',
            romanization: 'kham lak-sa-na-nam',
            meaning: 'classifier words',
            example: 'คำลักษณนามใช้กับคำนามในภาษาไทย'
          },
          {
            thai_word: 'ฝึกสนทนา',
            romanization: 'fuk son-tha-na',
            meaning: 'practice conversation',
            example: 'การฝึกสนทนาช่วยพัฒนาทักษะการพูด'
          },
          {
            thai_word: 'แบบทดสอบ',
            romanization: 'baep thot-sop',
            meaning: 'test/examination',
            example: 'แบบทดสอบวัดความเข้าใจของผู้เรียน'
          },
          {
            thai_word: 'ประโยคซับซ้อน',
            romanization: 'pra-yok sap-son',
            meaning: 'complex sentences',
            example: 'ประโยคซับซ้อนมีโครงสร้างที่ซับซ้อน'
          }
        ];
        
        setVocabulary(mockVocabulary);
      }
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      
      // ใช้ mock data เมื่อเกิด error
      const mockVocabulary = [
        {
          thai_word: 'การใช้คำเชื่อม',
          romanization: 'kan chai kham chuem',
          meaning: 'use of conjunctions',
          example: 'การใช้คำเชื่อมทำให้ประโยคซับซ้อนขึ้น'
        },
        {
          thai_word: 'คำลักษณนาม',
          romanization: 'kham lak-sa-na-nam',
          meaning: 'classifier words',
          example: 'คำลักษณนามใช้กับคำนามในภาษาไทย'
        },
        {
          thai_word: 'ฝึกสนทนา',
          romanization: 'fuk son-tha-na',
          meaning: 'practice conversation',
          example: 'การฝึกสนทนาช่วยพัฒนาทักษะการพูด'
        },
        {
          thai_word: 'แบบทดสอบ',
          romanization: 'baep thot-sop',
          meaning: 'test/examination',
          example: 'แบบทดสอบวัดความเข้าใจของผู้เรียน'
        },
        {
          thai_word: 'ประโยคซับซ้อน',
          romanization: 'pra-yok sap-son',
          meaning: 'complex sentences',
          example: 'ประโยคซับซ้อนมีโครงสร้างที่ซับซ้อน'
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

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSelectedDifficulty(null);
    } else {
      Alert.alert(
        'เกมจบแล้ว!',
        `คุณได้คะแนน ${score} จาก ${vocabulary.length} คำ`,
        [
          { text: 'เล่นอีกครั้ง', onPress: resetGame },
          { text: 'กลับ', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const handleDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    setScore(score + points);
    setShowAnswer(true);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowAnswer(false);
    setSelectedDifficulty(null);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const changeGameMode = (mode) => {
    setGameMode(mode);
    setShowAnswer(false);
    setSelectedDifficulty(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>กำลังโหลดคำศัพท์...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>ไม่พบคำศัพท์</Text>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.buttonText}>กลับ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>← กลับ</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>คำศัพท์ Advanced</Text>
            <Text style={styles.headerSubtitle}>Level 3</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>คะแนน: {score}</Text>
          </View>
        </View>

        {/* Game Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'meaning' && styles.activeMode]}
            onPress={() => changeGameMode('meaning')}
          >
            <Text style={[styles.modeText, gameMode === 'meaning' && styles.activeModeText]}>
              ความหมาย
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'example' && styles.activeMode]}
            onPress={() => changeGameMode('example')}
          >
            <Text style={[styles.modeText, gameMode === 'example' && styles.activeModeText]}>
              ตัวอย่าง
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'usage' && styles.activeMode]}
            onPress={() => changeGameMode('usage')}
          >
            <Text style={[styles.modeText, gameMode === 'usage' && styles.activeModeText]}>
              การใช้งาน
            </Text>
          </TouchableOpacity>
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
        <ScrollView style={styles.wordContainer}>
          <View style={styles.wordCard}>
            <Text style={styles.thaiWord}>{currentWord.thai_word}</Text>
            <Text style={styles.romanization}>({currentWord.romanization})</Text>
            
            {gameMode === 'meaning' && (
              <View>
                <Text style={styles.questionText}>ความหมายของคำนี้คืออะไร?</Text>
                {showAnswer && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>ความหมาย:</Text>
                    <Text style={styles.answerText}>{currentWord.meaning}</Text>
                  </View>
                )}
              </View>
            )}
            
            {gameMode === 'example' && (
              <View>
                <Text style={styles.questionText}>ตัวอย่างการใช้คำนี้:</Text>
                {showAnswer && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>ตัวอย่าง:</Text>
                    <Text style={styles.answerText}>{currentWord.example}</Text>
                  </View>
                )}
              </View>
            )}
            
            {gameMode === 'usage' && (
              <View>
                <Text style={styles.questionText}>คำนี้ใช้ในบริบทไหน?</Text>
                {showAnswer && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>ความหมาย:</Text>
                    <Text style={styles.answerText}>{currentWord.meaning}</Text>
                    <Text style={styles.answerLabel}>ตัวอย่าง:</Text>
                    <Text style={styles.answerText}>{currentWord.example}</Text>
                  </View>
                )}
              </View>
            )}
            
            {showAnswer && selectedDifficulty && (
              <View style={styles.difficultyInfo}>
                <Text style={styles.difficultyText}>
                  ความยาก: {selectedDifficulty === 'easy' ? 'ง่าย' : selectedDifficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                </Text>
                <Text style={styles.pointsText}>
                  ได้ {selectedDifficulty === 'easy' ? '1' : selectedDifficulty === 'medium' ? '2' : '3'} คะแนน
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!showAnswer ? (
            <TouchableOpacity
              style={styles.showAnswerButton}
              onPress={handleShowAnswer}
            >
              <Text style={styles.buttonText}>ดูคำตอบ</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerButtons}>
              {!selectedDifficulty && (
                <View style={styles.difficultyButtons}>
                  <Text style={styles.difficultyLabel}>ความยากของคำนี้:</Text>
                  <View style={styles.difficultyRow}>
                    <TouchableOpacity
                      style={styles.difficultyButton}
                      onPress={() => handleDifficulty('easy')}
                    >
                      <Text style={styles.difficultyButtonText}>
                        ง่าย (1 คะแนน)
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.difficultyButton}
                      onPress={() => handleDifficulty('medium')}
                    >
                      <Text style={styles.difficultyButtonText}>
                        ปานกลาง (2 คะแนน)
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.difficultyButton}
                      onPress={() => handleDifficulty('hard')}
                    >
                      <Text style={styles.difficultyButtonText}>
                        ยาก (3 คะแนน)
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={!selectedDifficulty}
              >
                <Text style={[styles.buttonText, !selectedDifficulty && styles.disabledText]}>
                  ต่อไป
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF9800',
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
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FF9800',
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
    color: 'white',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  modeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeMode: {
    backgroundColor: 'white',
  },
  modeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  activeModeText: {
    color: '#FF9800',
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
    flex: 1,
    paddingHorizontal: 20,
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
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 10,
  },
  romanization: {
    fontSize: 18,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: '#E65100',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  answerContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  answerLabel: {
    fontSize: 16,
    color: '#E65100',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 18,
    color: '#E65100',
    textAlign: 'center',
    lineHeight: 24,
  },
  difficultyInfo: {
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  pointsText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  showAnswerButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  answerButtons: {
    gap: 20,
  },
  difficultyButtons: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
  },
  difficultyLabel: {
    fontSize: 16,
    color: '#E65100',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  difficultyButtonText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  disabledText: {
    color: '#ccc',
  },
});

export default AdvancedVocabularyGame;





