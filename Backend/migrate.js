require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Question = require('./models/Question');
const UserProgress = require('./models/UserProgress');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thai_meow', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Connect to SQLite
const connectSQLite = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./db/thai_meow.db', (err) => {
      if (err) {
        console.error('Error opening SQLite database:', err.message);
        reject(err);
      } else {
        console.log('SQLite Connected');
        resolve(db);
      }
    });
  });
};

// Migrate lessons
const migrateLessons = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating lessons...');
    
    db.all('SELECT * FROM lessons', [], async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // Clear existing lessons
        await Lesson.deleteMany({});
        
        const lessons = rows.map(row => ({
          lesson_id: row.lesson_id,
          title: row.title,
          level: row.level || 'Beginner',
          description: '',
          progress: 0,
          is_completed: false
        }));

        await Lesson.insertMany(lessons);
        console.log(`✅ Migrated ${lessons.length} lessons`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Migrate vocab to questions
const migrateVocab = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating vocabulary...');
    
    db.all('SELECT * FROM vocab', [], async (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // Clear existing questions
        await Question.deleteMany({});
        
        const questions = rows.map(row => ({
          lesson_id: row.lesson_id,
          question_type: 'multiple_choice',
          question_text: `What does "${row.word}" mean?`,
          word: row.word,
          romanization: row.romanization || '',
          options: [
            { text: row.meaning, correct: true },
            { text: 'Other meaning 1', correct: false },
            { text: 'Other meaning 2', correct: false },
            { text: 'Other meaning 3', correct: false }
          ],
          correct_answer: row.meaning,
          difficulty: 'easy'
        }));

        await Question.insertMany(questions);
        console.log(`✅ Migrated ${questions.length} vocabulary items`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Migrate quiz data
const migrateQuiz = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating quiz data...');
    
    db.all('SELECT * FROM quiz', [], async (err, rows) => {
      if (err) {
        console.log('No quiz table found, skipping...');
        resolve();
        return;
      }

      try {
        // Group quiz items by question
        const questionGroups = {};
        rows.forEach(row => {
          if (!questionGroups[row.question]) {
            questionGroups[row.question] = {
              lesson_id: row.lesson_id,
              question_text: row.question,
              options: [],
              correct_answer: ''
            };
          }
          
          questionGroups[row.question].options.push({
            text: row.choice_text,
            correct: row.is_correct === 1
          });
          
          if (row.is_correct === 1) {
            questionGroups[row.question].correct_answer = row.choice_text;
          }
        });

        const quizQuestions = Object.values(questionGroups)
          .filter(q => q.question_text && q.correct_answer && q.options.length > 0)
          .map(q => ({
            lesson_id: q.lesson_id,
            question_type: 'multiple_choice',
            question_text: q.question_text,
            word: q.question_text.split("'")[1] || q.question_text.substring(0, 20), // Extract word from question
            romanization: '',
            options: q.options.filter(opt => opt.text), // Filter out empty options
            correct_answer: q.correct_answer,
            difficulty: 'medium'
          }));

        await Question.insertMany(quizQuestions);
        console.log(`✅ Migrated ${quizQuestions.length} quiz questions`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Migrate dialogue data
const migrateDialogue = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating dialogue data...');
    
    db.all('SELECT * FROM dialogue', [], async (err, rows) => {
      if (err) {
        console.log('No dialogue table found, skipping...');
        resolve();
        return;
      }

      try {
        const dialogueQuestions = rows
          .filter(row => row.sentence && row.meaning)
          .map(row => ({
            lesson_id: row.lesson_id,
            question_type: 'translation',
            question_text: `Translate: "${row.sentence}"`,
            word: row.sentence,
            romanization: row.romanization || '',
            options: [
              { text: row.meaning, correct: true },
              { text: 'Other translation 1', correct: false },
              { text: 'Other translation 2', correct: false },
              { text: 'Other translation 3', correct: false }
            ],
            correct_answer: row.meaning,
            difficulty: 'medium'
          }));

        await Question.insertMany(dialogueQuestions);
        console.log(`✅ Migrated ${dialogueQuestions.length} dialogue items`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Migrate scenario data
const migrateScenario = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating scenario data...');
    
    db.all('SELECT * FROM scenario', [], async (err, rows) => {
      if (err) {
        console.log('No scenario table found, skipping...');
        resolve();
        return;
      }

      try {
        const scenarioQuestions = rows
          .filter(row => row.sentence)
          .map(row => ({
            lesson_id: row.lesson_id,
            question_type: 'arrange_sentence',
            question_text: `Arrange: "${row.sentence}"`,
            word: row.sentence,
            romanization: row.romanization || '',
            options: [
              { text: row.sentence, correct: true },
              { text: 'Other word 1', correct: false },
              { text: 'Other word 2', correct: false },
              { text: 'Other word 3', correct: false }
            ],
            correct_answer: row.sentence,
            difficulty: 'medium'
          }));

        await Question.insertMany(scenarioQuestions);
        console.log(`✅ Migrated ${scenarioQuestions.length} scenario items`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Migrate user progress
const migrateUserProgress = async (db) => {
  return new Promise((resolve, reject) => {
    console.log('Migrating user progress...');
    
    db.all('SELECT * FROM user_progress', [], async (err, rows) => {
      if (err) {
        console.log('No user_progress table found, skipping...');
        resolve();
        return;
      }

      try {
        // Clear existing user progress
        await UserProgress.deleteMany({});
        
        const progressData = rows.map(row => ({
          user_id: row.user_id?.toString() || '1',
          lesson_id: row.lesson_id,
          score: Math.floor((row.progress || 0) * 10), // Convert percentage to score
          total_questions: 10, // Default total questions
          completed_at: new Date(),
          diamonds_earned: Math.floor((row.progress || 0) * 10)
        }));

        await UserProgress.insertMany(progressData);
        console.log(`✅ Migrated ${progressData.length} user progress records`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Main migration function
const migrate = async () => {
  try {
    console.log('🚀 Starting migration from SQLite to MongoDB...');
    
    // Connect to databases
    await connectDB();
    const sqliteDb = await connectSQLite();
    
    // Run migrations
    await migrateLessons(sqliteDb);
    await migrateVocab(sqliteDb);
    await migrateQuiz(sqliteDb);
    await migrateDialogue(sqliteDb);
    await migrateScenario(sqliteDb);
    await migrateUserProgress(sqliteDb);
    
    // Close SQLite connection
    sqliteDb.close();
    
    console.log('🎉 Migration completed successfully!');
    
    // Show summary
    const lessonCount = await Lesson.countDocuments();
    const questionCount = await Question.countDocuments();
    const progressCount = await UserProgress.countDocuments();
    
    console.log('\n📊 Migration Summary:');
    console.log(`- Lessons: ${lessonCount}`);
    console.log(`- Questions: ${questionCount}`);
    console.log(`- User Progress: ${progressCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrate();
