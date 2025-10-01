import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, setUser } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    name: user?.name || '',
    bio: user?.bio || '',
  });

  const handleSave = () => {
    // Update user data
    setUser(prevUser => ({
      ...prevUser,
      ...formData,
    }));
    
    Alert.alert('สำเร็จ', 'อัปเดตโปรไฟล์เรียบร้อยแล้ว', [
      { text: 'ตกลง', onPress: () => navigation.goBack() }
    ]);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>แก้ไขโปรไฟล์</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: theme.primary }]}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <Image
            source={
              user?.avatar
                ? user.avatar
                : require('../../src/asset/catangry-Photoroom.png')
            }
            style={[styles.avatar, { borderColor: theme.primary }]}
          />
          <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: theme.primary }]}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.changePhotoText}>เปลี่ยนรูป</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>ชื่อผู้ใช้</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.textSecondary + '30'
              }]}
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              placeholder="ชื่อผู้ใช้"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>อีเมล</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.textSecondary + '30'
              }]}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="อีเมล"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>ชื่อจริง</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.textSecondary + '30'
              }]}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="ชื่อจริง"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>เกี่ยวกับฉัน</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.textSecondary + '30'
              }]}
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              placeholder="บอกเกี่ยวกับตัวคุณ..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>สถิติการเรียนรู้</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {user?.stats?.streak || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Streak</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons name="star" size={24} color="#FFD93D" />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {user?.stats?.total_xp || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>XP</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Ionicons name="trophy" size={24} color="#6BCF7F" />
              <Text style={[styles.statValue, { color: theme.text }]}>
                {user?.stats?.level || 1}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Level</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    marginBottom: 15,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  changePhotoText: {
    color: 'white',
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default EditProfileScreen;
