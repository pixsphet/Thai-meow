import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    Dimensions, 
    Image,
    ScrollView
} from 'react-native'; 	
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../services/apiClient';
// import vocabularyService from '../services/vocabularyService'; // Removed - using vocabWordService instead
import vocabWordService from '../services/vocabWordService';
import lessonService from '../services/lessonService';
import vaja9TtsService from '../services/vaja9TtsService';

const { width } = Dimensions.get('window');

// --------------------------
// Header Component
// --------------------------
const HeaderComponent = ({ total, current, onClose, hearts = 5 }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome6 name="xmark" size={26} color="#777" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
            <View 
                style={[
                    styles.progressFill, 
                    { width: `${(current / total) * 100}%`,
                    backgroundColor: "#FE8305" 
                }]}
            />
        </View>
        <View style={styles.heartContainer}>
            <FontAwesome name="heart" size={18} color="#ff4757" />
            <Text style={styles.heartText}>{hearts}</Text>
        </View>
    </View>
);

// --------------------------
// Cat Character
// --------------------------
const CatCharacter = () => (
    <View style={styles.catContainer}>
        <Image 
            source={require('../asset/Catsmile1.png')} 
            style={[styles.catImage, { width: 118, height: 118 }]} 
            resizeMode="contain"
        />
    </View>
);

