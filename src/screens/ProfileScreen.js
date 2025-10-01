import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import authService from "../services/authService";

const ProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    total_xp: 0,
    level: 1,
    streak: 0,
    lessons_completed: 0,
    games_played: 0,
    total_time_spent: 0
  });

  useEffect(() => {
    // Get current user from auth service
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserStats({
        total_xp: currentUser.stats?.total_xp || 0,
        level: currentUser.stats?.level || 1,
        streak: currentUser.stats?.streak || 0,
        lessons_completed: currentUser.stats?.lessons_completed || 0,
        games_played: currentUser.stats?.games_played || 0,
        total_time_spent: currentUser.stats?.total_time_spent || 0
      });
    }
  }, []);

  // Mock data for demonstration
  const mockData = {
    fire: userStats.streak,
    diamonds: Math.floor(userStats.total_xp / 100),
    learningHours: Math.floor(userStats.total_time_spent / 60),
    currentLevel: `Level ${userStats.level}`,
    levels: [
      {
        name: `Level ${userStats.level}`,
        stages: [
          { correct: 8, total: 10 },
          { correct: 7, total: 10 },
          { correct: 9, total: 10 }
        ]
      }
    ]
  };

  // ✅ ดึงข้อมูลเลเวลปัจจุบัน
  const currentLevel = mockData.levels.find(
    (lvl) => lvl.name === mockData.currentLevel
  );

  // ✅ คำนวณค่าเฉลี่ย progress ของเลเวลปัจจุบัน
  const levelProgress =
    currentLevel?.stages?.length > 0
      ? currentLevel.stages.reduce(
          (acc, stage) => acc + stage.correct / stage.total,
          0
        ) / currentLevel.stages.length
      : 0;

  // ✅ คะแนนล่าสุดของด่าน (exercise)
  const latestStage =
    currentLevel?.stages?.length > 0
      ? currentLevel.stages[currentLevel.stages.length - 1]
      : null;

  const latestScore = latestStage
    ? (latestStage.correct / latestStage.total) * 100
    : 0;

  const StatCard = ({ icon, text, number, onPress }) => (
    <TouchableOpacity
      style={[
        styles.statCard,
        { backgroundColor: theme.card, shadowColor: theme.shadow },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statContent}>
        {icon && (
          <FontAwesome6
            name={icon}
            size={20}
            color={theme.primary}
            style={styles.statIcon}
          />
        )}
        {number !== undefined && (
          <Text style={[styles.statNumber, { color: theme.primary }]}>
            {number}
          </Text>
        )}
        <Text style={[styles.statLabel, { color: theme.text }]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* พื้นหลังด้านบน */}
      <View style={[styles.orangeBackground, { backgroundColor: theme.primary }]}>
        <TouchableOpacity
          style={styles.settingIcon}
          onPress={() => navigation.navigate("Settings")}
        >
          <FontAwesome6
            name="gear"
            size={20}
            color={theme.mode === "dark" ? "#333333ff" : theme.card}
          />
        </TouchableOpacity>
      </View>

      {/* กล่องโปรไฟล์ */}
      <View style={[styles.profileCard, { backgroundColor: theme.background }]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={
              user.profile?.avatar
                ? { uri: user.profile.avatar }
                : require("../../src/asset/catangry-Photoroom.png")
            }
            style={[styles.avatar, { borderColor: theme.primary }]}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
            style={[styles.editButton, { backgroundColor: theme.secondary }]}
          >
            <Text style={[styles.editText, { color: theme.primary }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.text }]}>
            {user.profile?.first_name && user.profile?.last_name 
              ? `${user.profile.first_name} ${user.profile.last_name}`
              : user.username
            }
          </Text>
          <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard icon="flag" text="Learn" />
          <StatCard
            text="เพื่อนทั้งหมด"
            number={user.social?.friends?.length || 0}
            onPress={() => navigation.navigate("MyFriends")}
          />
          <StatCard
            icon="user-plus"
            text="Add friends"
            onPress={() => navigation.navigate("AddFriend")}
          />
        </View>

        {/* Dashboard */}
        <View style={styles.dashboard}>
          <View style={styles.dashboardRow}>
            <Text style={[styles.dashboardItem, { color: theme.text }]}>
              🔥 {mockData.fire}
            </Text>
            <Text style={[styles.dashboardItem, { color: theme.text }]}>
              💎 {mockData.diamonds}
            </Text>
            <Text style={[styles.dashboardItem, { color: theme.text }]}>
              ⏰ {mockData.learningHours}
            </Text>
          </View>

          {/* ✅ Level Progress */}
          <View style={styles.progressBlock}>
            <Text style={{ color: theme.text, marginBottom: 6 }}>
              Level: {mockData.currentLevel}
            </Text>
            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(levelProgress * 100)}%` },
                ]}
              />
            </View>
            <Text style={{ color: theme.text }}>
              {Math.round(levelProgress * 100)}%
            </Text>
          </View>

          {/* ✅ Latest Exercise Score */}
          <View style={styles.progressBlock}>
            <Text style={{ color: theme.text, marginBottom: 6 }}>
              Latest Exercise
            </Text>
            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.round(latestScore)}%` },
                ]}
              />
            </View>
            <Text style={{ color: theme.text }}>
              {Math.round(latestScore)}%
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.primary }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: theme.card }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* คลื่น SVG */}
        <Svg
          height="190"
          width="120%"
          viewBox="0 0 1440 320"
          style={styles.wave}
        >
          <Path
            fill={theme.mode === "dark" ? "#000000ff" : theme.card}
            transform="scale(-1, -1) translate(-1440, -320)"
            d="M0,160L60,140C120,120,240,80,360,70C480,60,600,80,720,100C840,120,960,150,1080,160C1200,170,1320,150,1380,130L1440,110L1440,0L0,0Z"
          />
        </Svg>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orangeBackground: { height: 260 },
  wave: {
    position: "absolute",
    bottom: 600,
    left: 0,
    zIndex: 5,
  },
  profileCard: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: -30,
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  settingIcon: { position: "absolute", top: 65, right: 25 },
  avatarWrapper: {
    position: "relative",
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    marginTop: 2,
    zIndex: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    right: 120,
    top: -25,
    position: "relative",
  },
  editButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    position: "absolute",
    top: 14,
    right: 2,
    zIndex: 20,
  },
  editText: { fontWeight: "bold" },
  userInfo: { alignSelf: "flex-start", marginLeft: 40, marginTop: -40 },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { fontSize: 14 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    minHeight: 90,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  statContent: { alignItems: "center", justifyContent: "center", gap: 10 },
  statIcon: { marginBottom: 4 },
  statNumber: { fontWeight: "bold", fontSize: 18 },
  statLabel: { fontSize: 14, textAlign: "center", fontWeight: "600" },
  dashboard: {
    width: "100%",
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#ffffff20",
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dashboardItem: { fontSize: 16, fontWeight: "bold" },
  progressBlock: { marginBottom: 15 },
  progressBarWrapper: {
    width: "100%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: { height: "100%", backgroundColor: "#FF8C00" },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;