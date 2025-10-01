import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import ProgressRing from '../component/ProgressRing';
import lessonService from '../services/lessonService';

const { width } = Dimensions.get('window');
const ITEM_OFFSET = 65;

const LevelStage3 = ({ navigation }) => {
  const level = 'Advanced';
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
      const response = await lessonService.getLessonsByLevel('Advanced');
      
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
        { id: 16, lesson_id: 16, title: 'การใช้คำเชื่อมและประโยคซับซ้อน', level: 'Advanced' },
        { id: 17, lesson_id: 17, title: 'คำลักษณนามพื้นฐาน', level: 'Advanced' },
        { id: 18, lesson_id: 18, title: 'ฝึกสนทนาเบื้องต้น (Dialogue)', level: 'Advanced' },
        { id: 19, lesson_id: 19, title: 'สรุปบทเรียน + แบบทดสอบรวม', level: 'Advanced' },
        { id: 20, lesson_id: 20, title: 'แบบฝึกประโยคจากชีวิตจริง', level: 'Advanced' },
        { id: 21, lesson_id: 21, title: 'การเขียนเรียงความ', level: 'Advanced' },
        { id: 22, lesson_id: 22, title: 'การนำเสนอ', level: 'Advanced' },
        { id: 23, lesson_id: 23, title: 'การอภิปราย', level: 'Advanced' },
        { id: 24, lesson_id: 24, title: 'การวิเคราะห์', level: 'Advanced' },
        { id: 25, lesson_id: 25, title: 'การประเมิน', level: 'Advanced' },
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
    console.log('LevelStage3: Component mounted, fetching stages...');
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

  console.log('LevelStage3: Rendering with loading:', loading, 'stages:', stages.length);
  
  return (
    <LinearGradient
      colors={['#FF9800', '#FFB74D', '#FFCC80']}
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
              <Text style={styles.levelText}>Level 3</Text>
              <Text style={styles.levelSubtext}>Advanced Level</Text>
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
          ) : stages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>ไม่พบข้อมูลบทเรียน</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchStages()}
              >
                <Text style={styles.retryButtonText}>ลองใหม่</Text>
              </TouchableOpacity>
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
                        category: 'advanced',
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
                    color="#FF9800"
                    bgColor="#FFE0B2"
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
            <Text style={styles.navIconInactiveText}>🧩</Text>
            <Text style={styles.navLabelInactive}>Daily Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <View style={styles.navIconActive}>
              <Text style={styles.navIconActiveText}>⚙️</Text>
            </View>
            <Text style={styles.navLabelActive}>Settings</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E65100',
  },
  levelInfo: {
    flex: 1,
    alignItems: 'center',
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E65100',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  levelSubtext: {
    fontSize: 14,
    color: '#E65100',
    marginTop: 2,
  },
  progressIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  completedIcon: {
    backgroundColor: '#4CAF50',
  },
  currentIcon: {
    backgroundColor: '#FF9800',
  },
  lockedIcon: {
    backgroundColor: '#BDBDBD',
  },
  completedIconText: {
    fontSize: 16,
    color: 'white',
  },
  currentIconText: {
    fontSize: 16,
    color: 'white',
  },
  lockedIconText: {
    fontSize: 16,
    color: 'white',
  },
  stageList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 18,
    color: '#E65100',
    fontWeight: '500',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stageItem: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stageCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 243, 224, 0.9)',
    borderWidth: 3,
    borderColor: '#FFB74D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneCircle: {
    backgroundColor: 'rgba(255, 243, 224, 0.9)',
    borderColor: '#FFB74D',
  },
  currentCircle: {
    backgroundColor: 'rgba(255, 243, 224, 0.9)',
    borderColor: '#FF9800',
  },
  lockedCircle: {
    backgroundColor: 'rgba(189, 189, 189, 0.3)',
    borderColor: '#BDBDBD',
  },
  stageContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 80,
    height: 80,
  },
  stageEmoji: {
    fontSize: 40,
  },
  stageLabelContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 5,
  },
  stageDescription: {
    fontSize: 12,
    color: '#E65100',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
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
    color: '#FF9800',
  },
  navIconInactiveText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelInactive: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
  },
});

export default LevelStage3;