// --------------------------
// AudioButton with AI TTS
// --------------------------
const AudioButton = ({ onPress, size = 50, text = '' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef(null);

    const handlePress = async () => {
        if (isPlaying) return;
        
        setIsPlaying(true);
        animationRef.current?.play();

        // Use AI TTS service
        try {
            if (text && text.trim() !== '') {
                console.log('🎤 Playing audio for text:', text);
                await vaja9TtsService.playThai(text);
            } else {
                console.log('⚠️ No text provided for TTS');
            }
        } catch (error) {
            console.error('TTS Error:', error);
        }

        onPress && onPress(); 

        setTimeout(() => {
            setIsPlaying(false);
            animationRef.current?.reset();
        }, 3000); 
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={1} style={styles.audioButtonContainer}>
            <View style={styles.audioButtonInner}>
                {isPlaying ? (
                    <LottieView
                        source={require('../asset/animations/speaking.json')}
                        style={{ width: 45, height: 45 }}
                        autoPlay
                        loop={false}
                    />
                ) : (
                    <Image 
                        source={require('../asset/speaker.png')} 
                        style={{ width: 60, height: 60 }} 
                        resizeMode="contain" 
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

// --------------------------
// Arrangement Component (ARRANGE_SENTENCE)
// --------------------------
const ArrangementComponent = ({ data, onAnswerChange, isAnswered, isCorrect }) => {
    const [selectedWords, setSelectedWords] = useState([]);
    const [availableWords, setAvailableWords] = useState(data.wordBank || []);

    const displayWords = isAnswered && isCorrect !== null ? 
        (isCorrect ? data.correctOrder : selectedWords.map(w => w.text)) : 
        selectedWords.map(w => w.text);

    const selectWord = (word) => {
        if (isAnswered) return;
        const newSelected = [...selectedWords, word];
        const newAvailable = availableWords.filter(w => w.id !== word.id);
        setSelectedWords(newSelected);
        setAvailableWords(newAvailable);
        onAnswerChange(newSelected.map(w => w.text));
    };

    const removeWord = (wordIndex) => {
        if (isAnswered) return;
        const removedWord = selectedWords[wordIndex];
        const newSelected = selectedWords.filter((_, index) => index !== wordIndex);
        const newAvailable = [...availableWords, removedWord];
        setSelectedWords(newSelected);
        setAvailableWords(newAvailable);
        onAnswerChange(newSelected.map(w => w.text));
    };

    useEffect(() => {
        setSelectedWords([]);
        setAvailableWords(data.wordBank || []);
    }, [data.id]);

    return (
        <View style={styles.arrangementWrapper}>
            <View style={styles.mainContent}>
                <View style={styles.titleSection}>
                    <Text style={styles.instructionTitle}>{data.instruction}</Text>
                </View>

                <View style={styles.questionSection}>
                    <CatCharacter />
                    <View style={styles.speechBubbleContainer}>
                        <View style={styles.speechBubble}>
                            <AudioButton text={data.questionText || ''} />
                            <Text style={styles.speechText}>{data.questionText || ''}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.answerArea}>
                    {displayWords.length > 0 ? (
                        <View style={styles.arrangedWordsContainer}>
                            {displayWords.map((wordText, index) => (
                                <TouchableOpacity
                                    key={`selected-${index}`}
                                    style={[
                                        styles.arrangedWord,
                                        isAnswered && isCorrect !== null && {
                                            borderColor: isCorrect ? '#58cc02' : '#ff4b4b',
                                            backgroundColor: isCorrect ? '#d4f4aa' : '#ffb3b3'
                                        }
                                    ]}
                                    onPress={() => removeWord(index)}
                                    disabled={isAnswered}
                                >
                                    <Text style={[
                                        styles.arrangedWordText,
                                        isAnswered && isCorrect !== null && { 
                                            color: isCorrect ? '#2e7d00' : '#cc0000' 
                                        }
                                    ]}>{wordText}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyAnswerArea} />
                    )}
                </View>

                <View style={styles.wordBankContainer}>
                    <View style={styles.wordBank}>
                        {data.wordBank.map((word) => {
                            const isSelected = selectedWords.some(selected => selected.id === word.id);

                            return isSelected ? (
                                <View key={`empty-${word.id}`} style={styles.emptyWordSlot} />
                            ) : (
                                <TouchableOpacity
                                    key={word.id}
                                    style={[styles.wordButton, isAnswered && { opacity: 0.5 }]}
                                    onPress={() => selectWord(word)}
                                    disabled={isAnswered}
                                >
                                    <Text style={styles.wordButtonText}>{word.text}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </View>
    );
};

// --------------------------
// Matching Component (MATCH_PICTURE)
// --------------------------
const MatchingComponent = ({ data, onAnswerChange, isAnswered, isCorrect }) => {
    const [selectedChoice, setSelectedChoice] = useState(null);

    const selectChoice = (choice) => {
        if (isAnswered) return;
        setSelectedChoice(choice.id);
        onAnswerChange(choice.text);
    };

    useEffect(() => {
        setSelectedChoice(null);
    }, [data.id]);

    return (
        <View style={styles.matchingWrapper}>
            <View style={styles.titleSection}>
                <Text style={styles.instructionTitle}>{data.instruction}</Text>
            </View>

            <View style={styles.matchingHeader}>
                <AudioButton text={data.correctText} />
                <Text style={styles.matchingQuestionText}>{data.correctText}</Text>
                <View style={styles.catWrapper}>
                    <CatCharacter />
                </View>
            </View>

            <View style={styles.imageGrid}>
                {data.choices && data.choices.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.imageChoice,
                            selectedChoice === choice.id && styles.imageChoiceSelected,
                            isAnswered && choice.text === data.correctText && styles.imageChoiceCorrect,
                            isAnswered && selectedChoice === choice.id && choice.text !== data.correctText && styles.imageChoiceWrong,
                        ]}
                        onPress={() => selectChoice(choice)}
                        disabled={isAnswered}
                    >
                        <View style={styles.imagePlaceholder}>
                            {choice.image ? (
                                <Image source={choice.image} style={styles.choiceImage} resizeMode="contain" />
                            ) : (
                                <Text style={styles.imageTextPlaceholder}>{choice.emoji || '🎨'}</Text>
                            )}
                        </View>
                        <View style={styles.choiceLabelBox}>
                            <Text style={styles.choiceLabelText}>{choice.text}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// --------------------------
// FeedbackBar
// --------------------------
const FeedbackBar = ({ isCorrect, onContinue }) => (
    <View style={[
        styles.feedbackContainer,
        { backgroundColor: isCorrect ? '#C4FAB3' : '#FFB4B4' }
    ]}>
        <View style={[
            styles.fullWidthButtonShadow,
            { backgroundColor: isCorrect ? '#34BD0A' : '#CC0000' }
        ]} />

        <View style={styles.feedbackContent}>
            <View style={styles.feedbackLeft}>
                <FontAwesome 
                    name={isCorrect ? "check-circle" : "times-circle"} 
                    size={24} 
                    color={isCorrect ? '#38CB0A' : '#FF0000'} 
                />
                <Text style={[
                    styles.feedbackText,
                    { color: isCorrect ? '#38CB0A' : '#FF0000' } 
                ]}>
                    {isCorrect ? 'Nice!' : 'Wrong'}
                </Text>
            </View> 
        </View> 
        <TouchableOpacity style={[
            styles.continueButton, 
            { backgroundColor: isCorrect ? '#3FE90B' : '#FF0000' } 
        ]} 
            onPress={onContinue}
        >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
        </TouchableOpacity>
    </View>
);

// --------------------------
// Lesson Complete Screen
// --------------------------
const LessonCompleteScreen = ({ navigation, score, totalQuestions }) => (
    <View style={styles.completeContainer}>
        <Image 
            source={require('../asset/complete.png')} 
            style={styles.completeImage} 
            resizeMode="contain"
        />

        <Text style={styles.completeTitleStyle}>Lesson complete!</Text>
        
        <View style={styles.scoreContainer}>
            {/* Diamond */}
            <View style={[styles.scoreBox, { borderColor: '#58CC02' }]}>
                <View style={[styles.scoreTitleBar, { backgroundColor: '#58CC02' }]}>
                    <Text style={styles.scoreTitleText}>SCORE</Text>
                </View>
                <View style={styles.scoreDetail}>
                    <FontAwesome name="star" size={24} color="#58CC02" />
                    <Text style={[styles.scoreValueText, { color: '#58CC02' }]}>
                        {score}
                    </Text>
                </View>
            </View>

            {/* Accuracy */}
            <View style={[styles.scoreBox, { borderColor: '#1CB0F6' }]}>
                <View style={[styles.scoreTitleBar, { backgroundColor: '#1CB0F6' }]}>
                    <Text style={styles.scoreTitleText}>ACCURACY</Text>
                </View>
                <View style={styles.scoreDetail}>
                    <FontAwesome name="check-circle" size={24} color="#1CB0F6" />
                    <Text style={[styles.scoreValueText, { color: '#1CB0F6' }]}>
                        {Math.round((score / totalQuestions) * 100)}%
                    </Text>
                </View>
            </View>
        </View>

        <View style={styles.letsGoButtonContainer}>
            <View style={styles.buttonShadowletsGo} />
            <TouchableOpacity 
                style={styles.letsGoButtonNew}
                onPress={() => navigation.navigate("MainTab")}
            >
                <Text style={styles.letsGoButtonTextNew}>LET'S GO !!</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// --------------------------
// Check Button
// --------------------------
const CheckButton = ({ onPress, disabled }) => (
    <View style={styles.bottomContainer}>
        <View style={styles.buttonShadow} />
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={disabled ? ["#e5e5e5", "#e5e5e5"] : ["#FFA500", "#FE8305"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.checkButton, disabled && styles.checkButtonDisabled]}
            >
                <Text style={[styles.checkButtonText, { color: disabled ? '#afafaf' : 'white' }]}>
                    CHECK
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
);

// --------------------------
// Main Lesson Screen
// --------------------------
const NewLessonGame = ({ navigation, route }) => {
    const { lessonId = 1, category = 'basic' } = route.params || {};
    
    const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null); 
    const [isCorrect, setIsCorrect] = useState(null); 
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [hearts, setHearts] = useState(5);
    
    const currentQuestion = questions[currentQuestIndex];

    // Load vocabulary data from API
    useEffect(() => {
        loadVocabularyData();
    }, [lessonId, category]);

    const loadVocabularyData = async () => {
        try {
            setLoading(true);
            
            // Get vocabulary from MongoDB via API
            const vocabData = await vocabWordService.getVocabWordsForGame(category, 'matching', 10);
            
            if (vocabData.success && vocabData.questions) {
                // Transform vocabulary data into game questions
                const gameQuestions = transformVocabularyToQuestions(vocabData.questions);
                setQuestions(gameQuestions);
            } else {
                // Fallback to mock data
                setQuestions(getMockQuestions());
            }
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            // Fallback to mock data
            setQuestions(getMockQuestions());
        } finally {
            setLoading(false);
        }
    };

    const transformVocabularyToQuestions = (vocabularies) => {
        return vocabularies.slice(0, 10).map((vocab, index) => {
            // Create different question types based on vocabulary data
            const questionType = index % 2 === 0 ? 'ARRANGE_SENTENCE' : 'MATCH_PICTURE';
            
            if (questionType === 'ARRANGE_SENTENCE') {
                return {
                    id: `arrange_${vocab._id || index}`,
                    type: 'ARRANGE_SENTENCE',
                    instruction: 'เรียงคำให้เป็นประโยคที่ถูกต้อง',
                    questionText: vocab.thai || 'เรียงคำให้ถูกต้อง',
                    correctOrder: [vocab.thai, 'หมายถึง', vocab.en],
                    wordBank: [
                        { id: 1, text: vocab.thai },
                        { id: 2, text: vocab.en },
                        { id: 3, text: 'คือ' },
                        { id: 4, text: 'หมายถึง' }
                    ]
                };
            } else {
                return {
                    id: `match_${vocab._id || index}`,
                    type: 'MATCH_PICTURE',
                    instruction: 'เลือกคำที่ตรงกับความหมาย',
                    correctText: vocab.thai,
                    choices: [
                        { id: 1, text: vocab.thai, emoji: '🇹🇭' },
                        { id: 2, text: vocab.en, emoji: '🇺🇸' },
                        { id: 3, text: 'คำอื่น', emoji: '❓' },
                        { id: 4, text: 'ไม่รู้', emoji: '🤷' }
                    ]
                };
            }
        });
    };

    const getMockQuestions = () => [
        {
            id: 'arrange_1',
            type: 'ARRANGE_SENTENCE',
            instruction: 'เรียงคำให้เป็นประโยคที่ถูกต้อง',
            questionText: 'สวัสดี หมายถึง Hello',
            correctOrder: ['สวัสดี', 'หมายถึง', 'Hello'],
            wordBank: [
                { id: 1, text: 'สวัสดี' },
                { id: 2, text: 'หมายถึง' },
                { id: 3, text: 'Hello' },
                { id: 4, text: 'คือ' }
            ]
        },
        {
            id: 'match_1',
            type: 'MATCH_PICTURE',
            instruction: 'เลือกคำที่ตรงกับความหมาย',
            correctText: 'ขอบคุณ',
            choices: [
                { id: 1, text: 'ขอบคุณ', emoji: '🙏' },
                { id: 2, text: 'Thank you', emoji: '🇺🇸' },
                { id: 3, text: 'สวัสดี', emoji: '👋' },
                { id: 4, text: 'Hello', emoji: '👋' }
            ]
        }
    ];

    const renderQuestionComponent = () => {
        if (!currentQuestion) return null;

        const commonProps = {
            data: currentQuestion,
            onAnswerChange: setUserAnswer,
            userAnswer: userAnswer,
            isAnswered: isCorrect !== null,
            isCorrect: isCorrect, 
        };

        switch (currentQuestion.type) {
            case 'ARRANGE_SENTENCE':
                return <ArrangementComponent {...commonProps} />;
            case 'MATCH_PICTURE':
                return <MatchingComponent {...commonProps} />;
            default:
                return <Text style={styles.errorText}>ไม่พบรูปแบบคำถามที่ถูกต้อง</Text>;
        }
    };

    const handleCheckAnswer = () => {
        if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) return;

        let correct = false;
        
        if (currentQuestion.type === 'ARRANGE_SENTENCE') {
            correct = JSON.stringify(userAnswer) === JSON.stringify(currentQuestion.correctOrder);
        } 
        else if (currentQuestion.type === 'MATCH_PICTURE') {
            correct = userAnswer === currentQuestion.correctText;
        }
        
        setIsCorrect(correct);
        
        if (correct) {
            setScore(score + 10);
        } else {
            setHearts(hearts - 1);
        }
    };

    const handleContinue = () => {
        if (currentQuestIndex < questions.length - 1) {
            setCurrentQuestIndex(prev => prev + 1);
            setIsCorrect(null);
            setUserAnswer(null);
        } else {
            // เมื่อจบบทเรียนแล้ว
            setCurrentQuestIndex(prev => prev + 1); 
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>กำลังโหลดเกม...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentQuestion && currentQuestIndex >= questions.length) {
        return <LessonCompleteScreen navigation={navigation} score={score} totalQuestions={questions.length} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent 
                total={questions.length} 
                current={currentQuestIndex + 1} 
                hearts={hearts}
                onClose={() => navigation.navigate("MainTab")} 
            />

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollViewContent}
            >
                {renderQuestionComponent()}
            </ScrollView>

            {isCorrect !== null ? (
                <FeedbackBar 
                    isCorrect={isCorrect} 
                    onContinue={handleContinue}
                />
            ) : (
                <CheckButton 
                    onPress={handleCheckAnswer} 
                    disabled={!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)} 
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    loadingText: {
        fontSize: 18,
        color: '#666',
    },
    
    // Header styles
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
        zIndex: 10,
    },
    closeButton: { 
        padding: 8,
        marginRight: 8,
    },
    progressContainer: { 
        flex: 1, 
        height: 12, 
        backgroundColor: '#e5e5e5', 
        borderRadius: 6, 
        marginHorizontal: 12, 
        overflow: 'hidden' 
    },
    progressFill: { 
        height: 12, 
        backgroundColor: '#58cc02', 
        borderRadius: 6,
    },
    heartContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginLeft: 8,
    },
    heartText: { 
        marginLeft: 4, 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#ff4757' 
    },

    // Content styles
    scrollView: {
        flex: 1,
    },
    
    scrollViewContent: { 
        paddingTop: 118, 
        paddingBottom: 100, 
        paddingHorizontal: 18,
        minHeight: '100%',
    },

    titleSection: {
        marginTop: 20, 	
        marginBottom: 20, 	 	
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },

    instructionTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#2c3e50', 
        textAlign: 'center',
        lineHeight: 32,
    },

    // Character styles
    catContainer: { 
        marginRight: 15,
        alignItems: 'center',
    },
    catImage: { 
        width: 80, 
        height: 80 
    },
    catWrapper: {
        position: 'absolute', 
        right: -40, 
        top: -30, 
        zIndex: 5,
        transform: [{ rotate: '-50deg' }],
    },

    // Audio button styles
    audioButtonContainer: {
        alignItems: 'center',
        padding: 2,
        marginRight: 4
    },
    audioButtonInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },

    // Arrangement component styles
    arrangementWrapper: { 
        flex: 1,
        paddingVertical: 10,
    },

    mainContent: {
        flex: 1,
    },

    questionSection: { 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginBottom: 40,
        paddingHorizontal: 18,
    },

    speechBubbleContainer: {
        flex: 1,
    },

    speechBubble: {
        backgroundColor: '#ffffffff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#edebebb8',
        padding: 16,
        top: 25,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    speechText: { 
        fontSize: 18, 
        color: '#2c3e50', 
        fontWeight: '500',
        flex: 1,
        marginLeft: 12,
        lineHeight: 24,
    },

    // Answer area styles
    answerArea: { 
        minHeight: 80,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 30,
        marginHorizontal: 18,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrangedWordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrangedWord: { 
        backgroundColor: '#e8f5e8', 
        borderWidth: 2, 
        borderColor: '#4caf50', 
        borderRadius: 15, 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        margin: 4,
        shadowColor: '#4caf50',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },

    arrangedWordText: { 
        fontSize: 16, 
        fontWeight: '600',
        color: '#2e7d32',
    },

    emptyAnswerArea: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },

    // Word bank styles
    wordBankContainer: {
        flex: 1,
    },

    wordBank: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center',
        paddingTop: 10,
        paddingHorizontal: 18,
    },

    wordButton: { 
        backgroundColor: '#ffffff', 
        borderWidth: 2, 
        borderColor: '#e0e0e0', 
        borderRadius: 15, 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        margin: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    wordButtonText: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#2c3e50' 
    },

    emptyWordSlot: { 
        backgroundColor: '#f0f0f0', 
        borderWidth: 2, 
        borderColor: '#d0d0d0', 
        borderRadius: 15, 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        margin: 6,
        minWidth: 60, 
        minHeight: 40, 
    },

    // Matching component styles
    matchingWrapper: { 
        flex: 1,
        paddingVertical: 10,
    },

    matchingHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        marginBottom: 30,
        paddingHorizontal: 18,
        gap: 12, 
        position: 'relative', 
    },

    matchingQuestionText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#2c3e50',
        marginLeft: 8, 
        flexShrink: 1, 
    },

    imageGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        paddingHorizontal: 5,
        gap: 25,
    },

    imageChoice: { 
        width: '45%', 
        height: 180,
        marginBottom: 16,
        borderRadius: 12, 
        borderWidth: 2, 
        borderColor: '#f0f0f0', 
        backgroundColor: '#ffffff', 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    imageChoiceSelected: { 
        borderColor: '#2196f3', 
        backgroundColor: '#e3f2fd',
        transform: [{ scale: 0.98 }],
    },

    imageChoiceCorrect: { 
        borderColor: '#4caf50', 
        backgroundColor: '#e8f5e8' 
    },

    imageChoiceWrong: { 
        borderColor: '#f44336', 
        backgroundColor: '#ffebee' 
    },

    imagePlaceholder: { 
        height: 118, 
        backgroundColor: '#ffffffff', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    choiceImage: {
        width: '100%',
        height: '100%',
    },

    imageTextPlaceholder: { 
        fontSize: 80, 	
        textAlign: 'center', 
    },

    choiceLabelBox: { 
        padding: 15, 
        alignItems: 'center',
    },

    choiceLabelText: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#2c3e50',
        textAlign: 'center',
    },

    // Bottom button styles
    bottomContainer: { 
        paddingHorizontal: 18, 
        paddingVertical: 16, 
        backgroundColor: '#ffffff', 
        borderTopWidth: 1, 
        borderTopColor: '#e0e0e0',
        marginTop: -20, 
    },

    buttonShadow: {
        position: "absolute",
        top: 25,
        left: 18,
        right: 18,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#743b01", 
        opacity: 1,
    },

    checkButton: { 
        paddingVertical: 16, 
        alignItems: 'center',
        borderRadius: 16,
        marginTop: 4,
        shadowColor: '#FE8305',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },

    checkButtonDisabled: {
        shadowColor: '#ccc',
    },

    checkButtonText: { 
        fontSize: 18, 
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // Feedback styles
    feedbackContainer: { 
        paddingHorizontal: 18, 
        paddingVertical: 18, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        minHeight: 140, 
    },

    feedbackContent: { 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start', 
        marginBottom: 20, 
    },

    feedbackLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    feedbackText: { 
        fontSize: 24, 
        fontWeight: 'bold',
        marginLeft: 12,
    },

    fullWidthButtonShadow: {
        position: "absolute",
        left: 18, 
        right: 18, 
        height: 50, 
        borderRadius: 15,
        bottom: 12, 
    },

    continueButton: { 
        backgroundColor: '#3FE90B', 
        paddingHorizontal: 24, 
        paddingVertical: 18, 
        borderRadius: 15,
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'center',
    },

    continueButtonText: { 
        color: '#ffffff', 
        fontSize: 18, 
        fontWeight: 'bold',
    },

    // Complete screen styles
    completeContainer: { 
        flex: 1, 
        backgroundColor: '#ffffff', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingBottom: 30, 
        paddingTop: 100,
    },

    completeImage: { 
        width: '80%', 
        height: 250, 
        marginBottom: 30,
        top: 50,
    },

    completeTitleStyle: { 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#FE8305',
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 40,
    },

    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '85%',
        marginBottom: 80,
    },

    scoreBox: {
        width: '45%',
        height: 100,
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: '#ffffff', 
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },

    scoreTitleBar: { 
        width: '100%',
        paddingVertical: 4,
        alignItems: 'center',
        marginBottom: 5,
    },
    
    scoreTitleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white', 
        textShadowColor: 'rgba(0, 0, 0, 0.1)', 
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },

    scoreDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', 
        flex: 1,
        paddingBottom: 10,
    },
    
    scoreValueText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#2c3e50', 
    },

    letsGoButtonContainer: {
        width: '90%',
        position: 'relative',
        marginBottom: 20, 
    },
    buttonShadowletsGo: {
        position: "absolute",
        top: 10,
        left: 0,
        right: 0,
        height: 62, 
        borderRadius: 16,
        backgroundColor: "#743b01",
        opacity: 1,
    },
    
    letsGoButtonNew: { 
        backgroundColor: '#FE8305', 
        paddingVertical: 18, 
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4, 
    },

    letsGoButtonTextNew: { 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    errorText: { 
        color: '#f44336', 
        fontSize: 16, 
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default NewLessonGame;
