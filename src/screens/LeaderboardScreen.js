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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import leaderboardService from '../services/leaderboardService';

const { width: screenWidth } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { getTotalXP, getCurrentLevel, getCurrentStreak } = useProgress();
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('total_xp');

  const tabs = [
    { id: 'global', name: 'รวม', icon: 'globe' },
    { id: 'weekly', name: 'รายสัปดาห์', icon: 'calendar' },
    { id: 'friends', name: 'เพื่อน', icon: 'people' },
  ];

  const sortOptions = [
    { id: 'total_xp', name: 'XP รวม', icon: 'star' },
    { id: 'level', name: 'ระดับ', icon: 'trending-up' },
    { id: 'streak', name: 'Streak', icon: 'fire' },
    { id: 'games_played', name: 'เกมที่เล่น', icon: 'game-controller' },
  ];

  useEffect(() => {
    loadLeaderboardData();
    if (user?.id) {
      loadUserRank();
    }
  }, [activeTab, sortBy, user?.id]);

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (activeTab) {
        case 'global':
          data = await leaderboardService.getGlobalLeaderboard(50, sortBy);
          break;
        case 'weekly':
          data = await leaderboardService.getWeeklyLeaderboard(50);
          break;
        case 'friends':
          data = await leaderboardService.getFriendsLeaderboard(user?.id, 20);
          break;
        default:
          data = { data: [] };
      }
      
      setLeaderboardData(leaderboardService.formatLeaderboardData(data.data || []));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRank = async () => {
    try {
      const rankData = await leaderboardService.getUserRank(user.id, sortBy);
      setUserRank(rankData.data);
    } catch (error) {
      console.error('Error loading user rank:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeaderboardData();
    if (user?.id) {
      await loadUserRank();
    }
    setRefreshing(false);
  };

  const LeaderboardItem = ({ item, index }) => {
    const isCurrentUser = item.userId === user?.id;
    const rankColor = leaderboardService.getRankBadgeColor(item.rank);
    const rankEmoji = leaderboardService.getRankEmoji(item.rank);

    return (
      <View style={[
        styles.leaderboardItem,
        { backgroundColor: isCurrentUser ? theme.primary + '20' : theme.card },
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankContainer}>
          <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
            <Text style={styles.rankText}>{item.rank}</Text>
          </View>
          <Text style={styles.rankEmoji}>{rankEmoji}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={[
            styles.username,
            { color: isCurrentUser ? theme.primary : theme.text }
          ]}>
            {item.username}
          </Text>
          <Text style={[styles.userDetails, { color: theme.textSecondary }]}>
            Level {item.level} • {leaderboardService.formatXP(item.totalXp)} XP
          </Text>
        </View>

        <View style={styles.statsContainer}>
          {activeTab === 'weekly' ? (
            <Text style={[styles.statValue, { color: theme.text }]}>
              {leaderboardService.formatXP(item.weeklyXp)}
            </Text>
          ) : (
            <Text style={[styles.statValue, { color: theme.text }]}>
              {leaderboardService.formatXP(item.totalXp)}
            </Text>
          )}
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            {activeTab === 'weekly' ? 'XP สัปดาห์' : 'XP รวม'}
          </Text>
        </View>
      </View>
    );
  };

  const UserRankCard = () => {
    if (!userRank) return null;

    return (
      <View style={[styles.userRankCard, { backgroundColor: theme.card }]}>
        <View style={styles.userRankHeader}>
          <Ionicons name="person" size={24} color={theme.primary} />
          <Text style={[styles.userRankTitle, { color: theme.text }]}>อันดับของคุณ</Text>
        </View>
        
        <View style={styles.userRankStats}>
          <View style={styles.userRankStat}>
            <Text style={[styles.userRankValue, { color: theme.primary }]}>
              #{userRank.rank}
            </Text>
            <Text style={[styles.userRankLabel, { color: theme.textSecondary }]}>
              อันดับ
            </Text>
          </View>
          
          <View style={styles.userRankStat}>
            <Text style={[styles.userRankValue, { color: theme.primary }]}>
              {userRank.percentile}%
            </Text>
            <Text style={[styles.userRankLabel, { color: theme.textSecondary }]}>
              เปอร์เซ็นต์
            </Text>
          </View>
          
          <View style={styles.userRankStat}>
            <Text style={[styles.userRankValue, { color: theme.primary }]}>
              {userRank.totalUsers}
            </Text>
            <Text style={[styles.userRankLabel, { color: theme.textSecondary }]}>
              ผู้เล่นทั้งหมด
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const TabButton = ({ tab }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: activeTab === tab.id ? theme.primary : theme.card },
        activeTab === tab.id && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(tab.id)}
    >
      <Ionicons
        name={tab.icon}
        size={20}
        color={activeTab === tab.id ? 'white' : theme.text}
      />
      <Text style={[
        styles.tabText,
        { color: activeTab === tab.id ? 'white' : theme.text }
      ]}>
        {tab.name}
      </Text>
    </TouchableOpacity>
  );

  const SortButton = ({ option }) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        { backgroundColor: sortBy === option.id ? theme.primary : theme.card },
        sortBy === option.id && styles.activeSortButton
      ]}
      onPress={() => setSortBy(option.id)}
    >
      <Ionicons
        name={option.icon}
        size={16}
        color={sortBy === option.id ? 'white' : theme.text}
      />
      <Text style={[
        styles.sortText,
        { color: sortBy === option.id ? 'white' : theme.text }
      ]}>
        {option.name}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={[styles.title, { color: theme.text }]}>Leaderboard</Text>
        <TouchableOpacity
          onPress={onRefresh}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* User Rank Card */}
      <UserRankCard />

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map(tab => (
          <TabButton key={tab.id} tab={tab} />
        ))}
      </ScrollView>

      {/* Sort Options */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortContainer}
        contentContainerStyle={styles.sortContent}
      >
        {sortOptions.map(option => (
          <SortButton key={option.id} option={option} />
        ))}
      </ScrollView>

      {/* Leaderboard */}
      <ScrollView
        style={styles.leaderboardContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.text }]}>
              กำลังโหลด...
            </Text>
          </View>
        ) : leaderboardData.length > 0 ? (
          leaderboardData.map((item, index) => (
            <LeaderboardItem key={item.userId || index} item={item} index={index} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              ไม่มีข้อมูล Leaderboard
            </Text>
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
  userRankCard: {
    margin: 15,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userRankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userRankStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userRankStat: {
    alignItems: 'center',
  },
  userRankValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRankLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  tabsContainer: {
    marginVertical: 10,
  },
  tabsContent: {
    paddingHorizontal: 15,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  sortContainer: {
    marginBottom: 10,
  },
  sortContent: {
    paddingHorizontal: 15,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  activeSortButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sortText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankEmoji: {
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
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

export default LeaderboardScreen;