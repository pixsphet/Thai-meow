import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Onboarding2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../src/asset/Onboarding2.jpg')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>"Learn Thai natively!"</Text>
      <Text style={styles.description}>
        Review vocabulary every day and listen to native speakers to pronounce correctly.
      </Text>

      <View style={styles.bottomNav}>
        {/* ปุ่มย้อนกลับ */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('Onboarding1')}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        {/* ปุ่มไปข้างหน้า */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('Onboarding3')}>
          <Icon name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
        {/* ปุ่มข้าม */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.skipText}>Skip</Text>
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
    width: 48,
    height: 50,
    borderRadius: 24,
    backgroundColor: '#FF8000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#FF8000',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

export default Onboarding2;