import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';  // Import LinearGradient

const PasswordChangedScreen = () => {
  const navigation = useNavigation();
  const animationRef = useRef(null);

  const animationSource = require('../../assets/animations/check.json');

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const handleGoToLogin = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          source={animationSource}
          autoPlay={true}
          loop={false}
          style={styles.lottieAnimation}
          onAnimationFinish={() => {
            console.log('Lottie animation finished on PasswordChangedScreen!');
          }}
        />

        <Text style={styles.title}>Password Changed</Text>
        <Text style={styles.subtitle}>
          Your password has been successfully changed.{"\n"}You can now log in with your new password.
        </Text>

        <TouchableOpacity onPress={handleGoToLogin} style={styles.buttonContainer}>
          <LinearGradient
            colors={['#FFA500', '#FE8305']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  lottieAnimation: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FE8305",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#808080",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',  // ให้มุมโค้งทำงานกับ LinearGradient
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PasswordChangedScreen;
