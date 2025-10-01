const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const VocabWord = require('../models/VocabWord');

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const { 
      level, 
      search, 
      limit = 50, 
      page = 1,
      sort = 'order'
    } = req.query;

    let query = {};
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Text search
    if (search) {
      query.$or = [
        { titleTH: { $regex: search, $options: 'i' } },
        { key: { $regex: search, $options: 'i' } },
        { note: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const lessons = await Lesson.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lesson.countDocuments(query);

    res.json({
      success: true,
      data: lessons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get lesson by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { includeVocabulary = false } = req.query;

    const lesson = await Lesson.findOne({ key });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    if (includeVocabulary === 'true') {
      const vocabulary = await VocabWord.find({ lessonKey: key })
        .sort({ thai: 1 });

      res.json({
        success: true,
        lesson: {
          ...lesson.toObject(),
          vocabulary
        }
      });
    } else {
      res.json({
        success: true,
        lesson
      });
    }
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get lessons by level
router.get('/level/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const { includeVocabulary = false } = req.query;

    const lessons = await Lesson.find({ level })
      .sort({ order: 1 });

    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No lessons found for this level'
      });
    }

    if (includeVocabulary === 'true') {
      const lessonsWithVocab = await Promise.all(
        lessons.map(async (lesson) => {
          const vocabulary = await VocabWord.find({ lessonKey: lesson.key })
            .sort({ thai: 1 });
          return {
            ...lesson.toObject(),
            vocabulary
          };
        })
      );

      res.json({
        success: true,
        level,
        lessons: lessonsWithVocab
      });
    } else {
      res.json({
        success: true,
        level,
        lessons
      });
    }
  } catch (error) {
    console.error('Error fetching lessons by level:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get lesson statistics
router.get('/:key/stats', async (req, res) => {
  try {
    const { key } = req.params;

    const lesson = await Lesson.findOne({ key });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const vocabCount = await VocabWord.countDocuments({ lessonKey: key });
    
    // Get vocabulary by part of speech
    const vocabByPos = await VocabWord.aggregate([
      { $match: { lessonKey: key } },
      { $group: { _id: '$pos', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      lessonKey: key,
      stats: {
        totalVocabulary: vocabCount,
        vocabularyByPos: vocabByPos
      }
    });
  } catch (error) {
    console.error('Error fetching lesson stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Search lessons
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;
    
    const lessons = await Lesson.find({
      $or: [
        { titleTH: { $regex: query, $options: 'i' } },
        { key: { $regex: query, $options: 'i' } },
        { note: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Error searching lessons:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
