require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Lesson = require('./models/Lesson');
const Question = require('./models/Question');
const UserProgress = require('./models/UserProgress');
const Vocabulary = require('./models/Vocabulary');

// Import routes
const vocabularyRoutes = require('./routes/vocabulary');
const gameRoutes = require('./routes/games');
const arrangeSentenceRoutes = require('./routes/arrange-sentence');
const audioRoutes = require('./routes/audio');
const simpleAudioRoutes = require('./routes/simple-audio');
const aiAudioRoutes = require('./routes/ai-audio');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const progressRoutes = require('./routes/progress');
const achievementRoutes = require('./routes/achievements');
const leaderboardRoutes = require('./routes/leaderboard');
const dailyChallengeRoutes = require('./routes/dailyChallenges');
const vocabWordsRoutes = require('./routes/vocabWords');
const lessonsRoutes = require('./routes/lessons');
const elevenLabsRoutes = require('./routes/elevenlabs');

// Connect to MongoDB
connectDB();

const app = express();

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Simple progress endpoint for testing
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const Progress = require('./models/Progress');
    const mongoose = require('mongoose');
    
    // Convert string to ObjectId
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const progress = await Progress.findOne({ user_id: userId });
    
    if (!progress) {
      // Create initial progress if doesn't exist
      const newProgress = new Progress({
        user_id: userId,
        total_xp: 0,
        level: 1,
        streak: 0,
        levels: [],
        games_played: [],
        categories: [],
        statistics: {
          total_play_time: 0,
          total_games_played: 0,
          average_score: 0,
          best_streak: 0,
          perfect_scores: 0,
          total_correct_answers: 0,
          total_questions_answered: 0
        },
        achievements: [],
        daily_progress: []
      });
      await newProgress.save();
      return res.json(newProgress);
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vocabulary', vocabularyRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/arrange-sentence', arrangeSentenceRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/simple-audio', simpleAudioRoutes);
app.use('/api/ai-audio', aiAudioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily-challenges', dailyChallengeRoutes);
app.use('/api/vocab-words', vocabWordsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/elevenlabs', elevenLabsRoutes);

// This route is now handled by lessonsRoutes

// ดึงคำศัพท์จากบทเรียน
app.get('/api/vocab/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const questions = await Question.find({
      lesson_id: parseInt(lessonId),
      question_type: 'multiple_choice'
    });
    
    // Transform to match old API format
    const vocab = questions.map(q => ({
      id: q._id,
      lesson_id: q.lesson_id,
      word: q.word,
      romanization: q.romanization,
      meaning: q.correct_answer
    }));
    
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงบทสนทนาจากบทเรียน
app.get('/api/dialogue/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const questions = await Question.find({
      lesson_id: parseInt(lessonId),
      question_type: 'translation'
    });
    
    // Transform to match old API format
    const dialogue = questions.map(q => ({
      id: q._id,
      lesson_id: q.lesson_id,
      sentence: q.word,
      romanization: q.romanization,
      meaning: q.correct_answer
    }));
    
    res.json(dialogue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงคำถามแบบทดสอบจากบทเรียน
app.get('/api/quiz/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const questions = await Question.find({
      lesson_id: parseInt(lessonId),
      question_type: { $in: ['multiple_choice', 'translation', 'arrange_sentence'] }
    });
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงสถานการณ์การสนทนา
app.get('/api/scenario/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const questions = await Question.find({
      lesson_id: parseInt(lessonId),
      question_type: 'arrange_sentence'
    });
    
    // Transform to match old API format
    const scenario = questions.map(q => ({
      id: q._id,
      lesson_id: q.lesson_id,
      sentence: q.word,
      romanization: q.romanization
    }));
    
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สุ่มคำศัพท์สำหรับเกม
app.get('/api/game/vocab/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { count = 10 } = req.query;
    
    const questions = await Question.aggregate([
      { $match: { 
        lesson_id: parseInt(lessonId),
        question_type: 'multiple_choice'
      }},
      { $sample: { size: parseInt(count) } }
    ]);
    
    // Transform to match old API format
    const vocab = questions.map(q => ({
      id: q._id,
      lesson_id: q.lesson_id,
      word: q.word,
      romanization: q.romanization,
      meaning: q.correct_answer
    }));
    
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สุ่มคำศัพท์จากหลายบทเรียน
app.get('/api/game/vocab/random', async (req, res) => {
  try {
    const { count = 10, level = 'Beginner' } = req.query;
    
    const questions = await Question.aggregate([
      {
        $lookup: {
          from: 'lessons',
          localField: 'lesson_id',
          foreignField: 'lesson_id',
          as: 'lesson'
        }
      },
      { $unwind: '$lesson' },
      { $match: { 
        'lesson.level': level,
        question_type: 'multiple_choice'
      }},
      { $sample: { size: parseInt(count) } }
    ]);
    
    // Transform to match old API format
    const vocab = questions.map(q => ({
      id: q._id,
      lesson_id: q.lesson_id,
      word: q.word,
      romanization: q.romanization,
      meaning: q.correct_answer,
      lesson_title: q.lesson.title
    }));
    
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างคำถามแบบเลือกตอบ
app.get('/api/game/quiz/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { count = 5 } = req.query;
    
    const questions = await Question.aggregate([
      { $match: { 
        lesson_id: parseInt(lessonId),
        question_type: 'multiple_choice'
      }},
      { $sample: { size: parseInt(count) } }
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// บันทึกความคืบหน้าผู้ใช้
app.post('/api/user/progress', async (req, res) => {
  try {
    const { lessonId, score, totalQuestions, completedAt } = req.body;
    
    // คำนวณเปอร์เซ็นต์
    const percentage = totalQuestions > 0 ? (score / totalQuestions) : 0;
    const diamondsEarned = Math.floor(score * 2); // 2 diamonds per correct answer
    
    const progressData = {
      user_id: '1', // Default user ID
      lesson_id: lessonId,
      score: score,
      total_questions: totalQuestions,
      completed_at: completedAt ? new Date(completedAt) : new Date(),
      diamonds_earned: diamondsEarned
    };
    
    // Update or create progress record
    const progress = await UserProgress.findOneAndUpdate(
      { user_id: '1', lesson_id: lessonId },
      progressData,
      { upsert: true, new: true }
    );
    
    console.log(`Progress saved: lessonId=${lessonId}, score=${score}/${totalQuestions}, diamonds=${diamondsEarned}`);
    
    res.json({ 
      success: true, 
      message: 'Progress saved successfully',
      percentage: percentage * 100,
      diamonds_earned: diamondsEarned,
      progress: progress
    });
  } catch (error) {
    console.error('Error saving progress:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ดึงความคืบหน้าผู้ใช้
app.get('/api/user/progress', async (req, res) => {
  try {
    const progress = await UserProgress.aggregate([
      {
        $lookup: {
          from: 'lessons',
          localField: 'lesson_id',
          foreignField: 'lesson_id',
          as: 'lesson'
        }
      },
      { $unwind: '$lesson' },
      {
        $project: {
          user_id: 1,
          lesson_id: 1,
          progress: { $divide: ['$score', '$total_questions'] },
          status: {
            $cond: {
              if: { $gte: [{ $divide: ['$score', '$total_questions'] }, 0.8] },
              then: 'done',
              else: 'current'
            }
          },
          lesson_title: '$lesson.title',
          level: '$lesson.level',
          diamonds_earned: 1,
          completed_at: 1
        }
      },
      { $sort: { lesson_id: 1 } }
    ]);
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงสถิติผู้ใช้
app.get('/api/user/stats', async (req, res) => {
  try {
    const stats = await UserProgress.aggregate([
      {
        $group: {
          _id: null,
          total_lessons_completed: { $sum: 1 },
          average_progress: { $avg: { $divide: ['$score', '$total_questions'] } },
          best_progress: { $max: { $divide: ['$score', '$total_questions'] } },
          worst_progress: { $min: { $divide: ['$score', '$total_questions'] } },
          completed_lessons: {
            $sum: {
              $cond: [
                { $gte: [{ $divide: ['$score', '$total_questions'] }, 0.8] },
                1,
                0
              ]
            }
          },
          total_diamonds: { $sum: '$diamonds_earned' }
        }
      }
    ]);
    
    const result = stats[0] || {
      total_lessons_completed: 0,
      average_progress: 0,
      best_progress: 0,
      worst_progress: 0,
      completed_lessons: 0,
      total_diamonds: 0
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connected to MongoDB');
});