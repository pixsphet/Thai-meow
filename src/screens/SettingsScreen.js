import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Modal,
    ScrollView,
    Animated,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';


/* -------------------- Custom Toggle Button -------------------- */
const CustomToggleButton = ({ enabled, toggle, type }) => {
    const togglePosition = useRef(new Animated.Value(enabled ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(togglePosition, {
            toValue: enabled ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [enabled, togglePosition]);

    const translateX = togglePosition.interpolate({
        inputRange: [0, 1],
        outputRange: [42, 2],
    });

    const gradientColors =
        type === 'theme'
            ? enabled
                ? ['#56c5e4ff', '#2E50B0']
                : ['#FFD700', '#FFA500']
            : enabled
                ? ['#4CAF50', '#68f46fff']
                : ['#ccc', '#999'];

    const iconLeft =
        type === 'theme' ? (
            <FontAwesome5
                name="sun"
                size={16}
                color="white"
                style={{ position: 'absolute', left: 8, zIndex: 1 }}
            />
        ) : (
            <FontAwesome5
                name="bell-slash"
                size={16}
                color="white"
                style={{ position: 'absolute', left: 8, zIndex: 1 }}
            />
        );

    const iconRight =
        type === 'theme' ? (
            <FontAwesome5
                name="moon"
                size={16}
                color="white"
                style={{ position: 'absolute', right: 8, zIndex: 1 }}
            />
        ) : (
            <FontAwesome5
                name="bell"
                size={16}
                color="white"
                style={{ position: 'absolute', right: 8, zIndex: 1 }}
            />
        );

    return (
        <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggle}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.toggleGradient}
            >
                <View style={styles.toggleInner}>
                    {enabled ? iconRight : iconLeft}
                    <Animated.View
                        style={[styles.toggleCircle, { transform: [{ translateX }] }]}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};


/* -------------------- Settings Screen -------------------- */
const SettingsScreen = () => {
    const navigation = useNavigation();
    const { darkTheme, toggleTheme, theme } = useTheme();
    const { user, logout } = useUser();

    const [notifications, setNotifications] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('TH');
    const [learningLevel, setLearningLevel] = useState('Beginner');
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const [contactExpanded, setContactExpanded] = useState(false);
    const contactAnimation = useRef(new Animated.Value(0)).current;

    const toggleContact = () => {
        setContactExpanded(!contactExpanded);
        Animated.timing(contactAnimation, {
            toValue: contactExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    // Adjusted outputRange to give more height for social icons
    const contactHeight = contactAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80], // Increased height from 60 to 80
    });

    const handleLogout = () => setLogoutModalVisible(true);
    const confirmLogout = async () => {
        setLogoutModalVisible(false);
        await logout();
        navigation.navigate('Login');
    };
    const cancelLogout = () => setLogoutModalVisible(false);
    const handleProfile = () => navigation.navigate('Profile');


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar
                barStyle={darkTheme ? 'light-content' : 'dark-content'}
                backgroundColor={theme.background}
            />

            {/* -------------------- Modal Logout -------------------- */}
            <Modal
                transparent
                visible={logoutModalVisible}
                animationType="fade"
                onRequestClose={cancelLogout}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>ออกจากระบบ</Text>
                        <Text style={[styles.modalMessage, { color: theme.text }]}>
                            คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={cancelLogout}
                            >
                                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.logoutConfirmButton]}
                                onPress={confirmLogout}
                            >
                                <Text style={styles.logoutConfirmText}>ออกจากระบบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* -------------------- Header -------------------- */}
            <View style={styles.header}>
                <View style={styles.statusContainer}>
                    <View style={{ flex: 1 }} />
                    <Text style={[styles.setupText, { color: theme.primary }]}>ตั้งค่า</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.finishedText, { color: '#3FE90B' }]}>เสร็จสิ้น</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                {/* -------------------- Account Section -------------------- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>บัญชีผู้ใช้</Text>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.card }]}
                        onPress={handleProfile}
                    >
                        <Text style={[styles.menuText, { color: theme.text }]}>โปรไฟล์</Text>
                        <Icon name="chevron-right" size={24} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* -------------------- Language & Level -------------------- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>ภาษาและระดับ</Text>

                    <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
                        <Text style={[styles.menuText, { color: theme.text }]}>ภาษาของแอพ</Text>
                        <View style={styles.languageContainer}>
                            {['EN', 'TH'].map((lang) => (
                                <TouchableOpacity
                                    key={lang}
                                    style={[
                                        styles.languageFlag,
                                        selectedLanguage === lang && styles.selectedLanguage,
                                    ]}
                                    onPress={() => setSelectedLanguage(lang)}
                                >
                                    <Text style={styles.flagText}>{lang === 'EN' ? '🇺🇸' : '🇹🇭'}</Text>
                                    <Text style={styles.langCode}>{lang}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
                        <Text style={[styles.menuText, { color: theme.text }]}>ระดับการเรียนรู้</Text>
                        <View style={styles.levelContainer}>
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.levelButton,
                                        learningLevel === level && styles.selectedLevel,
                                    ]}
                                    onPress={() => setLearningLevel(level)}
                                >
                                    <Text
                                        style={[
                                            styles.levelText,
                                            learningLevel === level && styles.selectedLevelText,
                                        ]}
                                    >
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* -------------------- Notifications & Theme -------------------- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>การแจ้งเตือนและธีม</Text>

                    <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
                        <Text style={[styles.menuText, { color: theme.text }]}>การแจ้งเตือน</Text>
                        <CustomToggleButton
                            enabled={notifications}
                            toggle={() => setNotifications(!notifications)}
                            type="notification"
                        />
                    </View>

                    <View style={[styles.menuItem, { backgroundColor: theme.card }]}>
                        <Text style={[styles.menuText, { color: theme.text }]}>โหมดธีม</Text>
                        <CustomToggleButton
                            enabled={darkTheme}
                            toggle={toggleTheme}
                            type="theme"
                        />
                    </View>
                </View>

                {/* -------------------- About App / Contact -------------------- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.primary }]}>เกี่ยวกับแอพ</Text>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.card }]}
                        onPress={toggleContact}
                    >
                        <Text style={[styles.menuText, { color: theme.text }]}>ติดต่อ</Text>
                        <Icon name={contactExpanded ? "expand-less" : "chevron-right"} size={24} color="#aaa" />
                    </TouchableOpacity>

                    <Animated.View style={{ height: contactHeight, overflow: 'hidden' }}>
                        <View style={styles.socialContainer}>
                            {['phone', 'facebook', 'email', 'more-horiz'].map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[styles.socialIcon, { backgroundColor: theme.card }]}
                                    onPress={() => alert(`คลิกที่ ${icon}`)}
                                >
                                    <Icon name={icon} size={24} color={theme.text} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                </View>

                {/* -------------------- Logout -------------------- */}
                <LinearGradient
                    colors={theme.gradients.sunset}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.logoutButton}
                >
                    <TouchableOpacity
                        onPress={handleLogout}
                        activeOpacity={0.8}
                        style={styles.logoutTouchable}
                    >
                        <Text style={styles.logoutText}>ออกจากระบบ</Text>
                    </TouchableOpacity>
                </LinearGradient>

            </ScrollView>
        </SafeAreaView>
    );
};


