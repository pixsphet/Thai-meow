import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import ProgressRing from '../component/ProgressRing';
import lessonService from '../services/lessonService';

const { width } = Dimensions.get('window');
const ITEM_OFFSET = 65;

const LevelStage2 = ({ navigation }) => {
  const level = 'Intermediate'; // กำหนดระดับนี้
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const fetchStages = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch stages...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      // ใช้ lessonService เพื่อดึงข้อมูลจาก MongoDB
      const response = await lessonService.getLessonsByLevel('Intermediate');
      
      clearTimeout(timeoutId);
      
      if (!response.success) {
        throw new Error(`API error: ${response.message || 'Failed to fetch lessons'}`);
      }
      
      const data = response.lessons || [];
      console.log('Fetched stages data:', data);

      // กำหนด stage ปัจจุบัน (current)
      const currentStageIndex = 0; // stage แรกเป็น current

      const updatedStages = data.map((lesson, index) => {
        let status = 'locked';
        if (index === currentStageIndex) status = 'current';
        else if (index < currentStageIndex) status = 'done';
        else status = 'locked';

        return {
          id: lesson._id,
          lesson_id: lesson.order || index + 1,
          title: lesson.titleTH,
          level: lesson.level,
          key: lesson.key,
          status,
          progress: index === currentStageIndex ? 0 : 1, // progress เริ่มต้น
          type: 'lottie',
          lottie: require('../asset/stage_start.json'), // default animation
        };
      });

      console.log('Updated stages:', updatedStages);
      setStages(updatedStages);
    } catch (error) {
      console.error('Error fetching stages:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      // แสดงข้อมูล mock เมื่อไม่สามารถเชื่อมต่อได้
      const mockData = [
        { id: 11, lesson_id: 11, title: 'คำถามพื้นฐาน', level: 'Intermediate' },
        { id: 12, lesson_id: 12, title: 'การซื้อของ', level: 'Intermediate' },
        { id: 13, lesson_id: 13, title: 'การเดินทาง', level: 'Intermediate' },
        { id: 14, lesson_id: 14, title: 'อากาศและฤดูกาล', level: 'Intermediate' },
        { id: 15, lesson_id: 15, title: 'งานอดิเรก', level: 'Intermediate' },
        { id: 16, lesson_id: 16, title: 'การทำงาน', level: 'Intermediate' },
        { id: 17, lesson_id: 17, title: 'การเรียน', level: 'Intermediate' },
        { id: 18, lesson_id: 18, title: 'การออกกำลังกาย', level: 'Intermediate' },
        { id: 19, lesson_id: 19, title: 'การพักผ่อน', level: 'Intermediate' },
        { id: 20, lesson_id: 20, title: 'การท่องเที่ยว', level: 'Intermediate' },
      ];
      
      const updatedStages = mockData.map((stage, index) => {
        let status = 'locked';
        if (index === 0) status = 'current';
        else if (index < 0) status = 'done';
        else status = 'locked';

        return {
          ...stage,
          status,
          progress: index === 0 ? 0 : 1,
          type: 'lottie',
          lottie: require('../asset/stage_start.json'),
        };
      });
      
      console.log('Using mock data:', updatedStages);
      setStages(updatedStages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  // Animation effects
  useEffect(() => {
    if (stages.length > 0) {
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
    }
  }, [stages]);

  return (
    <LinearGradient
      colors={['#4CAF50', '#66BB6A', '#81C784']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
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
              onPress={() => navigation.navigate('Level')}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level 2</Text>
              <Text style={styles.levelSubtext}>Intermediate Level</Text>
            </View>
            <View style={styles.progressIcons}>
              <View style={[styles.iconContainer, styles.completedIcon]}>
                <Text style={styles.completedIconText}>⭐</Text>
              </View>
              <View style={[styles.iconContainer, styles.completedIcon]}>
                <Text style={styles.completedIconText}>📖</Text>
              </View>
              <View style={[styles.iconContainer, styles.currentIcon]}>
                <Text style={styles.currentIconText}>📖</Text>
              </View>
              <View style={[styles.iconContainer, styles.lockedIcon]}>
                <Text style={styles.lockedIconText}>📚</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.stageList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
            </View>
          ) : (
            stages.map((stage, index) => (
              <Animated.View 
                key={stage.id || `stage-${index}`} 
                style={[
                  styles.stageItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  disabled={stage.status === 'locked'}
                  style={[
                    styles.stageCircle,
                    stage.status === 'done' && styles.doneCircle,
                    stage.status === 'current' && styles.currentCircle,
                    stage.status === 'locked' && styles.lockedCircle,
                  ]}
                  onPress={() => {
                    if (stage.status !== 'locked') {
                      console.log('Navigating to NewLessonGame with lessonId:', stage.lesson_id);
                      navigation.navigate('NewLessonGame', { 
                        lessonId: stage.lesson_id, 
                        category: 'intermediate',
                        level: stage.level,
                        stageTitle: stage.title 
                      });
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <ProgressRing
                    progress={stage.progress}
                    size={120}
                    strokeWidth={8}
                    color="#4CAF50"
                    bgColor="#C8E6C9"
                  />
                  <View style={styles.stageContent}>
                    {stage.type === 'lottie' && stage.lottie ? (
                      <LottieView
                        source={stage.lottie}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                      />
                    ) : (
                      <Text style={styles.stageEmoji}>📚</Text>
                    )}
                  </View>
                </TouchableOpacity>

                <View style={styles.stageLabelContainer}>
                  <Text style={styles.stageLabel}>{stage.title}</Text>
                  <Text style={styles.stageDescription}>
                    {stage.status === 'done' ? 'เสร็จแล้ว' : 
                     stage.status === 'current' ? 'เริ่มเรียน' : 'ยังล็อค'}
                  </Text>
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('MainTab')}
          >
            <Text style={styles.navIconInactiveText}>🏠</Text>
            <Text style={styles.navLabelInactive}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('TreasurechestScreen')}
          >
            <Text style={styles.navIconInactiveText}>📦</Text>
            <Text style={styles.navLabelInactive}>Treasure Chest</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Text style={styles.navIconInactiveText}>👤</Text>
            <Text style={styles.navLabelInactive}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('QuestScreen')}
          >
            <View style={styles.navIconActive}>
              <Text style={styles.navIconActiveText}>🧩</Text>
            </View>
            <Text style={styles.navLabelActive}>Daily Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Text style={styles.navIconInactiveText}>⚙️</Text>
            <Text style={styles.navLabelInactive}>Settings</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  levelSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  progressIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: 4,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  completedIcon: {
    backgroundColor: '#FFD700',
  },
  currentIcon: {
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  lockedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  completedIconText: {
    fontSize: 20,
    color: '#B8860B',
  },
  currentIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  lockedIconText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  stageList: { 
    paddingBottom: 150, 
    width: width, 
    paddingTop: 30 
  },
  stageWrapper: { 
    marginBottom: 40, 
    alignItems: 'center', 
    position: 'relative', 
    width: 285 
  },
  stageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#4CAF50',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  progressWrapper: { 
    width: 150, 
    height: 150, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative' 
  },
  lottieIcon: { 
    width: 150, 
    height: 150, 
    position: 'absolute', 
    zIndex: 10 
  },
  glow: { 
    shadowColor: '#4CAF50', 
    shadowOffset: { width: 0, height: 0 }, 
    shadowOpacity: 0.7, 
    shadowRadius: 22, 
    elevation: 28 
  },
  doneCircle: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderColor: '#66BB6A' 
  },
  activeCircle: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderColor: '#81C784' 
  },
  currentCircle: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderColor: '#4CAF50' 
  },
  lockedCircle: { 
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderColor: 'rgba(255, 255, 255, 0.3)' 
  },
  stageLabelContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  stageLabel: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stageDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: { 
    fontSize: 18, 
    color: '#FFFFFF', 
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  star: {
    fontSize: 16,
    color: '#FFD700',
    textShadowColor: '#4CAF50',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActiveText: {
    fontSize: 20,
    color: '#2196F3',
  },
  navIconInactiveText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelInactive: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
});

export default LevelStage2;
