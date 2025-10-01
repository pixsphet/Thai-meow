import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { useUser } from '../contexts/UserContext';

const { width: screenWidth } = Dimensions.get('window');

const ProgressDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const {
    progress,
    loading,
    getTotalXP,
    getCurrentLevel,
    getCurrentStreak,
    getLevelProgressPercentage,
    getStatistics,
    getRecentGames,
    getAchievementCount,
    getPerfectScoreCount,
    getAverageScore,
    getTotalPlayTime,
    loadLeaderboard,
    leaderboard
  } = useProgress();

  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadLeaderboard(10);
  }, []);

  const StatCard = ({ icon, title, value, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );

  const ProgressBar = ({ percentage, color = theme.primary }) => (
    <View style={[styles.progressBar, { backgroundColor: theme.textSecondary + '20' }]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );

  const AchievementCard = ({ achievement }) => (
    <View style={[styles.achievementCard, { backgroundColor: theme.card }]}>
      <View style={[styles.achievementIcon, { backgroundColor: theme.primary + '20' }]}>
        <Ionicons name="trophy" size={20} color={theme.primary} />
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: theme.text }]}>
          {achievement.achievement_name}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.textSecondary }]}>
          {achievement.description}
        </Text>
        <Text style={[styles.achievementDate, { color: theme.textSecondary }]}>
          {new Date(achievement.unlocked_at).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  const LeaderboardItem = ({ item, index }) => (
    <View style={[styles.leaderboardItem, { backgroundColor: theme.card }]}>
      <View style={styles.leaderboardRank}>
        <Text style={[styles.rankNumber, { color: theme.text }]}>#{index + 1}</Text>
      </View>
      <View style={styles.leaderboardInfo}>
        <Text style={[styles.leaderboardName, { color: theme.text }]}>
          {item.username}
        </Text>
        <Text style={[styles.leaderboardStats, { color: theme.textSecondary }]}>
          Level {item.level} • {item.total_xp} XP
        </Text>
      </View>
      <View style={styles.leaderboardStreak}>
        <Ionicons name="flame" size={16} color="#FF6B6B" />
        <Text style={[styles.streakText, { color: theme.text }]}>{item.streak}</Text>
      </View>
    </View>
  );

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && { backgroundColor: theme.primary + '20' }
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: isActive ? theme.primary : theme.textSecondary }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPlayTime = getTotalPlayTime();
  const levelProgress = getLevelProgressPercentage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Progress Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Overview"
          isActive={selectedTab === 'overview'}
          onPress={() => setSelectedTab('overview')}
        />
        <TabButton
          title="Achievements"
          isActive={selectedTab === 'achievements'}
          onPress={() => setSelectedTab('achievements')}
        />
        <TabButton
          title="Leaderboard"
          isActive={selectedTab === 'leaderboard'}
          onPress={() => setSelectedTab('leaderboard')}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
            {/* Level Progress */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Level Progress</Text>
              <View style={[styles.levelCard, { backgroundColor: theme.card }]}>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelNumber, { color: theme.primary }]}>
                    Level {getCurrentLevel()}
                  </Text>
                  <Text style={[styles.levelXP, { color: theme.textSecondary }]}>
                    {getTotalXP()} XP
                  </Text>
                </View>
                <ProgressBar percentage={levelProgress} />
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                  {levelProgress}% to next level
                </Text>
              </View>
            </View>

            {/* Statistics Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Statistics</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  icon="fire"
                  title="Current Streak"
                  value={getCurrentStreak()}
                  subtitle="days"
                  color="#FF6B6B"
                />
                <StatCard
                  icon="time"
                  title="Play Time"
                  value={`${totalPlayTime.hours}h ${totalPlayTime.minutes}m`}
                  color="#4ECDC4"
                />
                <StatCard
                  icon="star"
                  title="Perfect Scores"
                  value={getPerfectScoreCount()}
                  color="#FFD93D"
                />
                <StatCard
                  icon="trending-up"
                  title="Average Score"
                  value={`${getAverageScore()}%`}
                  color="#6BCF7F"
                />
              </View>
            </View>

              {/* Achievements & Leaderboard */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements & Leaderboard</Text>
                
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={() => navigation.navigate('Achievements')}
                  >
                    <LinearGradient
                      colors={[theme.primary, theme.primary + 'CC']}
                      style={styles.actionButtonGradient}
                    >
                      <MaterialCommunityIcons name="trophy" size={20} color="white" />
                      <View style={styles.actionButtonText}>
                        <Text style={styles.actionButtonTitle}>Achievements</Text>
                        <Text style={styles.actionButtonSubtitle}>
                          {progress?.achievements?.length || 0} รายการ
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                    onPress={() => navigation.navigate('Leaderboard')}
                  >
                    <LinearGradient
                      colors={theme.gradients.sunset}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="podium" size={20} color="white" />
                      <View style={styles.actionButtonText}>
                        <Text style={styles.actionButtonTitle}>Leaderboard</Text>
                        <Text style={styles.actionButtonSubtitle}>
                          อันดับผู้เล่น
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
                    onPress={() => navigation.navigate('DailyChallenge')}
                  >
                    <LinearGradient
                      colors={theme.gradients.primary}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name="trophy" size={20} color="white" />
                      <View style={styles.actionButtonText}>
                        <Text style={styles.actionButtonTitle}>ความท้าทายรายวัน</Text>
                        <Text style={styles.actionButtonSubtitle}>
                          ภารกิจประจำวัน
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>

            {/* Recent Games */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Games</Text>
              {getRecentGames(5).map((game, index) => (
                <View key={index} style={[styles.gameItem, { backgroundColor: theme.card }]}>
                  <View style={styles.gameInfo}>
                    <Text style={[styles.gameName, { color: theme.text }]}>
                      {game.game_name}
                    </Text>
                    <Text style={[styles.gameDetails, { color: theme.textSecondary }]}>
                      {game.level_name} • {game.stage_name}
                    </Text>
                  </View>
                  <View style={styles.gameScore}>
                    <Text style={[styles.scoreText, { color: theme.primary }]}>
                      {game.score}/{game.max_score}
                    </Text>
                    <Text style={[styles.scoreDate, { color: theme.textSecondary }]}>
                      {new Date(game.played_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'achievements' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Achievements ({getAchievementCount()})
            </Text>
            {progress?.achievements?.length > 0 ? (
              progress.achievements.map((achievement, index) => (
                <AchievementCard key={index} achievement={achievement} />
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Ionicons name="trophy-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No achievements yet. Keep playing to unlock them!
                </Text>
              </View>
            )}
          </View>
        )}

        {selectedTab === 'leaderboard' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Leaderboard</Text>
            {leaderboard.length > 0 ? (
              leaderboard.map((item, index) => (
                <LeaderboardItem key={index} item={item} index={index} />
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                <Ionicons name="people-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No leaderboard data available
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  levelCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelXP: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (screenWidth - 52) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  gameDetails: {
    fontSize: 14,
  },
  gameScore: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scoreDate: {
    fontSize: 12,
  },
  achievementButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  achievementButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  achievementButtonText: {
    flex: 1,
    marginLeft: 12,
  },
  achievementButtonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementButtonSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    flex: 1,
    marginLeft: 8,
  },
  actionButtonTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtonSubtitle: {
    color: 'white',
    fontSize: 10,
    opacity: 0.8,
    marginTop: 1,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leaderboardRank: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  leaderboardStats: {
    fontSize: 14,
  },
  leaderboardStreak: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default ProgressDashboardScreen;
