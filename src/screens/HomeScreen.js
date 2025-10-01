import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { 
    getTotalXP, 
    getCurrentLevel, 
    getCurrentStreak, 
    getLevelProgressPercentage,
    getStatistics,
    getRecentGames
  } = useProgress();

  // Language levels data from LevelScreen
  const languageLevels = [
    {
      id: 'thai-consonants',
      level: 'พยัญชนะไทย ก-ฮ',
      description: 'เรียนรู้พยัญชนะพื้นฐาน 44 ตัว พร้อมภาพประกอบและเสียงอ่าน',
      color: '#FF6B6B', // สีแดง
      image: require('../asset/Grumpy Cat.png'),
      stageCount: 44,
      completedStages: 0,
    },
    {
      id: 'beginner',
      level: 'Level 1 - Beginner',
      description: 'เรียนรู้คำศัพท์พื้นฐาน การออกเสียง และประโยคง่ายๆ',
      color: '#2196F3', // สีฟ้า
      image: require('../asset/Grumpy Cat.png'),
      stageCount: 10,
      completedStages: 0,
    },
    {
      id: 'intermediate',
      level: 'Level 2 - Intermediate',
      description: 'พัฒนาทักษะการพูด ฟัง อ่าน เขียน สำหรับการใช้ในชีวิตประจำวัน',
      color: '#4CAF50', // สีเขียว
      image: require('../asset/happy.png'),
      stageCount: 10,
      completedStages: 0,
    },
    {
      id: 'advanced',
      level: 'Level 3 - Advanced',
      description: 'สำหรับผู้เชี่ยวชาญในสำนวน ไวยากรณ์ และการสนทนาที่ซับซ้อน',
      color: '#FF9800', // สีส้ม
      image: require('../asset/catcry-Photoroom.png'),
      stageCount: 10,
      completedStages: 0,
    },
  ];

  const handleLevelPress = (levelId) => {
    // Navigate ไปหน้า Level Stage ตาม level
    switch (levelId) {
      case 'thai-consonants':
        navigation.navigate('ThaiConsonants', { levelId });
        break;
      case 'beginner':
        navigation.navigate('LevelStage1', { levelId });
        break;
      case 'intermediate':
        navigation.navigate('LevelStage2', { levelId });
        break;
      case 'advanced':
        navigation.navigate('LevelStage3', { levelId });
        break;
      default:
        navigation.navigate('LevelStage1', { levelId });
    }
  };

  const QuickActionCard = ({ icon, title, subtitle, onPress, colors, iconColor = "white" }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }) => (
    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: theme.text }]}>
              สวัสดี, {user?.username || 'ผู้เรียน'}!
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              พร้อมเรียนภาษาไทยกันไหม?
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard 
            icon="fire" 
            value={getCurrentStreak()} 
            label="Streak" 
            color="#FF6B6B" 
          />
          <StatCard 
            icon="star" 
            value={getTotalXP()} 
            label="XP" 
            color="#FFD93D" 
          />
          <StatCard 
            icon="trophy" 
            value={getCurrentLevel()} 
            label="Level" 
            color="#6BCF7F" 
          />
        </View>

        {/* Language Levels */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>ระดับการเรียนรู้</Text>
          {languageLevels.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.levelBox, { backgroundColor: item.color }]}
              onPress={() => handleLevelPress(item.id)}
            >
              <View style={styles.boxContent}>
                {item.image && <Image source={item.image} style={styles.catImage} />}
                <View style={styles.textContainer}>
                  <Text style={styles.levelText}>{item.level}</Text>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(item.completedStages / item.stageCount) * 100}%`,
                            backgroundColor: item.color
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {item.completedStages} / {item.stageCount} ด่าน
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>เริ่มเรียน</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon="alphabetical"
              title="พยัญชนะ"
              subtitle="เรียน ก-ฮ"
              colors={['#FF6B6B', '#FF8E8E']}
              onPress={() => navigation.navigate('ThaiConsonants')}
            />
            <QuickActionCard
              icon="format-letter-case"
              title="สระ"
              subtitle="เรียนสระไทย"
              colors={['#4ECDC4', '#6BCF7F']}
              onPress={() => navigation.navigate('ThaiVowels')}
            />
            <QuickActionCard
              icon="puzzle"
              title="เกม"
              subtitle="เล่นเกม"
              colors={['#FFD93D', '#FFA726']}
              onPress={() => navigation.navigate('MiniGame')}
            />
            <QuickActionCard
              icon="book-open"
              title="บทเรียน"
              subtitle="เรียนต่อ"
              colors={['#AB47BC', '#E1BEE7']}
              onPress={() => navigation.navigate('LevelStage1')}
            />
            <QuickActionCard
              icon="chart-line"
              title="ความคืบหน้า"
              subtitle="ดูสถิติ"
              colors={['#42A5F5', '#90CAF9']}
              onPress={() => navigation.navigate('ProgressDashboard')}
            />
            <QuickActionCard
              icon="trophy"
              title="ความสำเร็จ"
              subtitle="ดูรางวัล"
              colors={['#FF9800', '#FFB74D']}
              onPress={() => navigation.navigate('Achievements')}
            />
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>ความท้าทายประจำวัน</Text>
          <TouchableOpacity 
            style={[styles.dailyChallenge, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('Quest')}
          >
            <View style={styles.challengeContent}>
              <MaterialCommunityIcons name="calendar-star" size={32} color={theme.primary} />
              <View style={styles.challengeText}>
                <Text style={[styles.challengeTitle, { color: theme.text }]}>
                  ภารกิจประจำวัน
                </Text>
                <Text style={[styles.challengeSubtitle, { color: theme.textSecondary }]}>
                  เรียน 10 นาทีเพื่อรับรางวัล
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>กิจกรรมล่าสุด</Text>
          <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#4ECDC4" />
              <Text style={[styles.activityText, { color: theme.text }]}>
                เสร็จสิ้นบทเรียน "พยัญชนะ ก-ฮ"
              </Text>
            </View>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD93D" />
              <Text style={[styles.activityText, { color: theme.text }]}>
                ได้รับ 50 XP
              </Text>
            </View>
            <View style={styles.activityItem}>
              <MaterialCommunityIcons name="fire" size={20} color="#FF6B6B" />
              <Text style={[styles.activityText, { color: theme.text }]}>
                Streak 3 วันติดต่อกัน
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientCard: {
    padding: 20,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
    textAlign: 'center',
  },
  dailyChallenge: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeText: {
    flex: 1,
    marginLeft: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  challengeSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    marginLeft: 12,
    fontSize: 14,
  },
  // Level box styles from LevelScreen
  levelBox: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  boxContent: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  catImage: { 
    width: 80, 
    height: 80, 
    marginRight: 15, 
    justifyContent: "center" 
  },
  textContainer: { 
    flex: 1 
  },
  levelText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  descriptionText: { 
    color: 'rgba(255, 255, 255, 0.9)', 
    fontSize: 14, 
    lineHeight: 18, 
    marginBottom: 15 
  },
  progressContainer: { 
    marginTop: 10 
  },
  progressBar: { 
    height: 6, 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 3, 
    overflow: 'hidden',
    marginBottom: 5
  },
  progressFill: { 
    height: '100%', 
    borderRadius: 3 
  },
  progressText: { 
    color: 'rgba(255, 255, 255, 0.8)', 
    fontSize: 12, 
    fontWeight: '500' 
  },
});

export default HomeScreen;
