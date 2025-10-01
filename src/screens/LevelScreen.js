import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const LevelScreen = () => {
    const navigation = useNavigation();

    const languageLevels = [
        {
            id: 'thai-consonants',
            level: 'พยัญชนะไทย ก-ฮ',
            description: 'เรียนรู้พยัญชนะพื้นฐาน 44 ตัว พร้อมภาพประกอบและเสียงอ่าน',
            color: '#FF6B6B', // สีแดง
            image: require('../asset/Grumpy Cat.png'),
            stageCount: 44,
            completedStages: 0,
        },
        {
            id: 'beginner',
            level: 'Level 1 - Beginner',
            description: 'เรียนรู้คำศัพท์พื้นฐาน การออกเสียง และประโยคง่ายๆ',
            color: '#2196F3', // สีฟ้า
            image: require('../asset/Grumpy Cat.png'),
            stageCount: 10,
            completedStages: 0,
        },
        {
            id: 'intermediate',
            level: 'Level 2 - Intermediate',
            description: 'พัฒนาทักษะการพูด ฟัง อ่าน เขียน สำหรับการใช้ในชีวิตประจำวัน',
            color: '#4CAF50', // สีเขียว
            image: require('../asset/happy.png'),
            stageCount: 10,
            completedStages: 0,
        },
        {
            id: 'advanced',
            level: 'Level 3 - Advanced',
            description: 'สำหรับผู้เชี่ยวชาญในสำนวน ไวยากรณ์ และการสนทนาที่ซับซ้อน',
            color: '#FF9800', // สีส้ม
            image: require('../asset/catcry-Photoroom.png'),
            stageCount: 10,
            completedStages: 0,
        },
    ];

    const handleLevelPress = (levelId) => {
        // Navigate ไปหน้า stage ที่ถูกต้องตาม level
        switch (levelId) {
            case 'thai-consonants':
                navigation.navigate('ThaiConsonants', { levelId });
                break;
            case 'beginner':
                navigation.navigate('LevelStage1', { levelId });
                break;
            case 'intermediate':
                navigation.navigate('LevelStage2', { levelId });
                break;
            case 'advanced':
                navigation.navigate('LevelStage3', { levelId });
                break;
            default:
                navigation.navigate('LevelStage1', { levelId });
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.title}>Your Thai Language Level</Text>

                {languageLevels.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.levelBox, { backgroundColor: item.color }]}
                        onPress={() => handleLevelPress(item.id)}
                    >
                        <View style={styles.boxContent}>
                            {item.image && <Image source={item.image} style={styles.catImage} />}
                            <View style={styles.textContainer}>
                                <Text style={styles.levelText}>{item.level}</Text>
                                <Text style={styles.descriptionText}>{item.description}</Text>
                                
                                {/* Progress Bar */}
                                <View style={styles.progressContainer}>
                                    <View style={styles.progressBar}>
                                        <View 
                                            style={[
                                                styles.progressFill, 
                                                { 
                                                    width: `${(item.completedStages / item.stageCount) * 100}%`,
                                                    backgroundColor: item.color
                                                }
                                            ]} 
                                        />
                                    </View>
                                    <Text style={styles.progressText}>
                                        {item.completedStages} / {item.stageCount} ด่าน
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F7F7' },
    scrollViewContent: { flexGrow: 1, alignItems: 'center', paddingTop: 20, paddingHorizontal: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#FF8C00', marginBottom: 30, marginTop: 60 },
    levelBox: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    boxContent: { flexDirection: 'row', alignItems: 'center' },
    catImage: { width: 120, height: 120, marginRight: 15, justifyContent: "center" },
    textContainer: { flex: 1 },
    levelText: { color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 5 },
    descriptionText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 18, lineHeight: 20, marginBottom: 15 },
    progressContainer: { marginTop: 10 },
    progressBar: { 
        height: 8, 
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        borderRadius: 4, 
        overflow: 'hidden',
        marginBottom: 5
    },
    progressFill: { 
        height: '100%', 
        borderRadius: 4 
    },
    progressText: { 
        color: 'rgba(255, 255, 255, 0.8)', 
        fontSize: 14, 
        fontWeight: '500' 
    },
});

export default LevelScreen;