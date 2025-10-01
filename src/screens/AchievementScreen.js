import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const AchievementScreen = () => {
  const { theme } = useTheme();
  const { allAchievements, achievementStats, achievements } = useProgress();
  const navigation = useNavigation();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: 'apps' },
    { id: 'learning', name: 'การเรียนรู้', icon: 'book' },
    { id: 'streak', name: 'การเล่นติดต่อกัน', icon: 'fire' },
    { id: 'score', name: 'คะแนน', icon: 'star' },
    { id: 'level', name: 'ระดับ', icon: 'trending-up' },
    { id: 'game', name: 'เกม', icon: 'game-controller' },
    { id: 'time', name: 'เวลา', icon: 'time' },
    { id: 'special', name: 'พิเศษ', icon: 'diamond' }
  ];

  const rarities = [
    { id: 'all', name: 'ทั้งหมด', color: '#9E9E9E' },
    { id: 'common', name: 'ธรรมดา', color: '#4CAF50' },
    { id: 'uncommon', name: 'ไม่ธรรมดา', color: '#2196F3' },
    { id: 'rare', name: 'หายาก', color: '#FF9800' },
    { id: 'epic', name: 'มหากาพย์', color: '#9C27B0' },
    { id: 'legendary', name: 'ตำนาน', color: '#F44336' }
  ];

  const filteredAchievements = allAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    const unlockedMatch = !showUnlockedOnly || achievements.some(a => a.achievement_id === achievement.achievement_id);
    
    return categoryMatch && rarityMatch && unlockedMatch;
  });

  const getRarityColor = (rarity) => {
    const rarityData = rarities.find(r => r.id === rarity);
    return rarityData ? rarityData.color : '#9E9E9E';
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData ? categoryData.icon : 'help-circle';
  };

  const AchievementCard = ({ achievement, isUnlocked }) => {
    const unlockedAchievement = achievements.find(a => a.achievement_id === achievement.achievement_id);
    
    return (
      <View style={[
        styles.achievementCard,
        { backgroundColor: theme.card },
        isUnlocked && styles.unlockedCard
      ]}>
        <View style={[
          styles.achievementIcon,
          { backgroundColor: isUnlocked ? achievement.color + '20' : theme.textSecondary + '20' }
        ]}>
          <MaterialCommunityIcons
            name={achievement.icon}
            size={32}
            color={isUnlocked ? achievement.color : theme.textSecondary}
          />
        </View>
        
        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Text style={[
              styles.achievementName,
              { color: isUnlocked ? theme.text : theme.textSecondary }
            ]}>
              {achievement.name}
            </Text>
            <View style={[
              styles.rarityBadge,
              { backgroundColor: getRarityColor(achievement.rarity) + '20' }
            ]}>
              <Text style={[
                styles.rarityText,
                { color: getRarityColor(achievement.rarity) }
              ]}>
                {rarities.find(r => r.id === achievement.rarity)?.name}
              </Text>
            </View>
          </View>
          
          <Text style={[
            styles.achievementDescription,
            { color: isUnlocked ? theme.textSecondary : theme.textSecondary + '80' }
          ]}>
            {achievement.description}
          </Text>
          
          <View style={styles.achievementFooter}>
            <View style={styles.pointsContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.pointsText, { color: theme.text }]}>
                {achievement.points} คะแนน
              </Text>
            </View>
            
            {isUnlocked && unlockedAchievement && (
              <Text style={[styles.unlockedDate, { color: theme.textSecondary }]}>
                ปลดล็อกเมื่อ {new Date(unlockedAchievement.unlocked_at).toLocaleDateString('th-TH')}
              </Text>
            )}
          </View>
        </View>
        
        {isUnlocked && (
          <View style={styles.unlockedBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
        )}
      </View>
    );
  };

  const CategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.filterButton,
            { backgroundColor: selectedCategory === category.id ? theme.primary : theme.card },
            selectedCategory === category.id && styles.activeFilterButton
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Ionicons
            name={category.icon}
            size={20}
            color={selectedCategory === category.id ? 'white' : theme.text}
          />
          <Text style={[
            styles.filterText,
            { color: selectedCategory === category.id ? 'white' : theme.text }
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const RarityFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {rarities.map(rarity => (
        <TouchableOpacity
          key={rarity.id}
          style={[
            styles.rarityFilterButton,
            { backgroundColor: selectedRarity === rarity.id ? rarity.color : theme.card },
            selectedRarity === rarity.id && styles.activeRarityFilterButton
          ]}
          onPress={() => setSelectedRarity(rarity.id)}
        >
          <View style={[
            styles.rarityDot,
            { backgroundColor: rarity.color }
          ]} />
          <Text style={[
            styles.rarityFilterText,
            { color: selectedRarity === rarity.id ? 'white' : theme.text }
          ]}>
            {rarity.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const StatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.statsTitle, { color: theme.text }]}>สถิติ Achievement</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {achievementStats?.totalUnlocked || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            ปลดล็อกแล้ว
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {achievementStats?.totalAvailable || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            ทั้งหมด
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {achievementStats?.completionRate || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            ความสำเร็จ
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FFD700' }]}>
            {achievementStats?.totalPoints || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            คะแนนรวม
          </Text>
        </View>
      </View>
    </View>
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
        <Text style={[styles.title, { color: theme.text }]}>Achievements</Text>
        <TouchableOpacity
          onPress={() => setShowUnlockedOnly(!showUnlockedOnly)}
          style={styles.filterToggle}
        >
          <Ionicons
            name={showUnlockedOnly ? "eye-off" : "eye"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Card */}
        <StatsCard />

        {/* Category Filter */}
        <CategoryFilter />

        {/* Rarity Filter */}
        <RarityFilter />

        {/* Achievements List */}
        <View style={styles.achievementsList}>
          {filteredAchievements.map((achievement) => {
            const isUnlocked = achievements.some(a => a.achievement_id === achievement.achievement_id);
            return (
              <AchievementCard
                key={achievement.achievement_id}
                achievement={achievement}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </View>

        {filteredAchievements.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              ไม่พบ Achievement ที่ตรงกับเงื่อนไข
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
  filterToggle: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 15,
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
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  filterContainer: {
    marginVertical: 10,
  },
  filterContent: {
    paddingHorizontal: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  rarityFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  activeRarityFilterButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  rarityFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  achievementsList: {
    paddingBottom: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  unlockedCard: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  achievementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  unlockedDate: {
    fontSize: 10,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default AchievementScreen;