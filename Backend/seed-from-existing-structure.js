require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Lesson = require('./models/Lesson');
const VocabWord = require('./models/VocabWord');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thai-meow';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedFromExistingStructure() {
  console.log('🌱 Starting seed from existing structure...\n');
  
  try {
    await connectDB();
    
    const seedDir = path.join(__dirname, 'seed');
    const files = fs.readdirSync(seedDir);
    
    let totalWords = 0;
    let processedFiles = 0;
    
    for (const file of files) {
      if (file.endsWith('.js') && file.startsWith('thai-')) {
        console.log(`📖 Processing file: ${file}`);
        
        try {
          // Import the seed file
          const seedFile = require(path.join(seedDir, file));
          
          // Extract lesson data - try different possible structures
          let lessonData = null;
          let vocabularyData = [];
          
          // Try different possible structures
          if (seedFile.numbersLessonData) {
            lessonData = seedFile.numbersLessonData;
            vocabularyData = lessonData.vocab || [];
          } else if (seedFile.lessonData) {
            lessonData = seedFile.lessonData;
            vocabularyData = lessonData.vocab || [];
          } else if (seedFile.lesson) {
            lessonData = seedFile.lesson;
            vocabularyData = lessonData.vocab || [];
          } else if (seedFile.vocabularyData) {
            lessonData = { title: file.replace('.js', ''), level: 'Beginner' };
            vocabularyData = seedFile.vocabularyData;
          } else if (seedFile.vocabulary) {
            lessonData = { title: file.replace('.js', ''), level: 'Beginner' };
            vocabularyData = seedFile.vocabulary;
          } else if (seedFile.words) {
            lessonData = { title: file.replace('.js', ''), level: 'Beginner' };
            vocabularyData = seedFile.words;
          }
          
          if (!lessonData || !vocabularyData || vocabularyData.length === 0) {
            console.log(`⚠️ Skipping ${file} - no valid lesson or vocabulary data`);
            continue;
          }
          
          // Create lesson key from filename
          const lessonKey = file.replace('thai-', '').replace('-lesson.js', '').replace('-seed.js', '');
          
          // Create or update lesson
          const lesson = await Lesson.findOneAndUpdate(
            { key: lessonKey },
            {
              key: lessonKey,
              titleTH: lessonData.title || lessonData.titleTH || file.replace('.js', ''),
              level: lessonData.level || 'Beginner',
              note: lessonData.note || '',
              order: lessonData.lesson_id || 0
            },
            { upsert: true, new: true }
          );
          
          console.log(`✅ Lesson: ${lesson.titleTH} (${lesson.key})`);
          
          // Process vocabulary
          let wordCount = 0;
          
          for (const word of vocabularyData) {
            if (word.word || word.thai) {
              try {
                const thaiWord = word.word || word.thai;
                const roman = word.romanization || word.roman || word.pronunciation || '';
                const english = word.meaning || word.en || word.english || '';
                const example = word.example || word.exampleTH || '';
                
                await VocabWord.findOneAndUpdate(
                  { thai: thaiWord, lessonKey: lessonKey },
                  {
                    thai: thaiWord,
                    roman: roman,
                    en: english,
                    pos: word.pos || word.partOfSpeech || '',
                    lessonKey: lessonKey,
                    level: lessonData.level || 'Beginner',
                    tags: [lessonKey, (lessonData.level || 'Beginner').toLowerCase()],
                    exampleTH: example,
                    exampleEN: word.exampleEN || word.exampleEnglish || ''
                  },
                  { upsert: true, new: true }
                );
                wordCount++;
              } catch (error) {
                console.log(`⚠️ Skipped word: ${word.word || word.thai} - ${error.message}`);
              }
            }
          }
          
          console.log(`✅ Processed ${wordCount} words from ${file}`);
          totalWords += wordCount;
          processedFiles++;
          
        } catch (error) {
          console.log(`❌ Error processing ${file}: ${error.message}`);
        }
      }
    }
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Files processed: ${processedFiles}`);
    console.log(`   Total vocabulary words: ${totalWords}`);
    
    // Get final counts
    const lessonCount = await Lesson.countDocuments();
    const vocabCount = await VocabWord.countDocuments();
    
    console.log(`   Total lessons in DB: ${lessonCount}`);
    console.log(`   Total vocabulary in DB: ${vocabCount}`);
    
    console.log('\n🎉 Seeding from existing structure completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seeding
seedFromExistingStructure();
