const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');
const Question = require('../models/Question');
const UserProgress = require('../models/UserProgress');

// Get games by type
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    
    // Return available game types
    const gameTypes = [
      { type: 'matching', name: 'Word Matching', description: 'Match Thai words with English translations' },
      { type: 'arrangement', name: 'Sentence Arrangement', description: 'Arrange words to form correct sentences' },
      { type: 'pronunciation', name: 'Pronunciation Practice', description: 'Practice pronouncing Thai words' },
      { type: 'vocab-quiz', name: 'Vocabulary Quiz', description: 'Multiple choice vocabulary quiz' },
      { type: 'memory', name: 'Memory Game', description: 'Match pairs of cards' }
    ];
    
    if (type) {
      const gameType = gameTypes.find(gt => gt.type === type);
      if (gameType) {
        res.json([gameType]);
      } else {
        res.json([]);
      }
    } else {
      res.json(gameTypes);
    }
  } catch (error) {
    console.error('Error getting games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// เกมทายคำศัพท์ - Multiple Choice
router.get('/vocab-quiz', async (req, res) => {
  try {
    const { 
      count = 10, 
      category, 
      difficulty, 
      lesson_id 
    } = req.query;

    let query = { is_active: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);

    // ดึงคำศัพท์หลัก
    const mainWords = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    if (mainWords.length === 0) {
      return res.json([]);
    }

    // สร้างคำถามสำหรับแต่ละคำ
    const questions = await Promise.all(mainWords.map(async (word) => {
      // ดึงคำศัพท์อื่นในหมวดหมู่เดียวกันเป็นตัวเลือก
      const otherWords = await Vocabulary.aggregate([
        { 
          $match: { 
            category: word.category,
            difficulty: word.difficulty,
            _id: { $ne: word._id },
            is_active: true
          }
        },
        { $sample: { size: 3 } }
      ]);

      // สร้างตัวเลือก
      const options = [
        { text: word.meaning, correct: true },
        ...otherWords.map(w => ({ text: w.meaning, correct: false }))
      ];

      // สุ่มลำดับตัวเลือก
      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      return {
        id: word._id,
        word: word.thai_word,
        romanization: word.romanization,
        options: shuffledOptions,
        correct_answer: word.meaning,
        category: word.category,
        difficulty: word.difficulty
      };
    }));

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เกมเรียงประโยค - Arrange Sentence
router.get('/arrange-sentence', async (req, res) => {
  try {
    const { 
      count = 5, 
      category, 
      difficulty, 
      lesson_id 
    } = req.query;

    let query = { 
      is_active: true,
      usage_examples: { $exists: true, $not: { $size: 0 } }
    };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);

    const vocabularies = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    const questions = vocabularies.map(vocab => {
      const example = vocab.usage_examples[0];
      const words = example.thai.split(' ');
      const shuffledWords = [...words].sort(() => Math.random() - 0.5);

      return {
        id: vocab._id,
        sentence: example.thai,
        romanization: example.romanization,
        meaning: example.english,
        words: shuffledWords,
        correct_order: words,
        category: vocab.category,
        difficulty: vocab.difficulty
      };
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เกมจับคู่คำศัพท์ - Word Matching
router.get('/word-matching', async (req, res) => {
  try {
    const { 
      count = 8, 
      category, 
      difficulty, 
      lesson_id 
    } = req.query;

    let query = { is_active: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);

    const vocabularies = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    // สร้างคู่คำศัพท์
    const pairs = vocabularies.map(vocab => ({
      thai: vocab.thai_word,
      romanization: vocab.romanization,
      english: vocab.meaning,
      id: vocab._id
    }));

    // สลับลำดับ
    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);

    res.json({
      pairs: shuffledPairs,
      total_pairs: pairs.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เกมเติมคำในช่องว่าง - Fill in the Blank
router.get('/fill-blank', async (req, res) => {
  try {
    const { 
      count = 5, 
      category, 
      difficulty, 
      lesson_id 
    } = req.query;

    let query = { 
      is_active: true,
      usage_examples: { $exists: true, $not: { $size: 0 } }
    };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);

    const vocabularies = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    const questions = vocabularies.map(vocab => {
      const example = vocab.usage_examples[0];
      const words = example.thai.split(' ');
      const targetWordIndex = Math.floor(Math.random() * words.length);
      const blankedSentence = words.map((word, index) => 
        index === targetWordIndex ? '____' : word
      ).join(' ');

      return {
        id: vocab._id,
        sentence: blankedSentence,
        original_sentence: example.thai,
        romanization: example.romanization,
        meaning: example.english,
        correct_answer: words[targetWordIndex],
        target_word: vocab.thai_word,
        category: vocab.category,
        difficulty: vocab.difficulty
      };
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เกมฟังเสียง - Audio Recognition
router.get('/audio-quiz', async (req, res) => {
  try {
    const { 
      count = 10, 
      category, 
      difficulty, 
      lesson_id 
    } = req.query;

    let query = { 
      is_active: true,
      audio_url: { $exists: true, $ne: '' }
    };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);

    const vocabularies = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    const questions = await Promise.all(vocabularies.map(async (vocab) => {
      // ดึงคำศัพท์อื่นในหมวดหมู่เดียวกันเป็นตัวเลือก
      const otherWords = await Vocabulary.aggregate([
        { 
          $match: { 
            category: vocab.category,
            difficulty: vocab.difficulty,
            _id: { $ne: vocab._id },
            is_active: true
          }
        },
        { $sample: { size: 3 } }
      ]);

      const options = [
        { text: vocab.thai_word, correct: true },
        ...otherWords.map(w => ({ text: w.thai_word, correct: false }))
      ];

      const shuffledOptions = options.sort(() => Math.random() - 0.5);

      return {
        id: vocab._id,
        audio_url: vocab.audio_url,
        options: shuffledOptions,
        correct_answer: vocab.thai_word,
        romanization: vocab.romanization,
        meaning: vocab.meaning,
        category: vocab.category,
        difficulty: vocab.difficulty
      };
    }));

    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// บันทึกคะแนนเกม
router.post('/score', async (req, res) => {
  try {
    const { 
      game_type, 
      score, 
      total_questions, 
      time_taken, 
      category, 
      difficulty,
      lesson_id 
    } = req.body;

    const percentage = total_questions > 0 ? (score / total_questions) : 0;
    const diamondsEarned = Math.floor(score * 2); // 2 diamonds per correct answer
    const bonusDiamonds = time_taken < 30 ? Math.floor(score * 0.5) : 0; // Speed bonus

    const gameResult = {
      user_id: '1', // Default user ID
      game_type,
      score,
      total_questions,
      percentage,
      time_taken,
      diamonds_earned: diamondsEarned + bonusDiamonds,
      category,
      difficulty,
      lesson_id,
      completed_at: new Date()
    };

    // อัปเดตความถี่ของคำศัพท์ที่ตอบถูก
    if (req.body.correct_words && req.body.correct_words.length > 0) {
      await Vocabulary.updateMany(
        { _id: { $in: req.body.correct_words } },
        { $inc: { frequency: 1 } }
      );
    }

    res.json({
      success: true,
      message: 'Game score saved successfully',
      result: gameResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงสถิติเกม
router.get('/stats', async (req, res) => {
  try {
    const { user_id = '1' } = req.query;

    // สถิติเกมโดยรวม (ใช้ mock data เนื่องจากยังไม่มี GameResult model)
    const gameStats = {
      total_games_played: 0,
      total_score: 0,
      average_score: 0,
      best_score: 0,
      total_diamonds: 0,
      favorite_category: 'greetings',
      favorite_difficulty: 'beginner',
      games_by_type: {
        'vocab-quiz': 0,
        'arrange-sentence': 0,
        'word-matching': 0,
        'fill-blank': 0,
        'audio-quiz': 0
      }
    };

    res.json(gameStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
