import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ----- CustomAlert Component -----
const CustomAlert = ({ title, message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <View style={customAlertStyles.overlay}>
      <View style={customAlertStyles.alertContainer}>
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
    top: 0, left: 0, right: 0, bottom: 0,
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

    // shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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


const NewPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route?.params?.email || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // CustomAlert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleVerifyAndProceed = () => {
    if (!password || !confirmPassword) {
      showAlert("แจ้งเตือน", "กรุณากรอกรหัสผ่านและยืนยันรหัสผ่านให้ครบถ้วน");
      return;
    }

    if (password.length < 6) {
      showAlert("แจ้งเตือน", "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("แจ้งเตือน", "รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง");
      return;
    }

    // ถ้าผ่านหมด → ไปหน้าถัดไป
    navigation.navigate("PasswordChanged", { email });
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
        <Text style={styles.title}>Enter New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from{"\n"}previously used password.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            left={
              <TextInput.Icon
                icon={() => <FontAwesome name="lock" size={20} color="#808080" />}
              />
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#808080"
                  />
                )}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.textInput}
            theme={{
              roundness: 18,
              colors: {
                primary: "#1E90FF",
                background: "#ffffff",
                text: "#000000",
                placeholder: "#808080",
              },
            }}
          />

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            left={
              <TextInput.Icon
                icon={() => <FontAwesome name="lock" size={20} color="#808080" />}
              />
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome
                    name={showConfirmPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="#808080"
                  />
                )}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={styles.textInput}
            theme={{
              roundness: 18,
              colors: {
                primary: "#1E90FF",
                background: "#ffffff",
                text: "#000000",
                placeholder: "#808080",
              },
            }}
          />
        </View>

        <TouchableOpacity
          onPress={handleVerifyAndProceed}
          disabled={!password || !confirmPassword}
          style={[
            styles.verifyButton,
            (!password || !confirmPassword) && { opacity: 0.5 },
          ]}
        >
          <LinearGradient
            colors={["#FFA500", "#FE8305"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.verifyButtonText}>Verify and Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <CustomAlert
        title={alertTitle}
        message={alertMessage}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
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

    // shadow สำหรับ android และ iOS
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
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
    marginBottom: 20,
    textAlign: "center",
    marginTop: 5,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
    marginTop: 5,
  },
  textInput: {
  marginBottom: 15,
  backgroundColor: "#fff",  // ใช้สีขาวจะเห็นเงาชัดเจน
  elevation: 5,             // Android shadow depth
  shadowColor: "#aaa",      // iOS shadow color
  shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
  shadowOpacity: 0.25,      // iOS shadow opacity
  shadowRadius: 3.84,       // iOS shadow blur radius
  borderRadius: 12,         // มุมโค้งให้ดูสวยขึ้น
},

  verifyButton: {
    borderRadius: 25,
    width: "100%",
    marginTop: 20,
    overflow: "hidden", // ให้ LinearGradient มุมโค้งทำงาน
  },
  gradientButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default NewPasswordScreen;
