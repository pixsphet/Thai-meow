import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

const AdvancedWordGame = ({ navigation, route }) => {
  const { lessonId = 16, level = 'Advanced' } = route.params || {};
  
  // Mock data สำหรับ Advanced level
  const vocabulary = [
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
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

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
            
            {showAnswer && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>ความหมาย:</Text>
                <Text style={styles.answerText}>{currentWord.meaning}</Text>
                {selectedDifficulty && (
                  <Text style={styles.difficultyText}>
                    ความยาก: {selectedDifficulty === 'easy' ? 'ง่าย' : selectedDifficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {!showAnswer ? (
            <TouchableOpacity
              style={styles.showAnswerButton}
              onPress={handleShowAnswer}
            >
              <Text style={styles.buttonText}>ดูความหมาย</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerButtons}>
              <View style={styles.difficultyButtons}>
                <Text style={styles.difficultyLabel}>ความยากของคำนี้:</Text>
                <View style={styles.difficultyRow}>
                  <TouchableOpacity
                    style={[styles.difficultyButton, selectedDifficulty === 'easy' && styles.selectedDifficulty]}
                    onPress={() => handleDifficulty('easy')}
                  >
                    <Text style={[styles.difficultyButtonText, selectedDifficulty === 'easy' && styles.selectedDifficultyText]}>
                      ง่าย (1 คะแนน)
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.difficultyButton, selectedDifficulty === 'medium' && styles.selectedDifficulty]}
                    onPress={() => handleDifficulty('medium')}
                  >
                    <Text style={[styles.difficultyButtonText, selectedDifficulty === 'medium' && styles.selectedDifficultyText]}>
                      ปานกลาง (2 คะแนน)
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.difficultyButton, selectedDifficulty === 'hard' && styles.selectedDifficulty]}
                    onPress={() => handleDifficulty('hard')}
                  >
                    <Text style={[styles.difficultyButtonText, selectedDifficulty === 'hard' && styles.selectedDifficultyText]}>
                      ยาก (3 คะแนน)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
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
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 15,
  },
  example: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
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
    fontSize: 20,
    color: '#E65100',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: '500',
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
    borderColor: 'transparent',
  },
  selectedDifficulty: {
    backgroundColor: '#FF9800',
    borderColor: '#E65100',
  },
  difficultyButtonText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedDifficultyText: {
    color: 'white',
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

export default AdvancedWordGame;