/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    header: {
        padding: 20,
        paddingTop: 60
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    setupText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1
    },

    finishedText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'right'
    },

    content: {
        flex: 1,
        paddingHorizontal: 20
    },

    section: {
        marginBottom: 12
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15
    },

    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },

    menuText: {
        fontSize: 16
    },

    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    languageFlag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    selectedLanguage: {
        backgroundColor: '#E3F2FD',
        borderColor: '#2196F3'
    },

    flagText: {
        fontSize: 16,
        marginRight: 4
    },

    langCode: {
        fontSize: 12,
        color: '#666'
    },

    levelContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },

    levelButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        marginBottom: 4,
        minWidth: 80,
        alignItems: 'center',
    },

    selectedLevel: {
        backgroundColor: '#FF8C00'
    },

    levelText: {
        fontSize: 12,
        color: '#666'
    },

    selectedLevelText: {
        color: '#fff',
        fontWeight: '700'
    },

    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
        paddingVertical: 10, // Added paddingVertical for better spacing
    },

    socialIcon: {
        padding: 12,
        borderRadius: 50,
        elevation: 2
    },

    logoutButton: {
        marginTop: 30,
        marginBottom: 60,
        borderRadius: 30,
        elevation: 6
    },

    logoutTouchable: {
        paddingVertical: 14,
        alignItems: 'center'
    },

    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalContainer: {
        width: '80%',
        borderRadius: 12,
        padding: 25,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center'
    },

    modalMessage: {
        fontSize: 16,
        marginBottom: 25,
        textAlign: 'center'
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    modalButton: {
        flex: 1,
        borderRadius: 25,
        paddingVertical: 12,
        marginHorizontal: 5,
        alignItems: 'center'
    },

    cancelButton: {
        backgroundColor: '#ddd'
    },

    cancelButtonText: {
        fontSize: 16,
        color: '#444'
    },

    logoutConfirmButton: {
        backgroundColor: '#FF8C00'
    },

    logoutConfirmText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '700'
    },

    toggleButton: {
        width: 80,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden'
    },

    toggleGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        position: 'relative'
    },

    toggleInner: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    toggleCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        position: 'absolute'
    },

});

export default SettingsScreen;





