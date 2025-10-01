const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');

// ดึงคำศัพท์ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      lesson_id, 
      search, 
      limit = 50, 
      page = 1,
      sort = 'word'
    } = req.query;

    let query = { is_active: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Filter by lesson
    if (lesson_id) {
      query.lesson_id = parseInt(lesson_id);
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const vocabularies = await Vocabulary.find(query)
      .sort(sort === 'frequency' ? { frequency: -1 } : { [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('related_words', 'word thai_word meaning');

    const total = await Vocabulary.countDocuments(query);

    res.json({
      data: vocabularies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์ตาม ID
router.get('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findById(req.params.id)
      .populate('related_words', 'word thai_word meaning');
    
    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }
    
    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างคำศัพท์ใหม่
router.post('/', async (req, res) => {
  try {
    const vocabulary = new Vocabulary(req.body);
    await vocabulary.save();
    res.status(201).json(vocabulary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// อัปเดตคำศัพท์
router.put('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }
    
    res.json(vocabulary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ลบคำศัพท์ (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    
    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }
    
    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์สำหรับเกม
router.get('/game/random', async (req, res) => {
  try {
    const { 
      count = 10, 
      category, 
      difficulty, 
      lesson_id,
      exclude_ids = []
    } = req.query;

    let query = { is_active: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (lesson_id) query.lesson_id = parseInt(lesson_id);
    if (exclude_ids.length > 0) {
      query._id = { $nin: exclude_ids };
    }

    const vocabularies = await Vocabulary.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์ตามบทเรียนพร้อมเสียง AI TTS
router.get('/lesson/:lesson_id', async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const { include_audio = false } = req.query;

    const vocabularies = await Vocabulary.find({
      lesson_id: parseInt(lesson_id),
      is_active: true
    }).sort({ word: 1 });

    if (include_audio === 'true') {
      const aiTtsService = require('../services/aiTtsService');
      
      // Generate audio for each vocabulary item
      const vocabulariesWithAudio = await Promise.all(
        vocabularies.map(async (vocab) => {
          try {
            const audio = await aiTtsService.generateGameAudio(vocab);
            return {
              ...vocab.toObject(),
              audio: audio
            };
          } catch (error) {
            console.error(`Error generating audio for ${vocab.word}:`, error);
            return {
              ...vocab.toObject(),
              audio: null
            };
          }
        })
      );

      res.json({
        lesson_id: parseInt(lesson_id),
        total_vocab: vocabulariesWithAudio.length,
        vocabularies: vocabulariesWithAudio
      });
    } else {
      res.json({
        lesson_id: parseInt(lesson_id),
        total_vocab: vocabularies.length,
        vocabularies: vocabularies
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์สำหรับเกมเรียงประโยค
router.get('/game/arrange-sentence/:lesson_id', async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const { count = 5 } = req.query;

    const vocabularies = await Vocabulary.find({
      lesson_id: parseInt(lesson_id),
      is_active: true,
      example: { $exists: true, $ne: '' }
    })
    .sort({ frequency: -1 })
    .limit(parseInt(count));

    // Generate game data for arrange sentence
    const gameData = vocabularies.map(vocab => ({
      id: vocab._id,
      word: vocab.word,
      romanization: vocab.romanization,
      meaning: vocab.meaning,
      example: vocab.example,
      audio_url: vocab.audio_url,
      difficulty: vocab.difficulty
    }));

    res.json({
      lesson_id: parseInt(lesson_id),
      game_type: 'arrange_sentence',
      total_questions: gameData.length,
      questions: gameData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์ตามหมวดหมู่
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const vocabularies = await Vocabulary.find({
      category,
      is_active: true
    })
    .sort({ frequency: -1 })
    .limit(parseInt(limit));

    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ค้นหาคำศัพท์
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { limit = 20 } = req.query;

    const vocabularies = await Vocabulary.find({
      $text: { $search: term },
      is_active: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit));

    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// อัปเดตความถี่การใช้งาน
router.post('/:id/frequency', async (req, res) => {
  try {
    const { id } = req.params;
    const { increment = 1 } = req.body;

    const vocabulary = await Vocabulary.findByIdAndUpdate(
      id,
      { $inc: { frequency: increment } },
      { new: true }
    );

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary not found' });
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงสถิติคำศัพท์
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Vocabulary.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: null,
          total_words: { $sum: 1 },
          by_category: {
            $push: {
              category: '$category',
              count: 1
            }
          },
          by_difficulty: {
            $push: {
              difficulty: '$difficulty',
              count: 1
            }
          },
          total_frequency: { $sum: '$frequency' }
        }
      },
      {
        $project: {
          total_words: 1,
          total_frequency: 1,
          category_stats: {
            $reduce: {
              input: '$by_category',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [{
                        k: '$$this.category',
                        v: {
                          $add: [
                            { $ifNull: [{ $getField: { field: '$$this.category', input: '$$value' } }, 0] },
                            '$$this.count'
                          ]
                        }
                      }]
                    ]
                  }
                ]
              }
            }
          },
          difficulty_stats: {
            $reduce: {
              input: '$by_difficulty',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [{
                        k: '$$this.difficulty',
                        v: {
                          $add: [
                            { $ifNull: [{ $getField: { field: '$$this.difficulty', input: '$$value' } }, 0] },
                            '$$this.count'
                          ]
                        }
                      }]
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      total_words: 0,
      total_frequency: 0,
      category_stats: {},
      difficulty_stats: {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game data for word matching game
router.get('/game/word-matching/:lesson_id', async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const { count = 5 } = req.query;
    
    console.log(`Fetching word matching game data for lesson ${lesson_id}, count: ${count}`);
    
    // Get vocabulary from the lesson
    const vocab = await Vocabulary.find({ lesson_id: parseInt(lesson_id) });
    
    if (!vocab || vocab.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No vocabulary found for this lesson' 
      });
    }
    
    // Generate game questions
    const questions = [];
    const selectedVocab = vocab.slice(0, Math.min(count, vocab.length));
    
    for (const item of selectedVocab) {
      // Get 3 random wrong answers from other vocabulary
      const otherVocab = vocab.filter(v => v._id.toString() !== item._id.toString());
      const wrongAnswers = otherVocab
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(v => v.meaning);
      
      questions.push({
        thai_word: item.thai_word,
        romanization: item.romanization,
        meaning: item.meaning,
        example: item.example,
        correct_answer: item.meaning,
        wrong_answers: wrongAnswers,
        audio: item.audio
      });
    }
    
    console.log(`Generated ${questions.length} word matching questions`);
    
    res.json({
      success: true,
      lesson_id: parseInt(lesson_id),
      questions: questions
    });
    
  } catch (error) {
    console.error('Error fetching word matching game data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching game data',
      error: error.message 
    });
  }
});

module.exports = router;
