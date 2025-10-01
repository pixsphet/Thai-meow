import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"; // ✅ ใช้ MaterialCommunityIcons สำหรับ cube/puzzle
import { useTheme } from "../contexts/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

const icons = {
  Home: { active: "home", inactive: "home-outline", label: "Home", lib: Ionicons },
  "Treasure Chest": {
    active: "cube",
    inactive: "cube-outline",
    label: "Treasure Chest",
    lib: MaterialCommunityIcons,
  },
  Profile: { active: "account", inactive: "account-outline", label: "Profile", lib: MaterialCommunityIcons },
  Puzzle: { active: "puzzle", inactive: "puzzle-outline", label: "Daily Login", lib: MaterialCommunityIcons },
  Settings: { active: "settings", inactive: "settings-outline", label: "Settings", lib: Ionicons },
};

const TabItem = ({ route, isFocused, label, iconName, IconLib, onPress, theme }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.1 : 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.tab}
      android_ripple={{ color: theme.primary + "20", radius: 25, borderless: true }}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            backgroundColor: isFocused
              ? theme.mode === "dark"
                ? "#fff"
                : theme.primary
              : "transparent",
          },
        ]}
      >
        <IconLib
          name={iconName}
          size={24}
          color={
            isFocused
              ? theme.mode === "dark"
                ? theme.primary
                : "#fff"
              : theme.mode === "dark"
              ? theme.primary
              : theme.text + "60"
          }
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: isFocused
              ? theme.primary
              : theme.mode === "dark"
              ? theme.primary
              : theme.text + "60",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: state.index,
      friction: 10,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Animated.View
          style={[
            styles.slidingBackground,
            {
              backgroundColor: theme.primary + "10",
              borderColor: theme.primary + "30",
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: state.routes.map((_, i) => i),
                    outputRange: state.routes.map(
                      (_, i) => (screenWidth - 40) / state.routes.length * i + 10
                    ),
                  }),
                },
              ],
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconConfig = icons[route.name] || icons.Home; // fallback
          const iconName = isFocused ? iconConfig.active : iconConfig.inactive;
          const label = iconConfig.label;
          const IconLib = iconConfig.lib || Ionicons;

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              label={label}
              iconName={iconName}
              IconLib={IconLib}
              onPress={() => navigation.navigate(route.name)}
              theme={theme}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { paddingTop: 0 },
  container: {
    flexDirection: "row",
    height: 70,
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#dddddd46",
    borderRadius: 80,
  },
  slidingBackground: {
    position: "absolute",
    width: (screenWidth - 40) / 5 - 20,
    height: 44,
    borderRadius: 25,
    borderWidth: 1,
    zIndex: -1,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconContainer: { alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 25 },
  label: { fontSize: 12, textAlign: "center", fontWeight: "500" },
});

export default CustomTabBar;
