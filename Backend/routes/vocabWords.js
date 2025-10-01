const express = require('express');
const router = express.Router();
const VocabWord = require('../models/VocabWord');
const Lesson = require('../models/Lesson');

// Get all vocabulary words
router.get('/', async (req, res) => {
  try {
    const { 
      lessonKey, 
      level, 
      search, 
      limit = 50, 
      page = 1,
      sort = 'thai'
    } = req.query;

    let query = {};
    
    // Filter by lesson key
    if (lessonKey) {
      query.lessonKey = lessonKey;
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Text search
    if (search) {
      query.$or = [
        { thai: { $regex: search, $options: 'i' } },
        { roman: { $regex: search, $options: 'i' } },
        { en: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const vocabWords = await VocabWord.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await VocabWord.countDocuments(query);

    res.json({
      success: true,
      data: vocabWords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching vocabulary words:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get vocabulary words by lesson key
router.get('/lesson/:lessonKey', async (req, res) => {
  try {
    const { lessonKey } = req.params;
    const { includeAudio = false } = req.query;

    const vocabWords = await VocabWord.find({ lessonKey })
      .sort({ thai: 1 });

    if (vocabWords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No vocabulary found for this lesson'
      });
    }

    if (includeAudio === 'true') {
      const aiTtsService = require('../services/aiTtsService');
      
      // Generate audio for each vocabulary item
      const vocabWordsWithAudio = await Promise.all(
        vocabWords.map(async (vocab) => {
          try {
            const audio = await aiTtsService.playThai(vocab.thai);
            return {
              ...vocab.toObject(),
              audio: audio
            };
          } catch (error) {
            console.error(`Error generating audio for ${vocab.thai}:`, error);
            return {
              ...vocab.toObject(),
              audio: null
            };
          }
        })
      );

      res.json({
        success: true,
        lessonKey,
        totalWords: vocabWordsWithAudio.length,
        words: vocabWordsWithAudio
      });
    } else {
      res.json({
        success: true,
        lessonKey,
        totalWords: vocabWords.length,
        words: vocabWords
      });
    }
  } catch (error) {
    console.error('Error fetching vocabulary by lesson:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get vocabulary words for game
router.get('/game/:lessonKey', async (req, res) => {
  try {
    const { lessonKey } = req.params;
    const { count = 10, gameType = 'matching' } = req.query;
    
    console.log(`Fetching game data for lesson ${lessonKey}, count: ${count}, type: ${gameType}`);
    
    // Get vocabulary from the lesson
    const vocabWords = await VocabWord.find({ lessonKey });
    
    if (!vocabWords || vocabWords.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No vocabulary found for this lesson' 
      });
    }
    
    // Generate game questions based on game type
    let questions = [];
    const selectedWords = vocabWords.slice(0, Math.min(count, vocabWords.length));
    
    if (gameType === 'matching') {
      // Word matching game
      for (const word of selectedWords) {
        // Get 3 random wrong answers from other vocabulary
        const otherWords = vocabWords.filter(w => w._id.toString() !== word._id.toString());
        const wrongAnswers = otherWords
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(w => w.en);
        
        questions.push({
          id: word._id,
          thai: word.thai,
          roman: word.roman,
          en: word.en,
          correctAnswer: word.en,
          wrongAnswers: wrongAnswers,
          exampleTH: word.exampleTH,
          exampleEN: word.exampleEN
        });
      }
    } else if (gameType === 'arrange') {
      // Sentence arrangement game
      for (const word of selectedWords) {
        const sentenceParts = word.exampleTH.split(' ');
        questions.push({
          id: word._id,
          thai: word.thai,
          roman: word.roman,
          en: word.en,
          sentence: word.exampleTH,
          parts: sentenceParts,
          correctOrder: sentenceParts
        });
      }
    }
    
    console.log(`Generated ${questions.length} ${gameType} questions`);
    
    res.json({
      success: true,
      lessonKey,
      gameType,
      questions: questions
    });
    
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching game data',
      error: error.message 
    });
  }
});

// Get random vocabulary words
router.get('/random', async (req, res) => {
  try {
    const { count = 10, level, lessonKey } = req.query;
    
    let query = {};
    if (level) query.level = level;
    if (lessonKey) query.lessonKey = lessonKey;
    
    const vocabWords = await VocabWord.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json({
      success: true,
      data: vocabWords
    });
  } catch (error) {
    console.error('Error fetching random vocabulary:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Search vocabulary words
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const vocabWords = await VocabWord.find({
      $or: [
        { thai: { $regex: q, $options: 'i' } },
        { roman: { $regex: q, $options: 'i' } },
        { en: { $regex: q, $options: 'i' } }
      ]
    })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: vocabWords
    });
  } catch (error) {
    console.error('Error searching vocabulary:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
