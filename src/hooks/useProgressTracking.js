import { useState, useRef } from 'react';
import { useProgress } from '../contexts/ProgressContext';

export const useProgressTracking = () => {
  const { updateGameProgress, updateLevelProgress, updateCategoryProgress } = useProgress();
  const [isTracking, setIsTracking] = useState(false);
  const gameStartTime = useRef(null);
  const gameData = useRef({});

  // Start tracking a game session
  const startGameTracking = (gameInfo) => {
    gameStartTime.current = Date.now();
    gameData.current = {
      gameType: gameInfo.gameType,
      gameName: gameInfo.gameName,
      levelName: gameInfo.levelName,
      stageName: gameInfo.stageName,
      correctAnswers: 0,
      totalQuestions: 0,
      score: 0,
      maxScore: gameInfo.maxScore || 100
    };
    setIsTracking(true);
  };

  // Track a question answered
  const trackQuestion = (isCorrect, points = 1) => {
    if (!isTracking) return;

    gameData.current.totalQuestions += 1;
    if (isCorrect) {
      gameData.current.correctAnswers += 1;
      gameData.current.score += points;
    }
  };

  // End game tracking and save progress
  const endGameTracking = async (isCompleted = false) => {
    if (!isTracking || !gameStartTime.current) return;

    const timeSpent = Math.floor((Date.now() - gameStartTime.current) / 1000);
    
    try {
      const result = await updateGameProgress({
        ...gameData.current,
        timeSpent,
        isCompleted
      });

      // Reset tracking
      setIsTracking(false);
      gameStartTime.current = null;
      gameData.current = {};

      return result;
    } catch (error) {
      console.error('Error tracking game progress:', error);
      throw error;
    }
  };

  // Track level completion
  const trackLevelCompletion = async (levelInfo) => {
    try {
      const result = await updateLevelProgress({
        levelName: levelInfo.levelName,
        levelType: levelInfo.levelType,
        stageName: levelInfo.stageName,
        stageNumber: levelInfo.stageNumber,
        score: levelInfo.score,
        maxScore: levelInfo.maxScore,
        isCompleted: levelInfo.isCompleted
      });

      return result;
    } catch (error) {
      console.error('Error tracking level progress:', error);
      throw error;
    }
  };

  // Track category completion
  const trackCategoryCompletion = async (categoryInfo) => {
    try {
      const result = await updateCategoryProgress({
        categoryName: categoryInfo.categoryName,
        categoryType: categoryInfo.categoryType,
        totalLessons: categoryInfo.totalLessons,
        completedLessons: categoryInfo.completedLessons
      });

      return result;
    } catch (error) {
      console.error('Error tracking category progress:', error);
      throw error;
    }
  };

  // Track Thai Consonants progress
  const trackThaiConsonantsProgress = async (consonantData) => {
    const { consonant, isCorrect, timeSpent } = consonantData;
    
    await startGameTracking({
      gameType: 'thai_consonants',
      gameName: 'Thai Consonants Game',
      levelName: 'Basic Consonants',
      stageName: `Consonant ${consonant}`,
      maxScore: 100
    });

    trackQuestion(isCorrect, isCorrect ? 10 : 0);
    
    return await endGameTracking(isCorrect);
  };

  // Track Thai Vowels progress
  const trackThaiVowelsProgress = async (vowelData) => {
    const { vowel, isCorrect, timeSpent } = vowelData;
    
    await startGameTracking({
      gameType: 'thai_vowels',
      gameName: 'Thai Vowels Game',
      levelName: 'Basic Vowels',
      stageName: `Vowel ${vowel}`,
      maxScore: 100
    });

    trackQuestion(isCorrect, isCorrect ? 10 : 0);
    
    return await endGameTracking(isCorrect);
  };

  // Track Duolingo-style game progress
  const trackDuolingoGameProgress = async (gameData) => {
    const { level, stage, questions, correctAnswers, timeSpent } = gameData;
    
    await startGameTracking({
      gameType: 'duolingo_style',
      gameName: `${level} Duolingo Game`,
      levelName: level,
      stageName: stage,
      maxScore: questions.length * 10
    });

    // Track all questions
    questions.forEach((question, index) => {
      const isCorrect = correctAnswers.includes(index);
      trackQuestion(isCorrect, isCorrect ? 10 : 0);
    });
    
    return await endGameTracking(correctAnswers.length === questions.length);
  };

  // Track vocabulary game progress
  const trackVocabularyGameProgress = async (vocabData) => {
    const { category, words, correctAnswers, timeSpent } = vocabData;
    
    await startGameTracking({
      gameType: 'vocabulary',
      gameName: `${category} Vocabulary Game`,
      levelName: 'Vocabulary',
      stageName: category,
      maxScore: words.length * 10
    });

    // Track all words
    words.forEach((word, index) => {
      const isCorrect = correctAnswers.includes(index);
      trackQuestion(isCorrect, isCorrect ? 10 : 0);
    });
    
    return await endGameTracking(correctAnswers.length === words.length);
  };

  return {
    isTracking,
    startGameTracking,
    trackQuestion,
    endGameTracking,
    trackLevelCompletion,
    trackCategoryCompletion,
    trackThaiConsonantsProgress,
    trackThaiVowelsProgress,
    trackDuolingoGameProgress,
    trackVocabularyGameProgress
  };
};
