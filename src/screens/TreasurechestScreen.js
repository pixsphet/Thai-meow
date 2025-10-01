import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
// Mock data removed - using MongoDB Atlas data instead

// หน้านี้ยังแต่งไม่เสร็จ

const TreasurechestScreen = ({ route }) => {
  const [dailyProgress, setDailyProgress] = useState([]);
  const [diamonds, setDiamonds] = useState(0);
  const [learningHours, setLearningHours] = useState("0h 0m");

  // Load data from MongoDB Atlas instead of mock data
  useEffect(() => {
    loadDataFromAtlas();
  }, []);

  const loadDataFromAtlas = async () => {
    try {
      // Load user progress data from MongoDB Atlas
      // This would be implemented based on your user progress API
      console.log('Loading data from MongoDB Atlas...');
    } catch (error) {
      console.error('Error loading data from Atlas:', error);
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = route?.params?.username || "Guest";

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise((res) => setTimeout(res, 1500));
        const data = mockData;
        setDailyProgress(data.dailyProgress || []);
        setDiamonds(data.diamonds || 0);
        setLearningHours(data.learningHours || "0h 0m");
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color="#FE8305" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={{ color: "#ff0000", fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={require("../asset/Grumpy Cat.png")}
            style={[styles.avatar, { borderColor: "white" }]}
          />
          <Text style={styles.greetingText}>
            Hello, <Text style={styles.username}>{username}</Text>
          </Text>
        </View>

        {/* Daily Progress Section */}
        <View style={styles.dailyProgressSection}>
          <View style={styles.dateRow}>
            <Text style={styles.currentDateText}>Mon, 6 June</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{diamonds}</Text>
              <FontAwesome6 name="fire" size={20} color="#FE8305" />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dailyScroll}
          >
            {dailyProgress.map((item) => (
              <View key={item.day} style={styles.dayItem}>
                <TouchableOpacity
                  style={[
                    styles.dayBubble,
                    item.isActive
                      ? styles.activeDayBubble
                      : styles.inactiveDayBubble,
                  ]}
                >
                  <FontAwesome6
                    name="fire"
                    size={24}
                    color={item.isActive ? "white" : "#FE8305"}
                  />
                </TouchableOpacity>
                <Text
                  style={
                    item.isActive
                      ? styles.activeDayText
                      : styles.inactiveDayText
                  }
                >
                  {item.day}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Summary Cards Section */}
        <View style={styles.summaryCardsSection}>
          <View style={styles.card}>
            <FontAwesome6 name="gem" size={30} color="#000" />
            <Text style={styles.cardTitle}>Diamond</Text>
            <Text style={styles.cardValue}>{diamonds}</Text>
          </View>

          <View style={styles.card}>
            <FontAwesome6 name="graduation-cap" size={30} color="#000" />
            <Text style={styles.cardTitle}>Learning Hours</Text>
            <Text style={styles.cardValue}>{learningHours}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1, // เพิ่ม borderWidth เพื่อให้ borderColor ใช้งานได้
  },
  greetingText: {
    fontSize: 20,
    color: "#333",
  },
  username: {
    fontWeight: "bold",
    color: "#FE8305",
  },
  dailyProgressSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  currentDateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fe820556",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FE8305",
    marginRight: 5,
  },
  dailyScroll: {
    paddingVertical: 10,
  },
  dayItem: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  dayBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  activeDayBubble: {
    backgroundColor: "#FE8305",
  },
  inactiveDayBubble: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeDayText: {
    color: "#FE8305",
    fontWeight: "bold",
  },
  inactiveDayText: {
    color: "#808080",
  },
  summaryCardsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FE8305",
    marginTop: 5,
  },
});

export default TreasurechestScreen;
