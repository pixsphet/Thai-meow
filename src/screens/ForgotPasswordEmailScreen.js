import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// ----- CustomAlert Component -----
const CustomAlert = ({ title, message, visible, onClose, imageSource }) => {
  if (!visible) return null;

  return (
    <View style={customAlertStyles.overlay}>
      <View style={customAlertStyles.alertContainer}>
        {imageSource && (
          <Image source={imageSource} style={customAlertStyles.alertImage} />
        )}
        <Text style={customAlertStyles.alertTitle}>{title}</Text>
        <Text style={customAlertStyles.alertMessage}>{message}</Text>
        <TouchableOpacity
          onPress={onClose}
          style={{ width: "100%", borderRadius: 25, overflow: "hidden" }}
        >
          <LinearGradient
            colors={["#FFA500", "#FE8305"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={customAlertStyles.alertButton}
          >
            <Text style={customAlertStyles.alertButtonText}>OK</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const customAlertStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  alertContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    padding: 25,
    width: "80%",
    alignItems: "center",
    elevation: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  alertImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    paddingVertical: 13,
    alignItems: "center",
    borderRadius: 25,
  },
  alertButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
// ----- End CustomAlert -----

const ForgotPasswordEmailScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  // CustomAlert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertImage, setAlertImage] = useState(null);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleNext = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showAlert("แจ้งเตือน", "กรุณากรอกอีเมล");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showAlert("แจ้งเตือน", "รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    navigation.navigate("OTP", { email: trimmedEmail });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.head}>Forgot Password</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Mail Address Here</Text>
        <Text style={styles.subtitle}>
          Enter the email address associated with your account.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            left={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome name="envelope" size={20} color="gray" />
                )}
              />
            }
            style={styles.textInput}
            theme={{ roundness: 18 }}
            outlineColor="#E0E0E0"
            activeOutlineColor="#1CB0F6"
          />
        </View>

        <LinearGradient
          colors={["#FFA500", "#FE8305"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.nextButtonGradient, !email.trim() && { opacity: 0.5 }]}
        >
          <TouchableOpacity
            onPress={handleNext}
            disabled={!email.trim()}
            style={styles.touchableOverlay}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Custom Alert */}
      <CustomAlert
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        imageSource={alertImage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FE8305",
    position: "relative",
  },
  headerContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  head: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 120,
    padding: 20,
    paddingTop: 200,
    alignItems: "center",
    marginTop: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FE8305",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#808080",
    marginBottom: 10,
    textAlign: "center",
    marginTop: -2,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
    marginTop: 5,
  },
  textInput: {
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 16,
    borderRadius: 18,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: "#FE8305",
    borderRadius: 25,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextButtonGradient: {
    width: "100%",
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  touchableOverlay: {
    paddingVertical: 15,
    alignItems: "center",
  },
});

export default ForgotPasswordEmailScreen;
