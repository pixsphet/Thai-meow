import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Onboarding3 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../src/asset/Onboarding3.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>"Gamify Your Thai Learning!"</Text>
      <Text style={styles.description}>
        Hangman, pick a picture, compete with friends – increase motivation to learn
      </Text>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('Onboarding2')}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: '#FF8000', paddingHorizontal: 16 }]}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.startText}>Let's get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 100,
  },
  image: {
    width: 350,
    height: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 48,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 50,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    height: 50,
    borderRadius: 24,
    backgroundColor: '#FF8000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minWidth: 48,
  },
  startText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Onboarding3;