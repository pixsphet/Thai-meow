import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import dailyChallengeService from '../services/dailyChallengeService';

const { width: screenWidth } = Dimensions.get('window');

const DailyChallengeScreen = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { getTotalXP, getCurrentLevel, getCurrentStreak } = useProgress();
  const navigation = useNavigation();
  
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeUntilNextDay, setTimeUntilNextDay] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    loadChallenges();
    loadStats();
    startTimer();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await dailyChallengeService.getTodaysChallenges();
      const formattedChallenges = response.data.map(challenge => 
        dailyChallengeService.formatChallengeData(challenge)
      );
      setChallenges(formattedChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await dailyChallengeService.getChallengeStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const startTimer = () => {
    const updateTimer = () => {
      const timeInfo = dailyChallengeService.getTimeUntilNextDay();
      setTimeUntilNextDay(timeInfo);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    
    return () => clearInterval(interval);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadChallenges(), loadStats()]);
    setRefreshing(false);
  };

  const handleChallengePress = (challenge) => {
    if (challenge.userProgress.is_completed) {
      if (!challenge.userProgress.rewards_claimed) {
        claimRewards(challenge.id);
      } else {
        Alert.alert('ความท้าทายเสร็จสิ้น', 'คุณได้รับรางวัลแล้ว!');
      }
    } else {
      // Navigate to appropriate game based on challenge type
      navigateToGame(challenge);
    }
  };

  const claimRewards = async (challengeId) => {
    try {
      await dailyChallengeService.claimChallengeRewards(challengeId);
      Alert.alert('สำเร็จ!', 'คุณได้รับรางวัลแล้ว!');
      loadChallenges();
      loadStats();
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถรับรางวัลได้');
    }
  };

  const navigateToGame = (challenge) => {
    // Navigate to appropriate game based on challenge categories
    if (challenge.categories.includes('basic_letters')) {
      navigation.navigate('ThaiConsonants');
    } else if (challenge.categories.includes('vowels')) {
      navigation.navigate('ThaiVowels');
    } else {
      navigation.navigate('ThaiConsonants'); // Default
    }
  };

  const ChallengeCard = ({ challenge }) => {
    const status = dailyChallengeService.getChallengeStatus(challenge);
    const statusColor = dailyChallengeService.getChallengeStatusColor(status);
    const statusText = dailyChallengeService.getChallengeStatusText(status);
    const difficultyColor = dailyChallengeService.getDifficultyColor(challenge.difficulty);
    const icon = dailyChallengeService.getChallengeIcon(challenge.type);

    return (
      <TouchableOpacity
        style={[
          styles.challengeCard,
          { backgroundColor: theme.card },
          status === 'completed' && styles.completedCard
        ]}
        onPress={() => handleChallengePress(challenge)}
      >
        <LinearGradient
          colors={status === 'completed' ? ['#4CAF50', '#45A049'] : [theme.card, theme.card]}
          style={styles.challengeGradient}
        >
          <View style={styles.challengeHeader}>
            <View style={styles.challengeTitleContainer}>
              <Ionicons name={icon} size={24} color={theme.primary} />
              <Text style={[styles.challengeTitle, { color: theme.text }]}>
                {challenge.title}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>

          <Text style={[styles.challengeDescription, { color: theme.textSecondary }]}>
            {challenge.description}
          </Text>

          <View style={styles.challengeProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${challenge.userProgress.progress_percentage}%`,
                    backgroundColor: statusColor
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {dailyChallengeService.formatProgressValue(challenge.type, challenge.userProgress.current_progress)} / {dailyChallengeService.formatProgressValue(challenge.type, challenge.targetValue)}
            </Text>
          </View>

          <View style={styles.challengeFooter}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Text style={styles.difficultyText}>
                {dailyChallengeService.getDifficultyDisplayName(challenge.difficulty)}
              </Text>
            </View>

            {challenge.rewards.xp_bonus > 0 && (
              <View style={styles.rewardContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.rewardText, { color: theme.text }]}>
                  +{challenge.rewards.xp_bonus} XP
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const StatsCard = () => {
    if (!stats) return null;

    return (
      <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>สถิติความท้าทาย</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.completed_challenges || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              เสร็จสิ้น
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {Math.round(stats.completion_rate || 0)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              อัตราเสร็จสิ้น
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.current_streak || 0}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Streak
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const TimerCard = () => {
    const isExpiringSoon = dailyChallengeService.isChallengeExpiringSoon();
    
    return (
      <View style={[
        styles.timerCard,
        { 
          backgroundColor: isExpiringSoon ? '#FF5722' : theme.primary,
          opacity: 0.9
        }
      ]}>
        <Ionicons name="time" size={20} color="white" />
        <Text style={styles.timerText}>
          {isExpiringSoon ? 'ใกล้หมดเวลา!' : 'เวลาที่เหลือ'}
        </Text>
        <Text style={styles.timerValue}>
          {timeUntilNextDay.hours}h {timeUntilNextDay.minutes}m
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>ความท้าทายรายวัน</Text>
        <TouchableOpacity
          onPress={onRefresh}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        {/* Timer Card */}
        <TimerCard />

        {/* Stats Card */}
        <StatsCard />

        {/* Challenges */}
        <View style={styles.challengesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            ความท้าทายวันนี้ ({challenges.length})
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.text }]}>
                กำลังโหลด...
              </Text>
            </View>
          ) : challenges.length > 0 ? (
            challenges.map((challenge, index) => (
              <ChallengeCard key={challenge.id || index} challenge={challenge} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={64}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                ไม่มีความท้าทายวันนี้
              </Text>
            </View>
          )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  timerValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  challengesSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  challengeCard: {
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  challengeProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DailyChallengeScreen;
