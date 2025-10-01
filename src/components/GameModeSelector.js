import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const GameModeSelector = ({ onModeSelect, currentCategory = 'consonants' }) => {
  const { theme } = useTheme();

  const gameModes = [
    {
      id: 'lesson',
      title: 'บทเรียน',
      subtitle: 'เรียนรู้พื้นฐาน',
      icon: 'book-open-variant',
      colors: ['#4CAF50', '#45a049'],
      description: 'เรียนรู้พยัญชนะ สระ และวรรณยุกต์'
    },
    {
      id: 'matching',
      title: 'จับคู่',
      subtitle: 'จับคู่ตัวอักษร',
      icon: 'puzzle',
      colors: ['#2196F3', '#1976D2'],
      description: 'จับคู่ตัวอักษรกับเสียง'
    },
    {
      id: 'multiple',
      title: 'เลือกคำตอบ',
      subtitle: 'ฟังเสียงเลือกตัวอักษร',
      icon: 'help-circle',
      colors: ['#FF9800', '#F57C00'],
      description: 'ฟังเสียงแล้วเลือกตัวอักษรที่ถูกต้อง'
    },
    {
      id: 'fill',
      title: 'เติมคำ',
      subtitle: 'เติมตัวอักษรที่หายไป',
      icon: 'pencil',
      colors: ['#9C27B0', '#7B1FA2'],
      description: 'เติมตัวอักษรในลำดับที่ถูกต้อง'
    },
    {
      id: 'order',
      title: 'เรียงลำดับ',
      subtitle: 'เรียงตัวอักษรตามลำดับ',
      icon: 'sort',
      colors: ['#E91E63', '#C2185B'],
      description: 'เรียงตัวอักษรตามลำดับ ก-ฮ'
    },
    {
      id: 'quiz',
      title: 'แบบทดสอบ',
      subtitle: 'ทดสอบความรู้ทั้งหมด',
      icon: 'school',
      colors: ['#F44336', '#D32F2F'],
      description: 'ทดสอบความรู้แบบรวมทุกแบบ'
    }
  ];

  const getCategoryTitle = () => {
    switch (currentCategory) {
      case 'consonants':
        return 'พยัญชนะไทย ก-ฮ';
      case 'vowels':
        return 'สระไทย';
      case 'tones':
        return 'วรรณยุกต์ไทย';
      default:
        return 'พยัญชนะไทย ก-ฮ';
    }
  };

  const getCategoryIcon = () => {
    switch (currentCategory) {
      case 'consonants':
        return 'alphabetical';
      case 'vowels':
        return 'format-letter-case';
      case 'tones':
        return 'music-note';
      default:
        return 'alphabetical';
    }
  };

  const GameModeCard = ({ mode, index }) => (
    <TouchableOpacity
      style={styles.gameModeCard}
      onPress={() => onModeSelect(mode.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={mode.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={mode.icon}
              size={32}
              color="white"
            />
          </View>
          <Text style={styles.cardTitle}>{mode.title}</Text>
          <Text style={styles.cardSubtitle}>{mode.subtitle}</Text>
          <Text style={styles.cardDescription}>{mode.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.categoryIcon, { backgroundColor: theme.primary + '20' }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon()}
            size={32}
            color={theme.primary}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.categoryTitle, { color: theme.text }]}>
            {getCategoryTitle()}
          </Text>
          <Text style={[styles.categorySubtitle, { color: theme.textSecondary }]}>
            เลือกโหมดการเล่น
          </Text>
        </View>
      </View>

      {/* Game Modes Grid */}
      <View style={styles.gameModesGrid}>
        {gameModes.map((mode, index) => (
          <GameModeCard key={mode.id} mode={mode} index={index} />
        ))}
      </View>

      {/* Tips */}
      <View style={[styles.tipsContainer, { backgroundColor: theme.card }]}>
        <MaterialCommunityIcons
          name="lightbulb"
          size={20}
          color={theme.primary}
        />
        <Text style={[styles.tipsText, { color: theme.text }]}>
          💡 แนะนำ: เริ่มจาก "บทเรียน" เพื่อเรียนรู้พื้นฐานก่อนเล่นเกม
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 16,
  },
  gameModesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 30,
  },
  gameModeCard: {
    width: (screenWidth - 55) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
    minHeight: 160,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  cardDescription: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 16,
  },
  tipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipsText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default GameModeSelector;
