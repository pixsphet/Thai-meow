import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

const BeginnerWordGame = ({ navigation, route }) => {
  const { lessonId = 1, level = 'Beginner' } = route.params || {};
  
  // Mock data สำหรับ Beginner level
  const vocabulary = [
    {
      thai_word: 'สวัสดี',
      romanization: 'sa-wat-dee',
      meaning: 'hello',
      example: 'สวัสดีครับ/ค่ะ'
    },
    {
      thai_word: 'ขอบคุณ',
      romanization: 'khop-khun',
      meaning: 'thank you',
      example: 'ขอบคุณมากครับ/ค่ะ'
    },
    {
      thai_word: 'ขอโทษ',
      romanization: 'kho-thot',
      meaning: 'sorry',
      example: 'ขอโทษครับ/ค่ะ'
    },
    {
      thai_word: 'ใช่',
      romanization: 'chai',
      meaning: 'yes',
      example: 'ใช่ครับ/ค่ะ'
    },
    {
      thai_word: 'ไม่',
      romanization: 'mai',
      meaning: 'no',
      example: 'ไม่ครับ/ค่ะ'
    }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
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

  const handleCorrect = () => {
    setScore(score + 1);
    setShowAnswer(true);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowAnswer(false);
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
            <Text style={styles.headerTitle}>คำศัพท์ Beginner</Text>
            <Text style={styles.headerSubtitle}>Level 1</Text>
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
              <TouchableOpacity
                style={styles.correctButton}
                onPress={handleCorrect}
              >
                <Text style={styles.buttonText}>รู้แล้ว ✅</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>ต่อไป</Text>
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
    backgroundColor: '#2196F3',
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
    color: '#2196F3',
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
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 10,
  },
  romanization: {
    fontSize: 18,
    color: '#2196F3',
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
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  answerLabel: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answerText: {
    fontSize: 20,
    color: '#1976D2',
    fontWeight: 'bold',
    textAlign: 'center',
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
    flexDirection: 'row',
    gap: 15,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 20,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButton: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    flex: 1,
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
    color: '#2196F3',
  },
});

export default BeginnerWordGame;





