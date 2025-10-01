const express = require('express');
const router = express.Router();
const Vocabulary = require('../models/Vocabulary');
const GameResult = require('../models/GameResult');
// const ttsService = require('../services/ttsService'); // Commented out - service not found

// สร้างเกม Arrange Sentence สำหรับ Beginner
router.get('/beginner', async (req, res) => {
  try {
    const { count = 5 } = req.query;

    // ดึงคำศัพท์หมวด Beginner ที่มี usage_examples
    const vocabularies = await Vocabulary.aggregate([
      {
        $match: {
          difficulty: 'beginner',
          is_active: true,
          usage_examples: { $exists: true, $not: { $size: 0 } }
        }
      },
      { $sample: { size: parseInt(count) } }
    ]);

    if (vocabularies.length === 0) {
      return res.status(404).json({ error: 'No vocabulary found for beginner level' });
    }

    // สร้างคำถาม Arrange Sentence
    const questions = await Promise.all(vocabularies.map(async (vocab, index) => {
      const example = vocab.usage_examples[0];
      const thaiWords = example.thai.split(' ').filter(word => word.trim() !== '');
      const englishWords = example.english.split(' ').filter(word => word.trim() !== '');
      
      // สร้างตัวเลือกที่สับสน (distractors)
      const distractors = [];
      
      // เพิ่มคำไทยอื่นๆ เป็นตัวเลือก
      if (thaiWords.length > 1) {
        thaiWords.forEach(word => {
          if (!distractors.some(d => d.text === word)) {
            distractors.push({
              text: word,
              type: 'thai',
              correct: true
            });
          }
        });
      }
      
      // เพิ่มคำไทยอื่นๆ ที่ไม่เกี่ยวข้อง
      const otherThaiWords = ['หมา', 'แมว', 'บ้าน', 'น้ำ', 'ข้าว', 'สี', 'คน', 'เด็ก'];
      otherThaiWords.forEach(word => {
        if (!thaiWords.includes(word) && distractors.length < 8) {
          distractors.push({
            text: word,
            type: 'thai',
            correct: false
          });
        }
      });
      
      // เพิ่มคำอังกฤษ
      englishWords.forEach(word => {
        if (!distractors.some(d => d.text === word)) {
          distractors.push({
            text: word,
            type: 'english',
            correct: false
          });
        }
      });
      
      // เพิ่มคำอังกฤษอื่นๆ
      const otherEnglishWords = ['hello', 'goodbye', 'thank you', 'please', 'yes', 'no', 'good', 'bad'];
      otherEnglishWords.forEach(word => {
        if (!englishWords.includes(word) && distractors.length < 12) {
          distractors.push({
            text: word,
            type: 'english',
            correct: false
          });
        }
      });

      // สลับลำดับตัวเลือก
      const shuffledOptions = distractors.sort(() => Math.random() - 0.5);

      // สร้างเสียงสำหรับตัวเลือก (ไม่ใช้ await เพื่อความเร็ว)
      const optionsWithAudio = shuffledOptions.map(option => ({
        ...option,
        audio_url: null, // ปิดเสียงชั่วคราวเพื่อความเร็ว
        audio_available: false
      }));

      // สร้างเสียงสำหรับประโยค (ไม่ใช้ await เพื่อความเร็ว)
      const sentenceAudio = { success: false, audioUrl: null };
      const englishAudio = { success: false, audioUrl: null };

      return {
        id: `question_${index + 1}`,
        vocabulary_id: vocab._id,
        thai_sentence: example.thai,
        english_sentence: example.english,
        romanization: example.romanization,
        correct_thai_words: thaiWords,
        correct_english_words: englishWords,
        options: optionsWithAudio,
        category: vocab.category,
        difficulty: vocab.difficulty,
        lesson_id: vocab.lesson_id,
        audio: {
          thai_sentence: null,
          english_sentence: null,
          romanization: null
        },
        image_url: vocab.image_url || ''
      };
    }));

    res.json({
      game_type: 'arrange-sentence',
      difficulty: 'beginner',
      total_questions: questions.length,
      questions: questions,
      instructions: {
        thai: 'เรียงประโยคให้ถูกต้อง',
        english: 'Arrange the sentence correctly'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// บันทึกผลการเล่นเกม Arrange Sentence
router.post('/submit', async (req, res) => {
  try {
    const {
      user_id = '1',
      questions_answered,
      time_taken,
      total_questions,
      score
    } = req.body;

    // คำนวณเปอร์เซ็นต์
    const percentage = total_questions > 0 ? (score / total_questions) * 100 : 0;
    
    // คำนวณ diamonds ที่ได้
    const baseDiamonds = Math.floor(score * 2); // 2 diamonds per correct answer
    const timeBonus = time_taken < 30 ? Math.floor(score * 0.5) : 0; // Speed bonus
    const perfectBonus = percentage === 100 ? 10 : 0; // Perfect score bonus
    const totalDiamonds = baseDiamonds + timeBonus + perfectBonus;

    // หาคำศัพท์ที่ตอบถูกและผิด
    const correctWords = [];
    const incorrectWords = [];
    
    questions_answered.forEach(q => {
      if (q.correct) {
        correctWords.push(q.vocabulary_id);
      } else {
        incorrectWords.push(q.vocabulary_id);
      }
    });

    // สร้าง GameResult
    const gameResult = new GameResult({
      user_id,
      game_type: 'arrange-sentence',
      score,
      total_questions,
      percentage,
      time_taken,
      diamonds_earned: totalDiamonds,
      category: 'beginner',
      difficulty: 'beginner',
      lesson_id: 1, // Default lesson for beginner
      correct_words: correctWords,
      incorrect_words: incorrectWords,
      questions_answered: questions_answered.map(q => ({
        question_id: q.vocabulary_id,
        correct: q.correct,
        time_spent: q.time_spent || 0
      })),
      streak: score, // Current streak
      best_streak: score // Will be updated if better
    });

    await gameResult.save();

    // อัปเดตความถี่ของคำศัพท์ที่ตอบถูก
    if (correctWords.length > 0) {
      await Vocabulary.updateMany(
        { _id: { $in: correctWords } },
        { $inc: { frequency: 1 } }
      );
    }

    // คำนวณสถิติเพิ่มเติม
    const userStats = await GameResult.aggregate([
      { $match: { user_id } },
      {
        $group: {
          _id: null,
          total_games: { $sum: 1 },
          total_score: { $sum: '$score' },
          total_diamonds: { $sum: '$diamonds_earned' },
          best_streak: { $max: '$best_streak' },
          average_percentage: { $avg: '$percentage' }
        }
      }
    ]);

    const stats = userStats[0] || {
      total_games: 0,
      total_score: 0,
      total_diamonds: 0,
      best_streak: 0,
      average_percentage: 0
    };

    res.json({
      success: true,
      message: 'Game result saved successfully',
      result: {
        score,
        total_questions,
        percentage: Math.round(percentage * 100) / 100,
        time_taken,
        diamonds_earned: totalDiamonds,
        time_bonus: timeBonus,
        perfect_bonus: perfectBonus,
        correct_words_count: correctWords.length,
        incorrect_words_count: incorrectWords.length
      },
      user_stats: {
        total_games: stats.total_games,
        total_diamonds: stats.total_diamonds,
        best_streak: Math.max(stats.best_streak, score),
        average_percentage: Math.round(stats.average_percentage * 100) / 100
      },
      game_result_id: gameResult._id
    });
  } catch (error) {
    console.error('Error saving game result:', error);
    res.status(500).json({ error: error.message });
  }
});

// ดึงสถิติเกม Arrange Sentence
router.get('/stats/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 10 } = req.query;

    const stats = await GameResult.aggregate([
      { $match: { user_id, game_type: 'arrange-sentence' } },
      { $sort: { completed_at: -1 } },
      { $limit: parseInt(limit) },
      {
        $group: {
          _id: null,
          total_games: { $sum: 1 },
          total_score: { $sum: '$score' },
          total_questions: { $sum: '$total_questions' },
          total_diamonds: { $sum: '$diamonds_earned' },
          best_score: { $max: '$score' },
          best_percentage: { $max: '$percentage' },
          average_percentage: { $avg: '$percentage' },
          best_streak: { $max: '$best_streak' },
          total_time: { $sum: '$time_taken' },
          recent_games: {
            $push: {
              score: '$score',
              percentage: '$percentage',
              diamonds: '$diamonds_earned',
              completed_at: '$completed_at'
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total_games: 0,
      total_score: 0,
      total_questions: 0,
      total_diamonds: 0,
      best_score: 0,
      best_percentage: 0,
      average_percentage: 0,
      best_streak: 0,
      total_time: 0,
      recent_games: []
    };

    res.json({
      game_type: 'arrange-sentence',
      difficulty: 'beginner',
      stats: result,
      recent_games: result.recent_games.slice(0, 5) // Last 5 games
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำศัพท์ที่ผู้เล่นยังไม่เก่ง (สำหรับฝึกเพิ่ม)
router.get('/weak-words/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 10 } = req.query;

    // หาคำศัพท์ที่ผู้เล่นตอบผิดบ่อย
    const weakWords = await GameResult.aggregate([
      { $match: { user_id, game_type: 'arrange-sentence' } },
      { $unwind: '$incorrect_words' },
      {
        $group: {
          _id: '$incorrect_words',
          mistake_count: { $sum: 1 },
          last_mistake: { $max: '$completed_at' }
        }
      },
      { $sort: { mistake_count: -1, last_mistake: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'vocabularies',
          localField: '_id',
          foreignField: '_id',
          as: 'vocabulary'
        }
      },
      { $unwind: '$vocabulary' },
      {
        $project: {
          vocabulary_id: '$_id',
          word: '$vocabulary.thai_word',
          romanization: '$vocabulary.romanization',
          meaning: '$vocabulary.meaning',
          category: '$vocabulary.category',
          mistake_count: 1,
          last_mistake: 1
        }
      }
    ]);

    res.json({
      weak_words: weakWords,
      total_weak_words: weakWords.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
