import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
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

const OTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) text = text.charAt(0);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== "" && index < 3) inputRefs[index + 1].current.focus();
    if (text === "" && index > 0) inputRefs[index - 1].current.focus();
    if (index === 3 && text !== "") Keyboard.dismiss();
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerifyAndProceed = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) {
      showAlert("แจ้งเตือน", "กรุณากรอกรหัส OTP ให้ครบ 4 หลัก");
      return;
    }

    showAlert("ยืนยัน OTP", `OTP ที่กรอก: ${fullOtp}\nอีเมล: ${email}`);
    navigation.navigate("NewPassword", { email });
  };

  const handleResendCode = () => {
    showAlert("ส่งรหัสใหม่", "ได้ส่งรหัส OTP ใหม่ (จำลอง) ไปยังอีเมลของคุณแล้ว");
    setOtp(["", "", "", ""]);
    inputRefs[0].current.focus();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.head}>Forgot Password</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Get Your Code</Text>
        <Text style={styles.subtitle}>
          Please enter the 4 digit code that{"\n"}sent to your email address.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              mode="outlined"
              theme={{
                roundness: 18,
                colors: {
                  primary: "#1E90FF",
                  background: "#ffffff",
                  text: "#000000",
                  placeholder: "#808080",
                },
              }}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>If you don't receive code! </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
  colors={["#FFA500", "#FE8305"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={[
    styles.verifyButtonGradient,
    otp.join("").length !== 4 && { opacity: 0.5 }
  ]}
>
  <TouchableOpacity
    onPress={handleVerifyAndProceed}
    disabled={otp.join("").length !== 4}
    style={styles.verifyTouchable}
    activeOpacity={0.8}
  >
    <Text style={styles.verifyButtonText}>Verify and Proceed</Text>
  </TouchableOpacity>
</LinearGradient>

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
    paddingTop: 160,
    alignItems: "center",
    marginTop: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FE8305",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: "#808080",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 0,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 30,
  },
  resendText: {
    color: "#808080",
    fontSize: 14,
  },
  resendLink: {
    color: "#FE8305",
    fontSize: 14,
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#FE8305",
    borderRadius: 25,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  verifyButtonGradient: {
  width: "100%",
  borderRadius: 25,
  marginBottom: 10,
},
verifyTouchable: {
  paddingVertical: 15,
  alignItems: "center",
},

});

export default OTPScreen;
