import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { DESIGN_SYSTEM, COMMON_STYLES } from '../config/designSystem';
import { speakThai } from '../services/speechService';

import LevelStage1 from './LevelStage1';
import QuestScreen from './QuestScreen';
import TreasurechestScreen from './TreasurechestScreen';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen'; 


const { width } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

// Custom Tab Icon Component
const CustomTabIcon = ({ route, focused, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const getTabConfig = (routeName) => {
    switch (routeName) {
      case 'LevelStage1':
        return {
          icon: '🏠',
          label: 'หน้าแรก',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.primary, DESIGN_SYSTEM.colors.primaryLight],
        };
      case 'Quest':
        return {
          icon: '📋',
          label: 'ภารกิจ',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.accent, DESIGN_SYSTEM.colors.accentLight],
        };
      case 'Treasure':
        return {
          icon: '🎁',
          label: 'สมบัติ',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.secondary, DESIGN_SYSTEM.colors.secondaryLight],
        };
      case 'Profile':
        return {
          icon: '👤',
          label: 'โปรไฟล์',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.gray[600], DESIGN_SYSTEM.colors.gray[500]],
        };
      case 'Settings':
        return {
          icon: '⚙️',
          label: 'ตั้งค่า',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.gray[700], DESIGN_SYSTEM.colors.gray[600]],
        };
      default:
        return {
          icon: '❓',
          label: 'อื่นๆ',
          lottie: require('../asset/animations/check.json'),
          gradient: [DESIGN_SYSTEM.colors.gray[400], DESIGN_SYSTEM.colors.gray[300]],
        };
    }
  };

  const config = getTabConfig(route.name);

  const handlePress = async () => {
    await speakThai(config.label, { rate: 0.8 });
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.tabIconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {focused && (
          <Animated.View
            style={[
              styles.activeBackground,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <LinearGradient
              colors={config.gradient}
              style={styles.activeGradient}
            />
          </Animated.View>
        )}
        
        <View style={styles.iconWrapper}>
          <Text style={styles.tabIcon}>{config.icon}</Text>
        </View>
        
        <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
          {config.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MainTab = () => {
  const [userData, setUserData] = useState({
    xp: 0,
    streak: 0,
    level: 1,
    gems: 0,
  });

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load from AsyncStorage or API
      // For now, use mock data
      setUserData({
        xp: 150,
        streak: 3,
        level: 1,
        gems: 25,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <CustomTabIcon
            route={route}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
          />
        ),
      })}
    >
      <Tab.Screen 
        name="LevelStage1" 
        component={LevelStage1}
        options={{
          tabBarAccessibilityLabel: 'หน้าแรก',
        }}
      />
      <Tab.Screen 
        name="Quest" 
        component={QuestScreen}
        options={{
          tabBarAccessibilityLabel: 'ภารกิจ',
        }}
      />
      <Tab.Screen 
        name="Treasure" 
        component={TreasurechestScreen}
        options={{
          tabBarAccessibilityLabel: 'สมบัติ',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarAccessibilityLabel: 'โปรไฟล์',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarAccessibilityLabel: 'ตั้งค่า',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    backgroundColor: '#FF8000',
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius['3xl'],
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius['3xl'],
    position: 'absolute',
    borderTopWidth: 0,
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg,
    paddingTop: DESIGN_SYSTEM.spacing.md,
    paddingBottom: DESIGN_SYSTEM.spacing.lg,
    ...DESIGN_SYSTEM.shadows.lg,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
  },
  activeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
  },
  activeGradient: {
    flex: 1,
    borderRadius: DESIGN_SYSTEM.borderRadius.lg,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.xs,
  },
  tabIcon: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xl,
  },
  tabLabel: {
    fontSize: DESIGN_SYSTEM.typography.fontSize.xs,
    color: DESIGN_SYSTEM.colors.text.secondary,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.medium,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: DESIGN_SYSTEM.colors.white,
    fontWeight: DESIGN_SYSTEM.typography.fontWeight.bold,
  },
});

export default MainTab;
