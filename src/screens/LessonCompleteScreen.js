import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const LessonCompleteScreen = ({ navigation, route }) => {
  const { lessonId, score, totalQuestions } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  const handleContinue = () => {
    navigation.navigate('LevelStage1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF7E0', '#FFD180', '#FFA726']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Celebration Image */}
          <View style={styles.celebrationContainer}>
            <LottieView
              source={require('../asset/Success.json')}
              autoPlay
              loop={false}
              style={styles.celebrationAnimation}
            />
          </View>

          {/* Lesson Complete Text */}
          <Text style={styles.lessonCompleteText}>Lesson complete!</Text>

          {/* Rewards Section */}
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardBox}>
              <View style={styles.rewardIcon}>
                <Text style={styles.diamondIcon}>💎</Text>
              </View>
              <Text style={styles.rewardTitle}>DIAMOND</Text>
              <Text style={styles.rewardValue}>45</Text>
            </View>

            <View style={styles.rewardBox}>
              <View style={styles.rewardIcon}>
                <Text style={styles.speedIcon}>⏱️</Text>
              </View>
              <Text style={styles.rewardTitle}>SPEEDY</Text>
              <Text style={styles.rewardValue}>0.30</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              You completed {score} out of {totalQuestions} questions correctly!
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#FF8000', '#FF9500']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>LET'S GO!!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  celebrationContainer: {
    marginBottom: 30,
  },
  celebrationAnimation: {
    width: 200,
    height: 200,
  },
  lessonCompleteText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  rewardBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  diamondIcon: {
    fontSize: 24,
  },
  speedIcon: {
    fontSize: 24,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    marginBottom: 40,
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  continueButton: {
    width: '100%',
    maxWidth: 300,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LessonCompleteScreen;

